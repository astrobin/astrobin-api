import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { EquipmentItemService } from "@features/equipment/services/equipment-item.service";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { Store } from "@ngrx/store";
import { State } from "@app/store/state";
import { EquipmentItemType } from "@features/equipment/types/equipment-item-base.interface";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GeolocationService } from "@shared/services/geolocation.service";
import { LoadingService } from "@shared/services/loading.service";
import { PopNotificationsService } from "@shared/services/pop-notifications.service";
import { UtilsService } from "@shared/services/utils/utils.service";
import { Constants } from "@shared/constants";
import { MarketplaceListingCondition } from "@features/equipment/types/marketplace-line-item.interface";
import { WindowRefService } from "@shared/services/window-ref.service";
import { isPlatformBrowser } from "@angular/common";
import { UserInterface } from "@shared/interfaces/user.interface";

export interface MarketplaceFilterModel {
  itemType?: EquipmentItemType | null;
  maxDistance?: number | null;
  distanceUnit?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  region?: string | null;
  query?: string | null;
  user?: UserInterface["id"] | null;
  offersByUser?: UserInterface["id"] | null;
  soldToUser?: UserInterface["id"] | null;
  followedByUser?: UserInterface["id"] | null;
  sold?: boolean | null;
  expired?: boolean | null;
}

@Component({
  selector: "astrobin-marketplace-filter",
  templateUrl: "./marketplace-filter.component.html",
  styleUrls: ["./marketplace-filter.component.scss"]
})
export class MarketplaceFilterComponent extends BaseComponentDirective implements OnInit {
  filterFields: FormlyFieldConfig[];
  filterForm: FormGroup = new FormGroup({});

  @Output()
  filterChange = new EventEmitter<MarketplaceFilterModel>();

  constructor(
    public readonly store$: Store<State>,
    public readonly translateService: TranslateService,
    public readonly equipmentItemService: EquipmentItemService,
    public readonly router: Router,
    public readonly activatedRoute: ActivatedRoute,
    public readonly geolocationService: GeolocationService,
    public readonly loadingService: LoadingService,
    public readonly popNotificationsService: PopNotificationsService,
    public windowRefService: WindowRefService,
    @Inject(PLATFORM_ID) public readonly platformId: Object
  ) {
    super(store$);
  }

  ngOnInit() {
    super.ngOnInit();

    this.activatedRoute.queryParams.subscribe(params => {
      this._initFilterFields(params);
    });
  }

  applyFilters() {
    const _doApplyFilters = () => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: this.filterForm.value,
        queryParamsHandling: "merge"
      }).then(() => {
        this.filterChange.emit(this.filterForm.value);

        this.loadingService.setLoading(false);

        if (isPlatformBrowser(this.platformId)) {
          this.windowRefService.nativeWindow.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
          });
        }
      });
    };

    if (!this.filterForm.valid) {
      this.filterForm.markAllAsTouched();
      UtilsService.notifyAboutFieldsWithErrors(this.filterFields, this.popNotificationsService, this.translateService);
      return;
    }

    this.loadingService.setLoading(true);

    if (this.filterForm.value.maxDistance !== null) {
      this.geolocationService.getCurrentPosition().then(position => {
        this.filterForm.patchValue({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        _doApplyFilters();
      }).catch(() => {
        this.popNotificationsService.error(
          this.translateService.instant(
            "AstroBin could not determine your location because you didn't grant the require permission."
          )
        );
        _doApplyFilters();
      });
    } else {
      _doApplyFilters();
    }
  }

  resetFilters() {
    Object.keys(this.filterForm.controls).forEach(key => {
      const control = this.filterForm.get(key);
      control.setValue(null);
      control.markAsPristine();
      control.markAsUntouched();
    });

    this.applyFilters();
  }

  private _initFilterFields(params: Params) {
    this.filterFields = [
      {
        key: "itemType",
        type: "ng-select",
        wrappers: ["default-wrapper"],
        defaultValue: params["itemType"],
        props: {
          label: this.translateService.instant("Item type"),
          options: Object.values(EquipmentItemType).map(itemType => ({
            label: this.equipmentItemService.humanizeType(itemType),
            value: itemType
          })),
          clearable: true
        }
      },
      {
        key: "",
        template: "<hr />"
      },
      {
        key: "latitude",
        type: "input",
        className: "hidden"
      },
      {
        key: "longitude",
        type: "input",
        className: "hidden"
      },
      {
        key: "maxDistance",
        type: "input",
        wrappers: ["default-wrapper"],
        defaultValue: params["maxDistance"],
        props: {
          type: "number",
          label: this.translateService.instant("Max. distance"),
          description: this.translateService.instant("Max. distance from your location."),
          min: 0
        }
      },
      {
        key: "distanceUnit",
        type: "ng-select",
        wrappers: ["default-wrapper"],
        defaultValue: params["distanceUnit"],
        props: {
          label: this.translateService.instant("Distance unit"),
          searchable: false,
          options: [
            {
              label: "km",
              value: "km"
            },
            {
              label: "mi",
              value: "mi"
            }
          ]
        },
        expressionProperties: {
          "props.required": "model.maxDistance && model.maxDistance > 0"
        }
      },
      {
        key: "",
        template: "<hr />"
      },
      {
        key: "minPrice",
        type: "input",
        wrappers: ["default-wrapper"],
        defaultValue: params["minPrice"],
        props: {
          type: "number",
          label: this.translateService.instant("Min. price"),
          description: this.translateService.instant("Min. price of the item."),
          min: 0
        }
      },
      {
        key: "maxPrice",
        type: "input",
        wrappers: ["default-wrapper"],
        defaultValue: params["maxPrice"],
        props: {
          type: "number",
          label: this.translateService.instant("Max. price"),
          description: this.translateService.instant("Max. price of the item."),
          min: 0
        }
      },
      {
        key: "currency",
        type: "ng-select",
        wrappers: ["default-wrapper"],
        defaultValue: params["currency"],
        props: {
          label: this.translateService.instant("Currency"),
          searchable: false,
          options: Constants.SUPPORTED_CURRENCIES.map(
            currency => ({
              label: currency,
              value: currency
            })
          )
        },
        expressionProperties: {
          "props.required": "model.minPrice || model.maxPrice"
        }
      },
      {
        key: "",
        template: "<hr />"
      },
      {
        key: "condition",
        type: "ng-select",
        wrappers: ["default-wrapper"],
        defaultValue: params["condition"],
        props: {
          label: this.translateService.instant("Condition"),
          options: Object.values(MarketplaceListingCondition).map(condition => ({
            label: this.equipmentItemService.humanizeCondition(condition),
            value: condition
          }))
        }
      },
      {
        key: "region",
        type: "input",
        defaultValue: params["region"],
        className: "hidden"
      }
    ];
  }
}
