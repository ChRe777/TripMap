// -------------------------------------------------------------------------------------------------
// Module : Model 
// Author : Christoph Reif
// Date	  : 2017-03-09
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
// CONSTANTS
// -------------------------------------------------------------------------------------------------

var ITEM_TYPE = {
	FLIGHT   	: 0, 
	LOCATION 	: 1,
	ROAD	 	: 2,
	TRAIN    	: 3,
	OTHER	 	: 99
};

var ITEMS_CHANGED_TYPE = {
	ITEM_ADDED		: 0,
	ITEM_REMOVED 	: 1,
	ITEMS_CLEARED	: 2,
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



