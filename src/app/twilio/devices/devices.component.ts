import { Platform } from '@angular/cdk/platform';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { findIndex } from 'lodash';
import {
  browserSettings,
  SystemSettings,
} from 'src/app/shared/entities/enable-settings';

import { VideoAudioSettingsService } from '../services/video-audio-settings.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent implements OnInit {
  @Output() closeDialog = new EventEmitter();
  public hasPermissions: boolean;
  public settings: SystemSettings[] = browserSettings;
  public selectedIndex: number;
  constructor(
    public platform: Platform,
    private settingsService: VideoAudioSettingsService
  ) {
    this.selectedIndex = 0;
  }

  ngOnInit(): void {
    this.settingsService.enumerate();
    this.settingsService.hasPermissions().then((res) => {
      this.hasPermissions = res;
    });
    if (this.platform.isBrowser) {
      if (this.platform.BLINK) {
        this.selectedIndex = findIndex(this.settings, ['engine', 'BLINK']);
      }
      if (this.platform.EDGE) {
        this.selectedIndex = findIndex(this.settings, ['engine', 'EDGE']);
      }
      if (this.platform.FIREFOX) {
        this.selectedIndex = findIndex(this.settings, ['engine', 'FIREFOX']);
      }
      if (this.platform.SAFARI) {
        this.selectedIndex = findIndex(this.settings, ['engine', 'SAFARI']);
      }

      if (this.platform.TRIDENT) {
        this.selectedIndex = findIndex(this.settings, ['engine', 'EDGE']);
      }
      if (this.platform.WEBKIT) {
        this.selectedIndex = findIndex(this.settings, ['engine', 'SAFARI']);
      }
      if (this.platform.IOS) {
        this.selectedIndex = findIndex(this.settings, ['engine', 'IOS']);
      }
    }
  }

  close(): void {
    this.closeDialog.emit();
  }
}
