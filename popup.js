"use strict";
/// <reference types="chrome" />

import { storage } from "./storage.js";

window._storage = storage;

/** @returns {Promise<number | null>} */
async function getActiveTabId() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.id ?? null;
}

/** @returns {Promise<URL | null>} */
async function getActiveTabURL() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.url ? new URL(tabs[0]?.url) : null;
}

/**
 * @param {string} hostname
 * @returns {Promise<boolean>}
 */
async function isScrollEnabledFor(hostname) {
  return (await storage.get(hostname))?.scrollEnabled ?? false;
}

["select-prev", "select-next", "cancel"].forEach((id) => {
  document.getElementById(id).onclick = async () => {
    const activeTabId = await getActiveTabId();
    if (!activeTabId) return;
    chrome.tabs.sendMessage(activeTabId, id);
  };
});
document.getElementById("settings").onclick = () => {
  chrome.runtime.openOptionsPage();
};
const updateScrollToggle = () =>
  getActiveTabURL().then(async (url) => {
    const scrollHelperToggle = document.getElementById("scroll-helper");
    const text = (await isScrollEnabledFor(url.hostname)) ? "Disable" : "Enable";
    scrollHelperToggle.textContent = `${text} scroll`;
    const onclick = async () => {
      // prevent double toggle
      scrollHelperToggle.onclick = () => {};
      if (await isScrollEnabledFor(url.hostname)) {
        await storage.setIn([url.hostname, "scrollEnabled"], false);
      } else {
        await storage.setIn([url.hostname, "scrollEnabled"], true);
      }
      scrollHelperToggle.onclick = onclick;
    };
    scrollHelperToggle.onclick = onclick;
  });

storage.subscribe(null, (prev, current) => {
  updateScrollToggle();
});
updateScrollToggle();
