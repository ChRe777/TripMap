// -------------------------------------------------------------------------------------------------
// Module : Model 
// Author : Christoph Reif
// Date	  : 2017-03-09
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
// CONSTANTS
// -------------------------------------------------------------------------------------------------

var ITEM_SUB_TYPE = {
	CAR				: 2^0,
	BUS				: 2^1,
	TRAIN 			: 2^2,
	OTHER			: 2^8,
};

var ITEM_TYPE = {
	FLIGHT   		: 2^0, 
	LOCATION 		: 2^1,
	BUS_CAR_TRAIN	: 2^2,
	SHIP			: 2^3,
	OTHER	 		: 2^8
};

var ITEMS_CHANGED_TYPE = {
	ITEM_ADDED		: 2^0,
	ITEM_REMOVED 	: 2^1,
	ITEMS_CLEARED	: 2^2,
};

// -------------------------------------------------------------------------------------------------
// EVENT
// -------------------------------------------------------------------------------------------------

var itemsChangedFunc; // Observer Function

// -------------------------------------------------------------------------------------------------
// MODEL
// -------------------------------------------------------------------------------------------------

var itemId = 0;
var items = [];

//
// createFlightItem 
//
function createFlightItem(airportFrom, airportTo) {

	var item = {
		id			: itemId++,
		type  		: ITEM_TYPE.FLIGHT,
		flightRoute : null,
		airportFrom : airportFrom,
		airportTo   : airportTo
	};
	
	return item;
}

//
// createShipItem 
//
function createShipItem(harborFrom, harborTo) {

	var item = {
		id			: itemId++,
		type  		: ITEM_TYPE.SHIP,
		flightRoute : null,
		harborFrom 	: harborFrom,
		harborFrom  : harborFrom
	};
	
	return item;
}

//
// createCarBusTrainItem
// 
function createCarBusTrainItem(resultFrom, resultTo, subType) {

	var item = {
		id			: itemId++,
		type 		: ITEM_TYPE.BUS_CAR_TRAIN,
		subType		: subType,
		route		: null,		// route on Map with 2 marker and polyline
		resultFrom 	: resultFrom,
		resultTo	: resultTo,
		addressFrom : resultFrom.formatted_address,
		addressTo   : resultTo.formatted_address,
	};
	
	return item;
}

//
// createLocationItem
//
function createLocationItem(position, result) {
	
	var item = {
		id		 	: itemId++,
		type   	 	: ITEM_TYPE.LOCATION,
		marker 	 	: null,
		position 	: position,
		adress	 	: result.formatted_address,
		result	 	: result,
	};
	
	return item;
}

// -------------------------------------------------------------------------------------------------
// METHODS
// -------------------------------------------------------------------------------------------------

//
// addItem 
//
function addItem(item) {
	items.push(item);		
	itemsChangedFunc(item, ITEMS_CHANGED_TYPE.ITEM_ADDED);
}

//
// removeItemById 
//
function removeItemById(id) {
					
	for (var index = items.length - 1; index >= 0; index--) {
    
		var item = items[index];
	
		if (item.id === id) {
		
		   	items.splice(index, 1);
		   	
		   	// Fires item changed 
			
			// to remove from list
			// to remoce from map
			
			itemsChangedFunc(item, ITEMS_CHANGED_TYPE.ITEM_REMOVED);
			
			debugConsole("Item with id " + item.id + " removed");
			
		   	item = null;
		   
		   	break;
		}
	}		
	
}

//
// clearItems 
//
function clearItems() {
	items = [];				
	itemsChangedFunc(null, ITEMS_CHANGED_TYPE.ITEMS_CLEARED );
}



