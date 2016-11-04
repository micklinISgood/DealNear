var input;
var msg_id =[];
function init() {
input = document.getElementById('pac-input');

loadMsg(3);
if(getCookie("lat")==""){
   	window.location.href = 'http://'+ window.location.host; 
}else{
    loadPost(getCookie("lat"),getCookie("lng"));
}


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

	$.getJSON('http://'+ window.location.host + '/near_post', {
        lat: _lat,
        lng: _lng,
        uid: getCookie("uid")
      }, function(data) {
      	 _data = data.data;
         for(var i in _data){
         	console.log(_data[i]);
         	var iDiv = document.createElement('div');
			iDiv.id = _data[i]["pid"];
			iDiv.className = 'w3-third w3-padding-48';
			var innerDiv = document.createElement('div');
			innerDiv.className = 'w3-card-12 w3-white ';
			for ( var j in _data[i]["pics"]){
				var img = document.createElement('img');
				img.className ='w3-border w3-image'
				img.src = _data[i]["pics"][j];
				img.onclick = clickPhoto;
				innerDiv.appendChild(img);
			}
			var t = document.createElement('table');
			var tr1 = document.createElement('tr');
			var tr0 = document.createElement('tr');
			tr0.innerHTML = "<br/>"
			var td1 = document.createElement('td');
			td1.align="left";
			td1.innerHTML = _data[i]["title"];
			tr1.appendChild(td1);
			var td2 = document.createElement('td');
			td2.align="right";
			var d = new Date(0);
    		d.setUTCSeconds(_data[i]["cr_time"]);
			td2.innerHTML = d.toString().substring(0,21);
			tr1.appendChild(td2);
			var tr2 = document.createElement('tr');
			tr2.innerHTML = "Seller Rate: Unknown";
			if (_data[i]["rate"] != null){tr2.innerHTML = "Seller Rate: "+_data[i]["rate"];}

			var tr3 = document.createElement('tr');
			var td3 = document.createElement('td');
			td3.align="left";
			td3.innerHTML = "<b>Price</b>: "+_data[i]["price"];
			tr3.appendChild(td3);
			var td4 = document.createElement('td');
			td4.align="right";
			td4.innerHTML = "Watch: "+_data[i]["watch"];
			tr3.appendChild(td4);
			var tr4 = document.createElement('tr');
			tr4.innerHTML = "@"+ _data[i]["locs"];

			var tr5 = document.createElement('tr');
			tr5.innerHTML = "<br/>"


			t.appendChild(tr0);
			t.appendChild(tr1);
			t.appendChild(tr2);
			t.appendChild(tr3);
			t.appendChild(tr4);
			t.appendChild(tr5);
			innerDiv.appendChild(t);

			var btn = document.createElement('button');
			btn.className = "w3-btn w3-indigo";
			btn.id = _data[i]["p_uid"]+","+_data[i]["pid"];
			btn.onclick = sendMsg;
			btn.innerHTML = "Contact "+_data[i]["p_name"];
			innerDiv.appendChild(btn);

			iDiv.appendChild(innerDiv);
			document.getElementById('content').appendChild(iDiv);
         }
         
     });

}
function clickPhoto(element) {
  document.getElementById("img01").src =this.src;
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = this.alt;
}
function sendMsg(element) {
	console.log(this.id);
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