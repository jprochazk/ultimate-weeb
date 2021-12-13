"use strict";
/// <reference types="chrome" />

chrome.scripting.registerContentScripts(
  [{
    id: "foreground",
    js: ["foreground.js"],
    css: ["foreground.css"],
    matches: ["https://*/*", "http://*/*"],
    runAt: "document_start"
  }]
)

/* chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
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
}); */
