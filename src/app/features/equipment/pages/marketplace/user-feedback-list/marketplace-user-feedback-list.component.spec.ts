import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MarketplaceUserFeedbackListComponent } from "./marketplace-user-feedback-list.component";
import { MockBuilder } from "ng-mocks";
import { provideMockStore } from "@ngrx/store/testing";
import { initialState } from "@app/store/state";

describe("MarketplaceUserFeedbackListComponent", () => {
  let component: MarketplaceUserFeedbackListComponent;
  let fixture: ComponentFixture<MarketplaceUserFeedbackListComponent>;

  beforeEach(async () => {
    await MockBuilder(MarketplaceUserFeedbackListComponent).provide([
      provideMockStore({ initialState })
    ]);

    fixture = TestBed.createComponent(MarketplaceUserFeedbackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
