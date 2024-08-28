import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { Component, ElementRef, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from "@angular/core";
import { fromEvent, Observable, Subject, throttleTime } from "rxjs";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { takeUntil } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { MainState } from "@app/store/state";
import { WindowRefService } from "@shared/services/window-ref.service";
import { SearchModelInterface } from "@features/search/interfaces/search-model.interface";
import { SearchPaginatedApiResultInterface } from "@shared/services/api/interfaces/search-paginated-api-result.interface";
import { TranslateService } from "@ngx-translate/core";
import { UtilsService } from "@shared/services/utils/utils.service";

@Component({
  selector: "astrobin-scrollable-search-results-base",
  template: ""
})
export abstract class ScrollableSearchResultsBaseComponent<T> extends BaseComponentDirective implements OnInit, OnChanges {
  initialLoading = false;
  loading = false;
  page = 1;
  next: string | null = null;
  results: T[] = null;
  lastResultsCount = 0;
  pageSize = 100;

  @Input() model: SearchModelInterface;
  @Input() loadMoreOnScroll = true;
  @Input() showResultsCount = false;

  protected dataFetched = new Subject<{ data: T[], cumulative: boolean }>();
  protected scheduledLoadingTimeout: number = null;

  protected constructor(
    public readonly store$: Store<MainState>,
    public readonly windowRefService: WindowRefService,
    public readonly elementRef: ElementRef,
    @Inject(PLATFORM_ID) public readonly platformId: Record<string, unknown>,
    public readonly translateService: TranslateService
  ) {
    super(store$);
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (isPlatformBrowser(this.platformId)) {
      const scrollElement = this._getScrollableParent(this.elementRef.nativeElement) || this.windowRefService.nativeWindow;

      fromEvent(scrollElement, "scroll")
        .pipe(takeUntil(this.destroyed$), throttleTime(200))
        .subscribe(() => this._onScroll());
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.model && changes.model.currentValue) {
      if (
        this.windowRefService.nativeWindow.clearTimeout === undefined ||
        this.windowRefService.nativeWindow.setTimeout === undefined
      ) {
        // Server side.
        this.loadData();
      } else {
        this.cancelScheduledLoading();
        this.scheduleLoading();
      }
    }
  }

  modelIsPristine(): boolean {
    const ignoreModelKeys = ["page", "pageSize", "searchType", "ordering"];
    const modelKeys = Object.keys(this.model).filter(key => !ignoreModelKeys.includes(key));

    console.log(this.model);

    return modelKeys.filter(key => !ignoreModelKeys.includes(key)).every(key => {
      const value = this.model[key];
      console.log(value);
      return (
        value === "" ||
        value === null ||
        value === undefined ||
        (
          UtilsService.isObject(value) && (
            value.value === "" ||
            value.value === null ||
            value.value === undefined ||
            (UtilsService.isArray(value.value) && value.value.length === 0)
          )
        )
      );
    });
  }

  updateLastResultsCount(): void {
    let count = this.results?.length || 0;

    if (this.modelIsPristine()) {
      this.lastResultsCount = null;
      return;
    }

    if (count === 0) {
      this.lastResultsCount = this.translateService.instant("No results");
    } else if (count === 1) {
      this.lastResultsCount = this.translateService.instant("1 result");
    } else if (count >= 10000 && count < 100000) {
      this.lastResultsCount = this.translateService.instant("{{ count }} results", { count: Math.round(count / 10000) * 10000 });
    } else if (count >= 100000 && count < 1000000) {
      this.lastResultsCount = this.translateService.instant("{{ count }} results", { count: Math.round(count / 100000) * 100000 });
    } else if (count >= 1000000 && count < 10000000) {
      this.lastResultsCount = this.translateService.instant("{{ count }} results", { count: Math.round(count / 1000000) * 1000000 });
    } else {
      this.lastResultsCount = this.translateService.instant("{{ count }} results", { count });
    }
  }

  cancelScheduledLoading() {
    if (this.scheduledLoadingTimeout && this.windowRefService.nativeWindow.clearTimeout !== undefined) {
      this.windowRefService.nativeWindow.clearTimeout(this.scheduledLoadingTimeout);
      this.scheduledLoadingTimeout = null;
    }
  }

  scheduleLoading() {
    if (this.windowRefService.nativeWindow.setTimeout !== undefined) {
      this.scheduledLoadingTimeout = this.windowRefService.nativeWindow.setTimeout(() => {
        this.loadData();
      }, 50);
    } else {
      this.loadData();
    }
  }

  loadData(): void {
    if (
      isPlatformBrowser(this.platformId) &&
      this._isNearTop()
    ) {
      this.loading = false;
      this.initialLoading = true;

      this.fetchData().subscribe(response => {
        this.results = response.results;
        this.next = response.next;
        this.initialLoading = false;
        this.updateLastResultsCount();
        this.cancelScheduledLoading();
        this.dataFetched.next({ data: this.results, cumulative: false });
      });
    }
  }

  loadMore(): Observable<T[]> {
    return new Observable<T[]>(observer => {
      if (this.next && !this.loading) {
        this.loading = true;
        this.model = { ...this.model, page: (this.model.page || 1) + 1 };

        this.fetchData().subscribe(response => {
          this.results = this.results.concat(response.results);
          this.next = response.next;
          this.loading = false;
          this.cancelScheduledLoading();
          this.dataFetched.next({ data: this.results, cumulative: true });

          observer.next(response.results);
          observer.complete();
        });
      } else {
        observer.next([]);
        observer.complete();
      }
    });
  }

  abstract fetchData(): Observable<SearchPaginatedApiResultInterface<T>>;

  private _onScroll() {
    if (
      isPlatformBrowser(this.platformId) &&
      this._isNearBottom() &&
      !this.initialLoading &&
      !this.loading
    ) {
      if (this.results !== null) {
        if (this.loadMoreOnScroll) {
          this.loadMore().subscribe();
        }
      } else {
        this.loadData();
      }
    }
  }

  private _getScrollableParent(element: HTMLElement): HTMLElement | null {
    let parent = element.parentElement;

    while (parent) {
      const overflowY = window.getComputedStyle(parent).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        return parent;
      }
      parent = parent.parentElement;
    }

    return null;
  }

  private _isNearTop(): boolean {
    if (isPlatformServer(this.platformId)) {
      return false;
    }

    const window = this.windowRefService.nativeWindow;
    const rect = this.elementRef.nativeElement.getBoundingClientRect();

    return rect.top < window.innerHeight + 2000;
  }

  private _isNearBottom(): boolean {
    if (isPlatformServer(this.platformId)) {
      return false;
    }

    const window = this.windowRefService.nativeWindow;
    const rect = this.elementRef.nativeElement.getBoundingClientRect();

    return rect.bottom < window.innerHeight + 2000;
  }
}
