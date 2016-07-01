'use strict';

/* App Module */

var CartolaWatsonApp = angular.module('CartolaWatsonApp', [
    'CWController'
]);


'use strict';

/* Controllers */

var CWController = angular.module('CWController', []);



CWController.controller('CWCtrl', ['$scope','$http',
    function CogCtrl($scope,$http) {
        $scope.title = "Select the filter and click start";
        $scope.sortType     = 'Pillar'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.players = [];

         

        $http({
            method: 'GET',
            url: 'https://api.cartolafc.globo.com/atletas/mercado'
           }).then(function successCallback(response) {
                $scope.headers = [];
                for (var key in response.data[0]) {
                    $scope.headers.push(key);
                }

               var i;
               var x;
               for(i=0 ; i < response.data.atletas.length; i++){
                   $scope.players.push($scope.headers.atletas[x]);
                }
                  
       });

    }]);

