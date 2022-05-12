import { Component, OnInit } from "@angular/core";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { Store } from "@ngrx/store";
import { State } from "@app/store/state";
import { Actions } from "@ngrx/effects";
import { EquipmentItemBaseInterface, EquipmentItemType } from "@features/equipment/types/equipment-item-base.interface";
import { ActivatedRoute, NavigationEnd, Params, Router } from "@angular/router";
import { selectBrand } from "@features/equipment/store/equipment.selectors";
import { take, takeUntil } from "rxjs/operators";
import { UtilsService } from "@shared/services/utils/utils.service";
import { EditProposalInterface } from "@features/equipment/types/edit-proposal.interface";
import { Observable } from "rxjs";
import { PaginatedApiResultInterface } from "@shared/services/api/interfaces/paginated-api-result.interface";
import { WindowRefService } from "@shared/services/window-ref.service";

@Component({
  selector: "astrobin-equipment-explorer-base",
  template: ""
})
export abstract class ExplorerBaseComponent extends BaseComponentDirective implements OnInit {
  public page = 1;
  activeEditProposalId: EditProposalInterface<EquipmentItemBaseInterface>["id"];
  items$: Observable<PaginatedApiResultInterface<EquipmentItemBaseInterface>>;

  protected constructor(
    public readonly store$: Store<State>,
    public readonly actions$: Actions,
    public readonly activatedRoute: ActivatedRoute,
    public readonly router: Router,
    public readonly windowRefService: WindowRefService
  ) {
    super(store$);
  }

  protected _activeType: EquipmentItemType;

  get activeType(): EquipmentItemType {
    return this._activeType;
  }

  set activeType(type: string) {
    this._activeType = EquipmentItemType[type.toUpperCase()];
  }

  ngOnInit() {
    this.page = +this.activatedRoute.snapshot.queryParamMap.get("page") || 1;
    this.activeType = this.activatedRoute.snapshot.paramMap.get("itemType");
    this.activeEditProposalId = +this.activatedRoute.snapshot.paramMap.get("editProposalId");

    this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeType = this.activatedRoute.snapshot.paramMap.get("itemType");
        this.getItems();
      }
    });

    this.getItems();
  }

  viewItem(item: EquipmentItemBaseInterface): void {
    this.store$
      .select(selectBrand, item.brand)
      .pipe(take(1))
      .subscribe(brand => {
        this.router.navigate([
          "equipment",
          "explorer",
          this.activeType.toLowerCase(),
          item.id,
          UtilsService.slugify(`${brand.name} ${item.name}`)
        ]);
      });
  }

  pageChange(page: number) {
    this.page = page;

    const queryParams: Params = { page };

    this.router
      .navigate([], {
        relativeTo: this.activatedRoute,
        queryParams,
        queryParamsHandling: "merge"
      })
      .then(() => {
        this.getItems();
        this.windowRefService.scroll({ top: 0 });
      });
  }

  abstract getItems();
}
