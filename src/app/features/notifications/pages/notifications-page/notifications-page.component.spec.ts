import { AppModule } from "@app/app.module";
import { NotificationInterfaceGenerator } from "@features/notifications/generators/notification.interface.generator";
import { NotificationsModule } from "@features/notifications/notifications.module";
import { MockBuilder, MockInstance, MockRender, MockService } from "ng-mocks";
import { NotificationsPageComponent } from "./notifications-page.component";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { fakeAsync, flush } from "@angular/core/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { initialMainState } from "@app/store/state";
import { of } from "rxjs";
import { NotificationsService } from "@features/notifications/services/notifications.service";

describe("NotificationsPageComponent", () => {
  let component: NotificationsPageComponent;

  beforeEach(() =>
    MockBuilder(NotificationsPageComponent, NotificationsModule)
      .mock(AppModule, { export: true })
      .provide([
        provideMockStore({ initialState: initialMainState }),
        {
          provide: DomSanitizer,
          useValue: {
            sanitize: () => "safeString",
            bypassSecurityTrustHtml: () => "safeString"
          }
        }
      ])
  );

  beforeEach(() => {
    MockInstance(ActivatedRoute, () => ({
      snapshot: MockService(ActivatedRouteSnapshot, {
        queryParamMap: {
          has: jest.fn(),
          get: jest.fn(),
          getAll: jest.fn(),
          keys: []
        }
      })
    }));

    MockInstance(NotificationsService, () => ({
      refresh: jest.fn().mockReturnValue(of(null)),
      markAsRead: jest.fn().mockReturnValue(of(null)),
      markAllAsRead: jest.fn().mockReturnValue(of(null)),
      getAll: jest.fn().mockReturnValue(of(null))
    }));

    const fixture = MockRender(NotificationsPageComponent);
    component = fixture.point.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("toggleRead", () => {
    it("should call the right service method", () => {
      const notification = NotificationInterfaceGenerator.notification();
      notification.read = true;

      component.toggleRead(notification);

      expect(component.notificationsService.markAsRead).toHaveBeenCalledWith(notification, false);

      notification.read = false;
      component.toggleRead(notification);

      expect(component.notificationsService.markAsRead).toHaveBeenCalledWith(notification, true);
    });
  });

  describe("markAllAsRead", () => {
    it("should call the service method", () => {
      component.markAllAsRead();

      expect(component.notificationsService.markAllAsRead).toHaveBeenCalled();
    });
  });

  describe("pageChange", () => {
    it("should get notification for that page from the service", fakeAsync(() => {
      jest
        .spyOn(component.router, "navigateByUrl")
        .mockImplementation(() => new Promise<boolean>(resolve => resolve(true)));

      component.pageChange(2);

      flush();

      expect(component.notificationsService.getAll).toHaveBeenCalledWith(2);
    }));
  });
});
