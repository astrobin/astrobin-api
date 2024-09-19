import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";
import { ImageInterface, ImageRevisionInterface } from "@shared/interfaces/image.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ImageApiService } from "@shared/services/api/classic/images/image/image-api.service";
import { ImageAlias } from "@shared/enums/image-alias.enum";
import { ImageService } from "@shared/services/image/image.service";

@Component({
  selector: 'astrobin-image-viewer-additional-buttons',
  template: `
    <button
      *ngIf="hasMouseHover"
      (click)="toggleViewMouseHover.emit()"
      astrobinEventPreventDefault
      class="force-view-mousehover-button btn btn-link text-light"
      [class.active]="forceViewMouseHover"
    >
      <fa-icon icon="computer-mouse"></fa-icon>
    </button>

    <button
      *ngIf="revision?.solution && (revision?.solution.skyplotZoom1 || revision?.solution.pixinsightFindingChart)"
      (click)="openSkyplot()"
      astrobinEventPreventDefault
      class="skyplot-button btn btn-link text-light"
    >
      <fa-icon
        [ngbTooltip]="'View sky map' | translate"
        container="body"
        icon="map"
      ></fa-icon>
    </button>

    <button
      *ngIf="!revision?.videoFile"
      class="histogram-button btn btn-link text-light"
      (click)="openHistogram()"
    >
      <fa-icon
        [ngbTooltip]="'View histogram' | translate"
        container="body"
        icon="chart-simple"
      ></fa-icon>
    </button>

    <button
      (click)="showAdjustmentsEditor.emit()"
      astrobinEventPreventDefault
      class="adjustments-editor-button btn btn-link text-light d-none d-md-block"
    >
      <fa-icon
        [ngbTooltip]="'Image adjustments' | translate"
        container="body"
        icon="sliders"
      ></fa-icon>
    </button>

    <ng-template #skyplotModalTemplate>
      <div class="modal-body">
        <img
          [src]="revision?.solution?.pixinsightFindingChart || revision?.solution?.skyplotZoom1"
          [ngStyle]="{'filter': revision.solution.pixinsightFindingChart ? 'none' : 'grayscale(100%)'}"
          class="w-100"
          alt=""
        />
      </div>
    </ng-template>

    <ng-template #histogramModalTemplate>
      <div class="modal-body">
        <img *ngIf="!loadingHistogram; else loadingTemplate" [src]="histogram" alt="" />
      </div>
    </ng-template>

    <ng-template #loadingTemplate>
      <astrobin-loading-indicator></astrobin-loading-indicator>
    </ng-template>
  `,
  styleUrls: ["./image-viewer-additional-buttons.component.scss"]
})
export class ImageViewerAdditionalButtonComponent implements OnInit {
  @Input() image: ImageInterface;
  @Input() revisionLabel: string;

  @Input() hasMouseHover: boolean;
  @Input() inlineSvg: SafeHtml;
  @Input() forceViewMouseHover: boolean;

  @Output() toggleViewMouseHover = new EventEmitter<void>();
  @Output() showAdjustmentsEditor = new EventEmitter<void>();

  @ViewChild("skyplotModalTemplate")
  skyplotModalTemplate: TemplateRef<any>;

  @ViewChild("histogramModalTemplate")
  histogramModalTemplate: TemplateRef<any>;

  protected revision: ImageInterface | ImageRevisionInterface;
  protected loadingHistogram = false;
  protected histogram: string;

  constructor(
    public readonly modalService: NgbModal,
    public readonly imageApiService: ImageApiService,
    public readonly imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.revision = this.imageService.getRevision(this.image, this.revisionLabel);
  }

  openSkyplot(): void {
    this.modalService.open(this.skyplotModalTemplate, { size: "md" });
  }

  openHistogram(): void {
    if (this.loadingHistogram) {
      return;
    }

    this.modalService.open(this.histogramModalTemplate, { size: "sm" });
    this.loadingHistogram = true;

    this.imageApiService.getThumbnail(
      this.image.hash || this.image.pk, this.revisionLabel, ImageAlias.HISTOGRAM
    ).subscribe(thumbnail => {
      this.loadingHistogram = false;
      this.histogram = thumbnail.url;
    });
  }
}