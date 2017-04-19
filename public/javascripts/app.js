var app = angular.module('angularApp',[]);

app .config(function ($locationProvider){
    $locationProvider.html5Mode(true).hashPrefix('!');
});

app.controller('AdminController',function($scope,$http,$interval){
    load_pictures();

    function load_pictures(){
        $http.get('/get_recipes').success(function(data){
            $scope.recipes=data;
        });
    };
});

app.controller('signInController', function($scope, $location, $http, $window) {

    $scope.Authenticate = function() {
        var request = $http.get('/validate/'+$scope.user+'&'+$scope.password);
        request.success(function (data) {
            console.log("Back again in signUp Controller");
            $scope.answer=data;
           if(data[0].IsAdmin==1)
            {

                //$location.path('/admin');
                //$location.replace();
                $window.location.href="/admin_recipe";


            }
            else
               $window.location.href="/user/"+$scope.user;



        });
        request.error(function (data) {
            console.log('Error: ' + data);
        });
    };
});

app.controller('searchController', function($scope, $http) {
    $scope.modes = ["Keyword", "Category", "Ingredient"];


    $scope.AllRecipes = function () {
        console.log("Inside recipes-app");
        var request = $http.get('/get_recipe');
        request.success(function (data) {
            $scope.recipes = data;
        });
        request.error(function (data) {
            console.log('Error: ' + data);
        });

    };

    $scope.getCat = function()  {
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
        var c = $scope.catMode['Category'];
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
            if (data.length!=0)
            {
                $scope.kdata = data;
                $scope.emptymsg = '';
            }
            else
            {
                $scope.emptymsg = 'Sorry! There are no matches.';
            }


        });
        request.error(function (data) {
            console.log('Error: ' + data);
        });
    };

    $scope.updateResIngr = function()  {
        $scope.idata = [];
        var request = $http.get('/searchByIngr/' + $scope.ingr1+'&'+$scope.ingr2+'&'+$scope.ingr3);
        request.success(function (data) {
            if (data.length!=0)
            {
                $scope.idata = data;
                $scope.emptymsg = '';
            }
            else
            {
                $scope.emptymsg = 'Sorry! There are no matches.';
            }
        });
        request.error(function (data) {
            console.log('Error: ' + data);
        });
    };

});

app.controller('addController', function($scope, $http) {
    $scope.getCat = function()  {
        $scope.categories = [];
        var request = $http.get('/get_cat');
        request.success(function (data) {
            $scope.categories = data;
        });
        request.error(function (data) {
            console.log('Error: ' + data);
        });
    };

    $scope.ingredients = [{qty:'q1', unit:'u1',ig: 'i1'}, {qty:'q2', unit:'u2',ig: 'i2'}];

    $scope.addNewIngr = function() {
        var newItemNo = $scope.ingredients.length+1;
        $scope.ingredients.push({'qty':'q'+newItemNo, 'unit':'u'+newItemNo, 'ig':'i'+newItemNo });
    };

    $scope.removeIngr = function() {
        var lastItem = $scope.ingredients.length-1;
        $scope.ingredients.splice(lastItem);
    };
});
