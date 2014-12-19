define(function() {
  var parser = function(items) {
    var parsedItems = [];
    for (var i in items) {
      var item = items[i];
      var metadata = item.metadata || {};
      var displayName = metadata.displayName || item.name;
      parsedItems.push({
        name: item.name,
        displayName: displayName,
      });
    }
    return parsedItems;
  };

  return parser;
});
