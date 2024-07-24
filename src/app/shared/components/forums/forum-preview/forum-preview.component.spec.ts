import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ForumPreviewComponent } from "./forum-preview.component";
import { MockBuilder } from "ng-mocks";
import { AppModule } from "@app/app.module";
import { provideMockStore } from "@ngrx/store/testing";
import { initialMainState } from "@app/store/state";

describe("ForumPreviewComponent", () => {
  let component: ForumPreviewComponent;
  let fixture: ComponentFixture<ForumPreviewComponent>;

  beforeEach(async () => {
    await MockBuilder(ForumPreviewComponent, AppModule).provide([provideMockStore({ initialState: initialMainState })]);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumPreviewComponent);
    component = fixture.componentInstance;
    component.forumId = 1;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
