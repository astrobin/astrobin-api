import { TestBed } from "@angular/core/testing";
import { MockBuilder } from "ng-mocks";
import { AppModule } from "@app/app.module";
import { SensorDisplayProperty, SensorService } from "@features/equipment/services/sensor.service";
import { SensorGenerator } from "@features/equipment/generators/sensor.generator";
import { CameraGenerator } from "@features/equipment/generators/camera.generator";
import { ColorOrMono, SensorInterface } from "@features/equipment/types/sensor.interface";
import { of } from "rxjs";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { initialMainState } from "@app/store/state";

describe("SensorService", () => {
  let service: SensorService;
  let sensor: SensorInterface;
  let store: MockStore;
  let camera1 = CameraGenerator.camera({ id: 1, name: "Camera 1" });
  let camera2 = CameraGenerator.camera({ id: 2, name: "Camera 2" });

  beforeEach(async () => {
    await MockBuilder(SensorService, AppModule).provide(provideMockStore({ initialState: initialMainState }));
    service = TestBed.inject(SensorService);
    store = TestBed.inject(MockStore);
    jest.spyOn(service.translateService, "instant").mockImplementation(s => s);
    jest.spyOn(service.translateService, "stream").mockImplementation(s => of(s));
    sensor = SensorGenerator.sensor({
      quantumEfficiency: 10,
      pixelSize: 7.4,
      pixelWidth: 800,
      pixelHeight: 600,
      sensorWidth: 25,
      sensorHeight: 20,
      fullWellCapacity: 5,
      readNoise: 1000,
      frameRate: 24,
      adc: 12,
      colorOrMono: ColorOrMono.M,
      cameras: [camera1.id, camera2.id]
    });
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getPrintableProperty", () => {
    it("should work for quantum efficiency'", done => {
      service.getPrintableProperty$(sensor, SensorDisplayProperty.QUANTUM_EFFICIENCY).subscribe(value => {
        expect(value).toEqual("10%");
        done();
      });
    });

    it("should work for pixel size'", done => {
      service.getPrintableProperty$(sensor, SensorDisplayProperty.PIXEL_SIZE).subscribe(value => {
        expect(value).toEqual("7.4 μm");
        done();
      });
    });

    it("should work for pixels'", done => {
      service.getPrintableProperty$(sensor, SensorDisplayProperty.PIXELS).subscribe(value => {
        expect(value).toEqual("800 x 600");
        done();
      });
    });

    it("should work for sensor size'", done => {
      service.getPrintableProperty$(sensor, SensorDisplayProperty.SENSOR_SIZE).subscribe(value => {
        expect(value).toEqual("25 x 20 mm");
        done();
      });
    });

    it("should work for full well capacity'", done => {
      service.getPrintableProperty$(sensor, SensorDisplayProperty.FULL_WELL_CAPACITY).subscribe(value => {
        expect(value).toEqual("5 ke-");
        done();
      });
    });

    it("should work for read noise'", done => {
      service.getPrintableProperty$(sensor, SensorDisplayProperty.READ_NOISE).subscribe(value => {
        expect(value).toEqual("1000 e-");
        done();
      });
    });

    it("should work for frame rate'", done => {
      service.getPrintableProperty$(sensor, SensorDisplayProperty.FRAME_RATE).subscribe(value => {
        expect(value).toEqual("24 FPS");
        done();
      });
    });

    it("should work for ADC'", done => {
      service.getPrintableProperty$(sensor, SensorDisplayProperty.ADC).subscribe(value => {
        expect(value).toEqual("12-bit");
        done();
      });
    });

    it("should work for color or mono'", done => {
      service.getPrintableProperty$(sensor, SensorDisplayProperty.COLOR_OR_MONO).subscribe(value => {
        expect(value).toEqual("Mono");
        done();
      });
    });

    it("should work for cameras'", done => {
      const state = { ...initialMainState };
      state.equipment.equipmentItems = [camera1, camera2];
      store.setState(state);

      service.getPrintableProperty$(sensor, SensorDisplayProperty.CAMERAS).subscribe(value => {
        expect(value).toEqual("Test Brand Camera 1, Test Brand Camera 2");
        done();
      });
    });
  });
});
