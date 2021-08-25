import { Observable } from "rxjs";
import {
  EquipmentItemBaseInterface,
  EquipmentItemType
} from "@features/equipment/interfaces/equipment-item-base.interface";

export enum MigrationFlag {
  WRONG_TYPE = "WRONG_TYPE",
  MULTIPLE_ITEMS = "MULTIPLE_ITEMS",
  DIY = "DIY",
  MIGRATE = "MIGRATE"
}

export interface MigratableGearItemServiceInterface {
  getRandomNonMigrated?(): Observable<any[]>;

  getPendingMigrationReview?(): Observable<any[]>;

  lockForMigration?(gearId: number): Observable<void>;

  setMigration?(
    gearId: number,
    migrationFlag: MigrationFlag,
    itemType?: EquipmentItemType,
    itemId?: EquipmentItemBaseInterface["id"]
  ): void;
}
