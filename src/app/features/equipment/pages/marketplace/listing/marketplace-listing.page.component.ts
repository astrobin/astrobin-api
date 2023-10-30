import { Component, OnInit } from "@angular/core";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { Store } from "@ngrx/store";
import { State } from "@app/store/state";
import { ActivatedRoute } from "@angular/router";
import { LoadMarketplaceListing } from "@features/equipment/store/equipment.actions";
import { selectMarketplaceListingByHash } from "@features/equipment/store/equipment.selectors";
import { Observable } from "rxjs";
import { MarketplaceListingInterface } from "@features/equipment/types/marketplace-listing.interface";
import { SetBreadcrumb } from "@app/store/actions/breadcrumb.actions";
import { TranslateService } from "@ngx-translate/core";
import { filter, takeUntil, tap } from "rxjs/operators";
import { TitleService } from "@shared/services/title/title.service";
import { LoadingService } from "@shared/services/loading.service";

@Component({
  selector: "astrobin-marketplace-listing-page",
  templateUrl: "./marketplace-listing.page.component.html",
  styleUrls: ["./marketplace-listing.page.component.scss"]
})
export class MarketplaceListingPageComponent extends BaseComponentDirective implements OnInit {
  readonly breadcrumb = new SetBreadcrumb({
    breadcrumb: [
      {
        label: this.translateService.instant("Equipment"),
        link: "/equipment/explorer"
      },
      {
        label: this.translateService.instant("Marketplace"),
        link: "/equipment/marketplace"
      },
      {
        label: this.translateService.instant("Listing")
      }
    ]
  });

  title = this.translateService.instant("Equipment marketplace listing");
  listing$: Observable<MarketplaceListingInterface>;

  private _hash: MarketplaceListingInterface["hash"];

  constructor(
    public readonly store$: Store<State>,
    public readonly activatedRoute: ActivatedRoute,
    public readonly translateService: TranslateService,
    public readonly titleService: TitleService,
    public readonly loadingService: LoadingService
  ) {
    super(store$);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this._getListingFromRoute();

    this.titleService.setTitle(this.title);
    this.store$.dispatch(this.breadcrumb);

    this.refresh();
  }

  public refresh() {
    this.loadingService.setLoading(true);
    this.store$.dispatch(new LoadMarketplaceListing({ hash: this._hash }));
  }

  private _getListingFromRoute() {
    this.activatedRoute.paramMap.subscribe(params => {
      this._hash = params.get("hash");
      if (!!this._hash) {
        this.listing$ = this.store$.select(selectMarketplaceListingByHash(this._hash)).pipe(
          filter(listing => !!listing),
          tap(() => this.loadingService.setLoading(false)),
          takeUntil(this.destroyed$)
        );
      }
    });
  }
}
