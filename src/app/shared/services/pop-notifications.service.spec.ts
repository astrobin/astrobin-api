import { TestBed } from "@angular/core/testing";
import { testAppImports } from "@app/test-app.imports";
import { PopNotificationsService } from "./pop-notifications.service";

describe("PopNotificationsService", () => {
  let service: PopNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [testAppImports]
    });

    service = TestBed.inject(PopNotificationsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("success", () => {
    beforeEach(() => {
      spyOn(service.toastr, "success");
    });

    it("should defer to toastr module, with title", () => {
      service.success("message", "title");

      expect(service.toastr.success).toHaveBeenCalledWith("message", "title");
    });

    it("should defer to toastr module, without title", () => {
      service.success("message");

      expect(service.toastr.success).toHaveBeenCalledWith("message", "Success!");
    });
  });

  describe("info", () => {
    beforeEach(() => {
      spyOn(service.toastr, "info");
    });

    it("should defer to toastr module, with title", () => {
      service.info("message", "title");

      expect(service.toastr.info).toHaveBeenCalledWith("message", "title");
    });

    it("should defer to toastr module, without title", () => {
      service.info("message");

      expect(service.toastr.info).toHaveBeenCalledWith("message", "Info");
    });
  });

  describe("warning", () => {
    beforeEach(() => {
      spyOn(service.toastr, "warning");
    });

    it("should defer to toastr module, with title", () => {
      service.warning("message", "title");

      expect(service.toastr.warning).toHaveBeenCalledWith("message", "title");
    });

    it("should defer to toastr module, without title", () => {
      service.warning("message");

      expect(service.toastr.warning).toHaveBeenCalledWith("message", "Warning!");
    });
  });

  describe("error", () => {
    beforeEach(() => {
      spyOn(service.toastr, "error");
    });

    it("should defer to toastr module, with title", () => {
      service.error("message", "title");

      expect(service.toastr.error).toHaveBeenCalledWith("message", "title");
    });

    it("should defer to toastr module, without title", () => {
      service.error("message");

      expect(service.toastr.error).toHaveBeenCalledWith("message", "Error!");
    });
  });
});
