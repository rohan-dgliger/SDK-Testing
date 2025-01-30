(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DocumentInputSDK = {}));
})(this, (function (exports) { 'use strict';

    class DocumentInputSDK {
        constructor(options) {
            this.options = options || {};
            this.initialize();
        }

        initialize() {
            // Create Popup Container
            this.popupContainer = document.createElement('div');
            this.popupContainer.id = 'document-input-popup';
            this.popupContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 20px;
            z-index: 1000;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
            border-radius: 5px;
        `;
            document.body.appendChild(this.popupContainer);

            // Close Button
            const closeButton = document.createElement('span');
            closeButton.textContent = '×';
            closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 20px;
            cursor: pointer;
            color: #888;
        `;
            closeButton.onclick = () => this.closePopup();
            this.popupContainer.appendChild(closeButton);

            // Form Elements (Inside Popup)
            const title = document.createElement('h2');
            title.textContent = 'Document Input';
            this.popupContainer.appendChild(title);

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

            this.popupContainer.appendChild(radioGroup);

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

            this.popupContainer.appendChild(inputArea);

            // CSS
            const style = document.createElement('style');
            style.textContent = `
            #document-input-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff;
                border: 1px solid #ccc;
                padding: 20px;
                z-index: 1000;
                box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
                border-radius: 5px;
            }
            #document-input-popup .radio-group { margin-bottom: 20px; }
            #document-input-popup label { display: inline-block; margin-right: 15px; }
            #document-input-popup #input-area { margin-bottom: 20px; }
            #document-input-popup #input-label { display: block; margin-bottom: 5px; }
            #document-input-popup #doc-number { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 3px; box-sizing: border-box;}
            #document-input-popup #error-message { color: red; font-size: 12px; margin-top: 5px; }
            #document-input-popup button { padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; }
            #document-input-popup button:hover { background-color: #45a049; }
            #document-input-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 999;
            }
        `;
            document.head.appendChild(style);

            // Element References
            this.aadhaarRadio = document.getElementById('aadhaar');
            this.panRadio = document.getElementById('pan');
            this.inputArea = document.getElementById('input-area');
            this.inputLabel = document.getElementById('input-label');
            this.docNumberInput = document.getElementById('doc-number');
            this.errorMessage = document.getElementById('error-message');

            // Event Listeners
            this.aadhaarRadio.addEventListener('click', () => this.toggleInput());
            this.panRadio.addEventListener('click', () => this.toggleInput());
            submitButton.addEventListener('click', () => this.validate());

            // Overlay
            this.overlay = document.createElement('div');
            this.overlay.id = 'document-input-overlay';
            document.body.appendChild(this.overlay);
        }

        closePopup() {
            document.body.removeChild(this.popupContainer);
            document.body.removeChild(this.overlay);
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
            return true;
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

        const sdk = new DocumentInputSDK({
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

        sdk.openPopup = () => {
            document.body.appendChild(sdk.popupContainer);
            document.body.appendChild(sdk.overlay);
        };

        window.DocumentInputSDK = DocumentInputSDK;
    })();

    window.DocumentInputSDK = DocumentInputSDK;

    exports.DocumentInputSDK = DocumentInputSDK;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
