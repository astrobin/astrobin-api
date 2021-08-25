import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MigrationToolComponent } from "./migration-tool.component";
import { MockBuilder } from "ng-mocks";
import { EquipmentModule } from "@features/equipment/equipment.module";

describe("MigrationToolComponent", () => {
  let component: MigrationToolComponent;
  let fixture: ComponentFixture<MigrationToolComponent>;

  beforeEach(async () => {
    await MockBuilder(MigrationToolComponent, EquipmentModule);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrationToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
