import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { createLocalVideoTrack, LocalVideoTrack } from 'twilio-video';
import { StorageService } from '../services/storage.service';
import { VideoStateService } from '../services/video-state.service';

@Component({
  selector: 'app-camera',
  styleUrls: ['./camera.component.scss'],
  templateUrl: './camera.component.html',
})
export class CameraComponent implements AfterViewInit {
  @ViewChild('preview') previewElement: ElementRef;

  isInitializing = true;
  videoTrack: LocalVideoTrack = null;

  constructor(
    private readonly storageService: StorageService,
    private readonly renderer: Renderer2,
    private readonly stateService: VideoStateService
  ) { }

  async ngAfterViewInit(): Promise<void> {
    if (this.previewElement && this.previewElement.nativeElement) {
      const selectedVideoInput = this.storageService.get('videoInputId');      
      await this.initializeDevice(selectedVideoInput);
    }
  }

  async initializePreview(deviceId: string): Promise<void> {
    await this.initializeDevice(deviceId);
  }

  finalizePreview(): void {
    try {
      if (this.videoTrack) {
        this.videoTrack.detach().forEach(element => element.remove());
      }
      this.videoTrack = null;
    } catch (e) {
      // console.error(e);
    }
  }

  private async initializeDevice(deviceId?: string): Promise<void> {
    try {
      this.isInitializing = true;

      this.finalizePreview();

      this.videoTrack = deviceId
        ? await createLocalVideoTrack({ deviceId })
        : await createLocalVideoTrack();

      const videoElement = this.videoTrack.attach();
      this.renderer.setStyle(videoElement, 'height', '100%');
      this.renderer.setStyle(videoElement, 'width', '60%');
      Array.from(this.previewElement.nativeElement.children).forEach(child => {
        this.renderer.removeChild(this.previewElement.nativeElement, child);
      });

      this.stateService.callType$.subscribe((res) => {
        if (res === 'video') {
          this.renderer.appendChild(this.previewElement.nativeElement, videoElement);
        }
      });
    } finally {
      this.isInitializing = false;
    }
  }

  closeTracks(): void {
    try {
      if (this.videoTrack) {
        this.videoTrack.stop();
      }
      this.videoTrack = null;
    } catch (e) {
      // console.error(e);
    }
  }
}
