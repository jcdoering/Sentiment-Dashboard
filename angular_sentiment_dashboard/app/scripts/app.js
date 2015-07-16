'use strict';

/**
 * @ngdoc overview
 * @name sentimentApp
 * @description
 * # sentimentApp
 *
 * Main module of the application.
 */
angular
  .module('sentimentApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'chart.js'
  ])
  .config(function ($routeProvider,$rootScopeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $rootScopeProvider.digestTtl(5);

  });
