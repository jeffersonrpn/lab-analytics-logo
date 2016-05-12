'use strict';

angular.module('labAnalyticsLogoApp')
  .directive('lsdChart', function($parse, $window) {
     return {
        restrict:'EA',
        template:'<svg></svg>',
          link: function(scope, elem, attrs) {
            if (!$window.d3) { return console.log('D3 library is missing!'); }
            var exp = $parse(attrs.chartData);
            var data = exp(scope);
            var d3 = $window.d3;
            var rawSvg = elem.find('svg');
            var svg = d3.select(rawSvg[0]);
            var cfg = {
              radius: 3,
              w: 320,
              h: 320,
              factor: 1,
              levels: 3,
              maxValue: 0,
              radians: 2 * Math.PI,
              opacityArea: 0.3,
              ToRight: 5,
              TranslateX: 22.5,
              TranslateY: 22,
              TranslateLogotypeX: 50,
              TranslateLogotypeY: 100,
              ExtraWidthX: 45,
              ExtraWidthY: 45,
              color: '#EF4658',
              bgColor: '#FFF',
              strokeWidth: '2px',
              svgVersion: '1.1',
              svgXlink: 'http://www.w3.org/2000/svg'
            };
            var allAxis = (data[0].map(function(i){return i.axis;}));
            var total = allAxis.length;

            scope.$watchCollection(exp, function(newVal) {
              redraw(newVal);
            });

            var redraw = function(data) {
              data.forEach(function(y) {
                var dataValues = [];
                y.forEach(function(j, i) {
                  // Redraw circles
                  var circle = '#circle-'+j.axis;
                  svg.select(circle)
				            .transition(200)
                    .attr('cx', cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)))
                    .attr('cy', cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total)));

                  // Redraw lines
                  var line = '#line-'+j.axis;
                  svg.select(line)
				            .transition(200)
                    .attr('x2',  cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)))
                    .attr('y2',  cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total)));
                  dataValues.push([
                    cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                    cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                  ]);
                });
                // Redraw polygon (update points)
                svg.select('#polygon')
                  .transition(200)
                  .attr('points', function() {
                    var str = '';
                    for (var pti=0;pti<dataValues.length;pti++) {
                      str=str+dataValues[pti][0]+','+dataValues[pti][1]+' ';
                    }
                    return str;
                  });
              });
            };

            var draw = function(data) {

              cfg.maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}));}));

              var svg = d3.select(rawSvg[0])
                .attr('width', cfg.w+cfg.ExtraWidthX)
                .attr('height', cfg.h+cfg.ExtraWidthY)
                .attr('version', cfg.svgVersion)
                .attr('xmlns', cfg.svgXlink)
                .append('g')
                .attr('transform', 'translate(' + cfg.TranslateX + ',' + cfg.TranslateY + ')');

              // Draw polygon
              data.forEach(function(y) {
                var dataValues = [];
                svg.selectAll('.nodes')
                .data(y, function(j, i) {
                  dataValues.push([
                    cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                    cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                  ]);
                });
                dataValues.push(dataValues[0]);
                svg.selectAll('.area')
                .data([dataValues])
                .enter()
                .append('polygon')
                .attr('id', 'polygon')
                .attr('stroke', cfg.color)
                .attr('fill', cfg.bgColor)
                .attr('stroke-width', cfg.strokeWidth)
                .attr('points', function(d) {
                  var str = '';
                  for (var pti=0;pti<d.length;pti++) {
                    str=str+d[pti][0]+','+d[pti][1]+' ';
                  }
                  return str;
                });
              });

              // Draw dots and lines
              data.forEach(function(y) {
                // Draw dots
                svg.selectAll('.nodes')
                  .data(y)
                  .enter()
                  .append('svg:circle')
                  .attr('id', function(j){return 'circle-'+j.axis;}) // Sets the id to retrieve later
                  .attr('fill', cfg.color)
                  .attr('r', cfg.radius)
                  .attr('alt', function(j){return Math.max(j.value, 0);})
                  .attr('cx', function(j, i) {
                    var dataValues = [];
                    dataValues.push([
                      cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                      cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                    ]);
                    return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
                  })
                  .attr('cy', function(j, i){
                    return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
                  })
                  .attr('data-id', function(j){return j.axis;});

                // Draw lines
                svg.selectAll('.nodes')
                  .data(y)
                  .enter()
                  .append('line')
                  .attr('id', function(j){return 'line-'+j.axis;}) // Sets the id to retrieve later
                  .attr('x1', cfg.w/2)
                  .attr('y1', cfg.h/2)
                  .attr('x2', function(j, i) {
                    return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
                  })
                  .attr('y2', function(j, i) {
                    return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
                  })
                  .attr('stroke', cfg.color)
                  .attr('stroke-width', cfg.strokeWidth);
              });
              // Draw logotype (this part is fixed, made by designers)
              var logotype = d3.select(rawSvg[0])
                .append('g')
                .attr('id', 'logotype')
                .attr('transform', 'scale(0.3, 0.3) translate('+cfg.TranslateLogotypeX+', '+cfg.TranslateLogotypeY+')');
              logotype.append('path')
                .attr('id', 'Lab-analytics-1')
                .attr('fill', cfg.color)
                .attr('d', 'M19.947,403.693v125.143c0,10.92,3.569,14.068,10.078,14.068c5.25,0,9.029-2.098,12.389-4.409l1.469,10.92 c-3.989,2.729-10.918,5.46-18.268,5.46c-12.388,0-19.317-6.09-19.317-23.098V403.693H19.947z');
              logotype.append('path')
                .attr('id', 'lAb-analytics-2')
                .attr('fill', cfg.color)
                .attr('d', 'M136.064,529.466c0,8.399,2.309,13.438,8.399,13.438c3.359,0,6.719-1.888,10.288-4.619l1.26,11.13 c-3.99,2.939-10.289,5.46-16.168,5.46c-9.869,0-14.909-4.62-16.588-15.329c-6.929,8.819-18.477,15.329-32.125,15.329 c-27.297,0-45.145-20.999-45.145-56.485c0-35.275,17.218-57.323,45.774-57.323c11.339,0,23.728,5.25,30.657,13.859v-11.969 h13.648V529.466z M94.909,453.456c-21.627,0-35.275,17.007-35.275,44.935c0,27.507,13.648,44.094,35.275,44.094 c11.969,0,22.047-7.768,27.507-15.117v-59.213C116.956,460.806,106.878,453.456,94.909,453.456z');
              logotype.append('path')
                .attr('id', 'laB-analytics-3')
                .attr('fill', cfg.color)
                .attr('d', 'M179.531,454.926c6.929-7.77,18.058-13.859,31.706-13.859c27.087,0,44.935,20.997,44.935,56.692 s-17.848,57.115-44.935,57.115c-13.859,0-24.777-6.09-31.706-14.069v11.968h-13.649V403.693h13.649V454.926z M207.246,453.456 c-11.758,0-22.467,6.93-27.716,14.279v60.682c5.459,7.141,15.958,14.068,27.716,14.068c21.628,0,35.277-16.587,35.277-44.094 C242.523,470.463,228.874,453.456,207.246,453.456z');
              logotype.append('path')
                .attr('id', 'lab-Analytics-4')
                .attr('fill', cfg.color)
                .attr('d', 'M90.079,685.117c0,8.398,2.309,13.438,8.398,13.438c3.359,0,6.719-1.888,10.288-4.619l1.261,11.13 c-3.991,2.939-10.29,5.46-16.168,5.46c-9.869,0-14.909-4.619-16.588-15.329c-6.929,8.819-18.477,15.329-32.125,15.329 C17.848,710.525,0,689.526,0,654.041c0-35.276,17.217-57.323,45.774-57.323c11.339,0,23.728,5.25,30.657,13.859v-11.968h13.649 V685.117z M48.924,609.106c-21.627,0-35.275,17.007-35.275,44.935c0,27.507,13.648,44.094,35.275,44.094 c11.969,0,22.047-7.768,27.507-15.117v-59.213C70.971,616.457,60.893,609.106,48.924,609.106z');
              logotype.append('path')
                .attr('id', 'lab-aNalytics-5')
                .attr('fill', cfg.color)
                .attr('d', 'M119.897,708.424V598.609h13.648v17.638c6.509-12.39,18.058-19.529,34.016-19.529 c23.727,0,35.276,15.747,35.276,43.044v47.456c0,8.189,2.31,11.337,7.978,11.337c3.78,0,6.929-1.888,10.5-4.409l1.47,10.92 c-3.989,2.939-9.87,5.46-16.168,5.46c-11.759,0-17.428-6.09-17.428-20.159v-48.294c0-20.999-8.609-32.547-26.246-32.547 c-15.538,0-25.617,11.758-29.397,26.036v72.862H119.897z');
              logotype.append('path')
                .attr('id', 'lab-anAlytics-6')
                .attr('fill', cfg.color)
                .attr('d', 'M314.966,685.117c0,8.398,2.31,13.438,8.398,13.438c3.359,0,6.719-1.888,10.288-4.619l1.261,11.13 c-3.991,2.939-10.29,5.46-16.168,5.46c-9.869,0-14.908-4.619-16.588-15.329c-6.929,8.819-18.478,15.329-32.125,15.329 c-27.297,0-45.145-20.999-45.145-56.484c0-35.276,17.217-57.323,45.774-57.323c11.339,0,23.728,5.25,30.657,13.859v-11.968 h13.649V685.117z M273.81,609.106c-21.627,0-35.275,17.007-35.275,44.935c0,27.507,13.648,44.094,35.275,44.094 c11.969,0,22.047-7.768,27.507-15.117v-59.213C295.857,616.457,285.779,609.106,273.81,609.106z');
              logotype.append('path')
                .attr('id', 'lab-anaLytics-7')
                .attr('fill', cfg.color)
                .attr('d', 'M358.223,559.342v125.145c0,10.92,3.569,14.068,10.079,14.068c5.247,0,9.029-2.098,12.388-4.409 l1.471,10.92c-3.992,2.729-10.92,5.46-18.268,5.46c-12.389,0-19.318-6.09-19.318-23.097V559.342H358.223z');
              logotype.append('path')
                .attr('id', 'lab-analYtics-8')
                .attr('fill', cfg.color)
                .attr('d', 'M376.073,732.993c4.619,2.939,10.077,5.247,18.058,5.247c11.758,0,17.007-7.768,21.837-22.047l2.939-8.819 l-44.724-108.765h15.119l35.906,94.696l32.544-94.696h13.859l-43.464,120.525C421.218,738.24,413.237,750,394.762,750 c-9.239,0-16.59-3.151-21.209-6.3L376.073,732.993z');
              logotype.append('path')
                .attr('id', 'lab-analyTics-9')
                .attr('fill', cfg.color)
                .attr('d', 'M497.023,678.399c0,14.068,6.088,19.946,17.007,19.946c7.138,0,16.377-3.779,22.047-8.399l3.989,11.13 c-7.768,5.457-17.008,9.449-28.975,9.449c-16.8,0-27.717-9.029-27.717-30.658v-69.921h-18.058v-11.337h18.898l1.468-27.927 h11.34v27.927h38.424v11.337h-38.424V678.399z');
              logotype.append('path')
                .attr('id', 'lab-analytIcs-10')
                .attr('fill', cfg.color)
                .attr('d', 'M558.125,557.874c5.25,0,9.029,2.309,9.029,9.447c0,6.93-3.779,9.449-9.029,9.449 c-5.668,0-9.659-2.519-9.659-9.449C548.466,560.182,552.457,557.874,558.125,557.874z M564.845,598.609v88.609 c0,8.189,2.309,11.337,7.768,11.337c3.989,0,7.138-1.888,10.71-4.409l1.258,10.92c-3.779,2.939-9.867,5.46-16.167,5.46 c-11.547,0-17.217-6.09-17.217-20.159v-91.757H564.845z');
              logotype.append('path')
                .attr('id', 'lab-analytiCs-11')
                .attr('fill', cfg.color)
                .attr('d', 'M677.602,696.037c-10.289,9.239-23.938,15.327-39.057,15.327c-35.065,0-49.974-24.145-49.974-57.533 c0-34.015,19.108-58.163,48.926-58.163c25.616,0,38.844,14.909,40.943,38.006l-11.127,3.779 c-1.261-18.898-10.71-29.398-28.768-29.398c-22.467,0-36.116,18.898-36.116,45.355c0,26.667,10.71,45.565,37.586,45.565 c11.547,0,22.888-6.298,31.706-13.858L677.602,696.037z');
              logotype.append('path')
                .attr('id', 'lab-analyticS-12')
                .attr('fill', cfg.color)
                .attr('d', 'M755.293,616.247c-7.348-3.992-18.688-7.561-29.395-7.561c-16.38,0-25.408,7.978-25.408,20.369 c0,9.029,5.25,12.808,17.01,16.167l18.896,5.46c14.699,4.199,23.518,11.968,23.518,26.667c0,18.268-12.808,33.177-36.536,33.177 c-15.117,0-27.715-4.83-34.855-8.821l3.149-12.388c6.72,4.199,17.848,9.449,31.079,9.449c15.537,0,23.515-9.029,23.515-20.366 c0-10.29-7.348-14.069-17.218-17.008l-19.108-5.46c-15.116-4.409-23.305-12.18-23.305-26.667 c0-18.688,14.276-32.547,38.635-32.547c11.757,0,26.666,3.779,33.595,7.558L755.293,616.247z');
            };
            draw(data);
          }
   };
});
