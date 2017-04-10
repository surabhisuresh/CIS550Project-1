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

    $scope.updateResKey = function()  {
        $scope.data = [];
        var request = $http.get('/searchByKey/' + $scope.key);
        request.success(function (data) {
            $scope.data = data;
        });
        request.error(function (data) {
            console.log('Error: ' + data);
        });
    };
});