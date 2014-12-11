requirejs.config({
  paths: {
    'text': 'lib/requirejs-text/text',
    'jquery': 'lib/jquery/dist/jquery',
    'backbone': 'lib/backbone-amd/backbone',
    'underscore': 'lib/lodash/dist/lodash',
  },
  shim: {}
});

define(function(require) {
  var $ = require('jquery');
  var CoffeeLogView = require('coffee_log/view');
  var fakeCoffeeLogger = require('stubs/coffee_logger');

  $(function() {
    CoffeeLogView({
      container: $('main'),
      coffeeLogger: fakeCoffeeLogger,
    });
  });
});
