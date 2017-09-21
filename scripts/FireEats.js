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
"use strict";

function FireEats() {
  firebase.auth().signInAnonymously().then(() => {
    this.initTemplates();
    this.initRouter();
    this.initReviewDialog();
  });
}

FireEats.prototype.initRouter = function() {
  this.router = new Navigo();

  this.router
    .on({
      "/": () => {
        this.viewList();
      }
    })
    .on({
      "/setup": () => {
        this.viewSetup();
      }
    })
    .on({
      "/restaurants/*": () => {
        let path = this.getCleanPath(document.location.pathname);
        const id = path.split("/")[2];
        this.viewLocation(id);
      }
    })
    .resolve();

  /*
  This is a bit of extra logic to show the setup page if your Firestore has no
  data. It should be disabled for a production app.
  */
  firebase
    .firestore()
    .collection("restaurants")
    .limit(1)
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        this.router.navigate("/setup");
      }
    });
};

FireEats.prototype.getCleanPath = function(dirtyPath) {
  if (dirtyPath.startsWith("/index.html")) {
    return dirtyPath.split("/").slice(1).join("/");
  } else {
    return dirtyPath;
  }
};

FireEats.prototype.getFirebaseConfig = function() {
  return firebase.apps[0].options_;
};

FireEats.prototype.getRandomItem = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

FireEats.prototype.data = {
  words: [
    "Bar",
    "Fire",
    "Grill",
    "Drive Thru",
    "Place",
    "Best",
    "Spot",
    "Prime",
    "Eatin'"
  ],
  cities: [
    "San Francisco",
    "Mountain View",
    "Palo Alto",
    "Redwood City",
    "San Mateo",
    "Cupertino",
    "San Jose",
    "Daly City",
    "Millbrae",
    "Belmont"
  ],
  categories: [
    "Pizza",
    "Burgers",
    "American",
    "Dim Sum",
    "Pho",
    "Mexican",
    "Hot Pot"
  ]
};

window.onload = function() {
  window.app = new FireEats();

  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function(registration) {
        console.log(
          "ServiceWorker registration successful with scope:",
          registration.scope
        );
      })
      .catch(function(error) {
        console.log("ServiceWorker registration failed:", errror);
      });
  }
};
