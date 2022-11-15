let map;
let markers = [];

// load map
function init(){
	let myOptions = {
		zoom      : 12,
		center    : { lat:42.337331,lng:-71.089432},
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	let element = document.getElementById('map');
  	map = new google.maps.Map(element, myOptions);
  	addMarkers();
}

// Add bus markers to map
async function addMarkers(){
	// get bus data
	let locations = await getBusLocations();

	// loop through data, add bus markers
	locations.forEach(function(bus){
		let marker = getMarker(bus.id);		
		if (marker){
			moveMarker(marker,bus);
		}
		else{
			addMarker(bus);			
		}
	});

	// timer
	console.log(new Date());
	setTimeout(addMarkers,15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	let url = 'https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=22&include=trip';	
	let response = await fetch(url);
	let json     = await response.json();
	return json.data;
}

function addMarker(bus){
	let icon = getIcon(bus);
	let marker = new google.maps.Marker({
	    position: {
	    	lat: bus.attributes.latitude, 
	    	lng: bus.attributes.longitude
	    },
	    map: map,
	    icon: icon,
	    id: bus.id
	});
	markers.push(marker);
}

function getIcon(bus){
	// select icon based on bus direction
	if (bus.attributes.direction_id === 0) {
		return 'red.png';
	}
	return 'blue.png';	
}

function moveMarker(marker,bus) {
	// change icon if bus has changed direction
	let icon = getIcon(bus);
	marker.setIcon(icon);

	// move icon to new lat/lon
    marker.setPosition( {
    	lat: bus.attributes.latitude, 
    	lng: bus.attributes.longitude
	});
}

function getMarker(id){
	let marker = markers.find(function(item){
		return item.id === id;
	});
	return marker;
}

window.onload = init;
