define([
  'app',
], Ready(function(app) {
  app.controller('homeCtrl', [
    '$scope',
    'serviceNormalA',
    'serviceNormalB',
    function($scope, serviceNormalA, serviceNormalB) {
      $scope.location = 'homeCtrl';
    }
  ])
  // return [
  //   '$scope',
  //   'serviceNormalA',
  //   'serviceNormalB',
  //   function($scope, serviceNormalA, serviceNormalB) {
  //     $scope.location = 'homeCtrl';
  //   }
  // ]
}))
