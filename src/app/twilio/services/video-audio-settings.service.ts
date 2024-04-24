import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class VideoAudioSettingsService {
	public checkFor = ['audioinput', 'videoinput'];
	public hasAllSettings: boolean;
	constructor(private platform: Platform) {
		this.hasAllSettings = true;
		if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			// console.error('This browser doesnot support the API yet!');
		}
	}

	enumerate(): boolean {
		navigator.mediaDevices
			.enumerateDevices()
			.then((devices) => {
				devices.forEach((device) => {
					if (this.checkFor.includes(device.kind)) {
						this.hasAllSettings = false;
					}
				});
				if (this.hasAllSettings) {
					return true;
				} else {
					return false;
				}
			})
			.catch((err) => {
				return false;
			});
		return false;
	}

	async hasPermissions(): Promise<boolean> {
		const parameters = { audio: true, video: true };
		return navigator.mediaDevices
			.getUserMedia(parameters)
			.then((stream) => true)
			.catch((err) => false);
	}
}
