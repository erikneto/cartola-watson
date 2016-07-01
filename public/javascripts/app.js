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
        $scope.filtro = {};
        $scope.sorter = 'nome';
        $scope.posicoes = [
            [1, 'Goleiro'],
            [2, 'Lateral'],
            [3, 'Zagueiro'],
            [4, 'Meia'],
            [5, 'Atacante'],
            [6, 'Treinador']
        ];

         

        $http({
            method: 'GET',
            url: '/api/loadcartola'
           }).then(function successCallback(response) {
                $scope.headers = [];
                for (var key in response.data[0]) {
                    $scope.headers.push(key);
                }


               var i;
               var x;
               for(i=0 ; i < response.data.atletas.length; i++){
                   $scope.players.push(response.data.atletas[i]);
                }
                  
       });
       
        $scope.toggleSort = function(index) {

            if($scope.sorter === index){
                $scope.sortReverse = !$scope.sortReverse;
            }
            $scope.sorter = index;
           
        };
       
       
       $scope.filtrar = function(){
           $scope.players = [];
            $http({
                method: 'GET',
                url: '/api/loadcartola/'+ $scope.posicao[0]
               }).then(function successCallback(response) {
                    $scope.headers = [];
                    for (var key in response.data[0]) {
                        $scope.headers.push(key);
                    }


                   var i;
                   var x;
                   for(i=0 ; i < response.data.atletas.length; i++){
                       $scope.players.push(response.data.atletas[i]);
                    }

            });
       };

    }]);

