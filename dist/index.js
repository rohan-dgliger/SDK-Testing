(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DataFetcherSDK = {}));
})(this, (function (exports) { 'use strict';

    // documentInputSDK.js (SDK file)

    class DocumentInputSDK {
        constructor(containerId) {
            this.containerId = containerId || document.body; // Default to body if no ID provided
            this.container = typeof this.containerId === 'string' ? document.getElementById(this.containerId) : this.containerId;
            if (!this.container) {
                throw new Error("Container element not found.");
            }
            this.initialize();
        }

        initialize() {
            // Create elements (same as before, but now this.container is used)
            this.container.innerHTML = ""; // Clear existing content in the container.

            const title = document.createElement('h2');
            title.textContent = 'Document Input';
            this.container.appendChild(title);

            const radioGroup = document.createElement('div');
            radioGroup.className = 'radio-group';
            // ... (rest of the element creation code - same as before, but use this.container.appendChild)

            const style = document.createElement('style');
            style.textContent = `
            .container { /* ... your CSS styles ... */ }
            /* ... other CSS styles ... */
        `;
            document.head.appendChild(style);

            // Store references to elements for easy access later
            this.aadhaarRadio = document.getElementById('aadhaar');
            this.panRadio = document.getElementById('pan');
            this.inputArea = document.getElementById('input-area');
            this.inputLabel = document.getElementById('input-label');
            this.docNumberInput = document.getElementById('doc-number');
            this.errorMessage = document.getElementById('error-message');

        }


        toggleInput() {
            this.errorMessage.textContent = ""; // Clear previous messages
            this.inputArea.style.display = 'block';

            if (this.aadhaarRadio.checked) {
                this.inputLabel.textContent = 'Aadhaar Number:';
                this.inputArea.setAttribute('data-type', 'aadhaar');
            } else if (this.panRadio.checked) {
                this.inputLabel.textContent = 'PAN Number:';
                this.inputArea.setAttribute('data-type', 'pan');
            }
        }

        validate() {
            const docType = document.querySelector('input[name="docType"]:checked')?.value; // Use optional chaining
            const docNumber = this.docNumberInput.value;
            this.errorMessage.textContent = "";

            if (!docType) {
                this.errorMessage.textContent = "Please select document type";
                return false;
            }

            if (docType === 'aadhaar') {
                if (!this.isValidAadhaar(docNumber)) {
                    this.errorMessage.textContent = "Invalid Aadhaar Number";
                    return false;
                }
            } else if (docType === 'pan') {
                if (!this.isValidPAN(docNumber)) {
                    this.errorMessage.textContent = "Invalid PAN Number";
                    return false;
                }
            }

            alert("Validation Successful!");
            return true;
        }

        isValidAadhaar(aadhaar) {
            return /^\d{12}$/.test(aadhaar);
        }

        isValidPAN(pan) {
            return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
        }
    }


    // Make the SDK available globally (or however you want to export it)
    window.DocumentInputSDK = DocumentInputSDK;

    exports.DocumentInputSDK = DocumentInputSDK;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
