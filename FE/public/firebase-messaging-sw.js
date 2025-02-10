// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

let firebaseConfig = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    firebaseConfig = event.data.config;
    // Firebase가 이미 초기화되지 않았다면 초기화
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }
});

// Firebase Messaging 초기화
const messaging = firebase.messaging();

// 백그라운드 메시지 핸들링
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  // 필요한 알림 로직 구현
});