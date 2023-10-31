import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MarketplaceUserCardComponent } from "./marketplace-user-card.component";
import { MockBuilder } from "ng-mocks";
import { initialState } from "@app/store/state";
import { provideMockStore } from "@ngrx/store/testing";

describe("MarketplaceUserCardComponent", () => {
  let component: MarketplaceUserCardComponent;
  let fixture: ComponentFixture<MarketplaceUserCardComponent>;

  beforeEach(async () => {
    await MockBuilder(MarketplaceUserCardComponent).provide(provideMockStore({ initialState }));

    fixture = TestBed.createComponent(MarketplaceUserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
