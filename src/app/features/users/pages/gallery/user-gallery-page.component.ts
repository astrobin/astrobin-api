import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { MainState } from "@app/store/state";
import { Store } from "@ngrx/store";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { Actions } from "@ngrx/effects";
import { WindowRefService } from "@shared/services/window-ref.service";
import { TitleService } from "@shared/services/title/title.service";
import { TranslateService } from "@ngx-translate/core";
import { UserInterface } from "@shared/interfaces/user.interface";
import { UserProfileInterface } from "@shared/interfaces/user-profile.interface";
import { filter, takeUntil } from "rxjs/operators";
import { ImageViewerService } from "@shared/services/image-viewer.service";
import { LoadCollections } from "@app/store/actions/collection.actions";

@Component({
  selector: "astrobin-user-gallery-page",
  template: `
    <div class="page">
      <astrobin-user-gallery-header
        [user]="user"
        [userProfile]="userProfile"
      ></astrobin-user-gallery-header>

      <astrobin-user-gallery-navigation
        [user]="user"
        [userProfile]="userProfile"
      ></astrobin-user-gallery-navigation>
    </div>
  `,
  styleUrls: ["./user-gallery-page.component.scss"]
})
export class UserGalleryPageComponent extends BaseComponentDirective implements OnInit {
  protected user: UserInterface;
  protected userProfile: UserProfileInterface;

  constructor(
    public readonly store$: Store<MainState>,
    public readonly actions$: Actions,
    public readonly route: ActivatedRoute,
    public readonly windowRefService: WindowRefService,
    public readonly titleService: TitleService,
    public readonly translateService: TranslateService,
    public readonly router: Router,
    public readonly imageViewerService: ImageViewerService,
    public readonly activatedRoute: ActivatedRoute,
    public readonly viewContainerRef: ViewContainerRef
  ) {
    super(store$);

    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.imageViewerService.autoOpenSlideshow(this.componentId, this.activatedRoute, this.viewContainerRef);
    });
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.route.data.pipe(takeUntil(this.destroyed$)).subscribe((data: {
      userData: {
        user: UserInterface, userProfile: UserProfileInterface
      }
    }) => {
      this.user = data.userData.user;
      this.userProfile = data.userData.userProfile;

      this.store$.dispatch(new LoadCollections({ params: { user: this.user.id } }));
    });

    this._setMetaTags();
  }

  private _setMetaTags() {
    const title = this.user.displayName;
    const description = this.translateService.instant("A gallery on AstroBin.");

    this.titleService.setTitle(title);
    this.titleService.setDescription(description);
    this.titleService.addMetaTag({ name: "og:title", content: title });
    this.titleService.addMetaTag({ name: "og:description", content: description });

    if (this.user.avatar) {
      this.titleService.addMetaTag({ name: "og:gallery", content: this.user.avatar });
    }
  }
}
