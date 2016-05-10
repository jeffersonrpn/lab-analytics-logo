'use strict';

angular.module('lsdMorphingLogoApp')
  .directive('lsdChart', function($parse, $window) {
     return {
        restrict:'EA',
        template:"<svg></svg>",
          link: function(scope, elem, attrs) {
            var exp = $parse(attrs.chartData);
            var data = exp(scope);
            var d3 = $window.d3;
            var cfg = {
              radius: 5,
              w: 400,
              h: 400,
              factor: 1,
              levels: 3,
              maxValue: 0,
              radians: 2 * Math.PI,
              opacityArea: 0.3,
              ToRight: 5,
              TranslateX: 80,
              TranslateY: 30,
              ExtraWidthX: 200,
              ExtraWidthY: 200
            };
            var allAxis = (data[0].map(function(i){return i.axis;}));
            var total = allAxis.length;

            scope.$watchCollection(exp, function(newVal, oldVal) {
              redraw(newVal);
            });

            var redraw = function(data) {
              var rawSvg = elem.find('svg');
              var svg = d3.select(rawSvg[0]);
              data.forEach(function(y) {
                var dataValues = [];
                y.forEach(function(j, i) {
                  // Redraw circles
                  var circle = '#circle-'+j.axis;
                  svg.select(circle)
				            .transition(200)
                    .attr("cx", cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)))
                    .attr("cy", cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total)));

                  // Redraw lines
                  var line = '#line-'+j.axis;
                  svg.select(line)
				            .transition(200)
                    .attr("x2",  cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)))
                    .attr("y2",  cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total)));
                  dataValues.push([
                    cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                    cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                  ]);
                });
                // Redraw polygon (update points)
                svg.select('#polygon')
                  .transition(200)
                  .attr('points', function(d) {
                    var str = "";
                    for (var pti=0;pti<dataValues.length;pti++) {
                      str=str+dataValues[pti][0]+","+dataValues[pti][1]+" ";
                    }
                    return str;
                  });
              });
            }

            var draw = function(data) {

              cfg.maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}));}));

              var rawSvg = elem.find('svg');
              d3.select(rawSvg[0]).select("g").remove();
              var svg = d3.select(rawSvg[0])
                .attr("width", cfg.w+cfg.ExtraWidthX)
                .attr("height", cfg.h+cfg.ExtraWidthY)
                .append("g")
                .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

              // Draw polygon
              data.forEach(function(y) {
                var dataValues = [];
                svg.selectAll(".nodes")
                .data(y, function(j, i) {
                  dataValues.push([
                    cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                    cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                  ]);
                });
                dataValues.push(dataValues[0]);
                svg.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("id", function(j){return 'polygon';})
                .attr("class", "radar-chart-serie")
                .attr("points", function(d) {
                  var str = "";
                  for (var pti=0;pti<d.length;pti++) {
                    str=str+d[pti][0]+","+d[pti][1]+" ";
                  }
                  return str;
                });
              });

              // Draw dots and lines
              data.forEach(function(y) {
                // Draw dots
                svg.selectAll(".nodes")
                  .data(y)
                  .enter()
                  .append("svg:circle")
                  .attr("id", function(j){return 'circle-'+j.axis;}) // Sets the id to retrieve later
                  .attr("class", "radar-chart-serie")
                  .attr('r', cfg.radius)
                  .attr("alt", function(j){return Math.max(j.value, 0);})
                  .attr("cx", function(j, i) {
                    var dataValues = [];
                    dataValues.push([
                      cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                      cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                    ]);
                    return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
                  })
                  .attr("cy", function(j, i){
                    return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
                  })
                  .attr("data-id", function(j){return j.axis;});

                // Draw lines
                svg.selectAll(".nodes")
                  .data(y)
                  .enter()
                  .append("line")
                  .attr("id", function(j){return 'line-'+j.axis;}) // Sets the id to retrieve later
                  .attr("x1", cfg.w/2)
                  .attr("y1", cfg.h/2)
                  .attr("x2", function(j, i) {
                    return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
                  })
                  .attr("y2", function(j, i) {
                    return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
                  })
                  .attr("class", "radar-chart-serie");
              });

            }
            draw(data);
          }
   };
});
