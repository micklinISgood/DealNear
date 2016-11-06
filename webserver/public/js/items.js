
var items_data;
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
			var btn = document.createElement('button');
      		btn.className= "btn btn-xs w3-gray pull-right";
  			btn.onclick=deletePost;
  			btn.id =_data[i]["pid"];
  			sp = document.createElement('span');
  			sp.className = "glyphicon  glyphicon-remove";
  			sp.innerHTML= "Delete";
  			btn.appendChild(sp);
  			innerDiv.appendChild(btn);

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
	console.log(items_data[this.id]);
	console.log($("#price"+items_data[this.id]["pid"]));
}
function markAsSold(){
	console.log(this.id);
}
function deletePost() {
	console.log(this.id);
}

