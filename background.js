"use strict";
/// <reference types="chrome" />

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^https?/.test(tab.url ?? "")) {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["foreground.js"]
    });
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: ["foreground.css"]
    });
  }
});
