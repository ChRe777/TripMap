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


// -------------------------------------------------------------------------------------------------
// COMMANDS 
// -------------------------------------------------------------------------------------------------

//
// addFlight 
//
function addFlight() {

	var airportNameFrom = document.getElementById("airportFromTextBox").value;
	var airportNameTo   = document.getElementById("airportToTextBox"  ).value;

	var airportFrom = getAirportByName(airportNameFrom, airports);
	var airportTo   = getAirportByName(airportNameTo,   airports);
	
	// DEBUG
	
	if (DEBUG) {
	
		debugConsole(JSON.stringify(airportFrom) + "<br/>");
		debugConsole(JSON.stringify(  airportTo) + "<br/>");
		
		var text = 
			"airportFrom Lat:" + airportFrom.latitude + "<br/>"+
			"airportTo   Lat:" +   airportTo.latitude + "<br/>";
		
		debugConsole(text);
	
	}
	
	// DEBUG
	
	if (airportFrom != undefined  
	&&  airportTo   != undefined) {
	
				
		var item = createFlightItem(airportFrom, airportTo);
		
		addItem(item);
		
		debugConsole("Add flight from " + airportFrom.name + " to " + airportTo.name);
	}
	
}

//
// addRoad
//
function addRoad() {
	
	var roadAddressFrom = document.getElementById("roadFromTextBox").value;
	var roadAddressTo   = document.getElementById("roadToTextBox"  ).value;
	
	var foo = {
		address: roadAddressFrom
	};
	
	// ---- FROM -----
	
	geocoder.geocode(
		foo,
		function(resultsFrom, statusFrom) {
		
			if (statusFrom == "OK") {
	
				var resultFrom = resultsFrom[0];
				//var positionFrom = resultFrom.geometry.location;

				var bar = {
					address : roadAddressTo
				};

				// ---- TO ----
								
				geocoder.geocode(
					bar,
					function(resultsTo, statusTo) {
						if (statusTo == "OK") {
						
							var resultTo = resultsTo[0];
							//var positionTo = resultTo.geometry.location;
							
							var item = createCarBusTrainItem(resultFrom, resultTo);
		
							addItem(item);
		
							debugConsole("Add car/bus/train from " + roadAddressFrom + " to " + roadAddressTo);
		
						} else {
							if (status == "ZERO_RESULTS") {
								debugConsole("Address '" + roadAddressTo + "' not found.");
							}
						}
					}
				);
	
			} else {
				if (status == "ZERO_RESULTS") {
					debugConsole("Address '" + roadAddressFrom + "' not found.");
				}
			}
		}
	);
	
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

