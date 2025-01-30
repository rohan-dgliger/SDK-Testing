// my-kyc-sdk.js (Your SDK file)

class DataFetcher {
  constructor(containerId, onSubmit) {
    this.container = document.getElementById(containerId); // Get the container element
    if (!this.container) {
      throw new Error("Container element not found.");
    }
    this.onSubmit = onSubmit; // Callback function for submission
    this.createForm();
  }

  createForm() {
    // ... (All the code to create the form elements remains the same) ...

    // Handle form submission (modified)
    this.submitBtn.addEventListener("click", () => {
      const data = {
        type: this.selectedType,
        value: this.idInput.value,
      };
      this.onSubmit(data); // Call the callback function with the data
    });

     // Store references to elements as properties of the class
    this.formContainer = formContainer;  // Make formContainer a class property
    this.radioGroup = radioGroup;
    this.aadhaarRadio = aadhaarRadio;
    this.panRadio = panRadio;
    this.inputContainer = inputContainer;
    this.inputLabel = inputLabel;
    this.idInput = idInput;
    this.errorMessage = errorMessage;
    this.submitBtn = submitBtn;
    this.selectedType = ""; //Initialize selectedType

  }

  destroy() {
        // Remove the form from the DOM when the widget is no longer needed
        if (this.formContainer) {
            this.container.removeChild(this.formContainer);
        }
    }
}


// Make MyKYCWidget available globally (or export it if using modules)
window.MyKYCWidget = MyKYCWidget;  // For direct inclusion in HTML

// Or, if you're using a module system (like CommonJS or ES modules):
// export default MyKYCWidget;