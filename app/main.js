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
  var CoffeeLogger = require('coffee_log/coffee_logger');
  var fakeDatastore = require('stubs/datastore');

  var loading = true;

  var showApp = function() {
    loading = false;
    $('main').show();
    $('.loading-indicator').hide();
  };

  var coffeeLogger = CoffeeLogger({
    filename: 'my_coffee_history',
    datastore: fakeDatastore,
    onFetched: showApp,
  });

  $(function() {
    if (loading) {
      $('main').hide();
    } else {
      $('.loading-indicator').hide();
    }

    CoffeeLogView({
      container: $('main'),
      coffeeLogger: coffeeLogger,
    });
  });
});
