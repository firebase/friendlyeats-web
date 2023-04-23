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
import { View } from "./FriendlyEats.View";
import { Data } from "./FriendlyEats.Data";
import { Auth } from "./FriendlyEats.Auth";
import { Mock } from "./FriendlyEats.Mock";

/**
 * Initializes the FriendlyEats app.
 */
export class FriendlyEats {
  constructor(firebaseApp) {
    this.firebaseApp = firebaseApp;
    this.auth = new Auth(firebaseApp);
    this.filters = {
      city: "",
      price: "",
      category: "",
      sort: "Rating"
    };

    this.router = new Navigo();
    this.dialogs = {};

    this.db = new Data({ firebaseApp });
    this.mock = new Mock({
      friendlyEats: this,
      data: this.db,
      auth: this.auth,
    });

    this.auth
      .signInAnonymously()
      .then(() => {
        this.view = new View({
          friendlyEats: this,
          data: this.db,
          auth: this.auth,
          router: this.router,
          dialogs: this.dialogs,
          mock: this.mock
        });
        this.setRoutes();
        this.view.initReviewDialog();
        this.view.initFilterDialog();
      })
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * Initializes the router for the FriendlyEats app.
   */
  setRoutes() {
    this.router
      .on({
        "/": () => {
          this.view.updateQuery(this.filters);
        }
      })
      .on({
        "/setup": () => {
          this.view.viewSetup();
        }
      })
      .on({
        "/restaurants/*": () => {
          let path = this.getCleanPath(document.location.pathname);
          let id = path.split("/")[2];
          this.view.viewRestaurant(id);
        }
      })
      .resolve();

    this.db.checkForEmpty(snapshot => {
      if (snapshot.empty) {
        this.router.navigate("/setup");
      }
    });
  }

  getCleanPath(dirtyPath) {
    if (dirtyPath.startsWith("/index.html")) {
      return dirtyPath
        .split("/")
        .slice(1)
        .join("/");
    } else {
      return dirtyPath;
    }
  }

  getFirebaseConfig() {
    return this.firebaseApp.options;
  }

  getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  get mockData() {
    return {
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
        "Albuquerque",
        "Arlington",
        "Atlanta",
        "Austin",
        "Baltimore",
        "Boston",
        "Charlotte",
        "Chicago",
        "Cleveland",
        "Colorado Springs",
        "Columbus",
        "Dallas",
        "Denver",
        "Detroit",
        "El Paso",
        "Fort Worth",
        "Fresno",
        "Houston",
        "Indianapolis",
        "Jacksonville",
        "Kansas City",
        "Las Vegas",
        "Long Island",
        "Los Angeles",
        "Louisville",
        "Memphis",
        "Mesa",
        "Miami",
        "Milwaukee",
        "Nashville",
        "New York",
        "Oakland",
        "Oklahoma",
        "Omaha",
        "Philadelphia",
        "Phoenix",
        "Portland",
        "Raleigh",
        "Sacramento",
        "San Antonio",
        "San Diego",
        "San Francisco",
        "San Jose",
        "Tucson",
        "Tulsa",
        "Virginia Beach",
        "Washington"
      ],
      categories: [
        "Brunch",
        "Burgers",
        "Coffee",
        "Deli",
        "Dim Sum",
        "Indian",
        "Italian",
        "Mediterranean",
        "Mexican",
        "Pizza",
        "Ramen",
        "Sushi"
      ],
      ratings: [
        {
          rating: 1,
          text: "Would never eat here again!"
        },
        {
          rating: 2,
          text: "Not my cup of tea."
        },
        {
          rating: 3,
          text: "Exactly okay :/"
        },
        {
          rating: 4,
          text: "Actually pretty good, would recommend!"
        },
        {
          rating: 5,
          text: "This is my favorite place. Literally."
        }
      ]
    };
  }
}
