"use strict";
/// <reference types="chrome" />

import { storage } from "./storage.js";

(async () => {
  async function updateTable() {
    const selectors = (await storage.get(null)) ?? {};
    const rowTemplate = (site, prev, next) => `
    <tr>
      <td>${site}</td>
      <td>${prev}</td>
      <td>${next}</td>
      <td><button class="btn-clear" type="button">❌</button></td>
    </tr>
    `;
    const tableBody = document.getElementById("selectors-table");
    tableBody.innerHTML = "";
    for (const [key, { previous, next }] of Object.entries(selectors)) {
      tableBody.innerHTML += rowTemplate(key, previous, next);
      tableBody.lastElementChild.querySelector("button").onclick = () => {
        storage.remove(key);
      };
    }
  }

  storage.subscribe(null, (prev, current) => {
    console.log(prev, current);
    updateTable();
  });
  updateTable();
})();
