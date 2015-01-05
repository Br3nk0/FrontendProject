/**
 * Created by BrenkoD on 25/11/2014.
 */
    var MediaController = function($scope, $http){
        //scope eigenschappen
        $scope.media=[];
        //scope methodes (filters, eventhandlers
        //data callbacks
        var onDataDownloaded = function(response){
            angular.forEach(response.data, function(value,key){

                var newMedia = new Media(value.Id,value.Jaartal, value.Naam, value.Beschrijving, value.Afbeelding);
                $scope.media.push(newMedia);
            });

        };
        //methods
        $http.get('./Data/data.json').then(onDataDownloaded);
    };



