requirejs.config({
  paths: {},
  shim: {}
});

define(function(require) {
  // require modules
  var exampleModule = require('example_module');

  // initialize app
  window.alert("hello " + exampleModule.hello);
});
