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

import App from './app.svelte'; 
import FilterDialog from './components/filter-dialog.svelte';
import AddReview from './components/add-review.svelte';
import { mountComponent } from './lib/renderer';
import { addRating } from './lib/firestore';


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

   var that = this;
   firebase.auth().signInAnonymously().then(function() {
     mountComponent(document.querySelector('#app'), App, {that});
     that.initReviewDialog();
     that.initFilterDialog();
   }).catch(function(err) {
     console.log(err);
   });
 }
 
 FriendlyEats.prototype.getCleanPath = function(dirtyPath) {
   if (dirtyPath.startsWith('/index.html')) {
     return dirtyPath.split('/').slice(1).join('/');
   } else {
     return dirtyPath;
   }
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

window.app = new FriendlyEats();
