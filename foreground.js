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

  let options = (await storage.get(window.location.hostname)) ?? {};
  log(options);

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
})();
