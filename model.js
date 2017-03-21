// -------------------------------------------------------------------------------------------------
// Module : Model 
// Author : Christoph Reif
// Date	  : 2017-03-09
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
// CONSTANTS
// -------------------------------------------------------------------------------------------------

var ITEM_SUB_TYPE = {
	CAR				: "car",
	BUS				: "bus",
	TRAIN 			: "train",
	OTHER			: "other",
};

var ITEM_TYPE = {
	FLIGHT   		: "flight", 
	SHIP			: "Ship",
	LOCATION 		: "location",
	BUS_CAR_TRAIN	: "bus_car_train",
	OTHER	 		: "other"
};

var ITEMS_CHANGED_TYPE = {
	ITEM_ADDED		: "item_added",
	ITEM_REMOVED 	: "item_removed",
	ITEMS_CLEARED	: "items_cleared",
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
		route 		: null,
		airportFrom : airportFrom,
		airportTo   : airportTo
	};
	
	return item;
}

//
// createShipItem 
//
function createShipItem(harbourFrom, harbourTo) {

	var item = {
		id			: itemId++,
		type  		: ITEM_TYPE.SHIP,
		route 		: null,
		harbourFrom : harbourFrom,
		harbourTo  	: harbourTo,
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
		addressFrom : resultFrom,
		addressTo	: resultTo,
		//addressFrom : resultFrom.formatted_address,
		//addressTo   : resultTo.formatted_address,
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
		address	 	: result,
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



