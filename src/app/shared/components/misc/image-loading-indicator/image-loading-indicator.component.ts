import { AfterViewInit, Component, EventEmitter, Output } from "@angular/core";
import { BaseComponentDirective } from "@shared/components/base-component.directive";

@Component({
  selector: "astrobin-image-loading-indicator",
  template: `
    <div class="load-wrapper">
      <div class="activity"></div>
    </div>
  `,
  styleUrls: ["./image-loading-indicator.component.scss"]
})
export class ImageLoadingIndicatorComponent extends BaseComponentDirective implements AfterViewInit {
  @Output() load = new EventEmitter<void>();

  ngAfterViewInit() {
    this.load.emit();
  }
}
