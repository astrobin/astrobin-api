import { Component } from "@angular/core";
import { SearchBaseFilterComponent } from "@features/search/components/filters/search-base-filter/search-base-filter.component";
import { Store } from "@ngrx/store";
import { MainState } from "@app/store/state";
import { TranslateService } from "@ngx-translate/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SearchAutoCompleteType, SearchService } from "@features/search/services/search.service";
import { SearchFilterCategory } from "@features/search/interfaces/search-filter-component.interface";

@Component({
  selector: "astrobin-search-text-filter.search-filter-component",
  templateUrl: "../search-base-filter/search-base-filter.component.html",
  styleUrls: ["../search-base-filter/search-base-filter.component.scss"]
})
export class SearchTextFilterComponent extends SearchBaseFilterComponent {
  static key = SearchAutoCompleteType.TEXT;
  category = SearchFilterCategory.GENERAL;
  label = this.searchService.humanizeSearchAutoCompleteType(SearchTextFilterComponent.key);
  editFields = [];
  mayBeRemoved = false;
  infoText = this.translateService.instant(
    "This searches the title, description, and most image attributes, even if the exact words don't match perfectly." +
    " You can use quotation marks for exact matching, and the minus sign to exclude keywords. To do even more" +
    " precise searches, add filters."
  );

  constructor(
    public readonly store$: Store<MainState>,
    public readonly translateService: TranslateService,
    public readonly domSanitizer: DomSanitizer,
    public readonly modalService: NgbModal,
    public readonly searchService: SearchService
  ) {
    super(store$, translateService, domSanitizer, modalService, searchService);
  }
}
