/**
 * Created by demeyerebrenko on 22/12/14.
 */
function success(position) {
    var mapcanvas = document.createElement('div');
    mapcanvas.id = 'mapcontainer';
    mapcanvas.style.height =  '427px';
    mapcanvas.style.width = '570px';

    document.querySelector('article').appendChild(mapcanvas);

    var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var options = {
        zoom: 15,
        center: coords,
        mapTypeControl: false,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.LARGE
        },
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    var map = new google.maps.Map(document.getElementById("mapcontainer"), options);



    var marker = new google.maps.Marker({
        position: coords,
        animation:google.maps.Animation.BOUNCE,
        map: map,
        title:"You are here!"

    });
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
} else {
    error('Geo Location is not supported');
}
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-8196211-5']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();