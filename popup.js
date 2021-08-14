"use strict";
/// <reference types="chrome" />

import { storage } from "./storage.js";

/** @returns {Promise<number | undefined>} */
async function getActiveTabId() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.id;
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
