function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}
function showUser(){
	$("#post_form").hide();
	$("#user_info").show();
	$("#content").hide();
	$("#items").hide();
}
function showMain(){
	$("#post_form").hide();
	$("#user_info").hide();
	$("#content").show();
	$("#items").hide();
}
function showPost(){
	$("#post_form").show();
	$("#user_info").hide();
	$("#content").hide();
	$("#items").hide();
	$("#pac-input").hide();
}
function showItems(){
	$("#post_form").hide();
	$("#user_info").hide();
	$("#content").hide();
	$("#items").show();
}
function epoch2date(epoch){
	var d = new Date(0);
    d.setUTCSeconds(epoch);
	return d.toString().substring(0,21);
}