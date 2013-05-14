
$(function() {
	// Setting up the jQuery UI components
	$( '.button' ).button();
	$( "#tabs" ).tabs();
	var mylat;
	var mylong;
	var mylat_last;
	var mylong_last;
	var bounds;
	var lastMarker;
	var actualMarker;

	function distance (lat2, long2, lat1, long1) {
		
  		rad = function(x) {return x*Math.PI/180;}

		var R     = 6378.137;                          //Radio de la tierra en km
		var dLat  = rad( lat2 - lat1 );
		var dLong = rad( long2 - long1 );

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;

		return d.toFixed(3);                      //Retorna tres decimales
	}

	// Setting up the Google map
    if (navigator.geolocation) {
    	// Locate position
    	navigator.geolocation.getCurrentPosition(displayPosition, errorFunction);
	} else {
   		alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
	}	

	// Success callback function
	function displayPosition(pos) {
	    mylat = pos.coords.latitude;
	    mylong = pos.coords.longitude;
	 
		$('#actual_lat').val(mylat);
		$('#actual_long').val(mylong);

		//Load Google Map
		var latlng = new google.maps.LatLng(mylat, mylong);		
			   
		map = new google.maps.Map(document.getElementById("map_canvas"), {mapTypeId: google.maps.MapTypeId.ROADMAP});

		// Zoom and center the map according to the markers
		bounds = new google.maps.LatLngBounds();

		//Add actual-location marker
		actualMarker = new google.maps.Marker({
			position: latlng, 
			map: map, 
			title:"You are here"
		});
		bounds.extend(latlng);

		//Add last-location marker
		if (localStorage.lat && localStorage.lng){
			mylat_last=localStorage.lat;
			mylong_last= localStorage.lng;

			$("#distance").html(distance (mylat, mylong, localStorage.lat, localStorage.lng)+' km');
			lastMarker = new google.maps.Marker({
				position: new google.maps.LatLng(localStorage.lat, localStorage.lng), 
				map: map, 
				title:"You were here"
			});
			bounds.extend(new google.maps.LatLng(localStorage.lat, localStorage.lng));

			$('#last_lat').val(mylat_last);
			$('#last_long').val(mylong_last);
		}

		//Actualizar localStorage
		localStorage.lat=mylat;
		localStorage.lng=mylong;
	}

	// Error callback function
	function errorFunction(pos) {
		alert('Error!');
	}
	
	// Resize google map 
	$('#map_button').on('click',function(){
		google.maps.event.trigger($("#map_canvas")[0], 'resize');
		map.fitBounds(bounds);
	});


	//Updating markers

   	$('#actual_pos').submit(function(){
     
   		var actual_lat = $('#actual_lat').val();
   		var actual_long = $('#actual_long').val();

   		//Actualizar localStorage
		localStorage.lat= actual_lat;
		localStorage.lng= actual_long;
		mylat=actual_lat;
		mylong=actual_long;

		// Updating maker
		actualMarker.setPosition(new google.maps.LatLng(actual_lat, actual_long));

		bounds.extend(new google.maps.LatLng(actual_lat, actual_long));
		// Resize google map 
		google.maps.event.trigger($("#map_canvas")[0], 'resize');
		map.fitBounds(bounds);
		$("#distance").html(distance (mylat, mylong, mylat_last, mylong_last) +' km');
   		

   		
    	return false;
   	});

   	$('#last_pos').submit(function(){
     	var lat = $('#last_lat').val();
   		var lng = $('#last_long').val();
   		mylat_last = lat;
   		mylong_last = lng;
		// Updating maker
		lastMarker.setPosition(new google.maps.LatLng(lat, lng));
		bounds.extend(new google.maps.LatLng(lat, lng));

		// Resize google map 
		google.maps.event.trigger($("#map_canvas")[0], 'resize');
		map.fitBounds(bounds);
		$("#distance").html(distance (mylat, mylong, mylat_last, mylong_last)+' km');
    	return false;
   	});
});
