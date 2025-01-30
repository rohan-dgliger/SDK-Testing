(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DataFetcherSDK = {}));
})(this, (function (exports) { 'use strict';

  class DataFetcher {
      constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
          throw new Error('Container element not found');
        }
        this.apiUrl = "https://jsonplaceholder.typicode.com/posts";
        this.dataDisplay = null;
        this.fetchButton = null;
      }
    
      init() {
        // Create button
        this.fetchButton = document.createElement("button");
        this.fetchButton.textContent = "Fetch Data";
        this.container.appendChild(this.fetchButton);
    
        // Create display container
        this.dataDisplay = document.createElement("div");
        this.container.appendChild(this.dataDisplay);
    
        // Add event listener
        this.fetchButton.addEventListener("click", () => this.fetchData());
      }
    
      async fetchData() {
        this.dataDisplay.innerHTML = "Loading...";
    
        try {
          const response = await fetch(this.apiUrl);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
    
          this.dataDisplay.innerHTML = data.slice(0, 5).map(item => `
          <p><strong>${item.title}</strong>: ${item.body}</p>
        `).join("");
    
        } catch (error) {
          this.dataDisplay.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
      }
    
      // Optional: Method to change API URL
      setApiUrl(newUrl) {
        this.apiUrl = newUrl;
      }
    }
    
    // Make it available globally when using via script tag
    if (typeof window !== 'undefined') {
      window.DataFetcher = DataFetcher;
    }

  exports.DataFetcher = DataFetcher;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
