/**
 * Created by BrenkoD on 25/11/2014.
 */
(function(){
    "use strict";

    var app = angular.module("app",["ngRoute"]);

    app.config(function($routeProvider){

        /*$routeProvider.when("/Content",{
            templateUrl:"./media.html",
            controller: "MediaController"
        })
            .otherwise({redirectTo:"/Content"});*/
    });
   /* app.run(['$anchorScroll',function($anchorScroll){
        $anchorScroll.yOffset = 50;
    }])
        .controller('headerCtrl', ['$anchorScroll', '$location', '$scope',
            function ($anchorScroll, $location, $scope) {
                $scope.gotoAnchor = function(x) {
                    var newHash = 'anchor' + x;
                    if ($location.hash() !== newHash) {
                        // set the $location.hash to `newHash` and
                        // $anchorScroll will automatically scroll to it
                        $location.hash('anchor' + x);
                    } else {
                        // call $anchorScroll() explicitly,
                        // since $location.hash hasn't changed
                        $anchorScroll();
                    }
                };
            }
        ]);*/

})();

