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

    var initialize = function() {
      instance.$el.html(viewMarkup);
    };

    var onSelected = function() {
      deps.file.open(selectedFilename());
    };

    var selectNew = function() {
      var newFilename = window.prompt("New Filename");
      var file = deps.file;
      file.init(newFilename, null, {
        success: function() {
          file.dir(instance.showFiles);
          file.open(newFilename);
        }
      });
    };

    var $select = function() {
      return instance.$('select');
    };

    var selectedFilename = function() {
      return $select().val();
    };

    var BackboneView = Backbone.View.extend({
      events: {
        'change select': onSelected,
        'click .new-file': selectNew,
      }
    });

    var instance = new BackboneView({el: deps.container});

    instance.showFiles = function(fileList) {
      var parsedFileList = deps.fileListParser(fileList);
      for (var i in parsedFileList) {
        var file = parsedFileList[i];
        var $option = $('<option/>');
        $option.val(file.name).text(file.name);
        $option.appendTo($select());
      }
      $select().val(deps.file.filename());
    };

    initialize();
    return instance;
  };

  return FileSelectorView;
});
