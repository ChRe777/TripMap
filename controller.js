// -------------------------------------------------------------------------------------------------
// Module : Controller
// Author : Christoph Reif
// Date	  : 2017-03-09
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
// DEBUG
// -------------------------------------------------------------------------------------------------

var DEBUG = false;

function debugConsole(text) {
	var console = document.getElementById("console");
	console.innerHTML = console.innerHTML + text + "<br/>";
}

// -------------------------------------------------------------------------------------------------
// INIT
// -------------------------------------------------------------------------------------------------

//
// initAirportsDataList 
//
function initAirportsDataList() {

	var airportsDataList = document.getElementById('airports-list');
	
	var addOption = function(airport) {
		
		var option = document.createElement('option');
		
		option.value = airport.name;
		airportsDataList.appendChild(option);
		
	};
		
	airports.forEach(addOption);
}

//
// init 
//
function init() {

	airports = parseAirports(airportsCsv); 	debugConsole("Initialized airports");
	
	initAirportsDataList();

	initMap(); 								debugConsole("Initialized map");
	
	items = []; 							debugConsole("Initialized model");
	
	itemsChangedFunc = function(item, itemChangedType) {
		updateList(items);
		updateMap(items, item, itemChangedType);
	};
}

//
// addFromTo
//
function addFromTo(addressFrom, addressTo, callOnResults) {

	// ---- SNIP -----------------------------------------------------
	
	var geocoderRequestFrom = {
		address: addressFrom
	};

	// ---- FROM -----
	
	geocoder.geocode(
		geocoderRequestFrom,
		function(resultsFrom, statusFrom) {
		
			if (statusFrom == "OK") {
	
				var resultFrom = resultsFrom[0];
		
				var geocoderRequestTo = {
					address : addressTo
				};

				// ---- TO ----
								
				geocoder.geocode(
					geocoderRequestTo,
					function(resultsTo, statusTo) {
					
						if (statusTo == "OK") {
						
							var resultTo = resultsTo[0];
							
							callOnResults(resultFrom, resultTo);
							
						} else {
							if (status == "ZERO_RESULTS") {
								debugConsole("Address '" + harbourAddressTo + "' not found.");
							}
						}
					}
				);
	
			} else {
				if (status == "ZERO_RESULTS") {
					debugConsole("Address '" + harbourAddressFrom + "' not found.");
				}
			}
		}
	);
}

//
// addFromToOnRoad
//
function addFromToOnRoad(travelType, addressFrom, addressTo, addressOver) {


	function addressFound(status) {
		return status == "OK";
	}
	
	function takeFirstResult(results) {
		return results[0];
	}
	

	function getLocation(addresses, getRouteFunc) {
	
		var foo = {
			address: addresses.addressOver
		};
	
		geocoder.geocode(
			foo,
			function(results, status) {
			
				if (addressFound(status)) {
				
					var firstResult = takeFirstResult(results);
					
					var wayPoints = createWayPoints(firstResult);
					
					getRouteFunc(addresses, wayPoints);
					
				}
			}
			
		)
				
	}

	function createWayPoints(addressResult) {

		var wayPoints = [];
		
		var wayPoint = {
        	location : addressResult.geometry.location,
        	stopover : true
    	}

    	wayPoints.push(wayPoint);
    	
    	return wayPoints;
    }
  
    function getRoute(addresses, wayPoints) {
    
    	// TRANSIT
    	//
    	//  - BUS
    	//  - RAIL (Train, Subway, Tram ...) 
    	//  - TRAIN
    	//  - SUBWAY 
    	//  - TRAM
    	//
    	// https://developers.google.com/maps/documentation/javascript/directions?hl=de#TransitOptions
        
        // getTravelMode
        // 
    	function getTravelMode(travelType) {
    		
    		if (travelType == ITEM_TRAVEL_TYPE.CAR)	
    			return google.maps.TravelMode.DRIVING;
    			    		
    		return google.maps.TravelMode.TRANSIT;
    	}
    	
    	// getTransitOptions
    	// 
    	function getTransitOptions(travelType) {
    		
    		var transOptions = { };
    		
    		if (travelType == ITEM_TRAVEL_TYPE.CAR) {
    			transOptions = { };
    		}
    		
    		if (travelType == ITEM_TRAVEL_TYPE.BUS) {
    			transitOptions = {
					modes: [google.maps.TransitMode.BUS]
				};
			}
			
			if (travelType == ITEM_TRAVEL_TYPE.TRAIN) {
    			transitOptions = {
					modes: [google.maps.TransitMode.TRAIN]
				};
			} 
			
			return transOptions;
    	}
    
    	var travelMode 		= getTravelMode(travelType);
    	var transitOptions 	= getTransitOptions(travelType);
    	
		directionsService.route(
			{
				origin			: addresses.addressFrom,
				destination		: addresses.addressTo,
				
				/*
				waypoints		  : wayPoints,
				optimizeWaypoints : true,
				*/
				
				travelMode	   : travelMode,
				transitOptions : transitOptions,
			}, 
			function(response, status) {
	
				if (status === google.maps.DirectionsStatus.OK) {
			
					var result = response.routes[0];
					
					var item = createRoadItem(addresses, result, response, travelType);
				
					addItem(item);
					
					debugConsole('Add road with Directions request ' + status);

				} else {
					debugConsole('Directions request failed due to ' + status);
				}
			}
		);
  	}
  	
  	var addresses = {
  		addressFrom : addressFrom, 
  		addressTo 	: addressTo, 
  		addressOver : addressOver, 
  	};
  	
  	getLocation(addresses, getRoute);
    
}

// -------------------------------------------------------------------------------------------------
// COMMANDS 
// -------------------------------------------------------------------------------------------------

//
// addFlight
//
function addFlight() {
	
	var airportNameFrom = document.getElementById("airportFromTextBox").value;
	var airportNameTo   = document.getElementById("airportToTextBox"  ).value;
	
	function callOnResults(resultFrom, resultTo) {
	
		var item = createFlightItem(resultFrom, resultTo);
		addItem(item);

		debugConsole("Add flight from " + airportNameFrom + " to " + airportNameTo);
	}
	
	addFromTo(airportNameFrom, airportNameTo, callOnResults);
}

//
// addShip
//
function addShip() {
	
	var harbourAddressFrom = document.getElementById("harbourFromTextBox").value;
	var harbourAddressTo   = document.getElementById("harbourToTextBox"  ).value;
	
	function callOnResults(resultFrom, resultTo) {
	
		var item = createShipItem(resultFrom, resultTo);
		addItem(item);

		debugConsole("Add ship from " + harbourAddressFrom + " to " + harbourAddressTo);
	}
	
	addFromTo(harbourAddressFrom, harbourAddressTo, callOnResults);
}

//
// addRoad
//
function addRoad() {

	function getSelectedSubType() {

		var subtypes = document.getElementsByName('subtype');
		var subtype;

		for (var i = 0; i < subtypes.length; i++){
			if (subtypes[i].checked) {
				subtype = subtypes[i].value;
			}
		}
	
		switch (subtype) {
			case "car"  : return ITEM_SUB_TYPE.CAR;
			case "bus"  : return ITEM_SUB_TYPE.BUS;
			case "train": return ITEM_SUB_TYPE.TRAIN;
		}
	
	}
	
	var roadAddressFrom = document.getElementById("roadFromTextBox").value;
	var roadAddressTo   = document.getElementById("roadToTextBox"  ).value;
	
	function callOnResults(resultFrom, resultTo) {
	
		var item = createCarBusTrainItem(resultFrom, resultTo, getSelectedSubType());
		addItem(item);

		debugConsole("Add car/bus/train from " + roadAddressFrom + " to " + roadAddressTo);
	}
	
	addFromTo(roadAddressFrom, roadAddressTo, callOnResults);
	
}

//
// addRoadtest
//
function addRoadTest() {

	function getSelectedTravelType() {

		var travelTypes = document.getElementsByName('travelType');
		var travelType;

		for (var i = 0; i < travelTypes.length; i++){
			if (travelTypes[i].checked) {
				travelType = travelTypes[i].value;
			}
		}
	
		switch (travelType) {
			case "car"  : return ITEM_TRAVEL_TYPE.CAR;
			case "bus"  : return ITEM_TRAVEL_TYPE.BUS;
			case "train": return ITEM_TRAVEL_TYPE.TRAIN;
		}
	
	}
	
	var travelType = getSelectedTravelType();

	var roadAddressFrom  = document.getElementById("roadTestFromTextBox").value;
	var roadAddressTo    = document.getElementById("roadTestToTextBox"  ).value;
	var roadAddressVia   = document.getElementById("roadTestViaTextBox").value;
	
	addFromToOnRoad(travelType, roadAddressFrom, roadAddressTo, roadAddressVia);
	
}

//
// addLocation 
//
function addLocation() {
  
    var addressName = document.getElementById("positionAddress").value;
	
	var foo = {
		address: addressName
	};
	
    geocoder.geocode( 
		foo,
		function(results, status) {
      
			if (status == "OK") {
			
				var result = results[0];
			
				var position = result.geometry.location;
		
				var item = createLocationItem(position, result);
				
				addItem(item);
				
				debugConsole("Add position for " + addressName);
				
			} else {
				if (status == "ZERO_RESULTS") {
					debugConsole("Address '" + addressName + "' not found.");
				}
			}
		}
	);
}

//
// showHideList
//
function toggleList() {
	showHideList();
}






