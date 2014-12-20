define(function() {
  var CoffeeLogger = function(deps) {
    var file = deps.file;

    var instance = {};

    var history = [];
    var onFileLoadedCallbacks = [];

    var initialize = function() {
      file.onLoaded(onFileLoaded);
    };

    var runOnFileLoadedCallbacks = function() {
      for (var i in onFileLoadedCallbacks) {
        onFileLoadedCallbacks[i]();
      }
    };

    var exportData = function() {
      return { history: history };
    };

    var importData = function(data) {
      data = data || {};
      history = data.history || [];
    };

    var onFileLoaded = function() {
      importData(file.data());
      runOnFileLoadedCallbacks();
    };

    var save = function() {
      file.save(exportData());
    };

    instance.history = function() {
      return history;
    };

    instance.addRecord = function(record) {
      record.date = new Date();
      history.push(record);
      save();
    };

    instance.onFileLoaded = function(callback) {
      if (typeof callback === 'function') {
        onFileLoadedCallbacks.push(callback);
      }
    };

    instance.fileIsOpen = function() {
      return deps.file.filename() !== null;
    };

    initialize();
    return instance;
  };

  return CoffeeLogger;
});
