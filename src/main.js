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
import { descriptionForFilter } from './lib/query';
import { render, replaceElement, mountComponent } from './lib/renderer';
import { getAllRestaurants, getRestaurant, getFilteredRestaurants, addRating } from './lib/firestore';
import { addMockRatings } from './lib/mock';
import { categories, cities } from './lib/data';


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
   .on({'/': () => this.viewList(this.filters)})
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

FriendlyEats.prototype.viewList = function(filters) {
    const filter_description = descriptionForFilter(this.filters);

  var mainEl = this.renderTemplate('main-adjusted');
  var headerEl = this.renderTemplate('header-base', {
    hasSectionHeader: true
  });

  replaceElement(
    headerEl.querySelector('#section-header'),
    this.renderTemplate('filter-display', {
      filter_description:filter_description
    })
  );

  replaceElement(document.querySelector('.header'), headerEl);
  replaceElement(document.querySelector('main'), mainEl);

  var that = this;
  headerEl.querySelector('#show-filters').addEventListener('click', function() {
    that.dialogs.filter.show();
  });

  var renderer = {
    remove: function(doc) {
      var locationCardToDelete = mainEl.querySelector('#doc-' + doc.id);
      if (locationCardToDelete) {
        mainEl.querySelector('#cards').removeChild(locationCardToDelete.parentNode);
      }

      return;
    },
    display: function(doc) {
      var data = doc.data();
      data['.id'] = doc.id;
      data['go_to_restaurant'] = function() {
        that.router.navigate('/restaurants/' + doc.id);
      };
  
      var el = that.renderTemplate('restaurant-card', data);
      el.querySelector('.rating').append(that.renderRating(data.avgRating));
      el.querySelector('.price').append(that.renderPrice(data.price));
      // Setting the id allows to locating the individual restaurant card
      el.querySelector('.location-card').id = 'doc-' + doc.id;
  
      var existingLocationCard = mainEl.querySelector('#doc-' + doc.id);
      if (existingLocationCard) {
        // modify
        existingLocationCard.parentNode.before(el);
        mainEl.querySelector('#cards').removeChild(existingLocationCard.parentNode);
      } else {
        // add
        mainEl.querySelector('#cards').append(el);
      }
    },
    empty: function() {
      var headerEl = that.renderTemplate('header-base', {
        hasSectionHeader: true
      });

      var noResultsEl = that.renderTemplate('no-results');

      replaceElement(
        headerEl.querySelector('#section-header'),
        that.renderTemplate('filter-display', {
          filter_description: filter_description
        })
      );

      headerEl.querySelector('#show-filters').addEventListener('click', function() {
        that.dialogs.filter.show();
      });

      replaceElement(document.querySelector('.header'), headerEl);
      replaceElement(document.querySelector('main'), noResultsEl);
      return;
    }
  };

  if (filters.city || filters.category || filters.price || filters.sort !== 'Rating' ) {
    getFilteredRestaurants({
      city: filters.city || 'Any',
      category: filters.category || 'Any',
      price: filters.price || 'Any',
      sort: filters.sort
    }, renderer);
  } else {
    getAllRestaurants(renderer);
  }

  var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
  toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');

  mdc.autoInit();
};

FriendlyEats.prototype.viewSetup = function() {
  var config = this.getFirebaseConfig();
  mountComponent(document.querySelector('main'), Setup, { that: this, config });
  mountComponent(document.querySelector('.header'), HeaderBase, { hasSectionHeader: false });

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
  var dialog = document.querySelector('#dialog-add-review');
  this.dialogs.add_review = new mdc.dialog.MDCDialog(dialog);

  var that = this;
  this.dialogs.add_review.listen('MDCDialog:accept', function() {
    var pathname = that.getCleanPath(document.location.pathname);
    var id = pathname.split('/')[2];

    addRating(id, {
      rating: rating,
      text: dialog.querySelector('#text').value,
      userName: 'Anonymous (Web)',
      timestamp: new Date(),
      userId: firebase.auth().currentUser.uid
    }).then(function() {
      that.rerender();
    });
  });

  var rating = 0;

  dialog.querySelectorAll('.star-input i').forEach(function(el) {
    var rate = function() {
      var after = false;
      rating = 0;
      [].slice.call(el.parentNode.children).forEach(function(child) {
        if (!after) {
          rating++;
          child.innerText = 'star';
        } else {
          child.innerText = 'star_border';
        }
        after = after || child.isSameNode(el);
      });
    };
    el.addEventListener('mouseover', rate);
  });
};

FriendlyEats.prototype.initFilterDialog = function() {
  // TODO: Reset filter dialog to init state on close.
  this.dialogs.filter = new mdc.dialog.MDCDialog(document.querySelector('#dialog-filter-all'));

  var that = this;
  this.dialogs.filter.listen('MDCDialog:accept', function() {
    that.viewList(that.filters);
});

  var dialog = document.querySelector('aside');
  var pages = dialog.querySelectorAll('.page');

  replaceElement(
    dialog.querySelector('#category-list'),
    this.renderTemplate('item-list', { items: ['Any'].concat(categories) })
  );

  replaceElement(
    dialog.querySelector('#city-list'),
    this.renderTemplate('item-list', { items: ['Any'].concat(cities) })
  );

  var renderAllList = function() {
    replaceElement(
      dialog.querySelector('#all-filters-list'),
      that.renderTemplate('all-filters-list', that.filters)
    );

    dialog.querySelectorAll('#page-all .mdc-list-item').forEach(function(el) {
      el.addEventListener('click', function() {
        var id = el.id.split('-').slice(1).join('-');
        displaySection(id);
      });
    });
  };

  var displaySection = function(id) {
    if (id === 'page-all') {
      renderAllList();
    }

    pages.forEach(function(sel) {
      if (sel.id === id) {
        sel.style.display = 'block';
      } else {
        sel.style.display = 'none';
      }
    });
  };

  pages.forEach(function(sel) {
    var type = sel.id.split('-')[1];
    if (type === 'all') {
      return;
    }

    sel.querySelectorAll('.mdc-list-item').forEach(function(el) {
      el.addEventListener('click', function() {
        that.filters[type] = el.innerText.trim() === 'Any'? '' : el.innerText.trim();
        displaySection('page-all');
      });
    });
  });

  displaySection('page-all');
  dialog.querySelectorAll('.back').forEach(function(el) {
    el.addEventListener('click', function() {
      displaySection('page-all');
    });
  });
};

FriendlyEats.prototype.viewRestaurant = function(id) {
  var sectionHeaderEl;

  var that = this;
  return getRestaurant(id)
    .then(function(doc) {
      var data = doc.data();
      var dialog =  that.dialogs.add_review;

      data.show_add_review = function() {
        // Reset the state before showing the dialog
        dialog.root_.querySelector('#text').value = '';
        dialog.root_.querySelectorAll('.star-input i').forEach(function(el) {
          el.innerText = 'star_border';
        });

        dialog.show();
      };

      sectionHeaderEl = that.renderTemplate('restaurant-header', data);
      sectionHeaderEl
        .querySelector('.rating')
        .append(that.renderRating(data.avgRating));

      sectionHeaderEl
        .querySelector('.price')
        .append(that.renderPrice(data.price));
      return doc.ref.collection('ratings').orderBy('timestamp', 'desc').get();
    })
    .then(function(ratings) {
      var mainEl;

      if (ratings.size) {
        mainEl = that.renderTemplate('main');

        ratings.forEach(function(rating) {
          var data = rating.data();
          var el = that.renderTemplate('review-card', data);
          el.querySelector('.rating').append(that.renderRating(data.rating));
          mainEl.querySelector('#cards').append(el);
        });
      } else {
        mainEl = that.renderTemplate('no-ratings', {
          add_mock_data: function() {
            addMockRatings(id).then(function() {
              that.rerender();
            });
          }
        });
      }

      var headerEl = that.renderTemplate('header-base', {
        hasSectionHeader: true
      });

      replaceElement(document.querySelector('.header'), sectionHeaderEl);
      replaceElement(document.querySelector('main'), mainEl);
    })
    .then(function() {
      that.router.updatePageLinks();
    })
    .catch(function(err) {
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

FriendlyEats.prototype.renderRating = function(rating) {
  var el = this.renderTemplate('rating', {});
  for (var r = 0; r < 5; r += 1) {
    var star;
    if (r < Math.floor(rating)) {
      star = this.renderTemplate('star-icon', {});
    } else {
      star = this.renderTemplate('star-border-icon', {});
    }
    el.append(star);
  }
  return el;
};

FriendlyEats.prototype.renderPrice = function(price) {
  var el = this.renderTemplate('price', {});
  for (var r = 0; r < price; r += 1) {
    el.append('$');
  }
  return el;
};

FriendlyEats.prototype.rerender = function() {
  this.router.navigate(document.location.pathname + '?' + new Date().getTime());
};
