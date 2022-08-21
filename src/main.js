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
 
 FriendlyEats.prototype.getRandomItem = function(arr) {
   return arr[Math.floor(Math.random() * arr.length)];
 };
 
 FriendlyEats.prototype.data = {
   words: [
     'Bar',
     'Fire',
     'Grill',
     'Drive Thru',
     'Place',
     'Best',
     'Spot',
     'Prime',
     'Eatin\''
   ],
   cities: [
     'Albuquerque',
     'Arlington',
     'Atlanta',
     'Austin',
     'Baltimore',
     'Boston',
     'Charlotte',
     'Chicago',
     'Cleveland',
     'Colorado Springs',
     'Columbus',
     'Dallas',
     'Denver',
     'Detroit',
     'El Paso',
     'Fort Worth',
     'Fresno',
     'Houston',
     'Indianapolis',
     'Jacksonville',
     'Kansas City',
     'Las Vegas',
     'Long Island',
     'Los Angeles',
     'Louisville',
     'Memphis',
     'Mesa',
     'Miami',
     'Milwaukee',
     'Nashville',
     'New York',
     'Oakland',
     'Oklahoma',
     'Omaha',
     'Philadelphia',
     'Phoenix',
     'Portland',
     'Raleigh',
     'Sacramento',
     'San Antonio',
     'San Diego',
     'San Francisco',
     'San Jose',
     'Tucson',
     'Tulsa',
     'Virginia Beach',
     'Washington'
   ],
   categories: [
     'Brunch',
     'Burgers',
     'Coffee',
     'Deli',
     'Dim Sum',
     'Indian',
     'Italian',
     'Mediterranean',
     'Mexican',
     'Pizza',
     'Ramen',
     'Sushi'
   ],
   ratings: [
     {
       rating: 1,
       text: 'Would never eat here again!'
     },
     {
       rating: 2,
       text: 'Not my cup of tea.'
     },
     {
       rating: 3,
       text: 'Exactly okay :/'
     },
     {
       rating: 4,
       text: 'Actually pretty good, would recommend!'
     },
     {
       rating: 5,
       text: 'This is my favorite place. Literally.'
     }
   ]
 };
 
 window.onload = function() {
   window.app = new FriendlyEats();
 };
 // ==== FriendlyEats.Data.js
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

FriendlyEats.prototype.addRestaurant = function(data) {
  var collection = firebase.firestore().collection('restaurants');
  return collection.add(data);
};

FriendlyEats.prototype.getAllRestaurants = function(renderer) {
    var query = firebase.firestore()
        .collection('restaurants')
        .orderBy('avgRating', 'desc')
        .limit(50);

    this.getDocumentsInQuery(query, renderer);
};

FriendlyEats.prototype.getDocumentsInQuery = function(query, renderer) {
    query.onSnapshot(function(snapshot) {
        if (!snapshot.size) return renderer.empty(); // Display "There are no restaurants".
    
        snapshot.docChanges().forEach(function(change) {
          if (change.type === 'removed') {
            renderer.remove(change.doc);
          } else {
            renderer.display(change.doc);
          }
        });
      });
};

FriendlyEats.prototype.getRestaurant = function(id) {
  /*
    TODO: Retrieve a single restaurant
  */
};

FriendlyEats.prototype.getFilteredRestaurants = function(filters, renderer) {
  /*
    TODO: Retrieve filtered list of restaurants
  */
};

FriendlyEats.prototype.addRating = function(restaurantID, rating) {
  /*
    TODO: Retrieve add a rating to a restaurant
  */
};

 // ==== FriendlyEats.Mock.js
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 'use strict';

 /**
  * Adds a set of mock Restaurants to the Cloud Firestore.
  */
 FriendlyEats.prototype.addMockRestaurants = function() {
   var promises = [];

   this.addingMockData = true;
   for (var i = 0; i < 20; i++) {
     var name =
         this.getRandomItem(this.data.words) +
         ' ' +
         this.getRandomItem(this.data.words);
     var category = this.getRandomItem(this.data.categories);
     var city = this.getRandomItem(this.data.cities);
     var price = Math.floor(Math.random() * 4) + 1;
     var photoID = Math.floor(Math.random() * 22) + 1;
     var photo = 'https://storage.googleapis.com/firestorequickstarts.appspot.com/food_' + photoID + '.png';
     var numRatings = 0;
     var avgRating = 0;
 
     var promise = this.addRestaurant({
       name: name,
       category: category,
       price: price,
       city: city,
       numRatings: numRatings,
       avgRating: avgRating,
       photo: photo
     });
 
     if (!promise) {
       alert('addRestaurant() is not implemented yet!');
       return Promise.reject();
     } else {
       promises.push(promise);
     }
   }
 
   return Promise.all(promises).then(() => this.addingMockData = false );
 };
 
 /**
  * Adds a set of mock Ratings to the given Restaurant.
  */
 FriendlyEats.prototype.addMockRatings = function(restaurantID) {
   var ratingPromises = [];
   for (var r = 0; r < 5*Math.random(); r++) {
     var rating = this.data.ratings[
       parseInt(this.data.ratings.length*Math.random())
     ];
     rating.userName = 'Bot (Web)';
     rating.timestamp = new Date();
     rating.userId = firebase.auth().currentUser.uid;
     ratingPromises.push(this.addRating(restaurantID, rating));
   }
   return Promise.all(ratingPromises);
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

  this.replaceElement(
    headerEl.querySelector('#section-header'),
    this.renderTemplate('filter-display', {
      filter_description:filter_description
    })
  );

  this.replaceElement(document.querySelector('.header'), headerEl);
  this.replaceElement(document.querySelector('main'), mainEl);

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

      that.replaceElement(
        headerEl.querySelector('#section-header'),
        that.renderTemplate('filter-display', {
          filter_description: filter_description
        })
      );

      headerEl.querySelector('#show-filters').addEventListener('click', function() {
        that.dialogs.filter.show();
      });

      that.replaceElement(document.querySelector('.header'), headerEl);
      that.replaceElement(document.querySelector('main'), noResultsEl);
      return;
    }
  };

  if (filters.city || filters.category || filters.price || filters.sort !== 'Rating' ) {
    this.getFilteredRestaurants({
      city: filters.city || 'Any',
      category: filters.category || 'Any',
      price: filters.price || 'Any',
      sort: filters.sort
    }, renderer);
  } else {
    this.getAllRestaurants(renderer);
  }

  var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
  toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');

  mdc.autoInit();
};

FriendlyEats.prototype.viewSetup = function() {
  var config = this.getFirebaseConfig();
  this.mountComponent(document.querySelector('main'), Setup, { that: this, config });
  this.mountComponent(document.querySelector('.header'), HeaderBase, { hasSectionHeader: false });

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

    that.addRating(id, {
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

  this.replaceElement(
    dialog.querySelector('#category-list'),
    this.renderTemplate('item-list', { items: ['Any'].concat(this.data.categories) })
  );

  this.replaceElement(
    dialog.querySelector('#city-list'),
    this.renderTemplate('item-list', { items: ['Any'].concat(this.data.cities) })
  );

  var renderAllList = function() {
    that.replaceElement(
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
  return this.getRestaurant(id)
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
            that.addMockRatings(id).then(function() {
              that.rerender();
            });
          }
        });
      }

      var headerEl = that.renderTemplate('header-base', {
        hasSectionHeader: true
      });

      that.replaceElement(document.querySelector('.header'), sectionHeaderEl);
      that.replaceElement(document.querySelector('main'), mainEl);
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
  this.render(el, data);
  return el;
};

FriendlyEats.prototype.render = function(el, data) {
  if (!data) {
    return;
  }

  var that = this;
  var modifiers = {
    'data-fir-foreach': function(tel) {
      var field = tel.getAttribute('data-fir-foreach');
      var values = that.getDeepItem(data, field);

      values.forEach(function(value, index) {
        var cloneTel = tel.cloneNode(true);
        tel.parentNode.append(cloneTel);

        Object.keys(modifiers).forEach(function(selector) {
          var children = Array.prototype.slice.call(
            cloneTel.querySelectorAll('[' + selector + ']')
          );
          children.push(cloneTel);
          children.forEach(function(childEl) {
            var currentVal = childEl.getAttribute(selector);

            if (!currentVal) {
              return;
            }
            childEl.setAttribute(
              selector,
              currentVal.replace('~', field + '/' + index)
            );
          });
        });
      });

      tel.parentNode.removeChild(tel);
    },
    'data-fir-content': function(tel) {
      var field = tel.getAttribute('data-fir-content');
      tel.innerText = that.getDeepItem(data, field);
    },
    'data-fir-click': function(tel) {
      tel.addEventListener('click', function() {
        var field = tel.getAttribute('data-fir-click');
        that.getDeepItem(data, field)();
      });
    },
    'data-fir-if': function(tel) {
      var field = tel.getAttribute('data-fir-if');
      if (!that.getDeepItem(data, field)) {
        tel.style.display = 'none';
      }
    },
    'data-fir-if-not': function(tel) {
      var field = tel.getAttribute('data-fir-if-not');
      if (that.getDeepItem(data, field)) {
        tel.style.display = 'none';
      }
    },
    'data-fir-attr': function(tel) {
      var chunks = tel.getAttribute('data-fir-attr').split(':');
      var attr = chunks[0];
      var field = chunks[1];
      tel.setAttribute(attr, that.getDeepItem(data, field));
    },
    'data-fir-style': function(tel) {
      var chunks = tel.getAttribute('data-fir-style').split(':');
      var attr = chunks[0];
      var field = chunks[1];
      var value = that.getDeepItem(data, field);

      if (attr.toLowerCase() === 'backgroundimage') {
        value = 'url(' + value + ')';
      }
      tel.style[attr] = value;
    }
  };

  var preModifiers = ['data-fir-foreach'];

  preModifiers.forEach(function(selector) {
    var modifier = modifiers[selector];
    that.useModifier(el, selector, modifier);
  });

  Object.keys(modifiers).forEach(function(selector) {
    if (preModifiers.indexOf(selector) !== -1) {
      return;
    }

    var modifier = modifiers[selector];
    that.useModifier(el, selector, modifier);
  });
};

FriendlyEats.prototype.useModifier = function(el, selector, modifier) {
  el.querySelectorAll('[' + selector + ']').forEach(modifier);
};

FriendlyEats.prototype.getDeepItem = function(obj, path) {
  path.split('/').forEach(function(chunk) {
    obj = obj[chunk];
  });
  return obj;
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

FriendlyEats.prototype.replaceElement = function(parent, content) {
  parent.innerHTML = '';
  parent.append(content);
};

FriendlyEats.prototype.rerender = function() {
  this.router.navigate(document.location.pathname + '?' + new Date().getTime());
};

FriendlyEats.prototype.mountComponent = function(parent, cls, props = {}) {
    parent.innerHTML = '';
    const mounter = document.createElement('div');
    const component = new cls({target: mounter, props});
    parent.append(mounter);
    return component;
};