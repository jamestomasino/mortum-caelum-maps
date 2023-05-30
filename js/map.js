var map = null;
var mgr = null;
var mapTypes = {};
var mapTypeIds = [];
var labels_countries = [];
var labels_cities = [];

mapTypes['mortumcaelum'] = {
	getTileUrl: function(coord, zoom) {
		return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
			var bound = Math.pow(2, zoom);
			var url = 'tiles/' + zoom + "/" + coord.x + "/" + coord.y + '.jpg';
			//url = 'http://map.tomasino.org/' + url;
			return url;
		});
	},
	tileSize: new google.maps.Size(256, 256),
	isPng: true,
	maxZoom: 6,
	minZoom: 1,
	radius: 6378000,
	name: 'Mortum Caelum',
	credit: 'Image Credit: James Tomasino'
};

function getHorizontallyRepeatingTileUrl(coord, zoom, urlfunc) {
	var y = coord.y;
	var x = coord.x;
	var tileRange = 1 << zoom;
	if (y < 0 || y >= tileRange) {
		return null;
	}
	if (x < 0 || x >= tileRange) {
		x = (x % tileRange + tileRange) % tileRange;
	}
	return urlfunc({x:x,y:y}, zoom)
}

function initialize() {
	for (var key in mapTypes) {
		mapTypeIds.push(key);
	}
	var mapOptions = {
		zoom: 3,
		panControl: false,
		mapTypeControl: false,
		streetViewControl: false,
		overviewMapControl: false,
		zoomControl: true,
		scaleControl: true,
		scaleControlOptions: {
			position: google.maps.ControlPosition.BOTTOM_CENTER
		},

		center: new google.maps.LatLng(-31, 132),
		mapTypeControlOptions: {
			mapTypeIds: mapTypeIds,
		}
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	for (key in mapTypes) {
		map.mapTypes.set(key, new google.maps.ImageMapType(mapTypes[key]));
	}
	map.setMapTypeId('mortumcaelum');


	mgr = new MarkerManager(map);

	google.maps.event.addListener(mgr, 'loaded', function(){
		addMarkers();
		mgr.refresh();
		onZoomChange();
	});

	google.maps.event.addListener(map, 'click', onClick );
	google.maps.event.addListener(map, 'zoom_changed', onZoomChange );
}

function addMarkers () {
	for ( var i = 0; i < countries.length; ++i ) {
		var options = {
			position: new google.maps.LatLng ( countries[i].lat, countries[i].lon ),
			draggable: false,
			labelContent: countries[i].name,
			labelAnchor: new google.maps.Point(22,0),
			labelClass: "label_country",
			labelStyle: { opacity: 0.75 }
		};
		var marker = new MarkerWithLabel ( options );
		marker.setIcon ( 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=' ); // Blank gif base64
		labels_countries.push (marker);
		mgr.addMarker(marker, 0);
	}

	for ( var i = 0; i < cities.length; ++i ) {
		var align = cities[i].align || 'bottom';
				var options = {
			position: new google.maps.LatLng ( cities[i].lat, cities[i].lon ),
			draggable: false,
			labelContent: cities[i].name,
			labelClass: "label_city",
			labelStyle: { opacity: 0.75 }
		};
		var marker = new MarkerWithLabel ( options );
		marker.setIcon ( 'images/black-dot.png' ); // Blank gif base64
		labels_cities.push (marker);
		mgr.addMarker(marker, 3);
	}
}

function onZoomChange (){
	var zoom = map.getZoom();
	var countrySize = 0;
	var citySize = 0;
	switch (zoom) {
		case 0:
			countrySize = 8;
			citySize = 0;
			break;
		case 1:
			countrySize = 12;
			citySize = 0;
			break;
		case 2:
			countrySize = 18;
			citySize = 8;
			break;
		case 3:
			countrySize = 24;
			citySize = 12;
			break;
		case 4:
			countrySize = 36;
			citySize = 18;
			break;
		case 5:
			countrySize = 48;
			citySize = 24;
			break;
		case 6:
			countrySize = 54;
			citySize = 32;
			break;
	}

	for (var i = 0; i < labels_countries.length; ++i ){
		var marker = labels_countries[i];
		marker.labelStyle = { 'opacity': 0.75, 'font-size': countrySize + 'px', 'height': (countrySize + 10) + 'px' };
	}
	for (var i = 0; i < labels_cities.length; ++i ){
		var align = cities[i].align || 'bottom';
		var marker = labels_cities[i];
		var point;
		switch ( align ) {
			case 'top':
				point = new google.maps.Point(22, (citySize + 8) * 1.25 );
				break;
			case 'left':
				point = new google.maps.Point(22,0);
				break;
			case 'right':
				point = new google.maps.Point(22,0);
				break;
			case 'bottom':
			default:
				point = new google.maps.Point(22,0);
				break;
		}

		marker.labelStyle = { 'opacity': 0.75, 'font-size': citySize + 'px' };
		marker.labelAnchor = point;
	}
}





































function onClick (event) {
	console.log (event.latLng);
	placeMarker(event.latLng);
}

function onMarkerClick (event) {
	this['infoWindow'].open(map, this);
}

function placeMarker(location) {
	console.log(location.lat(), location.lng());
	var title = "'lat': " + location.lat().toFixed(4) + ", 'lon': " + location.lng().toFixed(4);
	var markerOptions = {};
	markerOptions.title = title;
	markerOptions.map = map;
	markerOptions.position = location;

	var marker = new google.maps.Marker(markerOptions);
	google.maps.event.addListener(marker, 'click', onMarkerClick);
	var infoWindowOptions = {};
	infoWindowOptions.content = title;
	marker['infoWindow'] = new google.maps.InfoWindow ( infoWindowOptions );
	marker['infoWindow'].open(map, marker);

	mgr.addMarker(marker, 4);
	mgr.refresh();
}

function setupWeatherMarkers() {

}

