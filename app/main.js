requirejs.config({
  paths: {
    'text': 'lib/requirejs-text/text',
    'jquery': 'lib/jquery/dist/jquery',
    'backbone': 'lib/backbone-amd/backbone',
    'underscore': 'lib/lodash/dist/lodash',
    'json-gcs': 'lib/json-gcs/dist/json-gcs',
    'google-oauther': 'lib/google-oauther/dist/google-oauther',
  },
  shim: {}
});

define(function(require) {
  var $ = require('jquery');
  var JsonGCS = require('json-gcs');
  var CoffeeLogView = require('coffee_log/view');
  var FileSelectorView = require('file_selector/view');
  var CoffeeLogger = require('coffee_log/coffee_logger');

  var authenticator = require('google-oauther');
  var datastore = JsonGCS.Storage({
    http: {ajax: $.ajax},
    authenticator: authenticator,
    bucketName: 'smartlogic_bpee',
  });
  var file = JsonGCS.File({datastore: datastore});

  var initializeApp = function() {
    $(function() {
      var coffeeLogger = CoffeeLogger({file: file});
      CoffeeLogView({
        barista: authenticator.user().displayName,
        container: $('main'),
        coffeeLogger: coffeeLogger,
      });

      var fileSelectorView = FileSelectorView({
        container: $('nav'),
        newFilePrompt: function(_prompt) { return window.prompt(_prompt); },
        file: file,
      });
      datastore.index({success: fileSelectorView.showFiles});
      setInterval(function() {
        if (file.filename()) {
          file.open(file.filename());
        }
      }, 5000);
      setInterval(function() {
        datastore.index({success: fileSelectorView.showFiles});
      }, 60000);
    });
  };

  authenticator.onAuthenticate(initializeApp);
  authenticator.run({
    scope: ['https://www.googleapis.com/auth/devstorage.read_write'],
    clientID: '712101487188-imrj0vr3dkrbdvhbu0c9b9k2c0hfss41.apps.googleusercontent.com'
  });
});
