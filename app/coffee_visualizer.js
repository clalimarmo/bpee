define(function(require) {
  var d3 = require('d3');
  var $ = require('jquery');
  var _ = require('underscore');

  var margins = {
    left: 100,
    right: 30,
    top: 30,
    bottom: 35,
  };

  var qualityColors = d3.scale.linear().domain([0, 0.5, 1]).range(['red', 'yellow', 'green']);

  var CoffeeVisualizer = function(deps) {
    var svg,
    svgContainer,
    x,
    y,
    xAxisLabel,
    yAxisLabel,
    recipes;

    var width = function() {
      return $(window).width() - 100;
    };

    var height = function() {
      return $(window).height() - 100;
    };

    var domain = function(data, key) {
      var accessor = function(datum) { return datum[key]; };
      var sDev = d3.deviation(data, accessor);
      var min = d3.min(data, accessor);
      var max = d3.max(data, accessor);
      return [Math.max(min - sDev, 0), max + sDev];
    };

    var scale = function(data, key) {
      var _domain = domain(data, key);
      return d3.scale.linear().domain(_domain);
    };

    var initialize = function() {
      recipes = deps.coffeeLogger.history();

      svgContainer = d3.select(deps.container).append('svg');
      svg = svgContainer.append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

      x = scale(recipes, 'brew_time').range([0, width() - margins.left - margins.right]);
      y = scale(recipes, 'brew_temp').range([height() - margins.top - margins.bottom, 0]);

      xAxisLabel = svg.append('text')
        .attr('fill', '#414241')
        .attr('text-anchor', 'end')
        .text('brew time (seconds)');

      yAxisLabel = svg.append('text')
        .attr('fill', '#414241')
        .attr('text-anchor', 'middle')
        .html('brew temp (&deg;F)');

      svg.append("g").attr("class", "x axis");
      svg.append("g").attr("class", "y axis");

      deps.coffeeLogger.onChanged(draw);
      d3.select(window).on('resize', draw);
      draw();
    };

    var draw = _.debounce(function() {
      recipes = deps.coffeeLogger.history();

      svgContainer.attr('width', width()).attr('height', height());

      x = scale(recipes, 'brew_time').range([0, width() - margins.left - margins.right]);
      y = scale(recipes, 'brew_temp').range([height() - margins.top - margins.bottom, 0]);

      xAxisLabel.attr('x', width() / 2).attr('y', height() - 35);
      yAxisLabel.attr('transform', 'translate(-40,' + (height() / 2) + ') rotate(-90)');

      var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
      var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

      svg.selectAll("g.y.axis").call(yAxis);
      svg.selectAll("g.x.axis")
        .attr("transform", "translate(0," + y.range()[0] + ")")
        .call(xAxis);

      var recipe = svg.selectAll('g.node').data(deps.coffeeLogger.history);

      recipe.enter().append('g').attr('class', 'node')
        .append('circle').attr('class', 'dot')
          .attr('r', 5)
          .style('fill', function(r) { return qualityColors(r.rating); });

      recipe.attr('transform', function(r) { return 'translate(' + x(r.brew_time) + ',' + y(r.brew_temp) + ')'; });
    }, 100);

    var instance = {};

    initialize();
    return instance;
  };

  return CoffeeVisualizer;
});
