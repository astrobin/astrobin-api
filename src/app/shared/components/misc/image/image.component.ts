import { AfterViewInit, Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { LoadImage } from "@app/store/actions/image.actions";
import { LoadThumbnail } from "@app/store/actions/thumbnail.actions";
import { selectImage } from "@app/store/selectors/app/image.selectors";
import { selectThumbnail } from "@app/store/selectors/app/thumbnail.selectors";
import { State } from "@app/store/state";
import { Store } from "@ngrx/store";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { ImageAlias } from "@shared/enums/image-alias.enum";
import { ImageThumbnailInterface } from "@shared/interfaces/image-thumbnail.interface";
import { ImageInterface } from "@shared/interfaces/image.interface";
import { ImageApiService } from "@shared/services/api/classic/images/image/image-api.service";
import { ThumbnailGroupApiService } from "@shared/services/api/classic/images/thumbnail-group/thumbnail-group-api.service";
import { ImageService } from "@shared/services/image/image.service";
import { Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";

@Component({
  selector: "astrobin-image",
  templateUrl: "./image.component.html",
  styleUrls: ["./image.component.scss"]
})
export class ImageComponent extends BaseComponentDirective implements OnInit, OnChanges, AfterViewInit {
  image$: Observable<ImageInterface>;
  thumbnail$: Observable<ImageThumbnailInterface>;

  @Input()
  @HostBinding("attr.data-id")
  id: number;

  @Input()
  revision = "final";

  @Input()
  alias: ImageAlias;

  @HostBinding("class.loading")
  loading = false;

  constructor(
    public readonly store$: Store<State>,
    public readonly imageApiService: ImageApiService,
    public readonly thumbnailGroupApiService: ThumbnailGroupApiService,
    public readonly imageService: ImageService
  ) {
    super();
  }

  get backgroundSize(): string {
    switch (this.alias) {
      case ImageAlias.REGULAR_CROP_ANONYMIZED:
        return "initial";
      default:
        return "cover";
    }
  }

  ngOnInit(): void {
    if (this.id === null) {
      throw new Error("Attribute 'id' is required");
    }

    if (this.alias === null) {
      throw new Error("Attribute 'alias' is required");
    }
  }

  ngAfterViewInit(): void {
    this._load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._load();
  }

  private _load(): void {
    this.loading = true;

    this.image$ = this.store$.select(selectImage, this.id);
    this.thumbnail$ = this.store$
      .select(selectThumbnail, {
        id: this.id,
        revision: this.revision,
        alias: this.alias
      })
      .pipe(
        filter(thumbnail => !!thumbnail),
        tap(() => (this.loading = false))
      );

    this.store$.dispatch(new LoadImage(this.id));
    this.store$.dispatch(new LoadThumbnail({ id: this.id, revision: this.revision, alias: this.alias }));
  }
}
