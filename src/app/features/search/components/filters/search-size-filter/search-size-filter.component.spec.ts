import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchSizeFilterComponent } from "./search-size-filter.component";
import { AppModule } from "@app/app.module";
import { MockBuilder } from "ng-mocks";
import { provideMockStore } from "@ngrx/store/testing";
import { initialMainState } from "@app/store/state";

describe("SizeFilterComponent", () => {
  let component: SearchSizeFilterComponent;
  let fixture: ComponentFixture<SearchSizeFilterComponent>;

  beforeEach(async () => {
    await MockBuilder(SearchSizeFilterComponent, AppModule).provide([
      provideMockStore({ initialState: initialMainState })
    ]);

    fixture = TestBed.createComponent(SearchSizeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
