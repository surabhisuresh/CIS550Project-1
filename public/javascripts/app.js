var app = angular.module('angularApp',[]);

app.controller('searchController', function($scope, $http) {
    $scope.updateRes = function()  {
        $scope.data = [];
        var request = $http.get('/sql/' + $scope.key);
        request.success(function (data) {
            $scope.data = data;
        });
        request.error(function (data) {
            console.log('Error: ' + data);
        });
    };
});