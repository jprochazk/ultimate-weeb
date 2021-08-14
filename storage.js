"use strict";
/// <reference types="chrome" />

// TODO: type safety (create "store" with specific layout)

/**
 * @param {any} object
 * @param {string[]} path
 * @param {any} value
 * @returns {any}
 */
function setDeep(object, path, value) {
  if (path.length === 0) throw new Error("Empty path");
  let pathIndex = 0;
  let node = object;
  while (node && pathIndex < path.length - 1) {
    node = node?.[path[pathIndex++]];
  }
  if (node) node[path[path.length - 1]] = value;
  return object;
}

export const storage = {
  /**
   * @param {string | null} key
   * @returns {Promise<any>}
   */
  get: (key) =>
    new Promise((resolve) => {
      chrome.storage.local.get(key, (items) => {
        if (key === null) resolve(items);
        return items[key] ? resolve(items[key]) : resolve();
      });
    }),
  /**
   * @param {string} key
   * @param {any} value
   * @returns {Promise<void>}
   */
  set: (key, value) =>
    new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => resolve());
    }),
  /**
   * @param {string[]} path
   * @param {any} value
   * @returns {Promise<void>}
   */
  setIn: (path, value) =>
    new Promise(async (resolve) => {
      console.log(path);
      const first = path.shift();
      const current = await storage.get(first);
      console.log("before", JSON.stringify(current));
      setDeep(current, path, value);
      console.log("after", JSON.stringify(current));
      storage.set(first, current);
    }),
  /**
   * @param {string} key
   * @returns {Promise<void>}
   */
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
