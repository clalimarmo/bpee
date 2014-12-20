define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');

  var viewMarkup = require('text!coffee_log/view.html');
  var rowMarkup = require('text!coffee_log/row.html');

  var CoffeeLogView = function(deps) {
    var initialize = function() {
      renderView();
      renderContent();
      deps.coffeeLogger.onFileLoaded(renderContent);
    };

    var renderView = function() {
      instance.$el.html(viewMarkup);
    };

    var renderContent = function() {
      $content().toggle(deps.coffeeLogger.fileIsOpen());
      $nothingLoadedIndicator().toggle(!deps.coffeeLogger.fileIsOpen());

      var history = deps.coffeeLogger.history();

      var $history = $historyTable();
      $history.empty();
      for (var recordKey in deps.coffeeLogger.history()) {
        var record = history[recordKey];
        var $row = renderHistoryRow(record);
        $history.append($row);
      }
    };

    var renderHistoryRow = function(record) {
      var $row = $(rowMarkup);
      $row.find('.date').text(record.date);
      $row.find('.barista').text(record.barista);
      $row.find('.method').text(record.method);
      $row.find('.time').text(record.time);
      $row.find('.temperature').text(record.temperature);
      $row.find('.grind').text(record.grind);
      return $row;
    };

    var $content = function() {
      return instance.$('.content');
    };

    var $nothingLoadedIndicator = function() {
      return instance.$('.nothing-loaded');
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
      $record.find('input[type="text"]').val('');

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
