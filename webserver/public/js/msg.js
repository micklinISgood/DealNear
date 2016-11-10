var current_time, periodic;
function fireChat() {
  document.getElementById("modal02").style.display = "block";

  var line = document.getElementById("chatname");
  name =this.innerHTML.split(",")[0];
  line.innerHTML=name;
  var btn = document.getElementById("chatbtn");
  btn.onclick = sendchatMsg;
  btn.value = this.id;
  // current_time = parseInt(new Date().getTime()/1000);
  current_time=0;
  loadChat(this.id);
  periodic = setInterval(loadChat, 5000, this.id);
}
function closeMsg() {
	$("#modal02").hide();
	clearInterval(periodic);
	_uid = getCookie("uid");
	_token = getCookie("token");
	loadMsg(_uid,_token);
}
function sendchatMsg(){
	// console.log(this.value);
	var text = document.getElementById("chatmsg");
	// console.log(text.value);
	msg = text.value;
	
	if(msg.length==0 || this.id==null) return false;
	uid = getCookie("uid");
	token = getCookie("token");


	if(token=="" || uid==""){
		window.location.reload();
	}

	$.post('http://'+ window.location.host + '/sendMsg', {
        from_id: uid,
        token: token,
        to_id: this.value,
        text: msg
      }, function(data) {
				
				if(data.data=="error") return false;
				var t = document.getElementById("chats");
				var tr = document.createElement('tr');
	  			
				
				//left first then right to do two columns
				var td1 = document.createElement('td');
				td1.align="left";
				td1.innerHTML="";
				tr.appendChild(td1);
				var td2 = document.createElement('td');
				td2.align="right";
				td2.innerHTML=msg;
				tr.appendChild(td2);

	  		 	t.appendChild(tr);
				//loadChat(this.value);

				
			},'json');
}
function loadChat(from_id){
	
	uid = getCookie("uid");
	token = getCookie("token");

	if(token=="" || uid==""){
		window.location.reload();
	}

	$.getJSON('http://'+ window.location.host + '/getChats', {
	    from_id: from_id,
	    to_id: uid,
	    token: token,
	    time:current_time
	  }, function(data) {
	  		data= data.data;
	
	  		if(data=="error") return false;

	  		var t = document.getElementById("chats");
	  		t.innerHTML="";
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