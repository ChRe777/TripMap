// -------------------------------------------------------------------------------------------------
// Module : Maps (View)
// Author : Christoph Reif
// Date	  : 2017-03-09
//
// Example: http://jsfiddle.net/mpsbhat/h6jskwws/2/
// -------------------------------------------------------------------------------------------------

var geocoder;
var map;


// -------------------------------------------------------------------------------------------------
// INIT
// -------------------------------------------------------------------------------------------------

//
// initMap 
//
function initMap() {

    geocoder = new google.maps.Geocoder();
	
    var latlngCenter = new google.maps.LatLng(0, 0);
	
    var mapOptions = {
		zoom	: 1,
		center	: latlngCenter
    };
	
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	
}

// -------------------------------------------------------------------------------------------------
// LIBRARY
// -------------------------------------------------------------------------------------------------

//
// addMarker
//
function addMarker(position) {

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
	
	geodesicPoly = new google.maps.Polyline(style);
	geodesicPoly.setPath(path);
	
	return geodesicPoly;
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

	var markerFrom = addMarker  (positionFrom);
	var markerTo   = addMarker  (positionTo  );
	var polyLine   = addPolyLine(markerFrom, markerTo, flightStyle);
	
	var obj = {
		markerFrom 	: markerFrom,
		markerTo 	: markerTo,
		polyLine 	: polyLine
	};
	
	return obj;
}

//
// removeFlightRoute
//
function removeFlightRoute(flight) {

	removeMarker(flight.markerFrom);
	removeMarker(flight.markerTo);
	removePolyLine(flight.polyLine);

}

//
// addRoute
//
function addRoute(positionFrom, positionTo, routeStyle) {

	var markerFrom = addMarker  (positionFrom);
	var markerTo   = addMarker  (positionTo  );
	var polyLine   = addPolyLine(markerFrom, markerTo, routeStyle);
	
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



// -------------------------------------------------------------------------------------------------
// FACTORY - create or destroy map item by type
// -------------------------------------------------------------------------------------------------

//
// createMapItem
//
function createMapItem(item) {

	function createFlight(item) {
		
		var shortDashedLineStyle = {
        	path: 'M 0 -1 L 0 2',
        	strokeOpacity: 1,
        	strokeWeight: 2,
    	};
    
		var polyLineStyleFlight = {
			strokeColor: '#CC0099',
			strokeOpacity: 0,
			icons: [{
			  icon: shortDashedLineStyle,
			  offset: '50%',
			  repeat: '10px'
			}],
			strokeWeight: 2,
			geodesic: true,
			map: map
		};
	
		var positionFrom = new google.maps.LatLng(item.airportFrom.latitude, item.airportFrom.longitude);
		var positionTo   = new google.maps.LatLng(item.airportTo.latitude,   item.airportTo.longitude  );
				
		return addFlightRoute(positionFrom, positionTo, polyLineStyleFlight);		
	};
	
	function createCar(item) {
	
		var polyLineStyleCar = {
			strokeColor: '#770099',
			strokeOpacity: 1.0,
			strokeWeight: 2,
			geodesic: false,
			map: map
		};
		
		var positionFrom = item.resultFrom.geometry.location;
		var positionTo   = item.resultTo.geometry.location;
				
		return addRoute(positionFrom, positionTo, polyLineStyleCar);
		
	};
	
	function createBus(item) {
		
		var polyLineStyleBus = {
			strokeColor: '#220077',
			strokeOpacity: 1.0,
			strokeWeight: 3,
			geodesic: false,
			map: map
		};
	
		var positionFrom = item.resultFrom.geometry.location;
		var positionTo   = item.resultTo.geometry.location;
				
		return addRoute(positionFrom, positionTo, polyLineStyleBus);
	};

	function createTrain(item) {
	
	    var tLineStyle = {
			path: 'M 0 -1 L 0 10 M 1 5 l 2 0',
			strokeOpacity: 1,
			strokeWeight: 2,
    	};
    
		var polyLineStyleTrain = {
			strokeColor: '#220022',
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
	
		var positionFrom = item.resultFrom.geometry.location;
		var positionTo   = item.resultTo.geometry.location;
				
		return addRoute(positionFrom, positionTo, polyLineStyleTrain);
		
	}
	
	function createShip(item) {
		
		var longDashedLineStyle = {
        	path: 'M 0 -1 L 0 4',
        	strokeOpacity: 1,
        	strokeWeight: 2,
    	};
    
		var polyLineStyleFlight = {
			strokeColor: '#CC0099',
			strokeOpacity: 0,
			icons: [{
			  icon: longDashedLineStyle,
			  offset: '50%',
			  repeat: '10px'
			}],
			strokeWeight: 2,
			geodesic: false,
			map: map
		};
	
		var positionFrom = new google.maps.LatLng(item.airportFrom.latitude, item.airportFrom.longitude);
		var positionTo   = new google.maps.LatLng(item.airportTo.latitude,   item.airportTo.longitude  );
				
		return addFlightRoute(positionFrom, positionTo, polyLineStyleFlight);	
		
	}

	switch (item.type) {
		
			// Flight
			//
			case ITEM_TYPE.FLIGHT:
				item.flightRoute = createFlight(item);
			break;
			
			// Bus, Car or Train
			//
			case ITEM_TYPE.BUS_CAR_TRAIN:
			
				switch (item.subType) {
					case ITEM_SUB_TYPE.CAR:
						item.route = createCar(item);
					break;
					
					case ITEM_SUB_TYPE.BUS:
						item.route = createBus(item);
					break;
						
					case ITEM_SUB_TYPE.TRAIN:
						item.route = createTrain(item);
					break;
				}
				
			break;
		
			// Location
			//
			case ITEM_TYPE.LOCATION:
				item.marker = addMarker(item.position);
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
			removeFlightRoute(item.flightRoute);
			item.flightRoute = null;
			break;
		
		// Bus, Car or Train
		case ITEM_TYPE.BUS_CAR_TRAIN:
			removeRoute(item.route);
			item.route = null;
			break;
		
		// Location
		case ITEM_TYPE.LOCATION:
			removeMarker(item.marker);
			item.marker = null;
			break;
	}

}


// -------------------------------------------------------------------------------------------------
// COMMANDS 
// -------------------------------------------------------------------------------------------------

//
// updateMap
// 
function updateMap(items, item, itemChangedType) {

	function updateFitBounds(items) {
	
		function getBoundsFlight(item) {
			var bounds = new google.maps.LatLngBounds();
			bounds.extend(item.flightRoute.markerFrom.getPosition());
			bounds.extend(item.flightRoute.markerTo.getPosition());
			return bounds;
		}
	
		function getBoundsRoute(item) {
			var bounds = new google.maps.LatLngBounds();
			bounds.extend(item.route.markerFrom.getPosition());
			bounds.extend(item.route.markerTo.getPosition());
			return bounds;
		}
		
		function getBoundsLocation(item) {
			var bounds = new google.maps.LatLngBounds();
			bounds.extend(item.position);
			return bounds;
		}
	
		var bounds = new google.maps.LatLngBounds();
		
		items.forEach(
		
			function(item) {
	
				switch (item.type) {
		
					case ITEM_TYPE.FLIGHT:					
						bounds = bounds.union(getBoundsFlight(item));
						break;
				
					case ITEM_TYPE.BUS_CAR_TRAIN:
						bounds = bounds.union(getBoundsRoute(item));
						break;
			
					case ITEM_TYPE.LOCATION:
						bounds = bounds.union(getBoundsLocation(item));
						break;
				}
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
