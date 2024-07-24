import { Injectable } from "@angular/core";
import { All, AppActionTypes } from "@app/store/actions/app.actions";
import { LoadImage } from "@app/store/actions/image.actions";
import { LoadThumbnail, LoadThumbnailCanceled, LoadThumbnailSuccess } from "@app/store/actions/thumbnail.actions";
import { selectImage } from "@app/store/selectors/app/image.selectors";
import { selectLoadingThumbnail, selectThumbnail } from "@app/store/selectors/app/thumbnail.selectors";
import { MainState } from "@app/store/state";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { ImageApiService } from "@shared/services/api/classic/images/image/image-api.service";
import { EMPTY, Observable, of } from "rxjs";
import { catchError, delay, filter, map, mergeMap, switchMap, take } from "rxjs/operators";

@Injectable()
export class ThumbnailEffects {
  LoadThumbnail: Observable<LoadThumbnail | LoadThumbnailSuccess | LoadThumbnailCanceled> = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActionTypes.LOAD_THUMBNAIL),
      mergeMap(action =>
        this.store$.select(selectThumbnail, action.payload.data).pipe(
          mergeMap(thumbnailFromStore =>
            thumbnailFromStore !== null
              ? of(thumbnailFromStore)
              : this.store$.select(selectImage, action.payload.data.id).pipe(
                take(1),
                mergeMap(imageFromStore => {
                  if (imageFromStore !== null) {
                    return this.imageApiService.getThumbnail(
                      imageFromStore.hash || imageFromStore.pk,
                      action.payload.data.revision,
                      action.payload.data.alias,
                      action.payload.bustCache
                    );
                  }

                  this.store$.dispatch(new LoadImage({ imageId: action.payload.data.id }));

                  return this.store$.select(selectImage, action.payload.data.id).pipe(
                    filter(image => !!image),
                    mergeMap(image =>
                      this.imageApiService.getThumbnail(
                        image.hash || image.pk,
                        action.payload.data.revision,
                        action.payload.data.alias,
                        action.payload.bustCache
                      )
                    )
                  );
                })
              )
          )
        )
      ),
      mergeMap(thumbnail => {
        if (thumbnail.url.toLowerCase().indexOf("placeholder") !== -1) {
          return of(void 0).pipe(
            delay(1000),
            switchMap(() =>
              this.store$.select(selectLoadingThumbnail, {
                id: thumbnail.id,
                revision: thumbnail.revision,
                alias: thumbnail.alias
              })
            ),
            map(loadingThumbnail => {
              if (!!loadingThumbnail) {
                return new LoadThumbnail({
                  data: { id: thumbnail.id, revision: thumbnail.revision, alias: thumbnail.alias },
                  bustCache: true
                });
              }

              return new LoadThumbnailCanceled({
                id: thumbnail.id,
                revision: thumbnail.revision,
                alias: thumbnail.alias
              });
            })
          );
        } else {
          return of(thumbnail).pipe(
            map(() => new LoadThumbnailSuccess(thumbnail)),
            catchError(() => EMPTY)
          );
        }
      })
    )
  );

  constructor(
    public readonly store$: Store<MainState>,
    public readonly actions$: Actions<All>,
    public readonly imageApiService: ImageApiService
  ) {
  }
}
