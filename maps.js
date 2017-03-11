// -------------------------------------------------------------------------------------------------
// Module : Maps (View)
// Author : Christoph Reif
// Date	  : 2017-03-09
// -------------------------------------------------------------------------------------------------

var geocoder;
var map;
var polyLineStyle;

// -------------------------------------------------------------------------------------------------
// INIT
// -------------------------------------------------------------------------------------------------

//
// initMap 
//
function initMap() {

    geocoder = new google.maps.Geocoder();
	
    var latlng = new google.maps.LatLng(-34.397, 150.644);
	
    var mapOptions = {
		zoom: 2,
		center: latlng
    }
	
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	
	var lineSymbol = {
		path: 'M 0,-2 0,0',
		strokeOpacity: 1,
		scale: 4
	};
	
	// Flight
	//
	polyLineStyleFlight = {
		strokeColor: '#CC0099',
		strokeOpacity: 1.0,
		/*icons: [{
		  icon: lineSymbol,
		  offset: '0',
		  repeat: '15px'
		}],
		*/
		strokeWeight: 3,
		geodesic: true,
		map: map
	};
	
	// Bus/Car/Train
	//
	polyLineStyleRoute = {
		strokeColor: '#770099',
		strokeOpacity: 1.0,
		strokeWeight: 3,
		geodesic: false,
		map: map
	};

	
}

// -------------------------------------------------------------------------------------------------
// COMMANDS
// -------------------------------------------------------------------------------------------------

//
// addMarker
//
function addMarker(position) {

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
function addFlightRoute(positionFrom, positionTo) {

	var markerFrom = addMarker  (positionFrom);
	var markerTo   = addMarker  (positionTo  );
	var polyLine   = addPolyLine(markerFrom, markerTo, polyLineStyleFlight);
	
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
function addRoute(positionFrom, positionTo) {

	var markerFrom = addMarker  (positionFrom);
	var markerTo   = addMarker  (positionTo  );
	var polyLine   = addPolyLine(markerFrom, markerTo, polyLineStyleRoute);
	
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
	
			switch (item.type) {
		
			// Flight
			//
			case ITEM_TYPE.FLIGHT:
			
				var positionFrom = new google.maps.LatLng(item.airportFrom.latitude, item.airportFrom.longitude);
				var positionTo   = new google.maps.LatLng(item.airportTo.latitude,   item.airportTo.longitude  );
				
				var flightRoute = addFlightRoute(positionFrom, positionTo);
				
				item.flightRoute = flightRoute;
				
				// TODO: Fit bounds to all objects in list				
				var bounds = new google.maps.LatLngBounds();
				bounds.extend(positionFrom);
				bounds.extend(positionTo);
				map.fitBounds(bounds);
				
			break;
			
			// Bus, Car or Train
			//
			case ITEM_TYPE.BUS_CAR_TRAIN:
			
				var positionFrom = item.resultFrom.geometry.location;
				var positionTo   = item.resultTo.geometry.location;
				
				var route = addRoute(positionFrom, positionTo);
				
				item.route = route;
				
				// TODO: Fit bounds to all objects in list				
				var bounds = new google.maps.LatLngBounds();
				bounds.extend(positionFrom);
				bounds.extend(positionTo);
				map.fitBounds(bounds);
				
				//map.setCenter(positionFrom);
				
			break;
		
			// Location
			//
			case ITEM_TYPE.LOCATION:
				
				var marker = addMarker(item.position);
				
				item.marker = marker;
				
				map.setCenter(item.position);
				
				
			break;
			
		}
	}

	function updateMapItemRemoved(item) {
	
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

	if (itemChangedType == ITEMS_CHANGED_TYPE.ITEM_ADDED) {
		updateMapItemAdded(item);
	}  
	else if (itemChangedType == ITEMS_CHANGED_TYPE.ITEM_REMOVED) {
		updateMapItemRemoved(item);
	}
	
	updateFitBounds(items);	
}
