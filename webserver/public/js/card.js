var input;
function init() {
input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);
 google.maps.event.addListener(searchBox,'places_changed', function(){
    
    var place = searchBox.getPlaces()[0];
    if (!place.geometry) {
      return;
    }
   
    loadPost(place.geometry.location.lat(),place.geometry.location.lng())
   
  });

}
function loadPost(_lat,_lng) {
	console.log(_lat+","+_lng);

}