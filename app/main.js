requirejs.config({
  paths: {
    'text': 'lib/requirejs-text/text',
    'jquery': 'lib/jquery/dist/jquery',
    'backbone': 'lib/backbone-amd/backbone',
    'underscore': 'lib/lodash/dist/lodash',
    'json-gcs': 'lib/json-gcs/dist/json-gcs',
    'google-oauther': 'lib/google-oauther/dist/google-oauther',
    'd3': 'lib/d3/d3',
  },
  shim: {}
});

define(function(require) {
  var $ = require('jquery');
  var JsonGCS = require('json-gcs');
  var DatastoreFile = require('datastore_file');
  var CoffeeLogView = require('coffee_log/view');
  var FileSelectorView = require('file_selector/view');
  var CoffeeLogger = require('coffee_log/coffee_logger');
  var CoffeeVisualizer = require('coffee_visualizer');
  var ClassSelectView = require('class_select_view');

  var authenticator = require('google-oauther');
  var datastore = JsonGCS({
    http: {ajax: $.ajax},
    authenticator: authenticator,
    bucketName: 'smartlogic_bpee',
  });
  var file = DatastoreFile({datastore: datastore});

  var initializeApp = function() {
    $(function() {
      ClassSelectView({
        container: $('#view-selector'),
        target: 'main',
        label: 'View',
        initialValue: 'show-log',
        classes: {
          'log': 'show-log',
          'quality by time and temperature': 'show-visualizations',
        }
      });

      var coffeeLogger = CoffeeLogger({file: file});
      CoffeeLogView({
        barista: authenticator.user().displayName,
        container: $('#log'),
        coffeeLogger: coffeeLogger,
      });
      CoffeeVisualizer({
        coffeeLogger: coffeeLogger,
        container: '#visualizations',
        width: 500,
        height: 500,
      });

      var fileSelectorView = FileSelectorView({
        container: $('#file-selector'),
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
