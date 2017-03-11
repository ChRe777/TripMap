// -------------------------------------------------------------------------------------------------
// Module : main
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

	airports = parseAirports(airportsCsv);
		
	initAirportsDataList();
	
	initMap();
	
	var table = document.getElementById("table");
	
	table.addEventListener("resize", 
		function() {
			google.maps.event.trigger(map, 'resize');
		}
	);
	
	//items = [];
}

// -------------------------------------------------------------------------------------------------
// MAIN
// -------------------------------------------------------------------------------------------------

function main() {
	init();
}
