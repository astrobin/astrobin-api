import { createSelector } from "@ngrx/store";
import { CollectionInterface } from "@shared/interfaces/collection.interface";
import { GetCollectionsParamsInterface } from "@shared/services/api/classic/collections/collection-api.service";
import { AppState } from "@app/store/reducers/app.reducers";
import { selectApp } from "@app/store/selectors/app/app.selectors";

export const selectCollections = createSelector(
  selectApp,
  (state: AppState) => state.collections // Assuming collections are stored in AppState
);

export const selectCollectionsByParams = (params: GetCollectionsParamsInterface) => createSelector(
  selectCollections,
  (collections: CollectionInterface[]) => {
    if (!collections) {
      return null;
    }

    if (params.user !== undefined) {
      // Filter collections by the user id
      return collections.filter(collection => collection.user === params.user);
    }

    if (params.ids !== undefined && params.ids.length > 0) {
      // Filter collections by the ids
      return collections.filter(collection => params.ids.includes(collection.id));
    }

    // Return all collections if no filter applied
    return collections;
  }
);