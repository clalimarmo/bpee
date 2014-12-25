define(function(require) {
  var d3 = require('d3');

  var margins = {
    left: 100,
    right: 30,
    top: 30,
    bottom: 35,
  };

  var qualityColors = d3.scale.linear().domain([0, 0.5, 1]).range(['red', 'yellow', 'green']);

  var CoffeeVisualizer = function(deps) {
    var svg,
    x,
    y,
    recipes;

    var domain = function(data, key) {
      var accessor = function(datum) { return datum[key]; };
      var sDev = d3.deviation(data, accessor);
      var min = d3.min(data, accessor);
      var max = d3.max(data, accessor);
      return [min - sDev, max + sDev];
    };

    var scale = function(data, key) {
      var _domain = domain(data, key);
      return d3.scale.linear().domain(_domain);
    };

    var initialize = function() {
      recipes = deps.coffeeLogger.history();

      svg = d3.select(deps.container)
        .append('svg')
          .attr('width', deps.width)
          .attr('height', deps.height)
          .append('g')
            .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

      x = scale(recipes, 'brew_time').range([0, deps.width - margins.left - margins.right]);
      y = scale(recipes, 'brew_temp').range([deps.height - margins.top - margins.bottom, 0]);

      svg.append('text')
        .attr('fill', '#414241')
        .attr('text-anchor', 'end')
        .attr('x', deps.width / 2)
        .attr('y', deps.height - 35)
        .text('brew time (seconds)');

      svg.append('text')
        .attr('fill', '#414241')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(-40,' + (deps.height / 2) + ') rotate(-90)')
        .html('brew temp (&deg;F)');

      svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
      svg.append("g").attr("class", "y axis");

      deps.coffeeLogger.onChanged(draw);
    };

    var draw = function() {
      recipes = deps.coffeeLogger.history();

      x = scale(recipes, 'brew_time').range([0, deps.width - margins.left - margins.right]);
      y = scale(recipes, 'brew_temp').range([deps.height - margins.top - margins.bottom, 0]);

      var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
      var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

      svg.selectAll("g.y.axis").call(yAxis);
      svg.selectAll("g.x.axis").call(xAxis);

      var recipe = svg.selectAll('g.node').data(deps.coffeeLogger.history);
      recipe.enter().append('g').attr('class', 'node')
        .attr('transform', function(r) { return 'translate(' + x(r.brew_time) + ',' + y(r.brew_temp) + ')'; })
        .append('circle').attr('class', 'dot')
          .attr('r', 5)
          .style('fill', function(r) { return qualityColors(r.rating); });
    };

    var instance = {};

    initialize();
    return instance;
  };

  return CoffeeVisualizer;
});
