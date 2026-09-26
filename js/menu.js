/* =========================================================
   MENU PAGE — dynamic render, search & category filter
   ========================================================= */
(function () {
  "use strict";
  if (typeof MENU_DATA === "undefined") return;

  const wrap = document.getElementById("menuCategories");
  const chipsWrap = document.getElementById("menuChips");
  const searchInput = document.getElementById("menuSearch");
  const searchClear = document.getElementById("menuSearchClear");
  const searchField = document.getElementById("menuSearchField");
  const emptyState = document.getElementById("menuEmpty");

  const iconClass = (icon) => {
    const map = {
      "cup-soda": "fa-glass-water", "soup": "fa-bowl-food", "drumstick": "fa-drumstick-bite",
      "salad": "fa-bowl-food", "pizza": "fa-pizza-slice", "flame": "fa-fire",
      "chef-hat": "fa-utensils", "utensils": "fa-utensils", "circle-dot": "fa-circle-dot",
      "square": "fa-cheese", "leaf": "fa-leaf", "nut": "fa-seedling", "bowl": "fa-bowl-rice",
      "flame-kindling": "fa-fire-burner", "wheat": "fa-wheat-awn", "sandwich": "fa-bacon",
      "cookie": "fa-cookie-bite", "glass-water": "fa-mug-hot", "ice-cream-cone": "fa-ice-cream",
      "cake-slice": "fa-cake-candles", "utensils-crossed": "fa-utensils", "package": "fa-box"
    };
    return map[icon] || "fa-utensils";
  };

  /* Render all categories */
  function render() {
    const frag = document.createDocumentFragment();

    MENU_DATA.forEach((cat, ci) => {
      const isCombo = cat.items.every((it) => it.is_combo);
      const section = document.createElement("div");
      section.className = "menu-category";
      section.dataset.category = cat.category;
      if (ci === 0) section.classList.add("is-open");

      const head = document.createElement("div");
      head.className = "menu-category-head";
      head.innerHTML = `
        <span class="mc-icon"><i class="fas ${iconClass(cat.icon)}"></i></span>
        <h3>${cat.category}</h3>
        <span class="mc-count">${cat.items.length} item${cat.items.length > 1 ? "s" : ""}</span>
        <i class="fas fa-chevron-down mc-chevron"></i>
      `;
      head.addEventListener("click", () => section.classList.toggle("is-open"));
      section.appendChild(head);

      const body = document.createElement("div");
      body.className = "menu-category-body";

      if (isCombo) {
        const grid = document.createElement("div");
        grid.className = "combo-grid";
        cat.items.forEach((it) => {
          const card = document.createElement("div");
          card.className = "combo-card";
          card.innerHTML = `
            <span class="price-tag">₹${it.price}</span>
            <span class="gst">${it.meta}</span>
            <p>${it.desc || ""}</p>
          `;
          grid.appendChild(card);
        });
        body.appendChild(grid);
      } else {
        const grid = document.createElement("div");
        grid.className = "menu-items";
        cat.items.forEach((it) => {
          const row = document.createElement("div");
          row.className = "menu-item";
          row.dataset.name = it.name.toLowerCase();
          row.innerHTML = `
            <span class="menu-item-name"><span class="veg-dot" aria-hidden="true"></span>${it.name} <span class="menu-item-meta">${it.meta || ""}</span></span>
            <span class="menu-item-price">₹${it.price}</span>
          `;
          grid.appendChild(row);
        });
        body.appendChild(grid);
      }

      section.appendChild(body);
      frag.appendChild(section);
    });

    wrap.appendChild(frag);
  }

  /* Render category filter chips */
  function renderChips() {
    const allChip = document.createElement("button");
    allChip.type = "button";
    allChip.className = "filter-chip is-active";
    allChip.textContent = "All Categories";
    allChip.dataset.filter = "all";
    chipsWrap.appendChild(allChip);

    MENU_DATA.forEach((cat) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "filter-chip";
      chip.textContent = cat.category;
      chip.dataset.filter = cat.category;
      chipsWrap.appendChild(chip);
    });

    chipsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;
      chipsWrap.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      document.querySelectorAll(".menu-category").forEach((sec) => {
        const show = filter === "all" || sec.dataset.category === filter;
        sec.classList.toggle("is-hidden", !show);
        if (show) sec.classList.add("is-open");
      });
      if (filter !== "all") {
        document.querySelector(`.menu-category[data-category="${CSS.escape(filter)}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* Live search across item names */
  function highlight(el, term) {
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    if (!term) { el.textContent = original; return; }
    const re = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
    el.innerHTML = original.replace(re, "<mark>$1</mark>");
  }

  function runSearch() {
    const term = searchInput.value.trim().toLowerCase();
    searchField.classList.toggle("has-value", term.length > 0);

    if (!term) {
      document.querySelectorAll(".menu-item").forEach((it) => {
        it.classList.remove("is-filtered-out");
        const nameEl = it.querySelector(".menu-item-name");
        if (nameEl.dataset.original) nameEl.innerHTML = nameEl.dataset.original;
      });
      document.querySelectorAll(".menu-category").forEach((sec) => {
        sec.classList.remove("is-hidden");
      });
      chipsWrap.querySelectorAll(".filter-chip").forEach((c, i) => c.classList.toggle("is-active", i === 0));
      emptyState.classList.remove("is-visible");
      return;
    }

    let anyVisible = false;
    document.querySelectorAll(".menu-category").forEach((sec) => {
      const items = sec.querySelectorAll(".menu-item");
      if (!items.length) {
        // combo-only categories (Fix Lunch, Pack Lunch, etc.) have no searchable item rows
        sec.classList.add("is-hidden");
        return;
      }
      let sectionHasMatch = false;
      items.forEach((it) => {
        const match = it.dataset.name.includes(term);
        it.classList.toggle("is-filtered-out", !match);
        const nameEl = it.querySelector(".menu-item-name");
        if (match) {
          highlight(nameEl, term);
          sectionHasMatch = true;
          anyVisible = true;
        }
      });
      sec.classList.toggle("is-hidden", !sectionHasMatch);
      if (sectionHasMatch) sec.classList.add("is-open");
    });

    emptyState.classList.toggle("is-visible", !anyVisible);
  }

  searchInput && searchInput.addEventListener("input", runSearch);
  searchClear && searchClear.addEventListener("click", () => {
    searchInput.value = "";
    runSearch();
    searchInput.focus();
  });

  render();
  renderChips();
})();
