import { AfterViewInit, Component, EventEmitter, Inject, Output, PLATFORM_ID } from "@angular/core";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { MarketplaceFilterModel } from "@features/equipment/components/marketplace-filter/marketplace-filter.component";
import { Store } from "@ngrx/store";
import { MainState } from "@app/store/state";
import { EquipmentMarketplaceService } from "@features/equipment/services/equipment-marketplace.service";
import { WindowRefService } from "@shared/services/window-ref.service";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "astrobin-marketplace-sidebar",
  templateUrl: "./marketplace-sidebar.component.html",
  styleUrls: ["./marketplace-sidebar.component.scss"]
})
export class MarketplaceSidebarComponent extends BaseComponentDirective implements AfterViewInit {
  collapsed: boolean = false;

  @Output()
  filterChange = new EventEmitter<MarketplaceFilterModel>();

  constructor(
    public readonly store$: Store<MainState>,
    public readonly equipmentMarketplaceService: EquipmentMarketplaceService,
    public readonly windowRefService: WindowRefService,
    @Inject(PLATFORM_ID) public readonly platformId: any
  ) {
    super(store$);
  }

  initCollapsed(event?: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.collapsed = this.windowRefService.nativeWindow.innerWidth <= 768;
    }
  }

  ngAfterViewInit(): void {
    this.initCollapsed();
  }
}
