import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";
import { formlyConfig } from "@app/formly.config";
import { AppActionTypes, InitializeApp } from "@app/store/actions/app.actions";
import { AppState } from "@app/store/app.states";
import { AuthActionTypes, InitializeAuth } from "@features/account/store/auth.actions";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { ApiModule } from "@shared/services/api/api.module";
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
import { NgxFilesizeModule } from "ngx-filesize";
import { TimeagoModule } from "ngx-timeago";
import { ToastrModule } from "ngx-toastr";
import { switchMap } from "rxjs/operators";
import { ComponentsModule } from "./components/components.module";
import { PipesModule } from "./pipes/pipes.module";

export function appInitializer(store: Store<AppState>, actions$: Actions) {
  return () =>
    new Promise<any>(resolve => {
      store.dispatch(new InitializeApp());

      actions$
        .pipe(
          ofType(AppActionTypes.INITIALIZE_SUCCESS),
          switchMap(() => {
            store.dispatch(new InitializeAuth());
            return actions$.pipe(ofType(AuthActionTypes.INITIALIZE_SUCCESS));
          })
        )
        .subscribe(() => {
          resolve();
        });
    });
}

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    HttpClientModule,

    FontAwesomeModule,
    FormlyModule.forRoot(formlyConfig),
    FormlyBootstrapModule,
    NgbModule,
    NgbPaginationModule,
    NgSelectModule,
    NgxFilesizeModule,
    ToastrModule.forRoot({
      timeOut: 20000
    }),

    ApiModule,
    PipesModule
  ],
  exports: [
    CommonModule,
    ComponentsModule,
    HttpClientModule,
    PipesModule,
    FontAwesomeModule,
    FormlyModule,
    FormlyBootstrapModule,
    NgbModule,
    NgbPaginationModule,
    NgSelectModule,
    NgxFilesizeModule,
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
          deps: [Store, Actions]
        }
      ]
    };
  }
}
