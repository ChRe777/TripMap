// -------------------------------------------------------------------------------------------------
// Module : Maps (View)
// Author : Christoph Reif
// Date	  : 2017-03-09
//
// Example: http://jsfiddle.net/mpsbhat/h6jskwws/2/
// -------------------------------------------------------------------------------------------------

var geocoder;
var map;
var directionsService;


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// INIT
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------


//
// initLegend
// 
function initLegend() {

	function positionLegendOnMap(legend) {
		map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(legend);
	}

	var legend = document.getElementById('legend');
			
	createMapLegend(legend);
	
	positionLegendOnMap(legend);
}

//
// initDirectionService
// 
function initDirectionService() {

	// https://developers.google.com/maps/documentation/javascript/examples/directions-waypoints?hl=de
	
 	directionsService = new google.maps.DirectionsService;

}

//
// initMap 
//
function initMap() {

	createGeocoder();

	createMap();
	
	initDirectionService();
	
	initLegend();
	
}


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// LIBRARY
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------


//
// addDotMarker
//
function addDotMarker(position) {

	// Origins, anchor positions and coordinates of the marker increase in the X
  	// direction to the right and in the Y direction down.
  	var image = {
    	url: 'https://cdn0.iconfinder.com/data/icons/octicons/1024/primitive-dot-20.png',
    	// This marker is 20 pixels wide by 32 pixels high.
    	size: new google.maps.Size(10, 20),
    	// The origin for this image is (0, 0).
    	origin: new google.maps.Point(0, 0),
    	// The anchor for this image is the base of the flagpole at (0, 32).
    	anchor: new google.maps.Point(5, 10)
  	};
  
	var markerOpt = {
		map: map,
		icon : image,
		position: position
	};
	
	var marker = new google.maps.Marker(markerOpt);
		
	return marker;
}

//
// addDefaultMarker
//
function addDefaultMarker(position) {
 
	var markerOpt = {
		map: map,
		position: position
	};
	
	var marker = new google.maps.Marker(markerOpt);
		
	return marker;
}

//
// removeMarker
//
function removeMarker(marker) {
	marker.setMap(null);
}

//
// addPolyLine
//
function addPolyLine(markerFrom, markerTo, style) {

	var path = [markerFrom.getPosition(), markerTo.getPosition()];
	
	var polyline = new google.maps.Polyline(style);
	polyline.setPath(path);
	
	return polyline;
}

//
// addPolyLineWithPath
//
function addPolyLineWithPath(path, style) {

	//var path = [markerFrom.getPosition(), markerTo.getPosition()];
	
	var polyline = new google.maps.Polyline(style);
	polyline.setPath(path);
	
	return polyline;
}

//
// removePolyLine
//
function removePolyLine(polyLine) {
	polyLine.setMap(null);
}

//
// addFlightRoute
//
function addFlightRoute(positionFrom, positionTo, flightStyle) {
	return addRoute(positionFrom, positionTo, flightStyle);
}

//
// removeFlightRoute
//
function removeFlightRoute(flight) {
	removeRoute(flight);
}

//
// addRoute
//
function addRoute(positionFrom, positionTo, routeStyle) {

	var markerFrom = addDotMarker  (positionFrom);
	var markerTo   = addDotMarker  (positionTo  );
	var polyLine   = addPolyLine(markerFrom, markerTo, routeStyle);
	
	var obj = {
		markerFrom 	: markerFrom,
		markerTo 	: markerTo,
		polyLine 	: polyLine
	};
	
	return obj;
}

//
// addRoadRoute
//
function addRoadRoute(path, routeRoadStyle) {

	var positionFrom = path[0];
	var positionTo   = path[path.length - 1];

	var markerFrom = addDotMarker  (positionFrom);
	var markerTo   = addDotMarker  (positionTo  );
	var polyLine   = addPolyLineWithPath(path, routeRoadStyle);
	
	var obj = {
		markerFrom 	: markerFrom,
		markerTo 	: markerTo,
		polyLine 	: polyLine
	};
	
	return obj;
}

//
// removeRoute
//
function removeRoute(route) {

	removeMarker(route.markerFrom);
	removeMarker(route.markerTo);
	removePolyLine(route.polyLine);

}

//
// addRouteOnRoad
//

function addRouteOnRoad() {
			
		//directionsRenderer.setDirections(response);
			
		//var route = response.routes[0];
			
		//debugRoute(route);
					
}


//
// addLocation
//
function addLocation(position) {
	return addDefaultMarker(position);
}

//
// removeLocation
//
function removeLocation(marker) {
	removeMarker(marker);
}



// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// FACTORY - create or destroy map item by type
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------


//
// createMap
// 
function createMap() {

	var latlngCenter = new google.maps.LatLng(0, 0);
	
	// https://developers.google.com/maps/documentation/javascript/style-reference
/*	
var foo = [
  {
    "featureType": "all",
    "stylers": [
      { "color": "#C0C0C0" }
    ]
  },{
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      { "color": "#CCFFFF" }
    ]
  },{
    "featureType": "transit",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  }
];
*/

var styles = 
[
	{
    	"featureType": "transit.line",
    	/*"elementType": "labels",*/
    	"stylers": 
    	[
      		{ "visibility" : "off" }
    	]
  	}
];
	
    var mapOptions = {
		zoom	: 1,
		center	: latlngCenter,
		styles  : styles,
		
    };
	
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	
}

//
// createGeocoder
// 
function createGeocoder() {

	geocoder = new google.maps.Geocoder();
	
}

//
// createMapLegend
// 
function createMapLegend(legend) {

	var items = [
		{
			name: "Flight",
			path: "M 0 3 l 8 0   m 2 0 l 8 0   m 2 0 l 8 0   m 2 0 l 8 0",
			color: '#CC0099',
			strokeWidth: 2,
		},
		{
			name: "Car",
			path: "M 0 3 l 50 0 ",
			color: '#33ccff',
			strokeWidth: 2,
		},
		{
			name: "Bus",
			path: "M 0 3 l 50 0 ",
			color: '#0077ff',
			strokeWidth: 3,
		},
		{
			name: "Train",
			path: "M 0 3 l 8 0 l 0 -2 l 0 4   l 0 -2 l 8 0 l 0 -2 l 0 4   l 0 -2 l 8 0 l 0 -2 l 0 4   l 0 -2 l 8 0 l 0 -2 l 0 4  l 0 -2 l 8 0 l 0 -2 l 0 4",
			color: '#515151',
			strokeWidth: 2,
		},
		{
			name: "Ship",
			path: "M 0 3 l 12 0   m 2 0 l 12 0  m 2 0 l 12 0",
			color: '#ff3300',
			strokeWidth: 2,
		}
	];
	
	function createLegendItem(item) {
		var name = item.name;
		var path = item.path;
		var color = item.color;
		var strokeWidth = item.strokeWidth;
	
		var div = document.createElement('div');
		div.innerHTML = '<svg style="width:35px; height:5px; border:0px solid green;"><path stroke="'+color+'" stroke-width="'+strokeWidth+'" fill="none" d="' + path + '" /></svg>&nbsp;' + name;
	
		legend.appendChild(div);
	}
	
	items.forEach(createLegendItem);
	
	
}

//
// createMapItem
//
function createMapItem(item) {

	
	function getBoundsFlight(item) {
	
		var bounds = new google.maps.LatLngBounds();
				
		bounds.extend(item.airportFrom.geometry.location);
		bounds.extend(item.airportTo.geometry.location);
		
		return bounds;
	}
	
	function getBoundsShip(item) {
		var bounds = new google.maps.LatLngBounds();
				
		bounds.extend(item.harbourFrom.geometry.location);
		bounds.extend(item.harbourTo.geometry.location);
		
		return bounds;
	}
	
	function getBoundsCarBusTrain(item) {
	
		var bounds = new google.maps.LatLngBounds();
				
		bounds.extend(item.addressFrom.geometry.location);
		bounds.extend(item.addressTo.geometry.location);
		
		return bounds;
	}
	
	function getBoundsLocation(item) {
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(item.address.geometry.location);
		return bounds;
	}
	
	function getBoundsRoad(item) {
		var bounds = new google.maps.LatLngBounds();
		bounds.union(item.result.bounds);
		return bounds;	
	}
	

	function createFlight(item) {
		
		var shortDashedLineStyle = {
        	path: 'M 0 -1 L 0 2',
        	strokeOpacity: 1,
        	strokeWeight: 2,
    	};
    	    	
    	// Size 512x512
    	
    	var planeIcon = {
    		path			: "M438.8,320.6c-3.6-3.1-147.2-107.2-147.2-107.2c-0.2-0.2-0.4-0.4-0.5-0.5c-5.5-5.6-5.2-10.4-5.6-18.8c0,0-0.9-69-2.2-92  S270,64,256,64c0,0,0,0,0,0s0,0,0,0c-14,0-25.9,15-27.2,38s-2.2,92-2.2,92c-0.4,8.4-0.1,13.2-5.6,18.8c-0.2,0.2-0.4,0.4-0.5,0.5  c0,0-143.5,104.1-147.2,107.2s-9.2,7.8-9.2,18.2c0,12.2,3.6,13.7,10.6,11.6c0,0,140.2-39.5,145.4-40.8s7.9,0.6,8.3,7.5  s0.8,46.4,0.9,51s-0.6,4.7-2.9,7.4l-32,40.8c-1.7,2-2.7,4.5-2.7,7.3c0,0,0,6.1,0,12.4s2.8,7.3,8.2,4.9s32.6-17.4,32.6-17.4  c0.7-0.3,4.6-1.9,6.4-1.9c4.2,0,8-0.1,8.8,6.2c1.3,11.4,4.9,20.3,8.5,20.3c0,0,0,0,0,0s0,0,0,0c3.6,0,7.2-8.9,8.5-20.3  c0.7-6.3,4.6-6.2,8.8-6.2c1.8,0,5.7,1.6,6.4,1.9c0,0,27.2,15,32.6,17.4s8.2,1.4,8.2-4.9s0-12.4,0-12.4c0-2.8-1-5.4-2.7-7.3l-32-40.8  c-2.3-2.7-2.9-2.9-2.9-7.4s0.5-44.1,0.9-51s3.1-8.8,8.3-7.5s145.4,40.8,145.4,40.8c7.1,2.1,10.6,0.6,10.6-11.6  C448,328.4,442.5,323.7,438.8,320.6z",
			anchor			: new google.maps.Point(256, 256),
			strokeOpacity	: 1,
    		fillOpacity		: 1,
        	strokeWeight	: 1,
        	scale 			: 0.05,
        	rotation		: 0,
        	strokeColor		: '#000000',
        	fillColor		: '#000000',
		};
		
		var polyLineStyleFlight = {
			strokeColor: '#CC0099',
			strokeOpacity: 0,
			icons: [
				{
			  		icon	: shortDashedLineStyle,
			  		offset	: '50%',
			  		repeat	: '10px'
				},
				{
					icon	: planeIcon,
					offset	: '25%',
					repeat	: '50%',
				}
			],
			strokeWeight: 2,
			geodesic: true,
			map: map
		};
	
		var positionFrom = item.airportFrom.geometry.location;
		var positionTo   = item.airportTo.geometry.location;
				
		return addFlightRoute(positionFrom, positionTo, polyLineStyleFlight);		
	};
	
	function createCar(item) {
	
		var polyLineStyleCar = {
			strokeColor: '#33ccff',
			strokeOpacity: 1.0,
			strokeWeight: 2,
			geodesic: false,
			map: map
		};
		
		var positionFrom = item.addressFrom.geometry.location;
		var positionTo   = item.addressTo.geometry.location;
				
		return addRoute(positionFrom, positionTo, polyLineStyleCar);
		
	};
	
	function createBus(item) {
		
		var polyLineStyleBus = {
			strokeColor: '#0077ff',
			strokeOpacity: 1.0,
			strokeWeight: 3,
			geodesic: false,
			map: map
		};
	
		var positionFrom = item.addressFrom.geometry.location;
		var positionTo   = item.addressTo.geometry.location;
				
		return addRoute(positionFrom, positionTo, polyLineStyleBus);
	};

	function createTrain(item) {
	
	    var tLineStyle = {
			path: 'M 0 -10 L 0 0 M 1 -5 l -2 0',
			strokeOpacity: 1,
			strokeWeight: 2,
			scale: 1,
    	};
    
		var polyLineStyleTrain = {
			strokeColor: '#515151',
			strokeOpacity: 0,
			icons: [{
			  icon: tLineStyle,
			  offset: '50%',
			  repeat: '10px'
			}],
			strokeWeight: 2,
			geodesic: true,
			map: map
		};
	
		var positionFrom = item.addressFrom.geometry.location;
		var positionTo   = item.addressTo.geometry.location;
				
		return addRoute(positionFrom, positionTo, polyLineStyleTrain);
		
	}
	
	function createShip(item) {
		
		var longDashedLineStyle = {
        	path: 'M 0 -1 L 0 4',
        	strokeOpacity: 1,
        	strokeWeight: 2,
    	};
    
		var polyLineStyleShip = {
			strokeColor: '#ff3300',
			strokeOpacity: 0,
			icons: [{
			  icon: longDashedLineStyle,
			  offset: '50%',
			  repeat: '15px'
			}],
			strokeWeight: 2,
			geodesic: false,
			map: map
		};
		
		var positionFrom = item.harbourFrom.geometry.location;
		var positionTo   = item.harbourTo.geometry.location;
			
		return addRoute(positionFrom, positionTo, polyLineStyleShip);	
		
	}

	function createLocation(item) {
		return addDefaultMarker(item.address.geometry.location);
	}
	
	function createRoad(item) {
	
		// getPolyLineStyle
		//
    	function getPolyLineStyle(travelType) {
    

			// Car
			//
			var polyLineStyleCar = {
				strokeColor: '#33ccff',
				strokeOpacity: 1.0,
				strokeWeight: 4,
				geodesic: false,
				map: map
			};
	
			// Train
			//	
			var polyLineStyleTrain = {
				strokeColor: '#515151',
				strokeOpacity: 1,
				strokeWeight: 4,
				geodesic: false,
				map: map
			};
		
			// Bus
			//
			var polyLineStyleBus = {
				strokeColor: '#0077ff',
				strokeOpacity: 1.0,
				strokeWeight: 4,
				geodesic: false,
				map: map
			};
	
			// Other
			var polyLineStyleOther = {
				strokeColor: '#ff0000',
				strokeOpacity: 1.0,
				strokeWeight: 4,
				geodesic: false,
				map: map
			};
			
				
			if (travelType == ITEM_TRAVEL_TYPE.CAR)
				return polyLineStyleCar;
			
			if (travelType == ITEM_TRAVEL_TYPE.BUS)
				return polyLineStyleBus;
				
			if (travelType == ITEM_TRAVEL_TYPE.TRAIN)
				return polyLineStyleTrain;
				
			return polyLineStyleOther;
		}
		
		// https://mapicons.mapsmarker.com/markers/transportation/aerial-transportation/airport/
		
		var dotMarkerIcon = {
			url		: 'https://cdn0.iconfinder.com/data/icons/octicons/1024/primitive-dot-20.png',
			size	: new google.maps.Size(10, 20),
			origin	: new google.maps.Point(0, 0),
			anchor	: new google.maps.Point(5, 10)
		};
  	
		var markerStyleRoad = {
			icon : dotMarkerIcon,
		};
	
		//https://developers.google.com/maps/documentation/javascript/reference#DirectionsRendererOptions
	
	  	var directionsRenderer = new google.maps.DirectionsRenderer;
  	
  		directionsRenderer.setMap(map);
  	
	 	var options = {
	 		suppressInfoWindows : true,
	 		suppressMarkers : false,
	 		polylineOptions : getPolyLineStyle(item.travelType),
	 		markerOptions	: markerStyleRoad,
	 	};
	 	
	 	directionsRenderer.setOptions(options);
	 	directionsRenderer.setDirections(item.response);
	 			
		item.directionsRenderer = directionsRenderer;
	}
	
	
	
	switch (item.type) {
		
			// Flight
			//
			case ITEM_TYPE.FLIGHT:
				item.mapObj = createFlight(item);
				item.bounds = getBoundsFlight(item);
				break;
			
			// Ship
			//
			case ITEM_TYPE.SHIP:
				item.mapObj = createShip(item);
				item.bounds = getBoundsShip(item);
				break;
			
			// Bus, Car or Train
			//
			case ITEM_TYPE.BUS_CAR_TRAIN:
			
				switch (item.subType) {
				
					case ITEM_SUB_TYPE.CAR:
						item.mapObj = createCar(item);
						break;
					
					case ITEM_SUB_TYPE.BUS:
						item.mapObj = createBus(item);
						break;
						
					case ITEM_SUB_TYPE.TRAIN:
						item.mapObj = createTrain(item);
						break;
				}
				
				item.bounds = getBoundsCarBusTrain(item);
	
				break;
		
			// Location
			//
			case ITEM_TYPE.LOCATION:
				item.mapObj = createLocation(item);
				item.bounds = getBoundsLocation(item);
				break;
				
			// Road
			//
			case ITEM_TYPE.ROAD:
				item.mapObj = createRoad(item);
				item.bounds = getBoundsRoad(item);
				break;
	}
			
}

//
// destroyMapItem
// 
function destroyMapItem(item) {

	switch (item.type) {
	
		// Flight
		case ITEM_TYPE.FLIGHT:
			removeRoute(item.mapObj);
			item.mapObj = null;
			break;
		
		// Ship
		case ITEM_TYPE.SHIP:
			removeRoute(item.mapObj);
			item.mapObj = null;
			break;
			
		// Bus, Car or Train
		case ITEM_TYPE.BUS_CAR_TRAIN:
			removeRoute(item.mapObj);
			item.mapObj = null;
			break;
		
		// Location
		case ITEM_TYPE.LOCATION:
			removeMarker(item.mapObj);
			item.mapObj = null;
			break;
		
		// Road	
		case ITEM_TYPE.ROAD:
			//removeRouteRoad(item);
			
			item.directionsRenderer.setMap(null);
			
			//item.mapObj = null;
			break;
			
	}

}



// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// COMMANDS 
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------


//
// updateMap
// 
function updateMap(items, item, itemChangedType) {

	function updateFitBounds(items) {
	
		if (items.length == 0) {
			return;
		}

		var bounds = new google.maps.LatLngBounds();
	
		items.forEach(
			function(item) {
				bounds = bounds.union(item.bounds);
			}
		);
		
		map.fitBounds(bounds);
	}

	function updateMapItemAdded(item) {
		createMapItem(item);	
	}

	function updateMapItemRemoved(item) {
		destroyMapItem(item);
	}

	if (itemChangedType == ITEMS_CHANGED_TYPE.ITEM_ADDED) {
		updateMapItemAdded(item);
	}  
	else if (itemChangedType == ITEMS_CHANGED_TYPE.ITEM_REMOVED) {
		updateMapItemRemoved(item);
	}
	
	updateFitBounds(items);	
}
