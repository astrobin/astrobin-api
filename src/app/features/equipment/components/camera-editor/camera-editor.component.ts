import { AfterContentInit, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { BaseEquipmentItemEditorComponent } from "@features/equipment/components/base-equipment-item-editor/base-equipment-item-editor.component";
import { LoadingService } from "@shared/services/loading.service";
import { WindowRefService } from "@shared/services/window-ref.service";
import { CameraInterface } from "@features/equipment/interfaces/camera.interface";
import { State } from "@app/store/state";
import { EquipmentApiService } from "@features/equipment/services/equipment-api.service";
import { FormGroup } from "@angular/forms";
import { of } from "rxjs";
import { EquipmentItemType } from "@features/equipment/interfaces/equipment-item-base.interface";
import { SensorInterface } from "@features/equipment/interfaces/sensor.interface";
import {
  EquipmentActionTypes,
  FindAllEquipmentItems,
  FindAllEquipmentItemsSuccess
} from "@features/equipment/store/equipment.actions";
import { map } from "rxjs/operators";

@Component({
  selector: "astrobin-camera-editor",
  templateUrl: "./camera-editor.component.html",
  styleUrls: ["./camera-editor.component.scss"]
})
export class CameraEditorComponent extends BaseEquipmentItemEditorComponent<CameraInterface>
  implements OnInit, AfterContentInit {
  sensorCreation: {
    inProgress: boolean;
    form: FormGroup;
    name: string;
  } = {
    inProgress: false,
    form: new FormGroup({}),
    name: null
  };

  @ViewChild("sensorOptionTemplate")
  sensorOptionTemplate: TemplateRef<any>;

  constructor(
    public readonly store$: Store<State>,
    public readonly actions$: Actions,
    public readonly loadingService: LoadingService,
    public readonly translateService: TranslateService,
    public readonly windowRefService: WindowRefService,
    public readonly equipmentApiService: EquipmentApiService
  ) {
    super(store$, actions$, loadingService, translateService, windowRefService, equipmentApiService);
  }

  ngOnInit() {
    if (!this.returnToSelector) {
      this.returnToSelector = "#camera-editor-form";
    }
  }

  ngAfterContentInit(): void {
    this.fields = [
      this._getBrandField(),
      this._getNameField(),
      {
        key: "type",
        type: "ng-select",
        id: "camera-field-type",
        expressionProperties: {
          "templateOptions.disabled": () => this.sensorCreation.inProgress
        },
        templateOptions: {
          label: this.translateService.instant("Type"),
          required: true,
          clearable: true,
          options: of(
            [
              ["DEDICATED_DEEP_SKY", "Dedicated deep-sky camera"],
              ["DSLR_MIRRORLESS", "General purpose DSLR or mirrorless camera"],
              ["GUIDER_PLANETARY", "Guider/Planetary camera"],
              ["VIDEO", "General purpose video camera"],
              ["FILM", "Film camera"]
            ].map(item => ({
              value: item[0],
              label: this.translateService.instant(item[1])
            }))
          )
        }
      },
      {
        key: "sensor",
        type: "ng-select",
        id: "camera-field-sensor",
        expressionProperties: {
          "templateOptions.disabled": () => this.sensorCreation.inProgress
        },
        templateOptions: {
          label: this.translateService.instant("Sensor"),
          required: false,
          clearable: true,
          options: of([]),
          onSearch: (event: { term: string; items: SensorInterface[] }) => {
            this._onSensorSearch(event);
          },
          optionTemplate: this.sensorOptionTemplate,
          addTag: () => {
            this.sensorCreation.inProgress = true;
            this.form.get("sensor").setValue(null);
            setTimeout(() => {
              this.windowRefService.nativeWindow.document
                .getElementById("create-new-sensor")
                .scrollIntoView({ behavior: "smooth" });
            }, 1);
          }
        }
      },
      {
        key: "cooled",
        type: "checkbox",
        wrappers: ["default-wrapper"],
        id: "camera-field-cooled",
        defaultValue: false,
        expressionProperties: {
          "templateOptions.disabled": () => this.brandCreation.inProgress
        },
        templateOptions: {
          label: this.translateService.instant("Cooled"),
          description: this.translateService.instant("Whether this camera is equipment with a cooling mechanism.")
        }
      },
      {
        key: "maxCooling",
        type: "input",
        wrappers: ["default-wrapper"],
        id: "camera-field-max-cooling",
        hideExpression: () => !this.model.cooled,
        expressionProperties: {
          "templateOptions.disabled": () => this.brandCreation.inProgress
        },
        templateOptions: {
          type: "number",
          min: 1,
          step: 1,
          label: this.translateService.instant("Max. cooling (Celsius degrees below ambient)"),
          description: this.translateService.instant(
            "A positive whole number that represents how many Celsius below ambient temperature this camera can " +
              "be cooled."
          )
        }
      },
      {
        key: "backFocus",
        type: "input",
        wrappers: ["default-wrapper"],
        id: "camera-field-back-focus",
        expressionProperties: {
          "templateOptions.disabled": () => this.brandCreation.inProgress
        },
        templateOptions: {
          type: "number",
          min: 1,
          step: 0.1,
          label: this.translateService.instant("Back focus (in mm)"),
          description: this.translateService.instant("Camera back focus in mm.")
        }
      },
      this._getImageField()
    ];
  }

  sensorCreated(sensor: SensorInterface) {
    this.cancelSensorCreation();
  }

  cancelSensorCreation() {
    this.sensorCreation.inProgress = false;
  }

  createSensor() {}

  private _onSensorSearch(event: { term: string; items: SensorInterface[] }) {
    this.sensorCreation.name = event.term;

    if (!this.sensorCreation.name) {
      return of([]);
    }

    const field = this.fields.find(f => f.key === "sensor");
    this.store$.dispatch(new FindAllEquipmentItems({ q: this.sensorCreation.name, type: EquipmentItemType.SENSOR }));
    field.templateOptions.options = this.actions$.pipe(
      ofType(EquipmentActionTypes.FIND_ALL_EQUIPMENT_ITEMS_SUCCESS),
      map((action: FindAllEquipmentItemsSuccess) => action.payload.items),
      map(sensors =>
        sensors.map(sensor => {
          return {
            value: sensor.id,
            label: sensor.name,
            sensor
          };
        })
      )
    );
  }
}
