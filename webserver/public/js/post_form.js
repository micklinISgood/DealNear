var  map, selector, selector_btn;

function openMap(){
		if(selector_btn!=null) selector_btn.innerHTML="Location selector";
		selector_btn = this;
		selector_btn.innerHTML="Click on map for change";
	    //var myLatLng = {lat: parseFloat(_data[i]["latitude"]), lng: parseFloat(_data[i]["longitude"])};

	    if(selector==null){
    		addMarker(map.getCenter(), map);
            theForm = document.forms['item_form'];

            latQuery= selector_btn.name+"[lat]";
            lngQuery= selector_btn.name+"[lng]";
            nQuery= selector_btn.name+"[name]";
            theForm[nQuery].value=getCookie("loc_name");
            theForm[latQuery].value=getCookie("lat");
            theForm[lngQuery].value=getCookie("lng");

    	}else{
    		selector.setPosition(map.getCenter());
    	}
}

//clone location selector
$(document).on('click', '.btn-add', function(e)
    {
        e.preventDefault();


        var controlForm = $('#controlform'),
            currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);

        
        cur_name = newEntry.find('button')[0].name;
        newEntry.find('button')[0].innerHTML="Location selector";
        id = cur_name.substring(cur_name.lastIndexOf("[")+1,cur_name.length-1);
        id = parseInt(id)+1;
        newEntry.find('button')[0].name = "location["+id+"]"; 
        var searchBox = new google.maps.places.SearchBox(newEntry.find('input')[0]);
        google.maps.event.addListener(searchBox,'places_changed', function(){

        var place = searchBox.getPlaces()[0];
        if (!place.geometry) {
          return;
        }
        selector.setPosition(place.geometry.location);
        map.setCenter(place.geometry.location);
        setCookie("lat", place.geometry.location.lat().toFixed(5), 360);
        setCookie("lng", place.geometry.location.lng().toFixed(5), 360);
        setCookie("loc_name", place.name, 360);
        newEntry.find('input')[1].value=getCookie("lat");
        newEntry.find('input')[2].value=getCookie("lng");
        uplodlocation();

        });
        
        newEntry.find('input')[0].name = "location["+id+"][name]";
        newEntry.find('input')[1].name = "location["+id+"][lat]";
        newEntry.find('input')[2].name = "location["+id+"][lng]";
        
        newEntry.find('input')[0].value=getCookie("loc_name");
        newEntry.find('input')[1].value=getCookie("lat");
        newEntry.find('input')[2].value=getCookie("lng");
        newEntry.find('input')[1].placeholder="click on selector";
        newEntry.find('input')[2].placeholder="click on selector";

        controlForm.find('.entry:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-remove', function(e)
    {
		$(this).parents('.entry:first').remove();

		e.preventDefault();
		return false;
	});

$("#cancelbtn").click(function(){
    	backMarket();        
    });

function backMarket () {
	 $("#content").show();
     $("#user_info").hide();
	 $("#post_form").hide(); 
	  selector_btn=null;  

}
function addHidden(theForm, key, value) {
    // Create a hidden input element, and append it to the form:
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    theForm.appendChild(input);
}


function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
    selector = new google.maps.Marker({
    position: location,
    map: map
  });
}
function addnewpost() {
	 showPost();
	 map = new google.maps.Map(document.getElementById('map-selector'), {
    	zoom: 15,
    	center: {lat: parseFloat(getCookie("lat")), lng: parseFloat(getCookie("lng"))},
    	mapTypeId: google.maps.MapTypeId.ROADMAP
  	});

    addMarker(map.getCenter(), map);

	theForm = document.forms['item_form'];
    latQuery= "location[0][lat]";
    lngQuery= "location[0][lng]";
    nQuery= "location[0][name]";
    theForm[nQuery].value=getCookie("loc_name");
    theForm[latQuery].value=getCookie("lat");
    theForm[lngQuery].value=getCookie("lng");
    

    var searchBox = new google.maps.places.SearchBox(theForm["location[0][name]"]);
    google.maps.event.addListener(searchBox,'places_changed', function(){
    
    var place = searchBox.getPlaces()[0];
    if (!place.geometry) {
      return;
    }
    selector.setPosition(place.geometry.location);
    map.setCenter(place.geometry.location);
    setCookie("lat", place.geometry.location.lat().toFixed(5), 360);
    setCookie("lng", place.geometry.location.lng().toFixed(5), 360);
    setCookie("loc_name", place.name, 360);
    theForm[latQuery].value=getCookie("lat");
    theForm[lngQuery].value=getCookie("lng");
    uplodlocation();
   
    });
 
	theForm["uid"].value=getCookie("uid"); 	
	theForm["token"].value=getCookie("token");


	
}
