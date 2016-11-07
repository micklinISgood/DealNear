
var items_data, selected_rate=null,selected_buyer=null,selected_pid=null;
function viewItems(){
	showItems();

	tmp_con = document.getElementById('item_content');
	
	$("#loadimg").show();
	$.getJSON('http://'+ window.location.host + '/userItems', {
        token:getCookie("token"),
        uid: getCookie("uid")
      }, function(data) {
      	
      	tmp_con.innerHTML = "";

      	 _data = data.data;
      	 items_data =_data; 
      	 if(_data=="error"){
      	 	logout();
      	 	return false;
      	 }

         for(var i in _data){
         	var iDiv = document.createElement('div');
			iDiv.id = _data[i]["pid"];
			iDiv.className = 'w3-third';
			var innerDiv = document.createElement('div');
			innerDiv.className = 'w3-card-12 w3-white';
			innerDiv.style="width:95%;padding:2%";
			if(_data[i]["status"]==0){
				var btn = document.createElement('button');
	      		btn.className= "btn btn-xs w3-gray pull-right";
	  			btn.onclick=deletePost;
	  			btn.id =_data[i]["pid"];
	  			sp = document.createElement('span');
	  			sp.className = "glyphicon  glyphicon-remove";
	  			sp.innerHTML= "Delete";
	  			btn.appendChild(sp);
	  			innerDiv.appendChild(btn);
  			}

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
			td3.innerHTML = "<b>Price</b>: ";
			tr3.appendChild(td3);
			var td4 = document.createElement('td');
			td4.align="right";
			var price = document.createElement('input');
			price.type="number"
			price.min="0"
			price.step="1"
			price.id ="price"+_data[i]["pid"];
			price.value = _data[i]["price"];
			td4.appendChild(price);
			tr3.appendChild(td4);
		

			var tr5 = document.createElement('tr');
			tr5.innerHTML = "<br/>"
			var tr6 = document.createElement('tr');
			var td4 = document.createElement('td');
			td4.align="left";
			var btn = document.createElement('button');
			btn.className = "w3-btn w3-indigo";
			btn.id = i;
			btn.onclick = updatePrice;
			btn.innerHTML = "Update";
			td4.appendChild(btn);
			tr6.appendChild(td4);
			if(_data[i]["status"]==0){
				var td5 = document.createElement('td');
				td5.align="right";
				var btn = document.createElement('button');
				btn.className = "w3-btn w3-red";
				btn.id = _data[i]["pid"];
				btn.onclick = markAsSold;
				btn.innerHTML = "Mark as Sold";
				td5.appendChild(btn);
			}else if(_data[i]["status"]==1){
				var td5 = document.createElement('td');
				td5.align="right";
				var btn = document.createElement('button');
				btn.className = "w3-btn w3-black";
				btn.innerHTML = "Sold";
				td5.appendChild(btn);
			}
			tr6.appendChild(td5);
			

			t.appendChild(tr0);
			t.appendChild(tr1);
			//t.appendChild(tr2);
			t.appendChild(tr3);
			t.appendChild(tr5);
			t.appendChild(tr6);
			innerDiv.appendChild(t);

			

			

			iDiv.appendChild(innerDiv);
			tmp_con.appendChild(iDiv);
         }
         
     });

}
function updatePrice () {
	newprice= $("#price"+items_data[this.id]["pid"]).val();
	pid = items_data[this.id]["pid"]
	if(newprice==items_data[this.id]["price"])return false;
	uid= getCookie("uid");
	token= getCookie("token");
	if(uid==""||token=="") return false;
	$.getJSON('http://'+ window.location.host + '/updatePrice', {
        uid: uid,
        token: token,
        pid:pid,
        price: newprice
      }, function(data) {
      	if(data.data=="error") return false;
	});


}
function markAsSold(){
	uid= getCookie("uid");
	token= getCookie("token");
	if(uid==""||token=="") return false;
	
	selected_pid = this;
	tmp_con = document.getElementById('mainguess');
	$.getJSON('http://'+ window.location.host + '/guessBuyer', {
        uid: uid,
        token: token
      }, function(data) {
      	if(data.data=="error") return false;
      	tmp_con.innerHTML = "";

      	names = data.data;
      	for(var i in names){
      		var th1 = document.createElement('th');
      		var a = document.createElement('a');
      		a.href='#su';
      		a.innerHTML=names[i]["name"];
      		a.id=names[i]["uid"];
      		th1.appendChild(a);
      		tmp_con.appendChild(th1);
      	}
      		var th1 = document.createElement('th');
      		var a = document.createElement('a');
      		a.href='#su';
      		a.innerHTML="Others";
      		a.id="0";
      		th1.appendChild(a);
      		tmp_con.appendChild(th1);

      		//critical declare listener after creation
      		$('a[href="#su"]').click(function(){
			    // console.log(this);

			    if(selected_buyer==null){
			    	selected_buyer=this;
			    	selected_buyer.style.color="#4da6ff";
				}else{
					selected_buyer.style.color="";
			    	selected_buyer = this;
			    	selected_buyer.style.color="#4da6ff";
				}
			});
      
      		selected_rate=null;
      		selected_buyer=null;
			openNav();
	});

}
$('a[href="#r"]').click(function(){
    //console.log(this.style.color);

    if(selected_rate==null){
    	selected_rate=this;
    	selected_rate.style.color="#4da6ff";
	}else{
		selected_rate.style.color="";
    	selected_rate = this;
    	selected_rate.style.color="#4da6ff";
	}
});



$('a[href="#marksold"]').click(function(){

    
	//console.log(selected_rate.id+","+selected_pid+","+selected_buyer.id);

    if(selected_rate==null || selected_buyer==null || selected_pid == null ) return false;

    uid= getCookie("uid");
	token= getCookie("token");

	if(uid==""||token=="") return false;

    $.getJSON('http://'+ window.location.host + '/markAsSold', {
        from_id: uid,
        token: token,
        pid:selected_pid.id,
        to_id:selected_buyer.id,
        rate:selected_rate.id
      }, function(data) {
      	selected_pid.className="w3-btn w3-black";
      	selected_pid.innerHTML="Sold";
      	selected_pid=null;
      	closeNav();
      	if(data.data=="error") return false;
	});
  
});

function deletePost() {
	uid= getCookie("uid");
	token= getCookie("token");
	if(uid==""||token=="") return false;
	node = this.parentNode;
	$.getJSON('http://'+ window.location.host + '/deleteItem', {
        uid: uid,
        token: token,
        pid:this.id
      }, function(data) {
      	if(data.data=="error") return false;
		node.innerHTML="";
	});
}
function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

