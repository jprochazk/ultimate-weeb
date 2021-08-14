"use strict";
/// <reference types="chrome" />

(async () => {
  /** @type {import("./storage")} */
  const { storage } = await import(chrome.runtime.getURL("storage.js"));

  const log = (...args) => console.log("[Ultimate Weeb]", ...args);

  class UI {
    attached = false;

    constructor() {
      this.highlight = document.createElement("div");
      this.highlight.className = "uw-ext-highlight";

      window.addEventListener("mousemove", this.mousemove);
      window.addEventListener("click", this.click);
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
    click = (evt) => {
      if (!this.attached || !this.currentTarget) return;
      evt.stopPropagation();
      evt.preventDefault();
      // TODO: smarter selector generation?
      let selector = `${this.currentTarget.tagName}`;
      if (this.currentTarget.className)
        selector += `.${this.currentTarget.className.split(" ").join(".")}`;
      if (this.currentTarget.id) selector += `#${this.currentTarget.id}`;
      this.onSelectorUpdated(selector);
      this.hide();
    };

    onSelectorUpdated = () => {};

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

  let selectors = (await storage.get(window.location.hostname)) ?? {};

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" && selectors.previous) {
      document.querySelector(selectors.previous)?.click();
    }
    if (e.code === "ArrowRight" && selectors.next) {
      document.querySelector(selectors.next)?.click();
    }
  });

  storage.subscribe(window.location.hostname, (_, curr) => (selectors = curr));

  const setPrev = (value) => {
    storage.set(window.location.hostname, { previous: value, next: selectors.next });
  };
  const setNext = (value) => {
    storage.set(window.location.hostname, { previous: selectors.previous, next: value });
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
})();
