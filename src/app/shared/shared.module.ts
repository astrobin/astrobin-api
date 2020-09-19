import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";
import { formlyConfig } from "@app/formly.config";
import { NgbModule, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { ApiModule } from "@shared/services/api/api.module";
import { AppContextService } from "@shared/services/app-context/app-context.service";
import { AuthService } from "@shared/services/auth.service";
import { ClassicRoutesService } from "@shared/services/classic-routes.service";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";
import { ImageOwnerGuardService } from "@shared/services/guards/image-owner-guard.service";
import { UltimateSubscriptionGuardService } from "@shared/services/guards/ultimate-subscription-guard.service";
import { LoadingService } from "@shared/services/loading.service";
import { PopNotificationsService } from "@shared/services/pop-notifications.service";
import { SessionService } from "@shared/services/session.service";
import { UserStoreService } from "@shared/services/user-store.service";
import { UserService } from "@shared/services/user.service";
import { ValidationLoaderService } from "@shared/services/validation-loader.service";
import { WindowRefService } from "@shared/services/window-ref.service";
import { CookieService } from "ngx-cookie-service";
import { TimeagoModule } from "ngx-timeago";
import { ToastrModule } from "ngx-toastr";
import { take } from "rxjs/operators";
import { ComponentsModule } from "./components/components.module";
import { PipesModule } from "./pipes/pipes.module";

export function appInitializer(appContext: AppContextService, authService: AuthService) {
  return () =>
    new Promise<any>(resolve => {
      appContext.load().then(() => {
        authService
          .isAuthenticated()
          .pipe(take(1))
          .subscribe(authenticated => {
            if (authenticated) {
              appContext.loadForUser().then(() => resolve());
            } else {
              resolve();
            }
          });
      });
    });
}

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    HttpClientModule,

    FormlyModule.forRoot(formlyConfig),
    FormlyBootstrapModule,
    NgbModule,
    NgbPaginationModule,
    ToastrModule.forRoot(),
    ApiModule,
    PipesModule
  ],
  exports: [
    CommonModule,
    ComponentsModule,
    HttpClientModule,
    PipesModule,
    FormlyModule,
    FormlyBootstrapModule,
    NgbModule,
    NgbPaginationModule,
    ToastrModule,
    TimeagoModule,
    TranslateModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        AppContextService,
        AuthGuardService,
        AuthService,
        ClassicRoutesService,
        CookieService,
        ImageOwnerGuardService,
        LoadingService,
        PopNotificationsService,
        SessionService,
        UltimateSubscriptionGuardService,
        UserService,
        UserStoreService,
        ValidationLoaderService,
        WindowRefService,
        {
          provide: APP_INITIALIZER,
          useFactory: appInitializer,
          multi: true,
          deps: [AppContextService, AuthService]
        }
      ]
    };
  }
}
