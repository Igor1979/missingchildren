var t, v;
var radius = 0;
var map, circle, circleOptions, setCenter, marker;
var update_timeout = null;


function loadScript(src, callback) {

    var script = document.createElement("script");
    script.type = "text/javascript";
    if (callback) script.onload = callback;
    document.getElementsByTagName("head")[0].appendChild(script);
    script.src = src;
}


loadScript('http://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=initialize',
    function() {
        console.log('google-loader has been loaded, but not the maps-API ');
    });




function handleAge() {
    var ages = document.getElementsByName('age');
    for (var i = 0, length = ages.length; i < length; i++) {
        if (ages[i].checked) {
            v = parseFloat(ages[i].value);
            break;
        }
    }
}

function handleTime() {
    var times = document.getElementsByName('time');
    for (var i = 0, length = times.length; i < length; i++) {
        if (times[i].checked) {
            t = parseFloat(times[i].value);
            break;
        }
    }
}

function initialize() { /*В этой функции (initialize) мы указываем настройки (координаты центра, приближение, тип карты) и создаём карту. В результате внутри блока my_map появится обычная карта Google.*/
    var brdLatlng = new google.maps.LatLng(46.749591, 36.793752); //Berdyansk
    var myOptions = {
        zoom: 16,
        center: brdLatlng,
        mapTypeId: google.maps.MapTypeId.roadmap
    }
    map = new google.maps.Map(document.getElementById("my_map"), myOptions);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            map.setCenter(pos);
          }, function() {
            console.log('Error: The Geolocation service failed.');
          });
        } else {
          console.log('Error: Your browser doesn\'t support geolocation.');
    }

    

    circleOptions = { 
        fillColor: "#00AAFF",
        fillOpacity: 0.5,
        strokeColor: "#FFAA00",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        clickable: false
    }

    google.maps.event.addListener(map, 'click', function(event) {
        radius = v * t; // КіЛОМЕТРИ
        if (marker != undefined) {
            marker.setMap(null);
        }
        marker = new google.maps.Marker({
            position: event.latLng,
            clickable: false
        });
        marker.setMap(map);
        circleOptions.center = event.latLng;
        circleOptions.radius = radius * 1000;
        console.log(circleOptions.radius);
        if (circle != undefined) {
            circle.setMap(null);
        }
        circle = new google.maps.Circle(circleOptions);
        circle.setMap(map);
    });

}




rad = function(x) {
    return x * Math.PI / 180;
}

distHaversine = function(p1, p2) {
    var R = 6371; // earth's mean radius in km
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d.toFixed(3);
}