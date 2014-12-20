define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');

  var viewMarkup = require('text!coffee_log/view.html');
  var rowMarkup = require('text!coffee_log/row.html');
  var fieldTypeMap = {
    'number': Number,
    'text': String,
  };

  var CoffeeLogView = function(deps) {
    var initialize = function() {
      renderView();
      renderContent();
      deps.coffeeLogger.onFileLoaded(renderContent);
    };

    var renderView = function() {
      instance.$el.html(viewMarkup);
      $newRecord().find('[name="barista"]').val(deps.barista);
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
      for (var key in record) {
        var $cell = $row.find('.' + key);
        $cell.text(String(record[key]));
      }
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
      var record = {};

      $record.find('.value').each(function() {
        var $field = $(this);
        var typeCast = fieldTypeMap[$field.attr('type')] || String;
        record[$field.attr('name')] = typeCast($field.val());
      });

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
