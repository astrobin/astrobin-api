import { AfterViewInit, Component, OnInit } from "@angular/core";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { Store } from "@ngrx/store";
import { State } from "@app/store/state";
import { ActivatedRoute, Router } from "@angular/router";
import { MarketplaceListingInterface } from "@features/equipment/types/marketplace-listing.interface";
import { SetBreadcrumb } from "@app/store/actions/breadcrumb.actions";
import { TranslateService } from "@ngx-translate/core";
import { TitleService } from "@shared/services/title/title.service";
import { LoadingService } from "@shared/services/loading.service";
import { selectContentType, selectContentTypeById } from "@app/store/selectors/app/content-type.selectors";
import { filter, map, switchMap, take, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { LoadContentType, LoadContentTypeById } from "@app/store/actions/content-type.actions";
import { Observable } from "rxjs";
import { ContentTypeInterface } from "@shared/interfaces/content-type.interface";
import { EquipmentMarketplaceService } from "@features/equipment/services/equipment-marketplace.service";
import { UserInterface } from "@shared/interfaces/user.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationDialogComponent } from "@shared/components/misc/confirmation-dialog/confirmation-dialog.component";
import { Actions, ofType } from "@ngrx/effects";
import {
  CreateMarketplacePrivateConversation,
  CreateMarketplacePrivateConversationSuccess,
  DeleteMarketplaceListing,
  DeleteMarketplaceListingSuccess,
  DeleteMarketplacePrivateConversation,
  DeleteMarketplacePrivateConversationSuccess,
  EquipmentActionTypes,
  LoadMarketplacePrivateConversations,
  UpdateMarketplacePrivateConversation
} from "@features/equipment/store/equipment.actions";
import { MarketplacePrivateConversationInterface } from "@features/equipment/types/marketplace-private-conversation.interface";
import { NestedCommentsModalComponent } from "@shared/components/misc/nested-comments-modal/nested-comments-modal.component";
import {
  LoadNestedComment,
  LoadNestedComments,
  LoadNestedCommentsSuccess
} from "@app/store/actions/nested-comments.actions";
import { AppActionTypes } from "@app/store/actions/app.actions";
import {
  selectMarketplacePrivateConversation,
  selectMarketplacePrivateConversations
} from "@features/equipment/store/equipment.selectors";
import { selectNestedCommentById } from "@app/store/selectors/app/nested-comments.selectors";
import { NestedCommentInterface } from "@shared/interfaces/nested-comment.interface";

@Component({
  selector: "astrobin-marketplace-listing-page",
  templateUrl: "./marketplace-listing.page.component.html",
  styleUrls: ["./marketplace-listing.page.component.scss"]
})
export class MarketplaceListingPageComponent extends BaseComponentDirective implements OnInit, AfterViewInit {
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
  listing: MarketplaceListingInterface;
  listingContentType$: Observable<ContentTypeInterface>;
  listingUser$: Observable<UserInterface>;
  privateConversations$: Observable<MarketplacePrivateConversationInterface[]>;

  private _contentTypePayload = { appLabel: "astrobin_apps_equipment", model: "equipmentitemmarketplacelisting" };

  constructor(
    public readonly store$: Store<State>,
    public readonly actions$: Actions,
    public readonly activatedRoute: ActivatedRoute,
    public readonly translateService: TranslateService,
    public readonly titleService: TitleService,
    public readonly loadingService: LoadingService,
    public readonly equipmentMarketplaceService: EquipmentMarketplaceService,
    public readonly modalService: NgbModal,
    public readonly router: Router
  ) {
    super(store$);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.titleService.setTitle(this.title);
    this.store$.dispatch(this.breadcrumb);

    this.listing = this.activatedRoute.snapshot.data.listing;

    this.listingContentType$ = this.store$.select(selectContentType, this._contentTypePayload).pipe(
      filter(contentType => !!contentType),
      take(1)
    );

    this.listingUser$ = this.equipmentMarketplaceService.getListingUser$(this.listing).pipe(
      filter(user => !!user),
      take(1)
    );

    this.privateConversations$ = this.store$
      .select(selectMarketplacePrivateConversations(this.listing.id))
      .pipe(takeUntil(this.destroyed$));

    this.store$.dispatch(new LoadContentType(this._contentTypePayload));
    this.store$.dispatch(new LoadMarketplacePrivateConversations({ listingId: this.listing.id }));
  }

  ngAfterViewInit(): void {
    const fragment = this.activatedRoute.snapshot.fragment;
    if (fragment && fragment[0] === "c") {
      const commentId = +fragment.substring(1);

      this.store$.select(selectNestedCommentById, commentId).pipe(
        takeUntil(this.destroyed$),
        filter(comment => !!comment),
        take(1)
      ).subscribe((comment: NestedCommentInterface) => {
        const contentTypeId = comment.contentType;

        this.store$.select(selectContentTypeById, { id: contentTypeId }).pipe(
          takeUntil(this.destroyed$),
          filter(contentType => !!contentType && contentType.model === "equipmentitemmarketplaceprivateconversation"),
          switchMap(() => this.store$.select(selectMarketplacePrivateConversation(comment.objectId))),
          take(1)
        ).subscribe(privateConversation => {
          this.startPrivateConversation(privateConversation);
        });

        this.store$.dispatch(new LoadContentTypeById({ id: contentTypeId }));
      });

      this.store$.dispatch(new LoadNestedComment({ id: commentId }));
    }
  }

  delete() {
    const confirmationModal = this.modalService.open(ConfirmationDialogComponent);
    confirmationModal.closed
      .pipe(
        tap(() => this.loadingService.setLoading(true)),
        tap(() => this.store$.dispatch(new DeleteMarketplaceListing({ listing: this.listing }))),
        switchMap(() => this.actions$.pipe(ofType(EquipmentActionTypes.DELETE_MARKETPLACE_LISTING_SUCCESS))),
        filter((action: DeleteMarketplaceListingSuccess) => action.payload.id === this.listing.id),
        take(1)
      )
      .subscribe(() => {
        this.router.navigateByUrl("/equipment/marketplace").then(() => {
          this.loadingService.setLoading(false);
        });
      });
  }

  startPrivateConversation(privateConversation: MarketplacePrivateConversationInterface) {
    const contentTypePayload = {
      appLabel: "astrobin_apps_equipment",
      model: "equipmentitemmarketplaceprivateconversation"
    };

    this.store$
      .select(selectContentType, contentTypePayload)
      .pipe(
        filter(contentType => !!contentType),
        take(1),
        withLatestFrom(this.currentUser$)
      )
      .subscribe(([contentType, currentUser]) => {
        this.loadingService.setLoading(false);

        const modalRef = this.modalService.open(NestedCommentsModalComponent, {
          size: "lg",
          centered: true
        });
        const componentInstance: NestedCommentsModalComponent = modalRef.componentInstance;

        componentInstance.contentType = contentType;
        componentInstance.objectId = privateConversation.id;
        componentInstance.title =
          currentUser.id === this.listing.user
            ? this.translateService.instant("Private conversation with a prospective buyer")
            : this.translateService.instant("Private conversation with the seller");
        componentInstance.addCommentLabel = this.translateService.instant("Start a new conversation");
        componentInstance.noCommentsLabel = this.translateService.instant("No messages yet.");

        modalRef.dismissed
          .pipe(
            tap(() => this.loadingService.setLoading(true)),
            tap(() =>
              this.store$.dispatch(
                new LoadNestedComments({
                  contentTypeId: contentType.id,
                  objectId: privateConversation.id
                })
              )
            ),
            switchMap(() => this.actions$.pipe(ofType(AppActionTypes.LOAD_NESTED_COMMENTS_SUCCESS))),
            map((action: LoadNestedCommentsSuccess) => action.payload.nestedComments),
            take(1)
          )
          .subscribe(nestedComments => {
            const currentTime = new Date().toISOString();
            const updatedPrivateConversation = {
              ...privateConversation,
              userLastAccessed:
                currentUser.id !== this.listing.user ? currentTime : privateConversation.userLastAccessed,
              listingUserLastAccessed:
                currentUser.id === this.listing.user ? currentTime : privateConversation.listingUserLastAccessed
            };

            this.store$.dispatch(
              new UpdateMarketplacePrivateConversation({ privateConversation: updatedPrivateConversation })
            );

            if (nestedComments.length === 0) {
              this.actions$
                .pipe(
                  ofType(EquipmentActionTypes.DELETE_MARKETPLACE_PRIVATE_CONVERSATION_SUCCESS),
                  filter(
                    (action: DeleteMarketplacePrivateConversationSuccess) =>
                      action.payload.listingId === this.listing.id
                  ),
                  take(1)
                )
                .subscribe(() => {
                  this.loadingService.setLoading(false);
                });

              this.store$.dispatch(new DeleteMarketplacePrivateConversation({ privateConversation }));
            } else {
              this.loadingService.setLoading(false);
            }
          });
      });

    this.store$.dispatch(new LoadContentType(contentTypePayload));
  }

  onMessageSellerClicked(event: Event) {
    event.preventDefault();

    this.loadingService.setLoading(true);

    this.store$
      .select(selectMarketplacePrivateConversations(this.listing.id))
      .pipe(take(1))
      .subscribe(privateConversations => {
        if (privateConversations.length === 0) {
          this.actions$
            .pipe(
              ofType(EquipmentActionTypes.CREATE_MARKETPLACE_PRIVATE_CONVERSATION_SUCCESS),
              filter(
                (action: CreateMarketplacePrivateConversationSuccess) =>
                  action.payload.privateConversation.listing === this.listing.id
              ),
              map((action: CreateMarketplacePrivateConversationSuccess) => action.payload.privateConversation),
              take(1)
            )
            .subscribe(privateConversation => {
              this.startPrivateConversation(privateConversation);
            });

          this.store$.dispatch(new CreateMarketplacePrivateConversation({ listingId: this.listing.id }));
        } else {
          this.startPrivateConversation(privateConversations[0]);
        }
      });
  }
}