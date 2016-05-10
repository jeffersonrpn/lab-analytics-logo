'use strict';

angular.module('lsdMorphingLogoApp')
  .directive('lsdChart', function($window) {
     return {
        restrict:'EA',
        template:"<svg></svg>",
          link: function(scope, elem, attrs) {
            var data = scope[attrs.chartData];
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
              ExtraWidthX: 100,
              ExtraWidthY: 100
          	};

            cfg.maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}));}));
            var allAxis = (data[0].map(function(i){return i.axis;}));
          	var total = allAxis.length;
            var rawSvg = elem.find('svg');
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
                .attr("data-id", function(j){return j.axis;})
                .on('mouseover', function() {
                  d3.select(this)
                    .transition(200)
                    .attr('r', cfg.radius*1.5);
                })
                .on('mouseout', function() {
                  d3.select(this)
                    .transition(200)
                    .attr('r', cfg.radius);
                });

                svg.selectAll(".nodes")
                  .data(y)
                  .enter()
                  .append("line")
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
   };
});
