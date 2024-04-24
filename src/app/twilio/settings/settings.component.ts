import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { CameraComponent } from '../camera/camera.component';
import { DeviceSelectComponent } from '../device-select/device-select.component';
import { DeviceService } from '../services/device.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { VideoStateService } from '../services/video-state.service';

@Component({
  selector: 'app-settings',
  styleUrls: ['./settings.component.scss'],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
  public devices: MediaDeviceInfo[] = [];
  private subscription: Subscription;
  public videoDeviceId: string;

  get hasAudioInputOptions(): boolean {
    return this.devices && this.devices.filter(d => d.kind === 'audioinput').length > 0;
  }
  get hasAudioOutputOptions(): boolean {
    return this.devices && this.devices.filter(d => d.kind === 'audiooutput').length > 0;
  }
  get hasVideoInputOptions(): boolean {
    return this.devices && this.devices.filter(d => d.kind === 'videoinput').length > 0;
  }

  @ViewChild('camera') camera: CameraComponent;
  @ViewChild('videoSelect') video: DeviceSelectComponent;

  @Input() isPreviewing: boolean;

  @Output() settingsChanged = new EventEmitter<MediaDeviceInfo>();

  constructor(
    private readonly deviceService: DeviceService,
    public stateService: VideoStateService
  ) { }

  ngOnInit(): void {
    this.subscription =
      this.deviceService
        .$devicesUpdated
        .pipe(debounceTime(350))
        .subscribe(async deviceListPromise => {
          this.devices = await deviceListPromise;
          this.handleDeviceAvailabilityChanges();
        });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async onSettingsChanged(deviceInfo: MediaDeviceInfo): Promise<void> {
    this.settingsChanged.emit(deviceInfo);
  }

  async showPreviewCamera() {
    // this.isPreviewing = true;
    if (this.video?.selectedId) {
      if (!this.camera.videoTrack || this.videoDeviceId !== this.video.selectedId) {
        this.videoDeviceId = this.video.selectedId;
        const videoDevice = this.devices.find(d => d.deviceId === this.video.selectedId);
        await this.camera.initializePreview(videoDevice.deviceId);
      }
    }

    return this.camera.videoTrack;
  }

  hidePreviewCamera() {
    this.isPreviewing = false;
    this.camera.finalizePreview();
    return this.devices.find(d => d.deviceId === this.video.selectedId);
  }

  private handleDeviceAvailabilityChanges() {
    if (this.devices && this.devices.length && this.video && this.video.selectedId) {
      let videoDevice = this.devices.find(d => d.deviceId === this.video.selectedId);
      if (!videoDevice) {
        videoDevice = this.devices.find(d => d.kind === 'videoinput');
        if (videoDevice) {
          this.video.selectedId = videoDevice.deviceId;
          this.onSettingsChanged(videoDevice);
        }
      }
    }
  }


}
