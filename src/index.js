// documentInputSDK.js (Self-Initializing SDK)

export class DocumentInputSDK {
    constructor(container, options) { // Accept container or options
        this.container = container || document.body; // Default to body
        this.options = options || {};
        this.initialize();
    }

    initialize() {
        // ... (All the code to create and append elements - same as before)

        // ... (Internal event handling - same as before)
    }

    // ... (toggleInput, validate, isValidAadhaar, isValidPAN - same as before)
}


// Self-Initialization Logic:
(function() {  // Immediately Invoked Function Expression (IIFE)
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1]; // Get the current script tag

    let container;
    const containerId = currentScript.getAttribute('data-container'); // Get container ID from data attribute

    if(containerId){
        container = document.getElementById(containerId);
    }
    else{
        container = document.body;
    }


    if (container) {
        const sdk = new DocumentInputSDK(container, {
            onSuccess: (docNumber) => {
                // You can access the configuration from HTML using data attributes
                const successCallback = currentScript.getAttribute('data-on-success');
                if (typeof window[successCallback] === 'function') {
                    window[successCallback](docNumber);
                }
                else{
                    console.log("Document number validated:", docNumber);
                }

            },
            onError: (errorMessage) => {
                const errorCallback = currentScript.getAttribute('data-on-error');
                if (typeof window[errorCallback] === 'function') {
                    window[errorCallback](errorMessage);
                }
                else{
                    console.error("Validation error:", errorMessage);
                }
            },
        });
    } else {
        console.error("Container element not found.");
    }
})(); // The IIFE is executed immediately



window.DocumentInputSDK = DocumentInputSDK; // Still export the class