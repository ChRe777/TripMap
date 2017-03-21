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
// removeRoute
//
function removeRoute(route) {

	removeMarker(route.markerFrom);
	removeMarker(route.markerTo);
	removePolyLine(route.polyLine);

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
// FACTORY - create or destroy map item by type
// -------------------------------------------------------------------------------------------------

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
	
	switch (item.type) {
		
			// Flight
			//
			case ITEM_TYPE.FLIGHT:
				item.mapObj = createFlight(item);
				item.bounds = getBoundsFlight(item);
				break;
			
			// Flight
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
	}
			
}

//
// destroyMapItem
// 
function destroyMapItem(item) {

	switch (item.type) {
	
		// Flight
		case ITEM_TYPE.FLIGHT:
			removeFlightRoute(item.mapObj);
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
