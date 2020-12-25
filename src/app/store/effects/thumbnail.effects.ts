import { Injectable } from "@angular/core";
import { All, AppActionTypes } from "@app/store/actions/app.actions";
import { LoadThumbnail, LoadThumbnailSuccess } from "@app/store/actions/thumbnail.actions";
import { AppState } from "@app/store/app.states";
import { selectThumbnail } from "@app/store/selectors/app/thumbnail.selectors";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { ImageApiService } from "@shared/services/api/classic/images/image/image-api.service";
import { EMPTY, Observable, of } from "rxjs";
import { catchError, delay, map, mergeMap, withLatestFrom } from "rxjs/operators";

@Injectable()
export class ThumbnailEffects {
  @Effect()
  LoadThumbnail: Observable<LoadThumbnail | LoadThumbnailSuccess> = this.actions$.pipe(
    ofType(AppActionTypes.LOAD_THUMBNAIL),
    withLatestFrom(action =>
      this.store$.select(selectThumbnail, action.payload).pipe(map(result => ({ action, result })))
    ),
    mergeMap(observable => observable),
    mergeMap(({ action, result }) =>
      result !== null
        ? of(result)
        : this.imageApiService
            .getImage(action.payload.id)
            .pipe(
              mergeMap(image =>
                this.imageApiService.getThumbnail(image.hash || image.pk, action.payload.revision, action.payload.alias)
              )
            )
    ),
    mergeMap(thumbnail => {
      if (thumbnail.url.toLowerCase().indexOf("placeholder") !== -1) {
        return of(void 0).pipe(
          delay(100),
          map(() => new LoadThumbnail({ id: thumbnail.id, revision: thumbnail.revision, alias: thumbnail.alias }))
        );
      } else {
        return of(thumbnail).pipe(
          map(() => new LoadThumbnailSuccess(thumbnail)),
          catchError(() => EMPTY)
        );
      }
    })
  );

  @Effect({ dispatch: false })
  LoadThumbnailSuccess: Observable<void> = this.actions$.pipe(ofType(AppActionTypes.LOAD_THUMBNAIL_SUCCESS));

  constructor(
    public readonly store$: Store<AppState>,
    public readonly actions$: Actions<All>,
    public readonly imageApiService: ImageApiService
  ) {}
}
