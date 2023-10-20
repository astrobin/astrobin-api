import { Component, Input, OnChanges } from "@angular/core";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { MarketplaceListingLineItemInterface } from "@features/equipment/types/marketplace-listing-line-item.interface";
import { Store } from "@ngrx/store";
import { State } from "@app/store/state";
import { UtilsService } from "@shared/services/utils/utils.service";

@Component({
  selector: "astrobin-marketplace-listing-line-item-images",
  templateUrl: "./marketplace-listing-line-item-images.component.html",
  styleUrls: ["./marketplace-listing-line-item-images.component.scss"]
})
export class MarketplaceListingLineItemImagesComponent extends BaseComponentDirective implements OnChanges {
  readonly UtilsService = UtilsService;

  sliderImages: Array<object> = [];

  @Input()
  images: MarketplaceListingLineItemInterface["images"];

  constructor(public readonly store$: Store<State>) {
    super(store$);
  }

  ngOnChanges() {
    if (!this.images) {
      this.sliderImages = [];
      return;
    }

    if (UtilsService.isObject(this.images)) {
      const keys = Object.keys(this.images);

      if (keys.length === 0) {
        this.sliderImages = [];
        return;
      }

      for (const key of Object.keys(this.images)) {
        if (this.images[key] === undefined) {
          continue;
        }

        const url: string = this.images[key][0].url.changingThisBreaksApplicationSecurity;

        this.sliderImages.push({
          image: url,
          thumbImage: url
        });
      }
    } else if (UtilsService.isArray(this.images)) {
      this.sliderImages = this.images.map(image => ({
        image: image,
        thumbImage: image
      }));
    }
  }
}
