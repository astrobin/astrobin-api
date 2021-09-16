// tslint:disable:max-classes-per-file

import { PayloadActionInterface } from "@app/store/actions/payload-action.interface";
import {
  EquipmentItemBaseInterface,
  EquipmentItemType
} from "@features/equipment/interfaces/equipment-item-base.interface";
import { BrandInterface } from "@features/equipment/interfaces/brand.interface";
import { SensorInterface } from "@features/equipment/interfaces/sensor.interface";
import { CameraInterface } from "@features/equipment/interfaces/camera.interface";
import { EditProposalInterface } from "@features/equipment/interfaces/edit-proposal.interface";

export interface EquipmentItemCreationSuccessPayloadInterface {
  item: EquipmentItemBaseInterface;
}

export enum EquipmentActionTypes {
  LOAD_BRAND = "[Equipment] Load brand",
  LOAD_BRAND_SUCCESS = "[Equipment] Load brand success",
  CREATE_BRAND = "[Equipment] Create brand",
  CREATE_BRAND_SUCCESS = "[Equipment] Create brand success",
  FIND_ALL_BRANDS = "[Equipment] Find all brands",
  FIND_ALL_BRANDS_SUCCESS = "[Equipment] Find all brands success",
  FIND_ALL_EQUIPMENT_ITEMS = "[Equipment] Find all equipment items",
  FIND_ALL_EQUIPMENT_ITEMS_SUCCESS = "[Equipment] Find all equipment success",
  FIND_SIMILAR_IN_BRAND = "[Equipment] Find similar in brand",
  FIND_SIMILAR_IN_BRAND_SUCCESS = "[Equipment] Find similar in brand success",
  GET_OTHERS_IN_BRAND = "[Equipment] Get others in brand",
  GET_OTHERS_IN_BRAND_SUCCESS = "[Equipment] Get others in brand success",
  APPROVE_EQUIPMENT_ITEM = "[Equipment] Approve item",
  APPROVE_EQUIPMENT_ITEM_SUCCESS = "[Equipment] Approve item success",
  REJECT_EQUIPMENT_ITEM = "[Equipment] Reject item",
  REJECT_EQUIPMENT_ITEM_SUCCESS = "[Equipment] Reject item success",
  CREATE_SENSOR = "[Equipment] Create sensor",
  CREATE_SENSOR_SUCCESS = "[Equipment] Create sensor success",
  CREATE_SENSOR_EDIT_PROPOSAL = "[Equipment] Create sensor edit proposal",
  CREATE_SENSOR_EDIT_PROPOSAL_SUCCESS = "[Equipment] Create sensor edit proposal success",
  LOAD_SENSOR = "[Equipment] Load sensor",
  LOAD_SENSOR_SUCCESS = "[Equipment] Load sensor success",
  CREATE_CAMERA = "[Equipment] Create camera",
  CREATE_CAMERA_SUCCESS = "[Equipment] Create camera success",
  CREATE_CAMERA_EDIT_PROPOSAL = "[Equipment] Create camera edit proposal",
  CREATE_CAMERA_EDIT_PROPOSAL_SUCCESS = "[Equipment] Create camera edit request proposal"
}

export class LoadBrand implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.LOAD_BRAND;

  constructor(public payload: { id: BrandInterface["id"] }) {}
}

export class LoadBrandSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.LOAD_BRAND_SUCCESS;

  constructor(public payload: { brand: BrandInterface }) {}
}

export class CreateBrand implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.CREATE_BRAND;

  constructor(public payload: { brand: Omit<BrandInterface, "id"> }) {}
}

export class CreateBrandSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.CREATE_BRAND_SUCCESS;

  constructor(public payload: { brand: BrandInterface }) {}
}

export class FindAllBrands implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.FIND_ALL_BRANDS;

  constructor(public payload: { q: string }) {}
}

export class FindAllBrandsSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.FIND_ALL_BRANDS_SUCCESS;

  constructor(public payload: { brands: BrandInterface[] }) {}
}

export class FindAllEquipmentItems implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.FIND_ALL_EQUIPMENT_ITEMS;

  constructor(public payload: { q: string; type: EquipmentItemType }) {}
}

export class FindAllEquipmentItemsSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.FIND_ALL_EQUIPMENT_ITEMS_SUCCESS;

  constructor(public payload: { items: EquipmentItemBaseInterface[] }) {}
}

export class FindSimilarInBrand implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.FIND_SIMILAR_IN_BRAND;

  constructor(public payload: { brand: BrandInterface["id"]; q: string; type: EquipmentItemType }) {}
}

export class FindSimilarInBrandSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.FIND_SIMILAR_IN_BRAND_SUCCESS;

  constructor(public payload: { items: EquipmentItemBaseInterface[] }) {}
}

export class GetOthersInBrand implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.GET_OTHERS_IN_BRAND;

  constructor(public payload: { brand: BrandInterface["id"]; type: EquipmentItemType }) {}
}

export class GetOthersInBrandSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.GET_OTHERS_IN_BRAND_SUCCESS;

  constructor(public payload: { items: EquipmentItemBaseInterface[] }) {}
}

export class ApproveEquipmentItem implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.APPROVE_EQUIPMENT_ITEM;

  constructor(public payload: { item: EquipmentItemBaseInterface }) {}
}

export class ApproveEquipmentItemSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.APPROVE_EQUIPMENT_ITEM_SUCCESS;

  constructor(public payload: { item: EquipmentItemBaseInterface }) {}
}

export class RejectEquipmentItem implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.REJECT_EQUIPMENT_ITEM;

  constructor(public payload: { item: EquipmentItemBaseInterface; comment: string }) {}
}

export class RejectEquipmentItemSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.REJECT_EQUIPMENT_ITEM_SUCCESS;

  constructor(public payload: { item: EquipmentItemBaseInterface }) {}
}

export class CreateSensor implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.CREATE_SENSOR;

  constructor(public payload: { sensor: Omit<SensorInterface, "id"> }) {}
}

export class CreateSensorSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.CREATE_SENSOR_SUCCESS;

  constructor(public payload: EquipmentItemCreationSuccessPayloadInterface) {}
}

export class CreateSensorEditProposal implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.CREATE_SENSOR_EDIT_PROPOSAL;

  constructor(public payload: { sensor: Omit<EditProposalInterface<SensorInterface>, "id"> }) {}
}

export class CreateSensorEditProposalSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.CREATE_SENSOR_EDIT_PROPOSAL_SUCCESS;

  constructor(public payload: { editProposal: EditProposalInterface<SensorInterface> }) {}
}

export class LoadSensor implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.LOAD_SENSOR;

  constructor(public payload: { id: SensorInterface["id"] }) {}
}

export class LoadSensorSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.LOAD_SENSOR_SUCCESS;

  constructor(public payload: { item: SensorInterface }) {}
}

export class CreateCamera implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.CREATE_CAMERA;

  constructor(public payload: { camera: Omit<CameraInterface, "id"> }) {}
}

export class CreateCameraSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.CREATE_CAMERA_SUCCESS;

  constructor(public payload: EquipmentItemCreationSuccessPayloadInterface) {}
}

export class CreateCameraEditProposal implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.CREATE_CAMERA_EDIT_PROPOSAL;

  constructor(public payload: { camera: Omit<EditProposalInterface<CameraInterface>, "id"> }) {}
}

export class CreateCameraEditProposalSuccess implements PayloadActionInterface {
  readonly type = EquipmentActionTypes.CREATE_CAMERA_EDIT_PROPOSAL_SUCCESS;

  constructor(public payload: { editProposal: EditProposalInterface<CameraInterface> }) {}
}

export type EquipmentActions =
  | LoadBrand
  | LoadBrandSuccess
  | CreateBrand
  | CreateBrandSuccess
  | FindAllBrands
  | FindAllBrandsSuccess
  | FindAllEquipmentItems
  | FindAllEquipmentItemsSuccess
  | FindSimilarInBrand
  | FindSimilarInBrandSuccess
  | GetOthersInBrand
  | GetOthersInBrandSuccess
  | ApproveEquipmentItem
  | ApproveEquipmentItemSuccess
  | RejectEquipmentItem
  | RejectEquipmentItemSuccess
  | CreateSensor
  | CreateSensorSuccess
  | CreateSensorEditProposal
  | CreateSensorEditProposalSuccess
  | LoadSensor
  | LoadSensorSuccess
  | CreateCamera
  | CreateCameraSuccess
  | CreateCameraEditProposal
  | CreateCameraEditProposalSuccess;
