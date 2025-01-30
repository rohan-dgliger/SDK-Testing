(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DocumentInputSDK = {}));
})(this, (function (exports) { 'use strict';

    class DocumentInputSDK {
        constructor(container, options) {
            this.container = container || document.body;
            this.options = options || {};
            this.initialize();
        }

        initialize() {
            this.container.innerHTML = ""; // Clear any existing content

            const title = document.createElement('h2');
            title.textContent = 'Document Input';
            this.container.appendChild(title);

            const radioGroup = document.createElement('div');
            radioGroup.className = 'radio-group';

            const aadhaarLabel = document.createElement('label');
            const aadhaarRadio = document.createElement('input');
            aadhaarRadio.type = 'radio';
            aadhaarRadio.name = 'docType';
            aadhaarRadio.id = 'aadhaar';
            aadhaarRadio.value = 'aadhaar';
            aadhaarLabel.appendChild(aadhaarRadio);
            aadhaarLabel.appendChild(document.createTextNode(' Aadhaar'));
            radioGroup.appendChild(aadhaarLabel);

            const panLabel = document.createElement('label');
            const panRadio = document.createElement('input');
            panRadio.type = 'radio';
            panRadio.name = 'docType';
            panRadio.id = 'pan';
            panRadio.value = 'pan';
            panLabel.appendChild(panRadio);
            panLabel.appendChild(document.createTextNode(' PAN'));
            radioGroup.appendChild(panLabel);

            this.container.appendChild(radioGroup);

            const inputArea = document.createElement('div');
            inputArea.id = 'input-area';
            inputArea.style.display = 'none';

            const inputLabel = document.createElement('label');
            inputLabel.id = 'input-label';
            inputLabel.htmlFor = 'doc-number';
            inputArea.appendChild(inputLabel);

            const docNumberInput = document.createElement('input');
            docNumberInput.type = 'text';
            docNumberInput.id = 'doc-number';
            docNumberInput.name = 'doc-number';
            docNumberInput.placeholder = 'Enter Number';
            inputArea.appendChild(docNumberInput);

            const errorMessage = document.createElement('span');
            errorMessage.id = 'error-message';
            inputArea.appendChild(errorMessage);
            inputArea.appendChild(document.createElement('br'));

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            inputArea.appendChild(submitButton);

            this.container.appendChild(inputArea);

            const style = document.createElement('style');
            style.textContent = `
            .container {
                width: 400px;
                margin: 50px auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #f9f9f9;
            }
            .radio-group {
                margin-bottom: 20px;
            }
            label {
                display: inline-block;
                margin-right: 15px;
            }
            #input-area {
                margin-bottom: 20px;
            }
            #input-label {
                display: block;
                margin-bottom: 5px;
            }
            #doc-number {
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 3px;
                box-sizing: border-box;
            }
            #error-message {
                color: red;
                font-size: 12px;
                margin-top: 5px;
            }
            button {
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }
            button:hover {
                background-color: #45a049;
            }
        `;
            document.head.appendChild(style);

            this.aadhaarRadio = document.getElementById('aadhaar');
            this.panRadio = document.getElementById('pan');
            this.inputArea = document.getElementById('input-area');
            this.inputLabel = document.getElementById('input-label');
            this.docNumberInput = document.getElementById('doc-number');
            this.errorMessage = document.getElementById('error-message');

            this.aadhaarRadio.addEventListener('click', () => this.toggleInput());
            this.panRadio.addEventListener('click', () => this.toggleInput());
            submitButton.addEventListener('click', () => this.validate());
        }

        toggleInput() {
            this.errorMessage.textContent = "";
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
            const docType = document.querySelector('input[name="docType"]:checked')?.value;
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

            if (this.options.onSuccess) {
                this.options.onSuccess(docNumber);
            } else {
                alert("Validation successful!");
            }
            return true; // Return true if validation successful
        }

        isValidAadhaar(aadhaar) {
            return /^\d{12}$/.test(aadhaar);
        }

        isValidPAN(pan) {
            return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
        }
    }

    // Self-Initialization Logic:
    (function() {
        const scripts = document.getElementsByTagName('script');
        const currentScript = scripts[scripts.length - 1];

        let container;
        const containerId = currentScript.getAttribute('data-container');

        if (containerId) {
            container = document.getElementById(containerId);
        } else {
            container = document.body;
        }

        if (container) {
            new DocumentInputSDK(container, {
                onSuccess: (docNumber) => {
                    const successCallback = currentScript.getAttribute('data-on-success');
                    if (typeof window[successCallback] === 'function') {
                        window[successCallback](docNumber);
                    } else {
                        console.log("Document number validated:", docNumber);
                    }
                },
                onError: (errorMessage) => {
                    const errorCallback = currentScript.getAttribute('data-on-error');
                    if (typeof window[errorCallback] === 'function') {
                        window[errorCallback](errorMessage);
                    } else {
                        console.error("Validation error:", errorMessage);
                    }
                },
            });
        } else {
            console.error("Container element not found.");
        }
    })();

    window.DocumentInputSDK = DocumentInputSDK;

    exports.DocumentInputSDK = DocumentInputSDK;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
