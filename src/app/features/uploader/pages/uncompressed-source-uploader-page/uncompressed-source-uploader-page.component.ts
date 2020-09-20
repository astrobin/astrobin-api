import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { environment } from "@env/environment";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { Constants } from "@shared/constants";
import { ImageInterface } from "@shared/interfaces/image.interface";
import { ImageApiService } from "@shared/services/api/classic/images-app/image/image-api.service";
import { ThumbnailGroupApiService } from "@shared/services/api/classic/images-app/thumbnail-group/thumbnail-group-api.service";
import { JsonApiService } from "@shared/services/api/classic/json/json-api.service";
import { AppContextService } from "@shared/services/app-context/app-context.service";
import { ClassicRoutesService } from "@shared/services/classic-routes.service";
import { PopNotificationsService } from "@shared/services/pop-notifications.service";
import { TitleService } from "@shared/services/title/title.service";
import { UploadDataService } from "@shared/services/upload-metadata/upload-data.service";
import { WindowRefService } from "@shared/services/window-ref.service";
import { UploadState, UploadxService } from "ngx-uploadx";
import { Observable } from "rxjs";
import { map, take, takeUntil } from "rxjs/operators";

@Component({
  selector: "astrobin-uncompressed-source-uploader-page",
  templateUrl: "./uncompressed-source-uploader-page.component.html",
  styleUrls: ["./uncompressed-source-uploader-page.component.scss"]
})
export class UncompressedSourceUploaderPageComponent extends BaseComponentDirective implements OnInit {
  form = new FormGroup({});
  uploadState: UploadState;

  model = {
    image_file: ""
  };

  fields: FormlyFieldConfig[] = [
    {
      key: "image_file",
      id: "image_file",
      type: "chunked-file",
      templateOptions: {
        required: true
      }
    }
  ];

  appContext$ = this.appContext.context$;

  backendConfig$ = this.jsonApiService.getBackendConfig$();

  imageThumbnail$: Observable<string>;

  image: ImageInterface;

  constructor(
    public appContext: AppContextService,
    public jsonApiService: JsonApiService,
    public translate: TranslateService,
    public uploaderService: UploadxService,
    public uploadDataService: UploadDataService,
    public popNotificationsService: PopNotificationsService,
    public windowRef: WindowRefService,
    public classicRoutesService: ClassicRoutesService,
    public route: ActivatedRoute,
    public titleService: TitleService,
    public thumbnailGroupApiService: ThumbnailGroupApiService,
    public imageApiService: ImageApiService
  ) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.translate.instant("Uncompressed source uploader") + " (beta)");

    this.image = this.route.snapshot.data.image;
    this.uploadDataService.patchMetadata("image-upload", { image_id: this.image.pk });
    this.uploadDataService.patchMetadata("image-upload", {
      allowedExtensions: Constants.ALLOWED_UNCOMPRESSED_SOURCE_UPLOAD_EXTENSIONS
    });

    this.imageThumbnail$ = this.thumbnailGroupApiService
      .getThumbnailGroup(this.image.pk, Constants.ORIGINAL_REVISION)
      .pipe(map(thumbnailGroup => thumbnailGroup.gallery));

    this.uploadDataService.setEndpoint(`${environment.classicBaseUrl}/api/v2/images/uncompressed-source-upload/`);
    this.uploadDataService.setAllowedTypes(Constants.ALLOWED_UNCOMPRESSED_SOURCE_UPLOAD_EXTENSIONS.join(","));

    this.uploaderService.events.pipe(takeUntil(this.destroyed$)).subscribe(uploadState => {
      this.uploadState = uploadState;

      if (uploadState.status === "error") {
        this.popNotificationsService.error(`Error: ${uploadState.responseStatus}`);
      } else if (uploadState.status === "complete") {
        const response = JSON.parse(uploadState.response as string);
        this.imageApiService
          .getImage(response.image)
          .pipe(take(1))
          .subscribe(image => {
            this.windowRef.nativeWindow.location.assign(this.classicRoutesService.IMAGE(image.hash || "" + image.pk));
          });
      }
    });
  }

  onSubmit() {
    this.uploaderService.control({ action: "upload" });
  }

  uploadButtonDisabled(): boolean {
    return (
      !this.form.valid ||
      !this.uploadState ||
      ["queue", "uploading", "paused", "retry"].indexOf(this.uploadState.status) > -1
    );
  }

  uploadButtonLoading(): boolean {
    return (
      this.form.valid && this.uploadState && ["queue", "uploading", "complete"].indexOf(this.uploadState.status) > -1
    );
  }
}
