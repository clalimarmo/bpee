define(function() {
  var CoffeeLogger = function(deps) {
    var datastore = deps.datastore;
    var filename = deps.filename;

    var instance = {};

    var history = {};
    var reviews = {};
    var lastHistoryRecordId = 0;

    var updatedCallbacks = [];

    var initialize = function() {
      instance.onUpdated(deps.onFetched);
      fetch();
    };

    var save = function() {
      datastore.put(filename, {
        history: history,
        reviews: reviews,
        lastHistoryRecordId: lastHistoryRecordId,
      });
    };

    var fetch = function() {
      datastore.get(filename, {
        error: save,
        success: function(data) {
          history = data.history;
          reviews = data.reviews;
          lastHistoryRecordId = data.lastHistoryRecordId;
          for (var i in updatedCallbacks) {
            updatedCallbacks[i]();
          }
        },
      });
    };

    var reviewsFor = function(recordID) {
      if (reviews[recordID] === undefined) {
        reviews[recordID] = [];
      }
      return reviews[recordID];
    };

    instance.history = function() {
      return history;
    };

    instance.reviews = function() {
      return reviews;
    };

    instance.addRecord = function(record) {
      lastHistoryRecordId++;
      history[lastHistoryRecordId] = record;
      save();
    };

    instance.reviewRecord = function(recordId, review) {
      reviewsFor(recordId).push(review);
      save();
    };

    instance.onUpdated = function(callback) {
      if (typeof callback === 'function') {
        updatedCallbacks.push(callback);
      }
    };

    instance.fetch = fetch;

    initialize();
    return instance;
  };

  return CoffeeLogger;
});
