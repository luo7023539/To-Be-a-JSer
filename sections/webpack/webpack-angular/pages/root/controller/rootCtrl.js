define([
  'app',
  'serviceNormalA',
  'serviceNormalB',
  'serviceNormalC',
  '../css/rootCtrl.css',
], Ready(function(app) {
  app.controller('rootCtrl', [
    '$scope',
    function($scope) {
      $scope.location = 'rootCtrl';
    }
  ])
  /*return [
    '$scope',
    function($scope) {
      $scope.location = 'rootCtrl';
    }
  ]*/
}));
