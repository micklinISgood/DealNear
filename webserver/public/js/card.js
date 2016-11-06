var input, map, selector,infowindow, selector_btn;
function init() {
input = document.getElementById('pac-input');
$("#post_form").hide();

if(getCookie("lat")==""){
   	window.location.href = 'http://'+ window.location.host; 
}else{
    loadPost(getCookie("lat"),getCookie("lng"));
}

if( !(getCookie("uid")=="" || getCookie("token")=="" || getCookie("name")=="")){


	login =document.getElementById('login');
	login.innerHTML=getCookie("name").substring(1,getCookie("name").length-1);
	drop =document.getElementById('drop2');
	drop.innerHTML="";
	var li = document.createElement("li");
    var link = document.createElement("a");             
    var text = document.createTextNode("Info");
    link.appendChild(text);
    //link.onclick = logout;
    li.appendChild(link);
    drop.appendChild(li);
    li = document.createElement("li");
    link = document.createElement("a");             
    text = document.createTextNode("Items");
    link.appendChild(text);
    //link.onclick = logout;
    li.appendChild(link);
    drop.appendChild(li);
    li = document.createElement("li");
    link = document.createElement("a");             
    text = document.createTextNode("Logout");
    link.appendChild(text);
    link.onclick = logout;
    li.appendChild(link);
    drop.appendChild(li);
	loadMsg(getCookie("uid"),getCookie("token"));
	post =document.getElementById('post');
	post.onclick = addnewpost; 
	loc =document.getElementById('locbtn1');
	loc.onclick = openMap; 
	// postbtn =document.getElementById('submitbtn');
	// postbtn.onclick = handlePosting;

}else{
	// in1 =document.getElementById('in');
	// in1.className = "button";
	// in1.onclick =login;
	var link = 'http://'+ window.location.host+'/login.html';
	var iframe = document.createElement('iframe');
	iframe.frameBorder=0;
	iframe.width="400px";
	iframe.height="450px";
	iframe.id="randomid";
	iframe.setAttribute("src", link);
	document.getElementById("drop2").appendChild(iframe);
	iframe.onload = login;
	$('#randomid').contents().find('button').click(function() {
    	alert('submit');
	});
	// var stuffWasChanged = iframe.contentDocument.stuffWasChanged;
	// if (stuffWasChanged == "true") window.location.reload();
	//window.open(in1.href, "login", 'width=400,height=600,scrollbars=yes'); 
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

function openMap(){
		if(selector_btn!=null) selector_btn.innerHTML="Location selector";
		selector_btn = this;
		selector_btn.innerHTML="Click on map for change";
	    //var myLatLng = {lat: parseFloat(_data[i]["latitude"]), lng: parseFloat(_data[i]["longitude"])};

	    if(selector==null){
    		addMarker(map.getCenter(), map);
    	}else{
    		selector.setPosition(map.getCenter());
    	}
}
function handlePosting(){
	all = this.parentNode.childNodes[1].childNodes[0];
	for(var i in all){
	
		console.log(all[i]);
	}

}
//clone location selector
$(document).on('click', '.btn-add', function(e)
    {
        e.preventDefault();


        var controlForm = $('#controlform'),
            currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);

        
        cur_name = newEntry.find('button')[0].name;
        newEntry.find('button')[0].innerHTML="Location selector";
        id = cur_name.substring(cur_name.lastIndexOf("[")+1,cur_name.length-1);
        id = parseInt(id)+1;
        newEntry.find('button')[0].name = "location["+id+"]"; 
        
        newEntry.find('input')[0].name = "location["+id+"][name]";
        newEntry.find('input')[1].name = "location["+id+"][lat]";
        newEntry.find('input')[2].name = "location["+id+"][lng]";
        
        newEntry.find('input')[0].value='';
        newEntry.find('input')[1].value='';
        newEntry.find('input')[2].value='';
        newEntry.find('input')[1].placeholder="click on selector";
        newEntry.find('input')[2].placeholder="click on selector";

        newEntry.find('button')[0].onclick = openMap;
        controlForm.find('.entry:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-remove', function(e)
    {
		$(this).parents('.entry:first').remove();

		e.preventDefault();
		return false;
	});
$("#cancelbtn").click(function(){
       $("#content").show();
	   $("#post_form").hide(); 
	   selector_btn=null;        
    });
function addHidden(theForm, key, value) {
    // Create a hidden input element, and append it to the form:
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    theForm.appendChild(input);
}
function addnewpost() {
	 $("#content").hide();
	 $("#post_form").show();
	 map = new google.maps.Map(document.getElementById('map-selector'), {
    	zoom: 15,
    	center: {lat: parseFloat(getCookie("lat")), lng: parseFloat(getCookie("lng"))},
    	mapTypeId: google.maps.MapTypeId.ROADMAP
  	});
	theForm = document.forms['item_form'];

 
	theForm["uid"].value=getCookie("uid"); 	
	theForm["token"].value=getCookie("token");

	google.maps.event.addListener(map, 'click', function(event) {
		if(selector_btn==null){
			alert("select an location selector from the form first");
		}else{
 
    	selector.setPosition(event.latLng);
    	


    	latQuery= selector_btn.name+"[lat]";
    	lngQuery= selector_btn.name+"[lng]";
    	console.log(latQuery);
    	theForm[latQuery].value=event.latLng.lat().toFixed(5);
    	theForm[lngQuery].value=event.latLng.lng().toFixed(5);
    	}
  	});
  	
	
	
}
function getMarker() {
	console.log(this);
}
function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
    selector = new google.maps.Marker({
    position: location,
    map: map
  });
}
function login() {

	if(this.contentWindow.location=='http://'+ window.location.host+'/market.html')
		window.location.reload();
	//console.log("login");
	//$('#my_popup').popup();
	//window.open('http://'+ window.location.host+'/login.html', "login", 'width=400,height=450,scrollbars=yes');  
}
function logout() {
	$.getJSON('http://'+ window.location.host + '/logout', {
        uid: getCookie("uid"),
        token: getCookie("token"),
      }, function(data) { 
      		console.log(data);
      		if(data.data=='ok'){
      			setCookie("uid","",0);
      			setCookie("name","",0);
      			setCookie("token","",0);
      			window.location.href = 'http://'+ window.location.host+'/market.html'; 
      		}
      });
}
function viewUserinfo(){
	console.log("popup user info and history");
}
function loadPost(_lat,_lng) {
	tmp_con = document.getElementById('content');
	tmp_con.innerHTML = "";
	$.getJSON('http://'+ window.location.host + '/near_post', {
        lat: _lat,
        lng: _lng,
        uid: getCookie("uid")
      }, function(data) {
      	 _data = data.data;
         for(var i in _data){
         	var iDiv = document.createElement('div');
			iDiv.id = _data[i]["pid"];
			iDiv.className = 'w3-third';
			var innerDiv = document.createElement('div');
			innerDiv.className = 'w3-card-12 w3-white';
			innerDiv.style="width:95%;padding:2%";
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
  ids = this.id.split(",");
  console.log(ids);
  var captionText = document.getElementById("caption");
  captionText.innerHTML = this.alt;
}
function sendMsg(element) {
	// console.log(this.id);
	ids = this.id.split(",");
	// console.log(ids);
	$.getJSON('http://'+ window.location.host + '/sendMsg', {
        from_id: getCookie("uid"),
        token: getCookie("token"),
        to_id: ids[0],
        text: 'http://'+ window.location.host + '/p/'+ids[1]+'\n I am interested in this.'
      }, function(data) { 
      		// console.log(data);
      });

}

function fireChatroom(){
	console.log(this.id);
	console.log(getCookie("uid"));

}
function loadMsg(_uid,_token) {
$.getJSON('http://'+ window.location.host + '/inbox', {
        uid: _uid,
        token:_token
      }, function(data) {
      	 _data = data.data;
         for(var i in _data){
         	var d = new Date(0);
    		d.setUTCSeconds(_data[i]["time"]);
         	var u = document.getElementById('u'+i);
         	u.innerHTML = _data[i]["name"]+", "+d.toString().substring(0,21);
         	u.id = _data[i]["to_id"];
         	u.onclick = fireChatroom;
         	var m = document.getElementById('m'+i);
         	m.innerHTML =_data[i]["text"];
         }
         
      });
}