import { Component, Input, OnInit } from "@angular/core";
import { UserInterface } from "@shared/interfaces/user.interface";
import { BaseComponentDirective } from "@shared/components/base-component.directive";
import { Store } from "@ngrx/store";
import { MainState } from "@app/store/state";
import { ImageAlias } from "@shared/enums/image-alias.enum";
import { UserProfileInterface } from "@shared/interfaces/user-profile.interface";
import { Router, ActivatedRoute } from "@angular/router";

type GalleryNavigationComponent = "recent" | "collections" | "staging" | "about";

@Component({
  selector: "astrobin-user-gallery-navigation",
  template: `
    <ng-container *ngIf="currentUserWrapper$ | async as currentUserWrapper">
      <ul
        ngbNav
        #nav="ngbNav"
        [(activeId)]="active"
        class="nav-tabs"
        (click)="onTabClick(active)"
      >
        <li ngbNavItem="recent">
          <a ngbNavLink>
            <fa-icon icon="images" class="me-2"></fa-icon>
            <span translate="Recent images"></span>
          </a>
          <ng-template ngbNavContent>
            <astrobin-user-gallery-images
              [user]="user"
              [userProfile]="userProfile"
              [options]="{
                includeStagingArea:
                  currentUserWrapper.user?.id === user.id &&
                  userProfile.displayWipImagesOnPublicGallery
              }"
            ></astrobin-user-gallery-images>
          </ng-template>
        </li>

        <li
          *ngIf="currentUserWrapper.user?.id === user.id && !userProfile.displayWipImagesOnPublicGallery"
          ngbNavItem="staging"
        >
          <a ngbNavLink>
            <fa-icon icon="lock" class="me-2"></fa-icon>
            <span translate="Staging area"></span>
          </a>
          <ng-template ngbNavContent>
            <astrobin-user-gallery-images
              [user]="user"
              [userProfile]="userProfile"
              [options]="{ onlyStagingArea: currentUserWrapper.user?.id === user.id }"
            ></astrobin-user-gallery-images>
          </ng-template>
        </li>

        <li ngbNavItem="collections">
          <a ngbNavLink>
            <fa-icon icon="folder" class="me-2"></fa-icon>
            <span translate="Collections"></span>
          </a>
          <ng-template ngbNavContent>
          </ng-template>
        </li>

        <li ngbNavItem="about">
          <a ngbNavLink>
            <fa-icon icon="user" class="me-2"></fa-icon>
            <span translate="About"></span>
          </a>
          <ng-template ngbNavContent>
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav"></div>
    </ng-container>
  `,
  styleUrls: ["./user-gallery-navigation.component.scss"]
})
export class UserGalleryNavigationComponent extends BaseComponentDirective implements OnInit {
  @Input() user: UserInterface;
  @Input() userProfile: UserProfileInterface;

  protected active: GalleryNavigationComponent = "recent";

  constructor(
    public readonly store$: Store<MainState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(store$);
  }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment: string | null) => {
      if (fragment) {
        this.active = fragment as GalleryNavigationComponent;
      }
    });
  }

  onTabClick(tab: GalleryNavigationComponent) {
    this.router.navigate([], { fragment: tab });
  }

  protected readonly ImageAlias = ImageAlias;
}