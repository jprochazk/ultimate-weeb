"use strict";
/// <reference types="chrome" />

export const storage = {
  /**
   * @param {string | null} key
   * @returns {any}
   */
  get: (key) =>
    new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (items) => {
        if (key === null) resolve(items);
        return items[key] ? resolve(items[key]) : resolve();
      });
    }),
  /**
   * @param {string} key
   * @param {any} value
   */
  set: (key, value) =>
    new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => resolve());
    }),
  remove: (key) =>
    new Promise((resolve) => {
      chrome.storage.local.remove(key, () => resolve());
    }),
  /**
   * @param {string | null} key
   * @param {(oldValue: any, newValue: any)} callback
   */
  subscribe: (key, callback) => {
    chrome.storage.onChanged.addListener((changes, type) => {
      if (type !== "local") return;

      if (key === null) callback(changes);
      else if (Boolean(changes[key])) callback(changes[key].oldValue, changes[key].newValue);
    });
  }
};
