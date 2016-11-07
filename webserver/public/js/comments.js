function clickPhoto() {
  document.getElementById("img01").src =this.src;
  document.getElementById("modal01").style.display = "block";

  // console.log(this.id);

  var c = document.getElementById('comments');
  var btn = document.getElementById('commentbtn');
  btn.value =this.id;
  btn.onclick =submitComment;

	$.getJSON('http://'+ window.location.host + '/getComments', {
	    pid: this.id
	  }, function(data) {
	  		data= data.data;
	  		c.innerHTML="";
	  		if(data=="error") return false;

	  		for(var i in data){
	  			var tr = document.createElement('tr');
	  			tr.innerHTML=data[i]["name"]+" #"+data[i]["uid"]+" : "+data[i]["text"];
	  			c.appendChild(tr);
	  		}
	  	

	  });

}
function closeComment() {
	$("#modal01").hide();
}
function submitComment(){
	uid = getCookie("uid");
	token = getCookie("token");

	if(token=="" || uid==""){
		$('#drop2').show();
		$("#modal01").hide();
	}

	var c = document.getElementById('cmts');
	var cmts = document.getElementById('comments');

	if(c.value.length==0 || this.value =="") return false;

	
	$.post('http://'+ window.location.host + '/putComment', {
	    pid: this.value,
	    uid: uid,
	    token: token,
	    text: c.value
	  }
			, function(data) {
				
				data= data.data;

	  		if(data=="error") return false;

	  		name = getCookie("name").replace(/\"/g,"");
	  
	  		var tr = document.createElement('tr');
	  		tr.innerHTML=name+" #"+uid+" : "+c.value;
	  		cmts.appendChild(tr);

				
			},'json');
	
}