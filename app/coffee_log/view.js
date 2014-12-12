define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');

  var viewMarkup = require('text!coffee_log/view.html');
  var rowMarkup = require('text!coffee_log/row.html');

  var CoffeeLogView = function(deps) {
    var initialize = function() {
      redrawRows();
      deps.coffeeLogger.onUpdated(redrawRows);
    };

    var renderView = function() {
      instance.$el.html(viewMarkup);
    };

    var redrawRows = function() {
      renderView();
      renderHistoryRows();
    };

    var renderHistoryRows = function() {
      var history = deps.coffeeLogger.history();
      var reviews = deps.coffeeLogger.reviews();

      for (var recordKey in deps.coffeeLogger.history()) {
        var record = history[recordKey];
        var recordReviews = reviews[recordKey];
        var $row = renderHistoryRow(record, recordReviews);
        $historyTable().append($row);
      }
    };

    var renderHistoryRow = function(record, recordReviews) {
      var $row = $(rowMarkup);
      $row.find('.date').text(record.date);
      $row.find('.barista').text(record.barista);
      $row.find('.method').text(record.method);
      $row.find('.time').text(record.time);
      $row.find('.temperature').text(record.temperature);
      $row.find('.grind').text(record.grind);

      var $reviews = $row.find('.reviews ul');
      for (var i in recordReviews) {
        var review = recordReviews[i];
        $reviews.append($('<li>').text(review));
      }

      return $row;
    };

    var $historyTable = function() {
      return instance.$('.history tbody.records');
    };

    var $newRecord = function() {
      return instance.$('.add-record');
    };

    var addRecord = function() {
      var $record = $newRecord();
      var record = {
        date: new Date().toDateString(),
        barista: $record.find('.barista').val(),
        method: $record.find('.method').val(),
        grind: $record.find('.grind').val(),
        time: $record.find('.time').val(),
        temperature: $record.find('.temperature').val(),
      };

      deps.coffeeLogger.addRecord(record);
      renderHistoryRow(record, []).appendTo($historyTable());
    };

    var BackboneView = Backbone.View.extend({
      events: {
        'click .add-record input[type="submit"]': addRecord
      }
    });

    var instance = new BackboneView({
      el: deps.container
    });

    initialize();
    return instance;
  };
  return CoffeeLogView;
});
