var current_time;
function fireChat() {
  document.getElementById("modal02").style.display = "block";
  var t = document.getElementById("chats");
  t.innerHTML = "";
  var line = document.getElementById("chatname");
  name =this.innerHTML.split(",")[0];
  line.innerHTML=name;
  // current_time = parseInt(new Date().getTime()/1000);
  current_time=0;
  loadChat(this.id);
}
function closeMsg() {
	$("#modal02").hide();
}
function loadChat(from_id){
	
	uid = getCookie("uid");
	token = getCookie("token");

	if(token=="" || uid==""){
		$('#drop2').show();
		$("#modal02").hide();
	}

	$.getJSON('http://'+ window.location.host + '/getChats', {
	    from_id: from_id,
	    to_id: uid,
	    token: token,
	    time:current_time
	  }, function(data) {
	  		data= data.data;
	  		console.log(data)
	  		if(data=="error") return false;

	  		var t = document.getElementById("chats");
	  		var talkname = document.getElementById("chatname");

	  		for(var i in data){
	  			var tr = document.createElement('tr');
	  			var td2 = document.createElement('td');
				if(data[i]["uid"]==uid){
					//left first then right to do two columns
					var td1 = document.createElement('td');
					td1.align="left";
					td1.innerHTML="";
					tr.appendChild(td1);
					td2.align="right";
					http_index = data[i]["text"].indexOf("http://");
					url = data[i]["text"].substring(http_index);
					if(url.length>0){
						data[i]["text"]=data[i]["text"].substring(0,http_index);
						td2.innerHTML=data[i]["text"];
						var a = document.createElement('a');
						a.href = url;
						a.innerHTML=url;
						td2.appendChild(a);
					}else{
						td2.innerHTML=data[i]["text"];
					}
				}else{
					td2.align="left";
					var td1 = document.createElement('td');
					td1.align="right";
					td1.innerHTML="";
					tr.appendChild(td1);
					http_index = data[i]["text"].indexOf("http://");
					url = data[i]["text"].substring(http_index);

					if(url.length>0){
						data[i]["text"]=data[i]["text"].substring(0,http_index);
						td2.innerHTML=talkname.innerHTML+" : "+data[i]["text"];
						var a = document.createElement('a');
						a.href = url;
						a.innerHTML=url;
						td2.appendChild(a);
					}else{
						td2.innerHTML=talkname.innerHTML+" : "+data[i]["text"];
					}
					
				}
	  		 	tr.appendChild(td2);
	  		 	t.insertBefore(tr, t.children[0]);
	  		}
	  	

	  });

}