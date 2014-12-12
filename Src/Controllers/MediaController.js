/**
 * Created by BrenkoD on 25/11/2014.
 */

(function(){
    var MediaController = function($scope, $http){
        //scope eigenschappen
        $scope.media=[];
        $scope.jaren=[];
        //scope methodes (filters, eventhandlers
        //data callbacks
        var onDataDownloaded = function(response){
            angular.forEach(response.data, function(value,key){

                var newMedia = new Media(value.Id,value.Jaartal, value.Naam, value.Beschrijving, value.Afbeelding);

                if($scope.jaren.indexOf(value.Jaartal)<0){
                    $scope.jaren.push(value.Jaartal);
                }
                $scope.media.push(newMedia);
            });

        };
        //methods
        var data = $http.get('./Data/data.json').then(onDataDownloaded);
    };
    var app = angular.module("app");
    app.controller("MediaController", ["$scope","$http",MediaController]);

})();