import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messages.subscribe((messaging: AngularFireMessaging) => {
      messaging.onMessage = messaging.onMessage.bind(messaging);
      messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
    });
  }
  requestPermission(): void {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        localStorage.setItem('fcmToken', token);
      },
      (err) => {
        // console.error('Unable to get permission to notify.', err);
      }
    );
  }
  receiveMessage(): void {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        
        this.currentMessage.next(payload);
      });
  }
}
