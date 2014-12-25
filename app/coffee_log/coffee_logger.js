define(function() {
  var CoffeeLogger = function(deps) {
    var file = deps.file;

    var instance = {};

    var history = [];
    var onChangedCallbacks = [];

    var initialize = function() {
      file.onLoaded(onFileLoaded);
    };

    var runOnChangedCallbacks = function() {
      for (var i in onChangedCallbacks) {
        onChangedCallbacks[i]();
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
      runOnChangedCallbacks();
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
      runOnChangedCallbacks();
      save();
    };

    instance.onChanged = function(callback) {
      if (typeof callback === 'function') {
        onChangedCallbacks.push(callback);
      }
    };
    //alias
    instance.onFileLoaded = instance.onChanged;

    instance.fileIsOpen = function() {
      return deps.file.filename() !== null;
    };

    initialize();
    return instance;
  };

  return CoffeeLogger;
});
