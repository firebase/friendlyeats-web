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

export class View {
  constructor({ friendlyEats, data, router, dialogs, auth, mock }) {
    this.friendlyEats = friendlyEats;
    this.data = data;
    this.auth = auth;
    this.router = router;
    this.dialogs = dialogs;
    this.mock = mock;
    this.initTemplates();
  }

  initTemplates() {
    this.templates = {};
    document.querySelectorAll(".template").forEach(el => {
      this.templates[el.getAttribute("id")] = el;
    });
  }

  viewHome() {
    this.data.getAllRestaurants();
  }

  viewList(filters, filter_description) {
    if (!filter_description) {
      filter_description = "any type of food with any price in any city.";
    }

    let mainEl = this.renderTemplate("main-adjusted");
    let headerEl = this.renderTemplate("header-base", {
      hasSectionHeader: true
    });

    this.replaceElement(
      headerEl.querySelector("#section-header"),
      this.renderTemplate("filter-display", {
        filter_description: filter_description
      })
    );

    this.replaceElement(document.querySelector(".header"), headerEl);
    this.replaceElement(document.querySelector("main"), mainEl);

    headerEl.querySelector("#show-filters").addEventListener("click", () => {
      this.dialogs.filter.show();
    });

    let renderer = {
      remove: function(doc) {
        let locationCardToDelete = mainEl.querySelector("#doc-" + doc.id);
        if (locationCardToDelete) {
          mainEl
            .querySelector("#cards")
            .removeChild(locationCardToDelete.parentNode);
        }

        return;
      }.bind(this),
      display: function(doc) {
        let data = doc.data();
        data[".id"] = doc.id;
        data["go_to_restaurant"] = () => {
          this.router.navigate("/restaurants/" + doc.id);
        };

        let el = this.renderTemplate("restaurant-card", data);
        el.querySelector(".rating").append(this.renderRating(data.avgRating));
        el.querySelector(".price").append(this.renderPrice(data.price));
        // Setting the id allows to locating the individual restaurant card
        el.querySelector(".location-card").id = "doc-" + doc.id;

        let existingLocationCard = mainEl.querySelector("#doc-" + doc.id);
        if (existingLocationCard) {
          // modify
          existingLocationCard.parentNode.before(el);
          mainEl
            .querySelector("#cards")
            .removeChild(existingLocationCard.parentNode);
        } else {
          // add
          mainEl.querySelector("#cards").append(el);
        }
      }.bind(this),
      empty: function() {
        let headerEl = this.renderTemplate("header-base", {
          hasSectionHeader: true
        });

        let noResultsEl = this.renderTemplate("no-results");

        this.replaceElement(
          headerEl.querySelector("#section-header"),
          this.renderTemplate("filter-display", {
            filter_description: filter_description
          })
        );

        headerEl
          .querySelector("#show-filters")
          .addEventListener("click", () => {
            this.dialogs.filter.show();
          });

        this.replaceElement(document.querySelector(".header"), headerEl);
        this.replaceElement(document.querySelector("main"), noResultsEl);
        return;
      }.bind(this)
    };

    if (
      filters.city ||
      filters.category ||
      filters.price ||
      filters.sort !== "Rating"
    ) {
      this.data.getFilteredRestaurants(
        {
          city: filters.city || "Any",
          category: filters.category || "Any",
          price: filters.price || "Any",
          sort: filters.sort
        },
        renderer
      );
    } else {
      this.data.getAllRestaurants(renderer);
    }

    let toolbar = mdc.toolbar.MDCToolbar.attachTo(
      document.querySelector(".mdc-toolbar")
    );
    toolbar.fixedAdjustElement = document.querySelector(
      ".mdc-toolbar-fixed-adjust"
    );

    mdc.autoInit();
  }

  viewSetup() {
    let headerEl = this.renderTemplate("header-base", {
      hasSectionHeader: false
    });

    let config = this.friendlyEats.getFirebaseConfig();
    let noRestaurantsEl = this.renderTemplate("no-restaurants", config);

    let button = noRestaurantsEl.querySelector("#add_mock_data");
    let addingMockData = false;

    button.addEventListener("click", event => {
      if (addingMockData) {
        return;
      }
      addingMockData = true;

      event.target.style.opacity = "0.4";
      event.target.innerText = "Please wait...";

      this.mock.addMockRestaurants().then(() => {
        this.rerender();
      });
    });

    this.replaceElement(document.querySelector(".header"), headerEl);
    this.replaceElement(document.querySelector("main"), noRestaurantsEl);

    this.data.checkForEmpty(snapshot => {
      if (snapshot.size && !addingMockData) {
        this.router.navigate("/");
      }
    });
  }

  initReviewDialog() {
    let dialog = document.querySelector("#dialog-add-review");
    this.dialogs.add_review = new mdc.dialog.MDCDialog(dialog);

    this.dialogs.add_review.listen("MDCDialog:accept", () => {
      let pathname = this.friendlyEats.getCleanPath(document.location.pathname);
      let id = pathname.split("/")[2];

      this.data
        .addRating(id, {
          rating: rating,
          text: dialog.querySelector("#text").value,
          userName: "Anonymous (Web)",
          timestamp: new Date(),
          userId: this.auth.getUser().uid
        })
        .then(() => {
          this.rerender();
        });
    });

    let rating = 0;

    dialog.querySelectorAll(".star-input i").forEach(el => {
      let rate = () => {
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
  }

  initFilterDialog() {
    this.filters = {};
    // TODO: Reset filter dialog to init state on close.
    this.dialogs.filter = new mdc.dialog.MDCDialog(
      document.querySelector("#dialog-filter-all")
    );

    this.dialogs.filter.listen("MDCDialog:accept", () => {
      this.updateQuery(this.filters);
    });

    let dialog = document.querySelector("aside");
    let pages = dialog.querySelectorAll(".page");

    this.replaceElement(
      dialog.querySelector("#category-list"),
      this.renderTemplate("item-list", {
        items: ["Any"].concat(this.friendlyEats.mockData.categories)
      })
    );

    this.replaceElement(
      dialog.querySelector("#city-list"),
      this.renderTemplate("item-list", {
        items: ["Any"].concat(this.friendlyEats.mockData.cities)
      })
    );

    let renderAllList = () => {
      this.replaceElement(
        dialog.querySelector("#all-filters-list"),
        this.renderTemplate("all-filters-list", this.filters)
      );

      dialog.querySelectorAll("#page-all .mdc-list-item").forEach(el => {
        el.addEventListener("click", () => {
          let id = el.id
            .split("-")
            .slice(1)
            .join("-");
          displaySection(id);
        });
      });
    };

    let displaySection = id => {
      if (id === "page-all") {
        renderAllList();
      }

      pages.forEach(sel => {
        if (sel.id === id) {
          sel.style.display = "block";
        } else {
          sel.style.display = "none";
        }
      });
    };

    pages.forEach(sel => {
      let type = sel.id.split("-")[1];
      if (type === "all") {
        return;
      }

      sel.querySelectorAll(".mdc-list-item").forEach(el => {
        el.addEventListener("click", () => {
          this.filters[type] =
            el.innerText.trim() === "Any" ? "" : el.innerText.trim();
          displaySection("page-all");
        });
      });
    });

    displaySection("page-all");
    dialog.querySelectorAll(".back").forEach(el => {
      el.addEventListener("click", () => {
        displaySection("page-all");
      });
    });
  }

  updateQuery(filters) {
    let query_description = "";

    if (filters.category !== "") {
      query_description += filters.category + " places";
    } else {
      query_description += "any restaurant";
    }

    if (filters.city !== "") {
      query_description += " in " + filters.city;
    } else {
      query_description += " located anywhere";
    }

    if (filters.price !== "") {
      query_description += " with a price of " + filters.price;
    } else {
      query_description += " with any price";
    }

    if (filters.sort === "Rating") {
      query_description += " sorted by rating";
    } else if (filters.sort === "Reviews") {
      query_description += " sorted by # of reviews";
    }

    this.viewList(filters, query_description);
  }

  viewRestaurant(id) {
    let sectionHeaderEl;

    return this.data.getRestaurant(id)
      .then(doc => {
        let data = doc.data();
        let dialog = this.dialogs.add_review;

        data.show_add_review = () => {
          // Reset the state before showing the dialog
          dialog.root_.querySelector("#text").value = "";
          dialog.root_.querySelectorAll(".star-input i").forEach(el => {
            el.innerText = "star_border";
          });

          dialog.show();
        };

        sectionHeaderEl = this.renderTemplate("restaurant-header", data);
        sectionHeaderEl
          .querySelector(".rating")
          .append(this.renderRating(data.avgRating));

        sectionHeaderEl
          .querySelector(".price")
          .append(this.renderPrice(data.price));
        return this.data.getRestaurantRatings(doc);
      })
      .then(ratings => {
        let mainEl;

        if (ratings.size) {
          mainEl = this.renderTemplate("main");

          ratings.forEach(rating => {
            let data = rating.data();
            let el = this.renderTemplate("review-card", data);
            el.querySelector(".rating").append(this.renderRating(data.rating));
            mainEl.querySelector("#cards").append(el);
          });
        } else {
          mainEl = this.renderTemplate("no-ratings", {
            add_mock_data: () => {
              this.mock.addMockRatings(id).then(() => {
                this.rerender();
              });
            }
          });
        }

        let headerEl = this.renderTemplate("header-base", {
          hasSectionHeader: true
        });

        this.replaceElement(document.querySelector(".header"), sectionHeaderEl);
        this.replaceElement(document.querySelector("main"), mainEl);
      })
      .then(() => {
        this.router.updatePageLinks();
      })
      .catch(err => {
        console.warn("Error rendering page", err);
      });
  }

  renderTemplate(id, data) {
    let template = this.templates[id];
    let el = template.cloneNode(true);
    el.removeAttribute("hidden");
    this.render(el, data);
    return el;
  }

  render(el, data) {
    if (!data) {
      return;
    }

    let modifiers = {
      "data-fir-foreach": tel => {
        let field = tel.getAttribute("data-fir-foreach");
        let values = this.getDeepItem(data, field);

        values.forEach((value, index) => {
          let cloneTel = tel.cloneNode(true);
          tel.parentNode.append(cloneTel);

          Object.keys(modifiers).forEach(selector => {
            let children = Array.prototype.slice.call(
              cloneTel.querySelectorAll("[" + selector + "]")
            );
            children.push(cloneTel);
            children.forEach(childEl => {
              let currentVal = childEl.getAttribute(selector);

              if (!currentVal) {
                return;
              }
              childEl.setAttribute(
                selector,
                currentVal.replace("~", field + "/" + index)
              );
            });
          });
        });

        tel.parentNode.removeChild(tel);
      },
      "data-fir-content": tel => {
        let field = tel.getAttribute("data-fir-content");
        const content = this.getDeepItem(data, field);
        if (content != undefined) tel.innerText = content;
      },
      "data-fir-click": tel => {
        tel.addEventListener("click", () => {
          let field = tel.getAttribute("data-fir-click");
          this.getDeepItem(data, field)();
        });
      },
      "data-fir-if": tel => {
        let field = tel.getAttribute("data-fir-if");
        if (!this.getDeepItem(data, field)) {
          tel.style.display = "none";
        }
      },
      "data-fir-if-not": tel => {
        let field = tel.getAttribute("data-fir-if-not");
        if (this.getDeepItem(data, field)) {
          tel.style.display = "none";
        }
      },
      "data-fir-attr": tel => {
        let chunks = tel.getAttribute("data-fir-attr").split(":");
        let attr = chunks[0];
        let field = chunks[1];
        tel.setAttribute(attr, this.getDeepItem(data, field));
      },
      "data-fir-style": tel => {
        let chunks = tel.getAttribute("data-fir-style").split(":");
        let attr = chunks[0];
        let field = chunks[1];
        let value = this.getDeepItem(data, field);

        if (attr.toLowerCase() === "backgroundimage") {
          value = "url(" + value + ")";
        }
        tel.style[attr] = value;
      }
    };

    let preModifiers = ["data-fir-foreach"];

    preModifiers.forEach(selector => {
      let modifier = modifiers[selector];
      this.useModifier(el, selector, modifier);
    });

    Object.keys(modifiers).forEach(selector => {
      if (preModifiers.indexOf(selector) !== -1) {
        return;
      }

      let modifier = modifiers[selector];
      this.useModifier(el, selector, modifier);
    });
  }

  useModifier(el, selector, modifier) {
    el.querySelectorAll("[" + selector + "]").forEach(modifier);
  }

  getDeepItem(obj, path) {
    path.split("/").forEach(chunk => {
      obj = obj[chunk];
    });
    return obj;
  }

  renderRating(rating) {
    let el = this.renderTemplate("rating", {});
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
  }

  renderPrice(price) {
    let el = this.renderTemplate("price", {});
    for (let r = 0; r < price; r += 1) {
      el.append("$");
    }
    return el;
  }

  replaceElement(parent, content) {
    parent.innerHTML = "";
    parent.append(content);
  }

  rerender() {
    this.router.navigate(
      document.location.pathname + "?" + new Date().getTime()
    );
  }
}
