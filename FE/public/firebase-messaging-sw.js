// src/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBiZRjxbM62LZ-DwwYZDTn3dfcgiEUWQr4",
    authDomain: "d103-952ab.firebaseapp.com",
    projectId: "d103-952ab",
    storageBucket: "d103-952ab.firebasestorage.app",
    messagingSenderId: "12084198220",
    appId: "1:12084198220:web:9ad530873935a6e10a2de9",
    measurementId: "G-BGMK297J5C"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();