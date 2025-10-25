/* eslint-env serviceworker */
/* global importScripts firebase */
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0//firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyAFJ2bA2ouqPHeHnwEsPaTFxU-ww20dJmc",
    authDomain: "ring-ling.firebaseapp.com",
    projectId: "ring-ling",
    storageBucket: "ring-ling.firebasestorage.app",
    messagingSenderId: "131676104039",
    appId: "1:131676104039:web:68cfdfcd3456f1d280bbc2",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const title = payload.data.title;
    const options = {
        body: payload.data.body
    };

    self.registration.showNotification(title, options);
});