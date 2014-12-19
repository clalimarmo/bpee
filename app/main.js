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
  var jsonGcsIndexParser = require('file_selector/json_gcs_index_parser');

  var authenticator = require('google-oauther');
  var datastore = JsonGCS({
    http: {ajax: $.ajax},
    authenticator: authenticator,
    bucketName: 'smartlogic_bpee',
  });

  var initializeApp = function() {
    var loading = true;

    var showApp = function() {
      loading = false;
      $('main').show();
      $('.loading-indicator').hide();
    };

    var coffeeLogger = CoffeeLogger({
      filename: authenticator.user().id,
      datastore: datastore,
      onFetched: showApp,
    });
    setInterval(coffeeLogger.fetch, 5000);

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

      var fileSelectorView = FileSelectorView({
        fileListParser: jsonGcsIndexParser,
        getSelectedFile: coffeeLogger.filename,
        container: $('nav'),
      });
      datastore.index({success: fileSelectorView.showFiles});
      setInterval(60000, function() {
        datastore.index({success: fileSelectorView.showFiles});
      });

      fileSelectorView.onSelected(coffeeLogger.open);
    });
  };

  authenticator.onAuthenticate(initializeApp);

  authenticator.run({
    scope: ['https://www.googleapis.com/auth/devstorage.read_write'],
    clientID: '712101487188-imrj0vr3dkrbdvhbu0c9b9k2c0hfss41.apps.googleusercontent.com'
  });
});
