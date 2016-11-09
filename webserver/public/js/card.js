var input, map, selector,infowindow, selector_btn;
function init() {

showMain();

if(getCookie("lat")=="" ||getCookie("lng")==""){
   	setCookie("lat", "40.75890", 360);
    setCookie("lng", "-73.98513", 360);
    setCookie("loc_name", "Times Square", 360);
}

loadPost(getCookie("lat"),getCookie("lng"));


if( getCookie("uid")!="" && getCookie("token")!="" && getCookie("name")!=""){

	uplodlocation();
	login =document.getElementById('login2');
	login.text=getCookie("name").replace(/\"/g,"");
	span=document.createElement("span");
	span.className="caret";
	login.appendChild(span);
	drop =document.getElementById('drop2');
	drop.innerHTML="";
	var li = document.createElement("li");
    var link = document.createElement("a");             
    var text = document.createTextNode("Info");
    link.appendChild(text);
    link.onclick = viewUserinfo
    li.appendChild(link);
    drop.appendChild(li);
    li = document.createElement("li");
    link = document.createElement("a");             
    text = document.createTextNode("Items");
    link.appendChild(text);
    link.onclick = viewItems;
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
	// loc =document.getElementById('locbtn1');
	// loc.onclick = openMap; 


}else{

	var link = 'http://'+ window.location.host+'/login.html';
	var iframe = document.createElement('iframe');
	iframe.frameBorder=0;
	iframe.width="400px";
	iframe.height="450px";
	iframe.id="randomid";
	iframe.setAttribute("src", link);
	li = document.createElement("li");
	li.appendChild(iframe);
	document.getElementById("drop2").appendChild(li);
	iframe.onload = login;
	$("#inbox").hide();
	post =document.getElementById('post');
	post.onclick = requireLogin; 



}


function requireLogin () {
	$('#drop2').show();
	
	//document.getElementById('drop2').click();
	// $("#login").click();
}


input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);
 google.maps.event.addListener(searchBox,'places_changed', function(){
    
    var place = searchBox.getPlaces()[0];
    if (!place.geometry) {
      return;
    }
    backMarket(); 
    loadPost(place.geometry.location.lat(),place.geometry.location.lng())
    setCookie("lat", place.geometry.location.lat().toFixed(5), 360);
    setCookie("lng", place.geometry.location.lng().toFixed(5), 360);
    setCookie("loc_name", place.name, 360);
    uplodlocation();
   
  });



}


function login() {

	if(this.contentWindow.location !='http://'+ window.location.host+'/login.html')
	window.location.reload();
 
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
      	 uid = getCookie("uid");
      	 if(_data.length==0){
      	 	h2= document.createElement('h2');
      	 	center= document.createElement('center');
      	 	no_suff= document.createElement('p');
      	 	no_suff.innerHTML="Here is no stuff for sale. Try another location please."
      	 	center.appendChild(no_suff);
      	 	h2.appendChild(center);
      	 	tmp_con.appendChild(h2);
      	 }
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
				img.id =_data[i]["pid"];
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
			if (_data[i]["rate"] != null){tr2.innerHTML = "Seller Rate: "+_data[i]["rate"].toFixed(2);}

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

			//prevent self-msg
			if(_data[i]["p_uid"]!=uid){

				var btn = document.createElement('button');
				btn.className = "w3-btn w3-indigo";
				btn.id = _data[i]["p_uid"]+","+_data[i]["pid"];
				btn.onclick = sendMsg;
				btn.innerHTML = "Contact "+_data[i]["p_name"];
				innerDiv.appendChild(btn);
			}

			iDiv.appendChild(innerDiv);
			tmp_con.appendChild(iDiv);
         }
         
     });

}
// function clickPhoto(element) {
//   document.getElementById("img01").src =this.src;
//   document.getElementById("modal01").style.display = "block";
//   ids = this.id.split(",");
//   console.log(this);
//   var captionText = document.getElementById("caption");
//   captionText.innerHTML = this.alt;

// }
function sendMsg(element) {

	if(getCookie("uid")=="" ||getCookie("token")==""){
		// login2 = document.getElementById('login2');
		// login2.click();
		// $('#login').addClass('open');
		// // $('#login').click();
		// // $('#login').dropdown('toggle');
		// $('#login').attr('aria-expanded', true).focus();
		// $('#login').dropdown('toggle');

		$('#drop2').show();

		//console.log(document.getElementById('login2'));
		return false;
	}

	ids = this.id.split(",");
	// console.log(ids);
	$.post('http://'+ window.location.host + '/sendMsg', {
        from_id: getCookie("uid"),
        token: getCookie("token"),
        to_id: ids[0],
        text: 'I am interested in this. \n'+'http://'+ window.location.host + '/p/'+ids[1]
      }, function(data) {
				
				if(data.data=="error") return false;
				window.location.reload();
				
			},'json');


}

function fireChatroom(){
	console.log(this.id);
	console.log(getCookie("uid"));

}
function uplodlocation () {
	updata={}
	updata["uid"]= getCookie("uid");
	updata["token"]= getCookie("token");
	updata["lat"]= getCookie("lat");
	updata["lng"]= getCookie("lng");
	updata["loc_name"]= getCookie("loc_name");

	if(updata["uid"]==""||updata["token"]==""|| updata["lat"]==""||updata["lng"]==""||updata["loc_name"]=="") return false;

	$.post('http://'+ window.location.host + '/uploadUserloc', updata
			, function(data) {
				
				return false;

				
			},'json');

	
}




function loadMsg(_uid,_token) {



$.getJSON('http://'+ window.location.host + '/inbox', {
        uid: _uid,
        token:_token
      }, function(data) {
      	 _data = data.data;

      	 if(_data=="error") return false;
      	 var inbox = document.getElementById('inbox_msg');
		 inbox.innerHTML="";
         for(var i in _data){
      
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.innerHTML = _data[i]["name"]+", "+epoch2date(_data[i]["time"])+"<br>"+_data[i]["text"];;
            a.id= _data[i]["to_id"];
            a.onclick=fireChat;
            li.appendChild(a);
            inbox.appendChild(li);
         	var li = document.createElement('li');
      		li.role="separator";
      		li.className="divider";
         	inbox.appendChild(li);
         
         }
         
      });
}