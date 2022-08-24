// ==== FriendlyEats.js
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
'use strict';

import HeaderBase from './components/header-base.svelte';
import Setup from './components/setup.svelte';
import ListRestaurants from './components/list-restaurants.svelte';
import FilterDialog from './components/filter-dialog.svelte';
import RestaurantHeader from './components/restaurant-header.svelte';
import RestaurantReviews from './components/restaurant-reviews.svelte';
import AddReview from './components/add-review.svelte';
import { render, mountComponent } from './lib/renderer';
import { getRestaurant, addRating } from './lib/firestore';


 /**
  * Initializes the FriendlyEats app.
  */
 function FriendlyEats() {
   this.filters = {
     city: '',
     price: '',
     category: '',
     sort: 'Rating'
   };
 
   this.dialogs = {};
   this.addingMockData = false;

   var that = this;
   firebase.auth().signInAnonymously().then(function() {
     that.initTemplates();
     that.initRouter();
     that.initReviewDialog();
     that.initFilterDialog();
   }).catch(function(err) {
     console.log(err);
   });
 }
 
 /**
  * Initializes the router for the FriendlyEats app.
  */
 FriendlyEats.prototype.initRouter = function() {
   this.router = new Navigo();
 
   this.router
   .on({'/': () => this.viewList()})
   .on({'/setup': () => this.viewSetup()})
   .on({'/restaurants/*': () => {
       var path = this.getCleanPath(document.location.pathname);
       var id = path.split('/')[2];
       this.viewRestaurant(id);
    }})
   .resolve();

   firebase
     .firestore()
     .collection('restaurants')
     .limit(1)
     .onSnapshot((snapshot) => {
       if (snapshot.empty) {
         this.router.navigate('/setup');
       }
     });
 };
 
 FriendlyEats.prototype.getCleanPath = function(dirtyPath) {
   if (dirtyPath.startsWith('/index.html')) {
     return dirtyPath.split('/').slice(1).join('/');
   } else {
     return dirtyPath;
   }
 };
 
 FriendlyEats.prototype.getFirebaseConfig = function() {
   return firebase.app().options;
 };
 
 window.onload = function() {
   window.app = new FriendlyEats();
 };

 // ==== FriendlyEats.View.js
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
'use strict';

FriendlyEats.prototype.initTemplates = function() {
  this.templates = {};

  var that = this;
  document.querySelectorAll('.template').forEach(function(el) {
    that.templates[el.getAttribute('id')] = el;
  });
};

FriendlyEats.prototype.viewList = function() {
  mountComponent(document.querySelector('.header'), HeaderBase, {
    that: this,
    filters: this.filters,
  });
  mountComponent(document.querySelector('main'), ListRestaurants, { that: this });
};

FriendlyEats.prototype.viewSetup = function() {
  var config = this.getFirebaseConfig();
  mountComponent(document.querySelector('main'), Setup, { that: this, config });
  mountComponent(document.querySelector('.header'), HeaderBase);

  firebase
    .firestore()
    .collection('restaurants')
    .limit(1)
    .onSnapshot(snapshot => {
      if (snapshot.size && !this.addingMockData) {
        this.router.navigate('/');
      }
    });
};

FriendlyEats.prototype.initReviewDialog = function() {
  let values = {
    rating: 0,
    text: '',
  };

  var dialog = document.querySelector('#dialog-add-review');
  mountComponent(dialog, AddReview, { values });
  this.dialogs.add_review = new mdc.dialog.MDCDialog(dialog);

  var that = this;
  this.dialogs.add_review.listen('MDCDialog:accept', function() {
    var pathname = that.getCleanPath(document.location.pathname);
    var id = pathname.split('/')[2];

    addRating(id, {
      ...values,
      userName: 'Anonymous (Web)',
      timestamp: new Date(),
      userId: firebase.auth().currentUser.uid
    }).then(function() {
      that.rerender();
    });
  });
};

FriendlyEats.prototype.initFilterDialog = function() {
  // TODO: Reset filter dialog to init state on close.
  const dialogEl = document.querySelector('#dialog-filter-all');
  mountComponent(dialogEl, FilterDialog, { filters: this.filters });
  this.dialogs.filter = new mdc.dialog.MDCDialog(dialogEl);

  this.dialogs.filter.listen('MDCDialog:accept', () => this.viewList() );
};

FriendlyEats.prototype.viewRestaurant = function(id) {
  return getRestaurant(id)
    .then(doc => {
        mountComponent(document.querySelector('.header'), RestaurantHeader, { that: this, data: doc.data() });
        return doc.ref.collection('ratings').orderBy('timestamp', 'desc').get();
    })
    .then(ratings => {
      mountComponent(document.querySelector('main'), RestaurantReviews, { that: this, id, ratings})
    })
    .then(() => {
      this.router.updatePageLinks();
    })
    .catch(err => {
      console.warn('Error rendering page', err);
    });
};

FriendlyEats.prototype.renderTemplate = function(id, data) {
  var template = this.templates[id];
  var el = template.cloneNode(true);
  el.removeAttribute('hidden');
  render(el, data);
  return el;
};

FriendlyEats.prototype.rerender = function() {
  this.router.navigate(document.location.pathname + '?' + new Date().getTime());
};
