import { EquipmentActions, EquipmentActionTypes } from "./equipment.actions";
import { EquipmentItemBaseInterface } from "@features/equipment/interfaces/equipment-item-base.interface";
import { UtilsService } from "@shared/services/utils/utils.service";
import { BrandInterface } from "@features/equipment/interfaces/brand.interface";

export const equipmentFeatureKey = "equipment";

// tslint:disable-next-line:no-empty-interface
export interface EquipmentState {
  brands: BrandInterface[];
  equipmentItems: EquipmentItemBaseInterface[];
}

export const initialEquipmentState: EquipmentState = {
  brands: [],
  equipmentItems: []
};

export function reducer(state = initialEquipmentState, action: EquipmentActions): EquipmentState {
  switch (action.type) {
    case EquipmentActionTypes.LOAD_BRAND_SUCCESS: {
      return {
        ...state,
        brands: new UtilsService().arrayUniqueObjects([...state.brands, ...[action.payload.brand]])
      };
    }

    case EquipmentActionTypes.FIND_ALL_SUCCESS: {
      return {
        ...state,
        equipmentItems: new UtilsService().arrayUniqueObjects([...state.equipmentItems, ...action.payload.items])
      };
    }

    default: {
      return state;
    }
  }
}
