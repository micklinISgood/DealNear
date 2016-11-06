

function viewItems(){
	showItems();

	tmp_con = document.getElementById('items');
	tmp_con.innerHTML = "";
	$.getJSON('http://'+ window.location.host + '/userItems', {
        token:getCookie("token"),
        uid: getCookie("uid")
      }, function(data) {
      	 _data = data.data;
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
			btn.innerHTML = "Update";
			innerDiv.appendChild(btn);

			var btn = document.createElement('button');
			btn.className = "w3-btn w3-red";
			btn.id = _data[i]["p_uid"]+","+_data[i]["pid"];
			btn.onclick = sendMsg;
			btn.innerHTML = "Sold";
			innerDiv.appendChild(btn);
			

			iDiv.appendChild(innerDiv);
			tmp_con.appendChild(iDiv);
         }
         
     });

};