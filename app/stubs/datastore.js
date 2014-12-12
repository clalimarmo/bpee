define(function() {
  var stub = {};

  var history = {
    1: {
      date: '2014-12-03',
      barista: 'Brian',
      method: 'Aeropush (inverted)',
      time: '2 minutes',
      grind: '1.5 scoops medium roast, fine grind',
    },
    2: {
      date: '2014-12-03',
      barista: 'Giancarlo',
      method: 'Aeropush (normal)',
      time: '90 s',
      grind: '2 scoops medium roast, fine grind',
    },
  };

  var reviews = {
    1: [
      'pretty good - Brian',
      'yuck - Carlos',
      'hot dog water - Ara',
    ],
    2: [
      'terrible',
    ]
  };

  stub.get = function(filename, callback) {
    callback({
      history: history,
      reviews: reviews,
      latestHistoryRecordId: 2,
    });
  };

  stub.put = function() {};

  return stub;
});
