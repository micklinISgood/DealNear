function viewUserinfo(){
	console.log("popup user info and history");
	showUser ();
	getUser();
}

function getUser(){
	var sess = document.getElementById('session');
	sess.innerHTML="";
	$.getJSON('http://'+ window.location.host + '/getUser', {
        uid: getCookie("uid"),
        token: getCookie("token")
      }, function(data) {
      		console.log(data);
      		data=data.data;
      		var sess = document.getElementById('session');
      		// var sp = document.createElement('span');	
      		// sp.innerHTML= "Current Sessions";
      		// sess.appendChild(sp);
      		// sess.appendChild(document.createElement('br'));

      		for(var i in data["session"]){
      			var div = document.createElement('div');
      			div.id= data["session"][i]["token"];
      			var li = document.createElement('li');
      			li.innerHTML = data["session"][i]["type"]+" , "+epoch2date(data["session"][i]["time"])
      			div.appendChild(li);
      			var btn = document.createElement('button');
      			btn.className= "btn btn-xs btn-danger";
      			btn.onclick=deleteSession;
      			sp = document.createElement('span');
      			sp.className = "glyphicon  glyphicon-remove";
      			sp.innerHTML= "Delete";
      			btn.appendChild(sp);
      			div.appendChild(btn);
      			sess.appendChild(div);
      		}
      			//document.getElementById('upInfo');
     });
}
function deleteSession () {
	console.log(this.parentNode.id);
	query = "#"+this.parentNode.id;
	l= document.getElementById(this.parentNode.id);
	console.log(l);
	l.innerHTML="";

}