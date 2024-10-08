import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { UserInterface } from "@shared/interfaces/user.interface";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { select, Store } from "@ngrx/store";
import { MainState } from "@app/store/state";
import { CollectionInterface } from "@shared/interfaces/collection.interface";
import { LoadCollections } from "@app/store/actions/collection.actions";
import { selectCollections } from "@app/store/selectors/app/collection.selectors";
import { takeUntil } from "rxjs/operators";
import { FindImages } from "@app/store/actions/image.actions";

@Component({
  selector: "astrobin-user-gallery-collection-thumbnail",
  template: `
    <ng-container *ngIf="currentUserWrapper$ | async as currentUserWrapper">
      <div class="collection-container">
        <div class="collection-background">
          <div class="collection-thumbnail">
            <img *ngIf="collection.coverThumbnail" [ngSrc]="collection.coverThumbnail" fill alt="" />
            <img
              *ngIf="!collection.coverThumbnail"
              [ngSrc]="'/assets/images/stars.jpg?v=20241008'"
              alt=""
              class="empty-collection-thumbnail"
              fill
            />
          </div>
        </div>

        <div class="collection-name">
          {{ collection.name }}
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ["./user-gallery-collection-thumbnail.component.scss"]
})
export class UserGalleryCollectionThumbnailComponent
  extends BaseComponentDirective implements OnInit, OnChanges
{
  @Input() user: UserInterface;
  @Input() collection: CollectionInterface;

  private coverThumbnail: string;

  constructor(
    public readonly store$: Store<MainState>
  ) {
    super(store$);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.collection) {
    }
  }
}
