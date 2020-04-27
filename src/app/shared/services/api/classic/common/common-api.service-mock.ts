import { Injectable } from "@angular/core";
import { UserProfileGenerator } from "@shared/generators/user-profile.generator";
import { UserGenerator } from "@shared/generators/user.generator";
import { SubscriptionInterface } from "@shared/interfaces/subscription.interface";
import { UserProfileInterface } from "@shared/interfaces/user-profile.interface";
import { UserSubscriptionInterface } from "@shared/interfaces/user-subscription.interface";
import { UserInterface } from "@shared/interfaces/user.interface";
import { CommonApiServiceInterface } from "@shared/services/api/classic/common/common-api.service-interface";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CommonApiServiceMock implements CommonApiServiceInterface {
  getUser(id: number): Observable<UserInterface> {
    return of(UserGenerator.user());
  }

  getCurrentUserProfile(): Observable<UserProfileInterface> {
    return of(UserProfileGenerator.userProfile());
  }

  getSubscriptions(): Observable<SubscriptionInterface[]> {
    return of(null);
  }

  getUserSubscriptions(user?: UserInterface): Observable<UserSubscriptionInterface[]> {
    return of([]);
  }
}
