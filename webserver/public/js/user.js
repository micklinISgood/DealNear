var u_data;
function viewUserinfo(){
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
      		
      		data=data.data;
      		if(data!="error"){
	      		var sess = document.getElementById('session');
	      
	      		cur_token=getCookie("token");
	      		for(var i in data["session"]){
	      			var div = document.createElement('div');
	      			div.id= data["session"][i]["token"];
	      			var li = document.createElement('li');
	      			li.innerHTML = data["session"][i]["type"]+" , "+epoch2date(data["session"][i]["time"])
	      			div.appendChild(li);

	      			if(data["session"][i]["token"] !=cur_token){
		      			var btn = document.createElement('button');
		      			btn.className= "btn btn-xs btn-danger";
		      			btn.onclick=deleteSession;
		      			sp = document.createElement('span');
		      			sp.className = "glyphicon  glyphicon-remove";
		      			sp.innerHTML= "Delete";
		      			btn.appendChild(sp);
		      			div.appendChild(btn);
	      			}
	      			
	      			sess.appendChild(div);
	      		}

	      		u_data = data["u_info"];
	      		u_data["pw"]=u_data["pw"].replace(/[\d]|a|e|i|o|u/gi,"*");
	      		uForm = document.forms['user_form'];
	      		uForm["name"].value=u_data["name"];
	      		uForm["phone"].value=u_data["phone"];
	      		uForm["email"].value=u_data["email"];
	      		uForm["pw"].value=u_data["pw"];

	      		upbtn=document.getElementById('upbtn');
	      		upbtn.onclick=submitUpadte;

	      	}else{
	      		logout();	
	      	}
      			//document.getElementById('upInfo');
     });
}

function deleteSession () {
	
	l = document.getElementById(this.parentNode.id);
	//confirm = prompt("Type 'y' to confirm the deletion");
	if(confirm('Are you sure you want to delete this session?')){
		data={};
		if( getCookie("uid")!=""){

		
			data["d_token"]=this.parentNode.id;
			// console.log(data);
			$.post('http://'+ window.location.host + '/deleteSession', {
				uid:getCookie("uid"),
				token:getCookie("token"),
				d_token:this.parentNode.id
			}, function(data) {
			
					l.innerHTML="";
			
			},'json');
		
		}else{
			logout();
		}
	}

}

function submitUpadte () {
	//console.log(this.parentNode.name.value);
	updata ={};
	if(this.parentNode.name.value!=u_data["name"]) updata["name"]=this.parentNode.name.value;
	if(this.parentNode.phone.value!=u_data["phone"]) updata["phone"]=this.parentNode.phone.value;
	if(this.parentNode.email.value!=u_data["email"]) updata["email"]=this.parentNode.email.value;
	if(this.parentNode.pw.value!=u_data["pw"]) updata["pw"]=this.parentNode.pw.value;

	//no update,return
	if (Object.keys(updata).length==0) return false;
	
	updata["uid"]=getCookie("uid");
	updata["token"]=getCookie("token");
	$.post('http://'+ window.location.host + '/updateUser', updata
			, function(data) {
				
				if(data.data=="error") return false;

				if("name" in updata){
					login =document.getElementById('login');
					login.innerHTML=updata["name"];
					setCookie("name",updata["name"],360);
				}
				getUser();
			},'json');


	//console.log("name" in updata);



}