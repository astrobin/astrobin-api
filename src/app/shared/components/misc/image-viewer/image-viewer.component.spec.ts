import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewerComponent } from './image-viewer.component';
import { MockBuilder } from "ng-mocks";
import { AppModule } from "@app/app.module";
import { provideMockStore } from "@ngrx/store/testing";
import { initialMainState } from "@app/store/state";

describe('ImageViewerComponent', () => {
  let component: ImageViewerComponent;
  let fixture: ComponentFixture<ImageViewerComponent>;

  beforeEach(async () => {
    await MockBuilder(ImageViewerComponent, AppModule).provide([
      provideMockStore({ initialState: initialMainState }),
    ]);

    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});