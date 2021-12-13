"use strict";
/// <reference types="chrome" />

(async () => {
  /** @type {import("./storage")} */
  const { storage } = await import(chrome.runtime.getURL("storage.js"));

  const log = (...args) => console.log("[Ultimate Weeb]", ...args);

  /** @returns {string} */
  const generateSelector = (/** @type {HTMLElement} */ el) => {
    let { tagName, id, classList, parentElement } = el;
    let out = "";

    // if we have a valid ID, then use it directly, as IDs are unique
    if (id !== "" && id.match(/^[a-z].*/)) {
      out += `#${id}`;
      return out;
    }

    out += tagName;
    if (classList.length > 0) out += "." + [...classList.values()].map(v => v.replace(/:/g, "\\:")).join(".");
    if ((parentElement?.childElementCount ?? 0) > 1) {
      let childIndex = 1;
      let sib = el.previousElementSibling;
      while (sib) {
        childIndex++;
        sib = sib.previousElementSibling;
      }
      out += `:nth-child(${childIndex})`;
    }
    if (document.querySelectorAll(out).length === 1) return out;
    if (!parentElement) return out;

    return `${generateSelector(parentElement)} > ${out}`;
  }

  class UI {
    attached = false;

    constructor() {
      this.highlight = document.createElement("div");
      this.highlight.className = "uw-ext-highlight";

      window.addEventListener("mousemove", this.mousemove);
      window.addEventListener("click", this.click, {capture: true});
    }

    /** @type {HTMLElement | null} */
    currentTarget = null;
    mousemove = (evt) => {
      if (!this.attached) return;
      if (evt.target && this.currentTarget !== evt.target) {
        this.currentTarget = evt.target;
        const rect = this.currentTarget.getBoundingClientRect();
        this.highlight.style.left = `${rect.x}px`;
        this.highlight.style.top = `${rect.y}px`;
        this.highlight.style.width = `${rect.width}px`;
        this.highlight.style.height = `${rect.height}px`;
      }
    };
    click = (/** @type {MouseEvent} */ evt) => {
      if (!this.attached || !this.currentTarget) return;
      evt.stopImmediatePropagation();
      evt.preventDefault();
      this.onSelectorUpdated(generateSelector(this.currentTarget));
      this.hide();
    };

    onSelectorUpdated = () => { };

    show() {
      if (this.attached) return;
      document.body.appendChild(this.highlight);
      this.attached = true;
    }

    hide() {
      this.highlight.remove();
      this.attached = false;
    }
  }

  let options = (await storage.get(window.location.hostname)) ?? {};

  window.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowLeft":
        if (options.previous) {
          e.preventDefault();
        }
        break;
      case "ArrowRight":
        if (options.next) {
          e.preventDefault();
        }
        break;
      case "ArrowUp":
        if (options.scrollEnabled) {
          e.preventDefault();
        }
        break;
      case "ArrowDown":
        if (options.scrollEnabled) {
          e.preventDefault();
        }
        break;
    }
  });
  window.addEventListener("keyup", (e) => {
    switch (e.code) {
      case "ArrowLeft":
        if (options.previous) {
          e.preventDefault();
          document.querySelector(options.previous)?.click();
        }
        break;
      case "ArrowRight":
        if (options.next) {
          e.preventDefault();
          document.querySelector(options.next)?.click();
        }
        break;
      case "ArrowUp":
        if (options.scrollEnabled) {
          e.preventDefault();
          window.scrollBy(0, -window.innerHeight / 2);
        }
        break;
      case "ArrowDown":
        if (options.scrollEnabled) {
          e.preventDefault();
          window.scrollBy(0, window.innerHeight / 2);
        }
        break;
    }
  });

  storage.subscribe(window.location.hostname, (_, current) => (options = current));

  const setPrev = (value) => {
    storage.set(window.location.hostname, { previous: value, next: options.next });
  };
  const setNext = (value) => {
    storage.set(window.location.hostname, { previous: options.previous, next: value });
  };

  const ui = new UI();
  chrome.runtime.onMessage.addListener((message) => {
    switch (message) {
      case "select-prev":
        ui.onSelectorUpdated = setPrev;
        ui.show();
        break;
      case "select-next":
        ui.onSelectorUpdated = setNext;
        ui.show();
        break;
      case "cancel":
        ui.hide();
        break;
    }
  });

  log("Loaded");
})();
