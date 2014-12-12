define(function() {
  var CoffeeLogger = function(deps) {
    var datastore = deps.datastore;
    var filename = deps.filename;
    var onFetched = deps.onFetched;

    var instance = {};

    var history = {};
    var reviews = {};
    var lastHistoryRecordId = null;

    var initialize = function() {
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
      datastore.get(filename, function(data) {
        history = data.history;
        reviews = data.reviews;
        lastHistoryRecordId = data.lastHistoryRecordId;
        if (typeof(onFetched) === 'function') {
          onFetched();
        }
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

    initialize();
    return instance;
  };

  return CoffeeLogger;
});
