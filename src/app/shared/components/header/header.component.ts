import { Component } from "@angular/core";
import { NotificationsService } from "@features/notifications/services/notifications.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginModalComponent } from "@shared/components/auth/login-modal/login-modal.component";
import { BaseComponent } from "@shared/components/base.component";
import { AppContextService } from "@shared/services/app-context.service";
import { AuthService } from "@shared/services/auth.service";
import { ClassicRoutesService } from "@shared/services/classic-routes.service";
import { LoadingService } from "@shared/services/loading.service";
import { WindowRefService } from "@shared/services/window-ref.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface AvailableLanguageInterface {
  code: string;
  label: string;
}

@Component({
  selector: "astrobin-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent extends BaseComponent {
  isCollapsed = true;

  languages: AvailableLanguageInterface[] = [
    { code: "en", label: "English (US)" },
    { code: "en-GB", label: "English (UK)" },
    { code: "-", label: "-" },
    { code: "de", label: "Deutsch" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "it", label: "Italiano" },
    { code: "-", label: "-" },
    { code: "ar", label: "العربية" },
    { code: "el", label: "Ελληνικά" },
    { code: "fi", label: "Suomi" },
    { code: "ja", label: "日本語" },
    { code: "nl", label: "Nederlands" },
    { code: "pl", label: "Polski" },
    { code: "pt", label: "Português" },
    { code: "ru", label: "Русский" },
    { code: "sq", label: "Shqipe" },
    { code: "tr", label: "Türk" }
  ];

  constructor(
    public appContext: AppContextService,
    public modalService: NgbModal,
    public classicRoutes: ClassicRoutesService,
    public authService: AuthService,
    public notificationsService: NotificationsService,
    public loadingService: LoadingService,
    public windowRef: WindowRefService
  ) {
    super();
  }

  openLoginModal($event) {
    $event.preventDefault();
    this.modalService.open(LoginModalComponent, { centered: true });
  }

  logout($event) {
    $event.preventDefault();
    this.authService.logout();
  }

  currentLanguageCode$(): Observable<string> {
    return this.appContext.context$.pipe(map(context => context.languageCode));
  }
}
