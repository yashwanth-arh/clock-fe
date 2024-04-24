importScripts("https://www.gstatic.com/firebasejs/8.6.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.3/firebase-messaging.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.8/firebase-analytics.js");

firebase.initializeApp({
  apiKey: "AIzaSyAoqOZhsFlqzkoYvQ4R3ZFOrBSHZ0FdNgk",
  authDomain: "clock-healthcare.firebaseapp.com",
  projectId: "clock-healthcare",
  storageBucket: "clock-healthcare.appspot.com",
  messagingSenderId: "48655718171",
  appId: "1:48655718171:web:7719b4f6b64a23430c25be",
  measurementId: "G-WV2WHSVPKE"
});
const messaging = firebase.messaging();
