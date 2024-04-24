import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DeviceService } from '../services/device.service';
import { VideoStateService } from '../services/video-state.service';

@Component({
  selector: 'app-audio-settings',
  templateUrl: './audio-settings.component.html',
  styleUrls: ['./audio-settings.component.scss']
})
export class AudioSettingsComponent implements OnInit, OnDestroy {
  public devices: MediaDeviceInfo[] = [];
  private subscription: Subscription;


  get hasAudioInputOptions(): boolean {
    return this.devices && this.devices.filter(d => d.kind === 'audioinput').length > 0;
  }
  get hasAudioOutputOptions(): boolean {
    return this.devices && this.devices.filter(d => d.kind === 'audiooutput').length > 0;
  }

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

}
