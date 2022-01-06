import { Injectable } from "@angular/core";
import { LoadingService } from "@shared/services/loading.service";
import { HttpClient } from "@angular/common/http";
import { MigratableGearItemApiService } from "@shared/services/api/classic/astrobin/migratable-gear-item-api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MountApiService extends MigratableGearItemApiService {
  configUrl = this.baseUrl + "/astrobin/mount";

  constructor(public loadingService: LoadingService, public readonly http: HttpClient) {
    super(loadingService, http);
  }
}
