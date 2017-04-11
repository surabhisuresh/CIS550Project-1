var app = angular.module('angularApp',[]);

app.controller('searchController', function($scope, $http) {
    $scope.modes = ["Keyword", "Category", "Ingredient"];

    $scope.getCat = function() {
        $scope.categories = [];
        var request = $http.get('/get_cat');
        request.success(function (data) {
            $scope.categories = data;
        });
        request.error(function (data) {
            console.log('Error: ' + data);
        });
    };

    $scope.updateResCat = function()  {
        $scope.cdata = [];
        var c = $scope.catMode['category'];
        var request = $http.get('/searchByCat/'+c);
        request.success(function (data) {
            $scope.cdata = data;
        });
        request.error(function (data) {
            console.log('Error: ' + data);
        });
    };

    $scope.updateResKey = function()  {
        $scope.kdata = [];
        var request = $http.get('/searchByKey/' + $scope.key);
        request.success(function (data) {
            $scope.kdata = data;
        });
        request.error(function (data) {
            console.log('Error: ' + data);
        });
    };

    $scope.updateResIngr = function()  {
        $scope.idata = [];
        var request = $http.get('/searchByIngr/' + $scope.ingr1+'_'+$scope.ingr2+'_'+$scope.ingr3);
        request.success(function (data) {
            $scope.idata = data;
        });
        request.error(function (data) {
            console.log('Error: ' + data);
        });
    };



});