import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { Store } from "@ngrx/store";
import { State } from "@app/store/state";
import {
  EquipmentItemBaseInterface,
  EquipmentItemReviewerDecision
} from "@features/equipment/types/equipment-item-base.interface";
import { LoadBrand } from "@features/equipment/store/equipment.actions";
import { TranslateService } from "@ngx-translate/core";
import { selectBrand } from "@features/equipment/store/equipment.selectors";
import { filter, take, takeUntil } from "rxjs/operators";
import { EquipmentItemService } from "@features/equipment/services/equipment-item.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ItemSummaryModalComponent } from "@shared/components/equipment/summaries/item-summary-modal/item-summary-modal.component";
import { ItemUnapprovedInfoModalComponent } from "@shared/components/equipment/item-unapproved-info-modal/item-unapproved-info-modal.component";
import { UtilsService } from "@shared/services/utils/utils.service";

@Component({
  selector: "astrobin-equipment-item-display-name",
  templateUrl: "./equipment-item-display-name.component.html",
  styleUrls: ["./equipment-item-display-name.component.scss"]
})
export class EquipmentItemDisplayNameComponent extends BaseComponentDirective implements OnChanges {
  @Input()
  item: EquipmentItemBaseInterface;

  @Input()
  enableSummaryModal = false;

  @Input()
  enableBrandLink = false;

  brandName: string;
  brandLink: string;
  itemName: string;
  showItemUnapprovedInfo: boolean;

  constructor(
    public readonly store$: Store<State>,
    public readonly translateService: TranslateService,
    public readonly equipmentItemService: EquipmentItemService,
    public readonly modalService: NgbModal
  ) {
    super(store$);
  }

  ngOnChanges(): void {
    if (!!this.item.brand) {
      this.store$.dispatch(new LoadBrand({ id: this.item.brand }));
      this.store$
        .select(selectBrand, this.item.brand)
        .pipe(
          takeUntil(this.destroyed$),
          filter(brand => !!brand)
        )
        .subscribe(brand => {
          this.brandName = brand.name;
          this.brandLink = `/equipment/explorer/brand/${brand.id}/${UtilsService.slugify(brand.name)}`;
        });
    } else {
      this.brandName = this.translateService.instant("(DIY)");
      this.brandLink = undefined;
    }

    this.equipmentItemService
      .getName$(this.item)
      .pipe(take(1))
      .subscribe(name => (this.itemName = name));

    this.showItemUnapprovedInfo =
      this.item.reviewerDecision !== EquipmentItemReviewerDecision.APPROVED && !!this.item.brand;
  }

  openItemSummaryModal(item: EquipmentItemBaseInterface) {
    const modal: NgbModalRef = this.modalService.open(ItemSummaryModalComponent);
    modal.componentInstance.item = item;
  }

  openItemUnapprovedInfoModal(item: EquipmentItemBaseInterface) {
    const modal: NgbModalRef = this.modalService.open(ItemUnapprovedInfoModalComponent);
    modal.componentInstance.item = item;
  }
}
