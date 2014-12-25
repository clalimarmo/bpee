define(function(require) {
  var $ = require('jquery');
  var Backbone = require('backbone');

  var viewMarkup = require('text!class_select_view.html');

  var ClassSelectView = function(deps) {
    var view;

    var initialize = function() {
      view = new BackboneView({
        el: deps.container,
      });
      view.$el.html(viewMarkup);
      view.$('label').text(deps.label + ':');
      for (var text in deps.classes) {
        var className = deps.classes[text];
        $select().append($option(text, className));
      }
      $select().val(deps.initialValue);
      onSelected();
    };

    var $select = function() {
      return view.$('select');
    };

    var $option = function(text, className) {
      return $('<option>').text(text).val(className);
    };

    var onSelected = function() {
      var $target = $(deps.target);
      for (var text in deps.classes) {
        var className = deps.classes[text];
        $target.toggleClass(className, className === $select().val());
      }
    };

    var BackboneView = Backbone.View.extend({
      events: {
        'change select': onSelected,
      },
    });

    initialize();
  };
  return ClassSelectView;
});
