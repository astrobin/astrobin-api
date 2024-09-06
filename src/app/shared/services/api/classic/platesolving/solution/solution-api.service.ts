import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SolutionInterface } from "@shared/interfaces/solution.interface";
import { BaseClassicApiService } from "@shared/services/api/classic/base-classic-api.service";
import { LoadingService } from "@shared/services/loading.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ContentTypeInterface } from "@shared/interfaces/content-type.interface";
import { UtilsService } from "@shared/services/utils/utils.service";

@Injectable({
  providedIn: "root"
})
export class SolutionApiService extends BaseClassicApiService {
  configUrl = this.baseUrl + "/platesolving/solutions";

  constructor(public readonly loadingService: LoadingService, public readonly http: HttpClient) {
    super(loadingService);
  }

  getSolution(
    contentType: ContentTypeInterface["id"],
    objectId: string,
    includePixInsightDetails = false
  ): Observable<SolutionInterface> {
    let url = this.configUrl;

    url = UtilsService.addOrUpdateUrlParam(url, "content_type", contentType + "");
    url = UtilsService.addOrUpdateUrlParam(url, "object_id", objectId);
    if (includePixInsightDetails) {
      url = UtilsService.addOrUpdateUrlParam(url, "include_pixinsight_details", "true");
    }

    return this.http
      .get<SolutionInterface[]>(url)
      .pipe(
        map(response => {
          if (response.length === 0) {
            return null;
          }

          return response[0];
        })
      );
  }

  getSolutions(contentType: number, objectIds: string[]): Observable<SolutionInterface[]> {
    return this.http.get<SolutionInterface[]>(
      `${this.configUrl}/?content_type=${contentType}&object_ids=${objectIds.join(",")}`
    );
  }
}
