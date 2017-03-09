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
		zoom: 8,
		center: latlng
    }
	
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	
	var lineSymbol = {
		path: 'M 0,-2 0,0',
		strokeOpacity: 1,
		scale: 4
	};
	
	polyLineStyle = {
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
	
	
	items = [];
}

//
// updateMap 
//
function updateMap(items) {
	debugConsole("update map");
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
function addPolyLine(markerFrom, markerTo) {

	var path = [markerFrom.getPosition(), markerTo.getPosition()];
	
	geodesicPoly = new google.maps.Polyline(polyLineStyle);
	geodesicPoly.setPath(path);
	
	return geodesicPoly;
}

//
// removePolyLine
//
function removePolyLine(polyLine) {
	polyLine.setPath(null);
}

//
// addFlightRoute
//
function addFlightRoute(positionFrom, positionTo) {

	var markerFrom = addMarker  (positionFrom);
	var markerTo   = addMarker  (positionTo  );
	var polyLine   = addPolyLine(markerFrom, markerTo);
	
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

// -------------------------------------------------------------------------------------------------
// COMMANDS 
// -------------------------------------------------------------------------------------------------

//
// updateMap
// 
function updateMap(item, itemChangedType) {

	function updateMapItemAdded(item) {
	
			switch (item.type) {
		
			// Flight
			case ITEM_TYPE.FLIGHT:
				
				var flightRoute = addFlightRoute(item.airportFrom, item.airportTo);
				
				item.flightRoute = flightRoute;
				
				map.setCenter(item.airportFrom);
				
			break;
			
			// Location
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
		
}
