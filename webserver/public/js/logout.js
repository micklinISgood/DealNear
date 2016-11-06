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