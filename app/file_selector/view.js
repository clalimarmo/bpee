define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');

  var viewMarkup = require('text!file_selector/view.html');

  var defaultFileListParser = function(items) {
    return items;
  };

  var FileSelectorView = function(deps) {
    if (typeof deps.fileListParser !== 'function') {
      deps.fileListParser = defaultFileListParser;
    }

    var onSelectedCallbacks = [];

    var onSelected = function() {
      var selectedFilename = instance.$('select').val();
      for (var i in onSelectedCallbacks) {
        onSelectedCallbacks[i](selectedFilename);
      }
    };

    var initialize = function() {
      instance.$el.html(viewMarkup);
    };

    var BackboneView = Backbone.View.extend({
      events: {
        'change select': onSelected,
      }
    });

    var instance = new BackboneView({el: deps.container});

    var $select = function() {
      return instance.$('select');
    };

    instance.showFiles = function(fileList) {
      var parsedFileList = deps.fileListParser(fileList);
      for (var i in parsedFileList) {
        var file = parsedFileList[i];
        var $option = $('<option/>');
        $option.val(file.name).text(file.displayName);
        $option.appendTo($select());
      }
      $select().val(deps.getSelectedFile());
    };

    instance.onSelected = function(callback) {
      onSelectedCallbacks.push(callback);
    };

    initialize();
    return instance;
  };

  return FileSelectorView;
});
