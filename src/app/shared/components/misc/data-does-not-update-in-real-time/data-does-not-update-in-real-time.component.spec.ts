import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataDoesNotUpdateInRealTimeComponent } from "./data-does-not-update-in-real-time.component";
import { MockBuilder } from "ng-mocks";
import { AppModule } from "@app/app.module";
import { provideMockStore } from "@ngrx/store/testing";
import { initialMainState } from "@app/store/state";

describe("DataDoesNotUpdateInRealtimeComponent", () => {
  let component: DataDoesNotUpdateInRealTimeComponent;
  let fixture: ComponentFixture<DataDoesNotUpdateInRealTimeComponent>;

  beforeEach(async () => {
    await MockBuilder(DataDoesNotUpdateInRealTimeComponent, AppModule).provide([provideMockStore({ initialState: initialMainState })]);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDoesNotUpdateInRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
