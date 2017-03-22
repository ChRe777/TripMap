// -------------------------------------------------------------------------------------------------
// Module : List (View)
// Author : Christoph Reif
// Date	  : 2017-03-09
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
// METHODS
// -------------------------------------------------------------------------------------------------

//
// addList 
//
function addList(list, text) {
	list.innerHTML = list.innerHTML + text + "<br/>";
}

//
// clearList 
//
function clearList(list){
	list.innerHTML = "";
}

//
// writeFlight 
//
function writeFlight(list, item) {
	
	/*
	var obj = {
			type  		: ITEMTYPE.FLIGHT,
			route 		: Route,
			airportFrom : airportFrom,
			airportTo   : airportTo
	};
	*/
	
	var imgSrcPlane  = "https://cdn4.iconfinder.com/data/icons/aiga-symbol-signs/444/aiga_departingflights-16.png"
	var imgSrcDelete = "https://cdn3.iconfinder.com/data/icons/basic-interface/100/delete-16.png";
	
	var imgPl = "<img style='width:16px' src='" + imgSrcPlane + "'>";
	var imgDe = "<img style='width:16px' src='" + imgSrcDelete + "' onclick='removeItemById("+item.id+")'>";
	
	var text = imgPl + "&nbsp;" + imgDe + " From: " + item.airportFrom.formatted_address + " To: " + item.airportTo.formatted_address;
	addList(list, text);
}

//
// writeShip
//
function writeShip(list, item) {
	
	/*
	var obj = {
			type  		: ITEMTYPE.SHIP,
			route 		: route,
			airportFrom : airportFrom,
			airportTo   : airportTo
	};
	*/
	
	var imgSrcShip  = "https://cdn2.iconfinder.com/data/icons/picol-vector/32/transportation_ship-16.png"
	var imgSrcDelete = "https://cdn3.iconfinder.com/data/icons/basic-interface/100/delete-16.png";
	
	var imgPl = "<img style='width:16px' src='" + imgSrcShip + "'>";
	var imgDe = "<img style='width:16px' src='" + imgSrcDelete + "' onclick='removeItemById("+item.id+")'>";
			
	var text = imgPl + "&nbsp;" + imgDe + " From: " + item.harbourFrom.formatted_address + " To: " + item.harbourTo.formatted_address;
	addList(list, text);
}

//
// writeBusCarTrain
//
function writeBusCarTrain(list, item) {
	
	
	function getIconPerSubType(subType) {
	
		var imgSrc;
		
		var imgSrcTrain  = "https://cdn2.iconfinder.com/data/icons/font-awesome/1792/train-16.png";
		var imgSrcCar    = "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_directions_car_48px-16.png";
		var imgSrcBus 	 = "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_directions_bus_48px-16.png";
		
		switch (subType) {
			case ITEM_SUB_TYPE.CAR	: imgSrc = imgSrcCar;   break;
			case ITEM_SUB_TYPE.BUS	: imgSrc = imgSrcBus;   break;
			case ITEM_SUB_TYPE.TRAIN: imgSrc = imgSrcTrain; break;
		}
		
		return imgSrc;
	}
	
	/*
	var item = {
		id			: itemId++,
		type 		: ITEM_TYPE.BUS_CAR_TRAIN,
		subType		: ITEM_SUB_TYPE.CAR,
		route		: null,		// route on Map with 2 marker and polyline
		addressFrom : addressFrom,
		addressTo	: addressTo,
	};
	*/
	
	var imgSrcDelete = "https://cdn3.iconfinder.com/data/icons/basic-interface/100/delete-16.png";
	var imgSrcItem = getIconPerSubType(item.subType);
	
	var imgCa = "<img src='" + imgSrcItem + "'>";
	var imgDe = "<img src='" + imgSrcDelete + "' onclick='removeItemById("+item.id+")'>";
	
	var text = imgCa + "&nbsp;" + imgDe + " From: " + item.addressFrom.formatted_address + " To: " + item.addressTo.formatted_address;
	addList(list, text);
}

//
// writeLocation 
//
function writeLocation(list, item) {
	
	/*
	var obj = {
		type   	 : ITEMTYPE.LOCATION,
		marker 	 : marker,
		address  : address
	};
	*/
	
	var imgSrcPushpin = "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-location-16.png";
	var imgSrcDelete  = "https://cdn3.iconfinder.com/data/icons/basic-interface/100/delete-16.png";
	
	var imgPp = "<img src='" + imgSrcPushpin + "'>";
	var imgDe = "<img src='" + imgSrcDelete + "' onclick='removeItemById("+item.id+")'>";
	
	var text = imgPp + "&nbsp;" + imgDe + " Location: " + item.address.formatted_address;
	addList(list, text);			
}

//
// writeItem 
//
function writeItem(list, item) {
		
	switch (item.type) {
	
		case ITEM_TYPE.FLIGHT:
			writeFlight(list, item);
			break;
			
		case ITEM_TYPE.SHIP:
			writeShip(list, item);
			break;
		
		case ITEM_TYPE.BUS_CAR_TRAIN:
			writeBusCarTrain(list, item);
			break;
		
		case ITEM_TYPE.LOCATION:
			writeLocation(list, item);
			break;
	}
}

//
// writeItems 
//
function writeItems(list, items) {
	items.forEach(
		function(item) {
			writeItem(list, item);
		}
	);
}

// -------------------------------------------------------------------------------------------------
// COMMANDS 
// -------------------------------------------------------------------------------------------------

//
// updateList 
//
function updateList(items) {

	var list = document.getElementById("list");
	clearList(list);
	writeItems(list, items);
}

//
// showHideList
//
function showHideList() {

	var list = document.getElementById("right");
	var button = document.getElementById("toggleListButton");
	
	if (button.value == "Show List") {
		button.value = "Hide List";
		list.style.display = "block";
	} else {
		button.value = "Show List";
		list.style.display = "none";
	}

}



