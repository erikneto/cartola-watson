'use strict';

/* App Module */

var expertiseapp = angular.module('expertiseapp', [
    'ExpertiseController'
]);


'use strict';

/* Controllers */

var ExpertiseController = angular.module('ExpertiseController', []);



ExpertiseController.controller('ExpCtrl', ['$scope','$http',
    function CogCtrl($scope,$http) {
        $scope.title = "Select the filter and click start";
        $scope.sortType     = 'Pillar'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.resources = [];
        $scope.searchResource = '';
        $scope.resource = { Name: ''};
        var newrow = {};

         

        $http({
            method: 'GET',
            url: '/data'
           }).then(function successCallback(response) {
                $scope.headers = [];
                for (var key in response.data[0]) {
                    $scope.headers.push(key);
                }

               var i;
               var x;
               for(i=0 ; i < response.data.length; i++){
                  for (x=0;x<$scope.headers.length;x++){
                      if(!response.data[i][$scope.headers[x]])
                          response.data[i][$scope.headers[x]] = '';
                      newrow[$scope.headers[x]] = response.data[i][$scope.headers[x]];
                      
                  }
                  //alert(JSON.stringify(newrow));
                  $scope.resources.push(clone(newrow));
                      
                  if($scope.resources[$scope.resources.length-1]['Contact ID']){
                      $scope.loadBP($scope.resources[$scope.resources.length-1]);
                  }
                  
               }

               
        });
        
        $scope.loadBP = function(person){
            $http({
                method: 'GET',
                url: 'https://w3.api.ibm.com/common/run/bluepages/userid/' + person['Contact ID'].trim() + '/*?client_id=b778cb4b-cbb6-4322-99e1-933a193a237d'
            }).then(function successCallback(response) {
                
                person.Name = toTitleCase(attributebyname(response.data.search.entry[0].attribute,'cn'));
                person.Tieline = attributebyname(response.data.search.entry[0].attribute,'tieline');  
                person.Phone = attributebyname(response.data.search.entry[0].attribute,'telephoneNumber');
                person.Mobile = attributebyname(response.data.search.entry[0].attribute,'mobile');  
                
                
                
                
            });
        };
        
        $scope.sorter = function(val){
            return val[$scope.sortType];
        }
        
        $scope.toggleSort = function(index) {

            if($scope.sortType === index){
                $scope.sortReverse = !$scope.sortReverse;
            }
            $scope.sortType = index;
           
        };
        

        $scope.PersonSelected = function(person){
            $scope.resource = clone(person);
            $http({
                method: 'GET',
                url: 'https://w3.api.ibm.com/common/run/bluepages/userid/' + person['Contact ID'].trim() + '/*?client_id=b778cb4b-cbb6-4322-99e1-933a193a237d'
            }).then(function successCallback(response) {
                
                $scope.resource.jobrole = attributebyname(response.data.search.entry[0].attribute,'jobresponsibilities');
                
                
            });
            $("#myModal").modal();                
            
         };


    }]);


function attributebyname(array, name){
    var value = '';
    var x;
    for(x = 0;x<array.length;x++){
        if(array[x].name === name)
            value = array[x].value[0];
    }
    return value;
};

function clone(obj) {
    if (null === obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}