/**
 * Created by BrenkoD on 25/11/2014.
 */
(function(){
    "use strict";

    var app = angular.module("app",["ngRoute"]);

    app.config(function($routeProvider){

        $routeProvider.when("/Content",{
            templateUrl:"./media.html",
            controller: "MediaController"
        })
            .otherwise({redirectTo:"/Content"});
    });
})();