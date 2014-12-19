define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');

  var viewMarkup = require('text!file_selector/view.html');

  var defaultFileListParser = function(items) {
    var filenames = [];
    for (var i in items) {
      filenames.push(items[i].name);
    }
    return filenames;
  };

  var FileSelectorView = function(deps) {
    if (typeof deps.fileListParser !== 'function') {
      deps.fileListParser = defaultFileListParser;
    }

    var fileList = [];

    var initialize = function() {
      instance.$el.html(viewMarkup);
      deps.file.onLoaded(showSelectedFile);
    };

    var onSelected = function() {
      deps.file.open(selectedFilename());
    };

    var fileExists = function(filename) {
      return fileList.indexOf(filename) !== -1;
    };

    var selectNew = function() {
      var newFilename = window.prompt("Choose a filename:");
      var file = deps.file;

      if (fileExists(newFilename)) {
        return file.open(newFilename);
      };

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

    var showSelectedFile = function() {
      $select().val(deps.file.filename());
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

    instance.showFiles = function(_fileList) {
      fileList = deps.fileListParser(_fileList);
      $select().empty();
      for (var i in fileList) {
        var filename = fileList[i];
        var $option = $('<option/>');
        $option.val(filename).text(filename);
        $option.appendTo($select());
      }
      $select().val(deps.file.filename());
    };

    initialize();
    return instance;
  };

  return FileSelectorView;
});
