/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
importScripts('https://www.gstatic.com/firebasejs/9.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC4pjYxIa_Mz_ceS5ppLc9dmI9ycqHe_ik",
  authDomain: "friendly-eats-5c2b4.firebaseapp.com",
  databaseURL: "https://friendly-eats-5c2b4.firebaseio.com",
  projectId: "friendly-eats-5c2b4",
  storageBucket: "friendly-eats-5c2b4.appspot.com",
  messagingSenderId: "373507430883",
  appId: "1:373507430883:web:5d3f195256b717739a28d6",
  measurementId: "G-M86R7EN02K"
});

firebase.messaging();
