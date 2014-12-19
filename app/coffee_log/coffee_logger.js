define(function() {
  var CoffeeLogger = function(deps) {
    var file = deps.file;

    var instance = {};

    var history = [];
    var lastHistoryRecordId = 0;

    var updatedCallbacks = [];

    var initialize = function() {
      file.onLoad(onFileLoad);
    };

    var runUpdatedCallbacks = function() {
      for (var i in updatedCallbacks) {
        updatedCallbacks[i]();
      }
    };

    var exportData = function() {
      return { history: history };
    };

    var importData = function(data) {
      history = data.history;
    };

    var onFileLoad = function(data) {
      importData(data);
      runUpdatedCallbacks();
    };

    var save = function() {
      file.save(exportData());
    };

    instance.history = function() {
      return history;
    };

    instance.addRecord = function(record) {
      history.push(record);
      save();
    };

    instance.onUpdated = function(callback) {
      if (typeof callback === 'function') {
        updatedCallbacks.push(callback);
      }
    };

    initialize();
    return instance;
  };

  return CoffeeLogger;
});
