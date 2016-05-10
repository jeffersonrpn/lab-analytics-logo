'use strict';

angular.module('lsdMorphingLogoApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.chartData = [
    		  [
      			{axis:"N",		value: 5},
      			{axis:"NO1",	value: 1.2},
      			{axis:"NO2",	value: 4},
      			{axis:"O",		value: 0},
      			{axis:"SO1",	value: 0},
      			{axis:"SO2",	value: 0},
      			{axis:"S1",		value: 0},
      			{axis:"S2", 	value: 0},
      			{axis:"SE1",	value: 0},
      			{axis:"SE2",	value: 0},
      			{axis:"E",		value: 0},
      			{axis:"NE1",	value: 1},
      			{axis:"NE2",	value: 2.5}
    		  ]
    		];
  }]);
