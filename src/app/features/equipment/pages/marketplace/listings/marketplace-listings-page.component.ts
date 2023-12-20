import { Component, OnInit } from "@angular/core";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { Store } from "@ngrx/store";
import { State } from "@app/store/state";
import { TranslateService } from "@ngx-translate/core";
import { TitleService } from "@shared/services/title/title.service";
import { SetBreadcrumb } from "@app/store/actions/breadcrumb.actions";
import { selectMarketplaceListings } from "@features/equipment/store/equipment.selectors";
import { filter, map, takeUntil, tap } from "rxjs/operators";
import { LoadMarketplaceListings } from "@features/equipment/store/equipment.actions";
import { LoadingService } from "@shared/services/loading.service";

@Component({
  selector: "astrobin-marketplace-listings-page",
  templateUrl: "./marketplace-listings-page.component.html",
  styleUrls: ["./marketplace-listings-page.component.scss"]
})
export class MarketplaceListingsPageComponent extends BaseComponentDirective implements OnInit {
  readonly title = this.translateService.instant("Equipment marketplace");

  listings$ = this.store$.select(selectMarketplaceListings).pipe(
    takeUntil(this.destroyed$),
    filter(listings => !!listings),
    map(listings => listings.filter(listing => listing.lineItems.length > 0)),
    tap(() => this.loadingService.setLoading(false))
  );

  page = 1;

  constructor(
    public readonly store$: Store<State>,
    public readonly translateService: TranslateService,
    public readonly titleService: TitleService,
    public readonly loadingService: LoadingService
  ) {
    super(store$);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.titleService.setTitle(this.title);

    this.store$.dispatch(
      new SetBreadcrumb({
        breadcrumb: [
          {
            label: this.translateService.instant("Equipment"),
            link: "/equipment/explorer"
          },
          {
            label: this.translateService.instant("Marketplace")
          },
          {
            label: this.translateService.instant("All listings")
          }
        ]
      })
    );

    this.refresh();
  }

  public refresh() {
    this.loadingService.setLoading(true);
    this.store$.dispatch(new LoadMarketplaceListings({ page: this.page }));
  }
}
