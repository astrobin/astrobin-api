import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NestedCommentComponent } from "./nested-comment.component";
import { MockBuilder } from "ng-mocks";
import { AppModule } from "@app/app.module";
import { NestedCommentGenerator } from "@shared/generators/nested-comment.generator";
import { provideMockStore } from "@ngrx/store/testing";
import { initialMainState } from "@app/store/state";
import { provideMockActions } from "@ngrx/effects/testing";
import { of } from "rxjs";

describe("NestedCommentComponent", () => {
  let component: NestedCommentComponent;
  let fixture: ComponentFixture<NestedCommentComponent>;

  beforeEach(async () => {
    await MockBuilder(NestedCommentComponent, AppModule).provide([
      provideMockStore({ initialState: initialMainState }),
      provideMockActions(() => of())
    ]);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedCommentComponent);
    component = fixture.componentInstance;
    component.comment = NestedCommentGenerator.nestedComment();
    jest.spyOn(component.windowRefService, "getCurrentUrl").mockReturnValue({ hash: null } as URL);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
