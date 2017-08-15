define([
  'app.js',
], Ready(function(app) {
  app.controller('barCtrl', [
    '$scope',
    'serviceNormalB',
    'serviceNormalC',
    function($scope, serviceNormalB, serviceNormalC) {
      $scope.location = 'barCtrl';
    }
  ])
}));
