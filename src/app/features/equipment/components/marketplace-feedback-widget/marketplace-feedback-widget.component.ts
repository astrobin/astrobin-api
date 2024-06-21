import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { State } from "@app/store/state";
import { Store } from "@ngrx/store";
import { UserInterface } from "@shared/interfaces/user.interface";
import { EquipmentMarketplaceService } from "@features/equipment/services/equipment-marketplace.service";
import { MarketplaceListingInterface } from "@features/equipment/types/marketplace-listing.interface";
import { take, takeUntil } from "rxjs/operators";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MarketplaceFeedbackModalComponent } from "@features/equipment/components/marketplace-feedback-modal/marketplace-feedback-modal.component";
import { selectMarketplaceListing } from "@features/equipment/store/equipment.selectors";
import { ActivatedRoute } from "@angular/router";
import { MarketplaceFeedbackTargetType } from "@features/equipment/types/marketplace-feedback.interface";
import { selectUser } from "@features/account/store/auth.selectors";

@Component({
  selector: "astrobin-marketplace-feedback-widget",
  templateUrl: "./marketplace-feedback-widget.component.html",
  styleUrls: ["./marketplace-feedback-widget.component.scss"]
})
export class MarketplaceFeedbackWidgetComponent extends BaseComponentDirective implements OnInit, AfterViewInit {
  @Input()
  user: UserInterface;

  @Input()
  listing: MarketplaceListingInterface;

  showLeaveFeedbackButton: boolean;
  alreadyHasFeedbackFromCurrentUser: boolean;
  stars: number[] = [0, 0, 0, 0, 0]; // 0: empty, 1: half, 2: full

  constructor(
    public readonly store$: Store<State>,
    public readonly marketplaceService: EquipmentMarketplaceService,
    public readonly modalService: NgbModal,
    public readonly activatedRoute: ActivatedRoute
  ) {
    super(store$);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.store$.select(selectMarketplaceListing, { id: this.listing.id }).pipe(takeUntil(this.destroyed$)).subscribe(listing => {
      this.listing = listing;
      this.updateState();
    });

    this.store$.select(selectUser, this.user.id).pipe(takeUntil(this.destroyed$)).subscribe(user => {
      this.user = user;
      this.updateState();
    });
  }

  ngAfterViewInit(): void {
    const fragment = this.activatedRoute.snapshot.fragment;

    if (fragment === "feedback") {
      this.showFeedbackModal();
    }
  }

  updateState(): void {
    this.calculateStarRating();

    this.currentUser$
      .pipe(take(1))
      .subscribe(currentUser => {
        // We allow to leave feedback if:
        // - The current user is the seller, and the user in this component has some accepted offers
        // - The current user is a buyer with some accepted offers, and the user in this component is the seller

        if (currentUser.id === this.user.id) {
          this.showLeaveFeedbackButton = false;
        } else if (currentUser.id === this.listing.user) {
          // The current user is the seller of this listing. They can leave feedback if the user in this component is a
          // buyer and has some accepted offers.
          this.showLeaveFeedbackButton = this.marketplaceService.userIsBuyer(this.user.id, this.listing);
        } else {
          this.showLeaveFeedbackButton = this.marketplaceService.userIsBuyer(currentUser.id, this.listing);
        }

        this.listing.lineItems.forEach(lineItem => {
          lineItem.feedbacks.forEach(feedback => {
            if (feedback.recipient === this.user.id) {
              this.alreadyHasFeedbackFromCurrentUser = true;
            }
          });
        });
      });
  }

  calculateStarRating(): void {
    const feedbackPercentage = this.user.marketplaceFeedback;
    const fullStars = Math.floor(feedbackPercentage / 20);
    const halfStar = (feedbackPercentage % 20) >= 10 ? 1 : 0;

    for (let i = 0; i < fullStars; i++) {
      this.stars[i] = 2;
    }

    if (halfStar && fullStars < 5) {
      this.stars[fullStars] = 1;
    }
  }

  showFeedbackModal(): void {
    this.currentUser$
      .pipe(take(1))
      .subscribe(currentUser => {
        const targetType = currentUser.id === this.listing.user
          ? MarketplaceFeedbackTargetType.BUYER
          : MarketplaceFeedbackTargetType.SELLER;

        const modalRef = this.modalService.open(MarketplaceFeedbackModalComponent, {
          size: targetType === MarketplaceFeedbackTargetType.SELLER ? "xl" : "lg"
        });
        const componentInstance: MarketplaceFeedbackModalComponent = modalRef.componentInstance;

        componentInstance.listing = this.listing;
        componentInstance.user = this.user;
        componentInstance.targetType = targetType;
      });
  }
}