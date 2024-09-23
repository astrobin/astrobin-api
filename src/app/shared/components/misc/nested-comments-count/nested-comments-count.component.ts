import { Component, HostBinding, Input, OnChanges } from "@angular/core";
import { ContentTypeInterface } from "@shared/interfaces/content-type.interface";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { Store } from "@ngrx/store";
import { MainState } from "@app/store/state";
import { Observable } from "rxjs";
import { LoadNestedComments } from "@app/store/actions/nested-comments.actions";
import { selectNestedCommentsByContentTypeIdAndObjectId } from "@app/store/selectors/app/nested-comments.selectors";
import { filter, map, takeUntil, tap } from "rxjs/operators";

@Component({
  selector: "astrobin-nested-comments-count",
  templateUrl: "./nested-comments-count.component.html"
})
export class NestedCommentsCountComponent extends BaseComponentDirective implements OnChanges {
  @Input()
  contentType: ContentTypeInterface;

  @Input()
  objectId: number;

  @Input()
  hideZero = false;

  @HostBinding("class.d-none")
  hide = false;

  count$: Observable<number>;

  constructor(public readonly store$: Store<MainState>) {
    super(store$);
  }

  ngOnChanges() {
    if (!this.contentType || !this.objectId) {
      return;
    }

    // Assume that the nested comments are already loaded.
    this.count$ = this.store$.select(
      selectNestedCommentsByContentTypeIdAndObjectId(this.contentType.id, this.objectId)
    ).pipe(
      filter(nestedComments => nestedComments !== null),
      map(nestedComments => nestedComments.length),
      tap(count => (this.hide = count === 0 && this.hideZero)),
      takeUntil(this.destroyed$)
    );
  }
}
