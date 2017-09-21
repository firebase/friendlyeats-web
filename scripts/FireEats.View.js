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

FireEats.prototype.initTemplates = function() {
  let self = this;
  this.templates = {};
  document.querySelectorAll(".template").forEach(el => {
    self.templates[el.getAttribute("id")] = el;
  });
};

FireEats.prototype.viewHome = function() {
  this.getAllRestaurants();
};

FireEats.prototype.viewList = function(filters, filter_description) {
  if (!filter_description) {
    filter_description = "all restaurants";
  }

  const mainEl = this.renderTemplate("generic-main");
  const headerEl = this.renderTemplate("header-base", {
    hasSectionHeader: true
  });

  this.replaceElement(
    headerEl.querySelector("#section-header"),
    this.renderTemplate("generic-header", { filter_description })
  );

  this.replaceElement(document.querySelector(".header"), headerEl);
  this.replaceElement(document.querySelector("main"), mainEl);

  this.initFilterDialog();
  const dialog = document.querySelector("#dialog-filter dialog");
  const showDialogButton = document.querySelector("#show-filters");
  showDialogButton.addEventListener("click", function() {
    dialog.showModal();
    componentHandler.upgradeElements(dialog);
  });

  const render = doc => {
    const data = doc.data();
    data[".id"] = doc.id;
    data["navigateToDetails"] = () => {
      console.log("go");
      this.router.navigate(`/restaurants/${doc.id}`);
    };

    const el = this.renderTemplate("restaurant-card", data);
    el.querySelector(".rating").append(this.renderRating(data.averageRating));
    el.querySelector(".price").append(this.renderPrice(data.price));

    mainEl.querySelector("#cards").append(el);
  };

  if (filters) {
    this.getFilteredRestaurants(filters, render);
  } else {
    this.getAllRestaurants(render);
  }
};

FireEats.prototype.viewSetup = function() {
  const headerEl = this.renderTemplate("header-base", {
    hasSectionHeader: false
  });

  const config = this.getFirebaseConfig();
  config.add_mock_data = () => {
    this.addMockRestaurants();
  };
  const placeholderEl = this.renderTemplate("placeholder-config", config);

  this.replaceElement(document.querySelector(".header"), headerEl);
  this.replaceElement(document.querySelector("main"), placeholderEl);

  firebase
    .firestore()
    .collection("restaurants")
    .limit(1)
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        this.router.navigate("/");
      }
    });
};

FireEats.prototype.initReviewDialog = function() {
  const dialog = document.querySelector("#dialog-add-review");
  let rating = 0;

  dialog.querySelectorAll(".star-input i").forEach(el => {
    const rate = () => {
      let after = false;
      rating = 0;
      [].slice.call(el.parentNode.children).forEach(child => {
        if (!after) {
          rating++;
          child.innerText = "star";
        } else {
          child.innerText = "star_border";
        }
        after = after || child.isSameNode(el);
      });
    };
    el.addEventListener("mouseover", rate);
  });

  dialog.querySelector(".close").addEventListener("click", () => {
    dialog.close();
  });

  dialog.querySelector(".submit").addEventListener("click", () => {
    let pathname = this.getCleanPath(document.location.pathname);
    let id = pathname.split("/")[2];

    this.addReview(id, {
      rating,
      text: dialog.querySelector("#text").value,
      userName: "Anonymous (Web)",
      timestamp: new Date(),
      userId: firebase.auth().currentUser.uid
    }).then(() => {
      dialog.close();
    });
  });
};

FireEats.prototype.initFilterDialog = function() {
  const dialogTemplate = this.renderTemplate("dialog-filter", this.data);
  this.replaceElement(document.querySelector(".dialogs"), dialogTemplate);

  const dialog = dialogTemplate.querySelector("dialog");

  dialog.querySelectorAll("li").forEach(el => {
    el.addEventListener("click", () => {
      dialog.querySelector("#" + el.parentNode.getAttribute("for")).value =
        el.innerText;
    });
  });

  dialog.querySelector(".search").addEventListener("click", () => {
    const filters = {
      category: dialog.querySelector("#category").value,
      city: dialog.querySelector("#city").value,
      price: dialog.querySelector("#max_price").value,
      sort: dialog.querySelector("#sort").value
    };

    let query_description = "";

    if (filters.category != "Any") {
      query_description += `${filters.category} places`;
    } else {
      query_description += "any restaraunt";
    }

    if (filters.city != "Any") {
      query_description += ` in ${filters.city}`;
    } else {
      query_description += " located  anywhere";
    }

    if (filters.price != "$$$$") {
      query_description += ` with a price below ${filters.price}`;
    } else {
      query_description += " with any price";
    }

    if (sort == "Rating") {
      query_description += " sorted by rating";
    } else if (sort == "Reviews") {
      query_description += " sorted by # of reviews";
    }

    this.viewList(filters, query_description);
    dialog.close();
  });
};

FireEats.prototype.viewLocation = function(id) {
  let sectionHeaderEl;
  return this.getRestaurant(id)
    .then(doc => {
      const data = doc.data();
      const dialog = document.querySelector("#dialog-add-review");

      data.showAddReview = () => {
        dialog.showModal();
      };

      sectionHeaderEl = this.renderTemplate("restaurant-header", data);
      sectionHeaderEl
        .querySelector(".rating")
        .append(this.renderRating(data.averageRating));

      sectionHeaderEl
        .querySelector(".price")
        .append(this.renderPrice(data.price));
      return doc.ref.collection("ratings").get();
    })
    .then(ratings => {
      const mainEl = this.renderTemplate("generic-main");

      ratings.forEach(rating => {
        const data = rating.data();
        const el = this.renderTemplate("review-card", data);
        el.querySelector(".rating").append(this.renderRating(data.rating));
        mainEl.querySelector("#cards").append(el);
      });

      const headerEl = this.renderTemplate("header-base", {
        hasSectionHeader: true
      });

      this.replaceElement(document.querySelector(".header"), headerEl);
      this.replaceElement(
        document.querySelector("#section-header"),
        sectionHeaderEl
      );
      this.replaceElement(document.querySelector("main"), mainEl);
    })
    .then(() => {
      this.router.updatePageLinks();
    })
    .catch(err => {
      console.warn("Error rendering page", err);
    });
};

FireEats.prototype.renderTemplate = function(id, data) {
  const template = this.templates[id];
  const el = template.cloneNode(true);

  el
    .querySelectorAll("[data-upgraded], .is-upgraded, .is-dirty")
    .forEach(el => {
      el.classList.remove("is-upgraded");
      el.classList.remove("is-dirty");
      el.removeAttribute("data-upgraded");
      componentHandler.downgradeElements(el);
    });

  el.removeAttribute("hidden");
  this.render(el, data);
  return el;
};

FireEats.prototype.render = function(el, data) {
  if (!data) return;

  const modifiers = {
    "data-fir-foreach": tel => {
      const field = tel.getAttribute("data-fir-foreach");
      const values = this.getDeepItem(data, field);

      values.forEach((value, index) => {
        const cloneTel = tel.cloneNode(true);
        tel.parentNode.append(cloneTel);

        Object.keys(modifiers).forEach(selector => {
          const children = Array.prototype.slice.call(
            cloneTel.querySelectorAll(`[${selector}]`)
          );
          children.push(cloneTel);
          children.forEach(childEl => {
            const currentVal = childEl.getAttribute(selector);

            if (!currentVal) return;
            childEl.setAttribute(
              selector,
              currentVal.replace("~", `${field}/${index}`)
            );
          });
        });
      });

      tel.parentNode.removeChild(tel);
    },
    "data-fir-content": tel => {
      const field = tel.getAttribute("data-fir-content");
      tel.innerText = this.getDeepItem(data, field);
    },
    "data-fir-click": tel => {
      tel.addEventListener("click", () => {
        const field = tel.getAttribute("data-fir-click");
        this.getDeepItem(data, field)();
      });
    },
    "data-fir-if": tel => {
      const field = tel.getAttribute("data-fir-if");
      if (!this.getDeepItem(data, field)) {
        tel.style.display = "none";
      }
    },
    "data-fir-attr": tel => {
      const chunks = tel.getAttribute("data-fir-attr").split(":");
      const attr = chunks[0];
      const field = chunks[1];
      tel.setAttribute(attr, this.getDeepItem(data, field));
    },
    "data-fir-style": tel => {
      const chunks = tel.getAttribute("data-fir-style").split(":");
      const attr = chunks[0];
      const field = chunks[1];
      let value = this.getDeepItem(data, field);

      if (attr.toLowerCase() == "backgroundimage") {
        value = `url(${value})`;
      }
      tel.style[attr] = value;
    }
  };

  const preModifiers = ["data-fir-foreach"];

  preModifiers.forEach(selector => {
    const modifier = modifiers[selector];
    this.useModifier(el, selector, modifier);
  });

  Object.keys(modifiers).forEach(selector => {
    if (preModifiers.indexOf(selector) != -1) return;

    const modifier = modifiers[selector];
    this.useModifier(el, selector, modifier);
  });
};

FireEats.prototype.useModifier = function(el, selector, modifier) {
  el.querySelectorAll(`[${selector}]`).forEach(modifier);
};

FireEats.prototype.getDeepItem = function(obj, path) {
  path.split("/").forEach(chunk => {
    obj = obj[chunk];
  });
  return obj;
};

FireEats.prototype.renderRating = function(rating) {
  const el = this.renderTemplate("rating", {});
  for (let r = 0; r < 5; r += 1) {
    let star;
    if (r < Math.floor(rating)) {
      star = this.renderTemplate("star-icon", {});
    } else {
      star = this.renderTemplate("star-border-icon", {});
    }
    el.append(star);
  }
  return el;
};

FireEats.prototype.renderPrice = function(price) {
  const el = this.renderTemplate("price", {});
  for (let r = 0; r < price; r += 1) {
    el.append("$");
  }
  return el;
};

FireEats.prototype.replaceElement = function(parent, content) {
  parent.innerHTML = "";
  parent.append(content);
};
