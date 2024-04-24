export interface SystemSettings {
	system: string;
	steps: string[];
	icon?: string;
	screenshot?: string;
	engine?: string;
}

export const browserSettings: SystemSettings[] = [
	{
		system: 'Google Chrome',
		icon: 'chrome.png',
		screenshot: 'chrome.gif',
		steps: [
			'Go to a site that wants to use your camera and mic.',
			'Click the security status icon to the left of the web address.',
			'Choose Allow for your camera and microphone.',
		],
		engine: 'BLINK',
	},
	{
		system: 'Mac',
		icon: 'mac-os-logo.png',
		steps: [
			'Go to Apple menu  > System Preferences > Security & Privacy > Privacy tab.',
			'Unlock (click) the lock icon in the lower-left to allow you to make changes to your preferences.',
			'Click Camera in the left sidebar and then select the checkbox next to an app that needs camera access.',
			'Click Microphone in the left sidebar and then select the checkbox next to an app that needs mic access.',
		],
		engine: 'IOS',
	},
	{
		system: 'Windows',
		icon: 'windows.png',
		steps: [
			'Go to Start menu > Settings > Privacy.',
			'Click Camera in the left sidebar and then turn on access for the app that needs to use the camera.',
			'If this option is grayed out, make sure Let apps use my camera hardware is turned on.',
			' Click Microphone in the left sidebar and then turn on access for the app that needs to use the mic.',
			'If this option is grayed out, make sure Let apps use my microphone is turned on.',
		],
		engine: 'TRIDENT',
	},
	{
		system: 'Firefox',
		icon: 'firefox.png',
		screenshot: 'firefox.gif',
		steps: [
			'Go to a site that wants to use your camera and mic.',
			'From the pop up, choose your camera and/or microphone.',
			'Tip: Click Remember this decision to set your selections as default.',
			' Click Allow.',
		],
		engine: 'FIREFOX',
	},
	{
		system: 'Safari',
		icon: 'safari.png',
		screenshot: 'safari.png',
		steps: [
			'Open Safari Preferences.',
			'Navigate to Websites.',
			'Go to Camera and Microphone tabs.',
			'Change access to Allow.',
			'Restart Safari. ',
		],
		engine: 'SAFARI',
	},
	{
		system: 'Edge',
		icon: 'edge.png',
		screenshot: 'edge.png',
		steps: [
			'Select the lock icon located near the right side of your search bar.',
			'Select the drop-down menu next to camera and microphone.',
			'Change the camera and microphone access to Allow. ',
			'Refresh the browser tab (CTRL + R).',
		],
		engine: 'EDGE',
	},
];
