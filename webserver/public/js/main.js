var sec;
var map, heatmap, infowindow, input, geo_marker; 
var markers =[];
var Chat = {};
Chat.socket = null;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 40.8075355, lng: -73.9625727},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  pos = map.getCenter()
  plot(pos.lat(),pos.lng())
  
  input = document.getElementById('pac-input');
  console.log(input)
  infowindow= new google.maps.InfoWindow({
    maxWidth: 150
  });
  geo_marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
 var searchBox = new google.maps.places.SearchBox(input);
 google.maps.event.addListener(searchBox,'places_changed', function(){
    infowindow.close();
    geo_marker.setVisible(false);
    var place = searchBox.getPlaces()[0];
    if (!place.geometry) {
      return;
    }
   
    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
       map.setCenter(place.geometry.location);
         map.setZoom(12);
      //map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(12);  // Why 17? Because it looks good.
    }

    plot(place.geometry.location.lat(),place.geometry.location.lng())
    geo_marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    geo_marker.setPosition(place.geometry.location);
    geo_marker.setVisible(true);
    
    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }
    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, geo_marker);
  });

}
function cleanMarkers(){
   for(var i in markers){
      markers[i].setMap(null);
   }
   markers = [];
}
function plot(_lat,_lng){
$.getJSON('http://'+ window.location.host + '/near_count', {
        lat: _lat,
        lng: _lng
      }, function(data) {
          cleanMarkers();
          _data = data.data;
          for(var i in _data){
          var content = _data[i]["name"]+", Sales:"+_data[i]["count"];
          var myLatLng = {lat: parseFloat(_data[i]["latitude"]), lng: parseFloat(_data[i]["longitude"])};
          var markerImage = new google.maps.MarkerImage("https://chart.googleapis.com/chart?chst=d_bubble_text_small&&chld=bb%7C"+content+"%7CC6EF8C%7C000000",
                new google.maps.Size(content.length*10, content.length*2),
                new google.maps.Point(0, 0),
                new google.maps.Point(0, content.length));
          var marker = new google.maps.Marker({
            position: myLatLng,
            labelContent: _data[i]["name"]+","+_data[i]["count"],
            map: map,
            //anchor: new google.maps.Point(0,content.length),
            icon:markerImage,
            animation: google.maps.Animation.DROP
          });
          //console.log(marker.getPosition().lat()+","+marker.getPosition().lng());
          google.maps.event.addListener(marker, 'click', (function (marker) {
          return function () {
          //redirect
              setCookie("lat", marker.getPosition().lat(), 1);
              setCookie("lng", marker.getPosition().lng(), 1);
              window.location.href = 'http://'+ window.location.host + '/market.html';

            }
          })(marker));

          markers.push(marker);
        }
      });
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

