'use strict';

/**
 * @ngdoc function
 * @name labAnalyticsLogoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the labAnalyticsLogoApp
 */
angular.module('labAnalyticsLogoApp')
  .controller('MainCtrl', ['$interval', 'FileSaver', 'Blob', function ($interval, FileSaver, Blob) {
    var vm = this;
    vm.chartData = [
		  [
  			{axis:'N',		value: 5},
  			{axis:'NO1',	value: 1.2},
  			{axis:'NO2',	value: 4},
  			{axis:'O',		value: 0},
  			{axis:'SO1',	value: 0},
  			{axis:'SO2',	value: 0},
  			{axis:'S1',		value: 0},
  			{axis:'S2', 	value: 0},
  			{axis:'SE1',	value: 0},
  			{axis:'SE2',	value: 0},
  			{axis:'E',		value: 0},
  			{axis:'NE1',	value: 1},
  			{axis:'NE2',	value: 2.5}
		  ]
		];
    vm.svg = '';
    vm.copy = function() {
      vm.svg = angular.element('#logo').html();
    };
    vm.download = function() {
      var data = new Blob([vm.svg], { type: 'text/plain;charset=utf-8' });
      FileSaver.saveAs(data, 'labanalytics.svg');
    };
    var getRandomValue = function() {
      var minValue = 0.5;
      var maxValue = 5;
      return (Math.random() * maxValue) + minValue;
    };
    $interval(function() {
      vm.chartData = [
  		  [
    			{axis:'N',		value: getRandomValue()},
    			{axis:'NO1',	value: getRandomValue()},
    			{axis:'NO2',	value: getRandomValue()},
    			{axis:'O',		value: 0},
    			{axis:'SO1',	value: 0},
    			{axis:'SO2',	value: 0},
    			{axis:'S1',		value: 0},
    			{axis:'S2', 	value: 0},
    			{axis:'SE1',	value: 0},
    			{axis:'SE2',	value: 0},
    			{axis:'E',		value: 0},
    			{axis:'NE1',	value: getRandomValue()},
    			{axis:'NE2',	value: getRandomValue()}
  		  ]
  		];
      vm.copy();
    }, 2000, 0);
  }]);
