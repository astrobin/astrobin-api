import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { State } from "@app/store/state";
import { TranslateService } from "@ngx-translate/core";
import { SetBreadcrumb } from "@app/store/actions/breadcrumb.actions";
import { TitleService } from "@shared/services/title/title.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Actions } from "@ngrx/effects";
import { EquipmentApiService } from "@features/equipment/services/equipment-api.service";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { LoadBrand } from "@features/equipment/store/equipment.actions";
import { BrandInterface } from "@features/equipment/types/brand.interface";
import { PendingExplorerBaseComponent } from "@features/equipment/pages/explorer-base/pending-explorer-base.component";
import { EquipmentItemBaseInterface } from "@features/equipment/types/equipment-item-base.interface";
import { Observable } from "rxjs";
import { selectBrand } from "@features/equipment/store/equipment.selectors";
import { EquipmentItemService } from "@features/equipment/services/equipment-item.service";

@Component({
  selector: "astrobin-a-z-explorer",
  templateUrl: "./a-z-explorer.component.html",
  styleUrls: ["./a-z-explorer.component.scss"]
})
export class AZExplorerComponent extends PendingExplorerBaseComponent implements OnInit {
  title = this.translateService.instant("A-Z explorer");

  constructor(
    public readonly store$: Store<State>,
    public readonly actions$: Actions,
    public readonly activatedRoute: ActivatedRoute,
    public readonly router: Router,
    public readonly translateService: TranslateService,
    public readonly titleService: TitleService,
    public readonly equipmentApiService: EquipmentApiService,
    public readonly equipmentItemService: EquipmentItemService
  ) {
    super(store$, actions$, activatedRoute, router);
  }

  ngOnInit() {
    super.ngOnInit();

    this.titleService.setTitle(this.title);

    this.store$.dispatch(
      new SetBreadcrumb({
        breadcrumb: [
          {
            label: this.translateService.instant("Equipment")
          },
          {
            label: this.translateService.instant("Pending edit")
          }
        ]
      })
    );

    this._getItems();
  }

  pageChange(page: number): void {
    this.page = page;
    this._getItems(page);
  }

  getItemName$(item: EquipmentItemBaseInterface): Observable<string> {
    return this.store$.select(selectBrand, item.brand).pipe(
      filter(brand => !!brand),
      switchMap(brand => this.equipmentItemService.getName$(item).pipe(map(name => `${brand.name} ${name}`)))
    );
  }

  _getItems(page = 1) {
    this.items$ = this.equipmentApiService.getAllEquipmentItems(this._activeType, page, "az").pipe(
      tap(response => {
        const uniqueBrands: BrandInterface["id"][] = [];
        for (const item of response.results) {
          if (uniqueBrands.indexOf(item.brand) === -1) {
            uniqueBrands.push(item.brand);
          }
        }
        uniqueBrands.forEach(id => this.store$.dispatch(new LoadBrand({ id })));
      })
    );
  }
}
