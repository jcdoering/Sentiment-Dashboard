'use strict';

/**
 * @ngdoc function
 * @name sentimentApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sentimentApp
 */
angular.module('sentimentApp')
  .controller('MainCtrl', function ($scope, $http, $filter, $timeout) {

	  $scope.series = ['Day'];

	  $scope.data = {};
	  $scope.labels = {};


	  $scope.onClick = function (points, evt) {
	    console.log(points, evt);
	  };

	  $scope.options = {
	  	responsive: true,
	  	maintainAspectRatio: false
	  }

 	$scope.moods = [
 		{mood: "RONAmood", company: "RONA", search: "#RONA", type: "hour", position: 0}, 
 		{mood: "CTmood", company: "Canadian Tire", search: "#canadiantire OR #thetire OR #crappytire", type: "hour", position: 0}, 
 		{mood: "BLICmood", company: "BLIC", search: "#builtforlifeincanada", type: "hour", position: 0}, 
 		{mood: "CTSTOCKmood", company: "Canadian Tire Stock", search: "canadiantirestock", type: "hour", position: 0}, 
 		{mood: "WALMARTmood", company: "Walmart", search: "#walmart", type: "hour", position: 0},
 		{mood: "AMAZONmood", company: "Amazon", search: "#amazon", type: "hour", position: 0}, 
 		{mood: "LOWESmood", company: "Lowes", search: "#lowes", type: "hour", position: 0},
 		{mood: "ALIBABAmood", company: "Alibaba", search: "#alibaba", type: "hour", position: 0}, 
 		{mood: "HDmood", company: "Home Depot", search:  "#homedepot", type: "hour", position: 0}, 
 		{mood: "HBCmood", company: "HBC", search: "#hbc OR #hudsonsbay OR #thebay", type: "hour", position: 0}, 
 		{mood: "SEARSmood", company: "Sears", search: "#sears", type: "hour", position: 0}];

 	$scope.getData = function(mood, type){
 		
		$http.get('http://52.26.242.23:1337/twitter?mood=' + mood + '&type=' + type).
		  success(function(data, status, headers, config) {

		    $scope.labels[mood] = [];
		    $scope.data[mood] = [[]];
		    for(var year in data){
		    	for(var day in data[year]){
		    		//console.log(day)
		    		if(type == 'day'){
		    			$scope.labels[mood].push($filter('date')(dateFromDay(year,day), "longDate"))
		    		}
		    		else if(type == 'week'){
		    			$scope.labels[mood].push($filter('date')(dateFromWeek(year,day), "longDate"))
		    		}

		    		else if(type == 'hour'){
		    			$scope.labels[mood].push($filter('date')(dateFromHour(year,day), "short"))
		    		}
		    		$scope.data[mood][0].push(data[year][day]);
		    	}
		    }

		    console.log($scope.data)

		    $timeout(function(){
		    	$scope.$digest();
		    });

		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });

 	}


	function dateFromDay(year, day){
	  var date = new Date(year, 0); // initialize a date in `year-01-01`
	  return new Date(date.setDate(day)); // add the number of days
	}

	function dateFromHour(year, hour){
	  var date = new Date(year, 0); // initialize a date in `year-01-01`
	  var hourOfDay = hour%24;
	  var day = Math.floor(hour/24);

	  var newDate = new Date(date.setDate(day));
	  //console.log("hours " + new Date(newDate.setHours(hourOfDay)))
	  return new Date(newDate.setHours(hourOfDay)); // add the number of days
	}


	function dateFromWeek(year, week) {
	    var d = (1 + (week - 1) * 7); // 1st of January + 7 days for each week
	    return new Date(year, 0, d);
	}

 	$scope.moods.forEach(function(mood){
 		$scope.getData(mood.mood, "hour");
 	})



 	$scope.returnLabels = function(data, limit, position, index){
 
		var total = Math.abs(Math.ceil(data.length/limit));

		if($scope.moods[index].type == 'hour') limit = -12
		if(position < 0){
			position = 0;
			$scope.moods[index].position = 0;
		}

 		if(data.length > 4){

 			if(position < total){
 				var d = data.slice(limit-(Math.abs(position*limit)), data.length - (Math.abs(position*limit)))
 				//console.log(d);
 				return d;
 			}
 			else{
 				$scope.moods[index].position = 1;
 				var d = data.slice(limit-(Math.abs(total *limit)), data.length - (Math.abs(total *limit)));
 				//console.log(d);
 				return d;
 			}
 			
 		}

 		else{
 			return data;
 		}

 	}

 	$scope.returnData = function(data, limit, position, index){
 
		var total = Math.abs(Math.ceil(data[0].length/limit));
		if($scope.moods[index].type == 'hour') limit = -12
		if(position < 0){
			position = 0;
			$scope.moods[index].position = 0;
		}

 		if(data[0].length > 4){

 			if(position < total){
 				var d = data[0].slice(limit-(Math.abs(position*limit)), data[0].length - (Math.abs(position*limit)))
 				//console.log(d);
 				return [d];
 			}
 			else{
 				$scope.moods[index].position = 1;
 				var d = data[0].slice(limit-(Math.abs(total *limit)), data[0].length - (Math.abs(total *limit)));
 				//console.log(d);
 				return [d];
 			}
 			
 		}

 		else{
 			return data;
 		}

 	}


 	$timeout(function(){
 		console.log($scope.data);
 	},1000)

  });
