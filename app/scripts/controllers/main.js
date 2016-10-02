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
    var defaultChart = [
		  [
  			{axis:'N',		value: 5}, // Vertical
  			{axis:'NO1',	value: 1.2}, // 1o a esquerda
  			{axis:'NO2',	value: 4},  // 2o a esquerda
  			{axis:'O',		value: 0},  // Não usamos
  			{axis:'SO1',	value: 0},  // Não usamos
  			{axis:'SO2',	value: 0},  // Não usamos
  			{axis:'S1',		value: 0},  // Não usamos
  			{axis:'S2', 	value: 0},  // Não usamos
  			{axis:'SE1',	value: 0},  // Não usamos
  			{axis:'SE2',	value: 0}, // Não usamos
  			{axis:'E',		value: 0}, // Não usamos
  			{axis:'NE1',	value: 5}, // 2a direita
  			{axis:'NE2',	value: 2.5} // 1a direita
		  ]
		];
    vm.svg = '';
    vm.isStopped = false;
    vm.chartData = defaultChart;
    vm.copy = function() {
      vm.svg = angular.element('#logo').html();
    };
    vm.download = function() {
      vm.copy();
      var data = new Blob([vm.svg], { type: 'text/plain;charset=utf-8' });
      FileSaver.saveAs(data, 'labanalytics.svg');
    };
    vm.stop = function() {
      vm.copy();
      vm.isStopped = true;
      $interval.cancel(randomRepeat);
    };
    vm.hitme = function() {
      getGithubDimensions();
      vm.chartData = [
  		  [
    			{axis:'N',		value: github_info['commits'] + generateError()},
    			{axis:'NO1',	value: getWeekHours() + generateError()},
    			{axis:'NO2',	value: getTodaySeconds() + generateError()},
    			{axis:'O',		value: 0},
    			{axis:'SO1',	value: 0},
    			{axis:'SO2',	value: 0},
    			{axis:'S1',		value: 0},
    			{axis:'S2', 	value: 0},
    			{axis:'SE1',	value: 0},
    			{axis:'SE2',	value: 0},
    			{axis:'E',		value: 0},
    			{axis:'NE1',	value: lnRandomScaled(25, 60) / 50 * DIFF_MIN_MAX + MIN_SIZE},
    			{axis:'NE2',	value: github_info['repos'] + generateError()}
  		  ]
  		];
      vm.copy();
    };
    vm.backToDefault = function() {
      vm.chartData = defaultChart;
      vm.copy();
    };

    var DIFF_MIN_MAX = 4.5;
    var MIN_SIZE = 0.5
    var github_info = {repos : 2.5, commits : 5};
    var randomRepeat = $interval(vm.hitme, 2000);

    var generateError = function() {
      return(Math.random()/4 - 0.15);
    };
    var getRandomValue = function() {
      var minValue = 0.5;
      var maxValue = 5;
      return (Math.random() * maxValue) + minValue;
    };
    var getWeekHours = function(){
      var d = new Date();
      return ((d.getHours() + d.getMinutes() / 60 + d.getSeconds() / (60*60)) * d.getDay() + d.getHours()) / (24 * 7) * DIFF_MIN_MAX + MIN_SIZE;
    };
    var getTodaySeconds = function(){
      var d = new Date();
      return (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) / (60 * 60 * 24) * DIFF_MIN_MAX + MIN_SIZE;
    };
    var getGithubDimensions = function(){
      d3.json("github-activity.json",
               function(error, data){
                 github_info['commits'] = (data['commits'] / 200 * DIFF_MIN_MAX + MIN_SIZE);
                 github_info['repos'] = (data['repos'] / 20 * DIFF_MIN_MAX + MIN_SIZE);
               });
    };
    var spareRandom = null;

    function normalRandom(){
    	var val, u, v, s, mul;

    	if (spareRandom !== null){
    		val = spareRandom;
    		spareRandom = null;
    	}else{
    		do{
    			u = Math.random()*2-1;
    			v = Math.random()*2-1;

    			s = u*u+v*v;
    		} while(s === 0 || s >= 1);

    		mul = Math.sqrt(-2 * Math.log(s) / s);

    		val = u * mul;
    		spareRandom = v * mul;
    	}

    	return val / 14;	// 7 standard deviations on either side
    };
    function normalRandomInRange(min, max){
	     var val;
	     do {
		       val = normalRandom();
	     } while(val < min || val > max);

	    return val;
    };
    function lnRandomScaled(gmean, gstddev){
	    var r = normalRandomInRange(-1, 1);
	    r = r * Math.log(gstddev) + Math.log(gmean);
	    return Math.round(Math.exp(r));
    }
  }]);
