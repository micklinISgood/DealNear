var input;
var msg_id =[];
function init() {
input = document.getElementById('pac-input');

loadMsg(3);
console.log(msg_id);
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
function clearmsgid(){
	msg_id =[];
}
function loadMsg(_uid) {
clearmsgid();
$.getJSON('http://'+ window.location.host + '/inbox', {
        uid: _uid
      }, function(data) {
      	 _data = data.data;
         for(var i in _data){
         	var d = new Date(0);
    		d.setUTCSeconds(_data[i]["time"]);
         	var u = document.getElementById('u'+i);
         	u.innerHTML = _data[i]["name"]+", "+d.toString().substring(0,21);
         	var m = document.getElementById('m'+i);
         	m.innerHTML =_data[i]["text"];
         	msg_id.push(_data[i]["to_id"]);
         }
         
      });
}