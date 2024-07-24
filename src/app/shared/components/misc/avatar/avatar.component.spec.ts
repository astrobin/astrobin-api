import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AvatarComponent } from "./avatar.component";
import { MockBuilder } from "ng-mocks";
import { AppModule } from "@app/app.module";
import { provideMockStore } from "@ngrx/store/testing";
import { initialMainState } from "@app/store/state";
import { UserGenerator } from "@shared/generators/user.generator";

describe("AvatarComponent", () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await MockBuilder(AvatarComponent, AppModule).provide(provideMockStore({ initialState: initialMainState }));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    component.user = UserGenerator.user();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
