(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  // my-kyc-sdk.js (Your SDK file)


  // Make MyKYCWidget available globally (or export it if using modules)
  window.MyKYCWidget = MyKYCWidget;  // For direct inclusion in HTML

  // Or, if you're using a module system (like CommonJS or ES modules):
  // export default MyKYCWidget;

}));
