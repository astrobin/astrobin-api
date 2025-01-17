import { Component, ElementRef, Inject, Input, OnChanges, PLATFORM_ID, SimpleChanges, ViewChild } from "@angular/core";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { Store } from "@ngrx/store";
import { MainState } from "@app/store/state";
import { ImageSearchInterface } from "@shared/interfaces/image-search.interface";
import { ClassicRoutesService } from "@shared/services/classic-routes.service";
import { WindowRefService } from "@shared/services/window-ref.service";
import { TranslateService } from "@ngx-translate/core";
import { EquipmentItemType, EquipmentItemUsageType } from "@features/equipment/types/equipment-item-base.interface";
import { SearchModelInterface } from "@features/search/interfaces/search-model.interface";
import { ImageSearchComponent } from "@shared/components/search/image-search/image-search.component";
import { ImageSearchApiService } from "@shared/services/api/classic/images/image/image-search-api.service";
import { ImageAlias } from "@shared/enums/image-alias.enum";
import { UserProfileInterface } from "@shared/interfaces/user-profile.interface";
import { SearchService } from "@features/search/services/search.service";
import { Router } from "@angular/router";
import { filter, take } from "rxjs/operators";
import { LoadEquipmentItem } from "@features/equipment/store/equipment.actions";
import { selectEquipmentItem } from "@features/equipment/store/equipment.selectors";

@Component({
  selector: "astrobin-image-search-card",
  templateUrl: "./image-search-card.component.html",
  styleUrls: ["./image-search-card.component.scss"]
})
export class ImageSearchCardComponent extends BaseComponentDirective implements OnChanges {
  readonly EquipmentItemType = EquipmentItemType;
  readonly EquipmentItemUsageType = EquipmentItemUsageType;

  @ViewChild("imageSearchComponent", { read: ImageSearchComponent })
  imageSearchComponent: ImageSearchComponent;

  @Input()
  header = this.translateService.instant("Search results");

  @Input()
  model: SearchModelInterface;

  @Input()
  alias: ImageAlias.GALLERY | ImageAlias.REGULAR = ImageAlias.REGULAR;

  @Input()
  loadMoreOnScroll = true;

  @Input()
  showUsageButton = true;

  @Input()
  showSortButton = true;

  @Input()
  showMoreButton = true;

  @Input()
  showRetailers = true;

  @Input()
  showMarketplaceItems = true;

  @Input()
  showStaticOverlay = true;

  next: string;
  loading = true;
  images: ImageSearchInterface[] = [];
  searchUrl: string;

  constructor(
    public readonly store$: Store<MainState>,
    public readonly classicRoutesService: ClassicRoutesService,
    public readonly windowRefService: WindowRefService,
    public readonly elementRef: ElementRef,
    public readonly translateService: TranslateService,
    @Inject(PLATFORM_ID) public readonly platformId: Record<string, unknown>,
    public readonly imageSearchApiService: ImageSearchApiService,
    public readonly searchService: SearchService,
    public readonly router: Router
  ) {
    super(store$);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.model.ordering) {
      this.model = { ...this.model, ordering: "-likes" };
    }
    this.updateSearchUrl();
  }

  sortBy(ordering: string): void {
    this.model = { ...this.model, ordering, page: 1 };
    this.updateSearchUrl();
  }

  setUsageType(usageType: EquipmentItemUsageType): void {
    this.model = { ...this.model, usageType, page: 1 };
    this.updateSearchUrl();
  }

  updateSearchUrl(): void {
    const urlParams = new URLSearchParams();
    urlParams.set("d", "i");
    urlParams.set("sort", this.model.ordering || "-likes");

    if (this.model.itemType) {
      const paramName = this.imageSearchApiService.getFilterParamName(this.model.itemType, this.model.usageType);
      urlParams.set(paramName, this.model.itemId.toString());
    }

    if (this.model.username) {
      urlParams.set("username", this.model.username.toString());
    }

    this.searchUrl = `${this.classicRoutesService.SEARCH}?${urlParams.toString()}`;
  }

  onMoreClicked(event: MouseEvent): void {
    this.currentUserProfile$.pipe(take(1)).subscribe((userProfile: UserProfileInterface) => {
      if (!userProfile || !userProfile.enableNewSearchExperience) {
        this.windowRefService.nativeWindow.location.href = this.searchUrl;
      } else {
        const { itemId, itemType, ...model } = this.model;

        this.store$.select(selectEquipmentItem, { id: itemId, type: itemType }).pipe(
          filter(item => !!item),
          take(1)
        ).subscribe(item => {
          const params = this.searchService.modelToParams({
            ...model,
            [itemType.toLowerCase()]: {
              value: [{
                id: itemId,
                name: (item.brandName || this.translateService.instant("DIY")) + " " + item.name,
              }],
              matchType: null
            }
          });
          this.router.navigateByUrl(`/search?p=${params}`).then(() => {
            this.windowRefService.scroll({ top: 0 });
          });
        });

        this.store$.dispatch(new LoadEquipmentItem({ id: itemId, type: itemType }));
      }
    });
  }
}
