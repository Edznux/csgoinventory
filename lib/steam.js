var inventory;
var http = require('http');
/*
*	@pseudo : nickname of player.
*	@callback function.
*
*  @return : whole inventory of selected player on json format.
*/
var getInventory = function(pseudo,callback){
	var options = {
		host: 'steamcommunity.com',
		path: '/id/'+pseudo+'/inventory/json/730/2',
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	http.get(options, function(res) {
		console.log("statusCode: ", res.statusCode);
		// console.log("headers: ", res.headers);
		res.setEncoding('utf-8');
		console.log("data after status code value => ", response ,"end")
		var response = '';

		res.on('data', function(data) {
			response += data;
		});

		res.on('end', function() {
			try{
				callback(JSON.parse(response));
			}catch(e){
				callback({"success" : false});
			}
		});

	}).on('error', function(e) {
		console.error(e);
	});
};
// module.exports.inventory =inventory;
module.exports.getInventory = getInventory;
/*
*  @inv : inventory of the player
*
* @return : list of all weapons in the inventory
*/
var getWeapons = function(inv){
	weapons=[];
	if(inv.success){
		for(var key in inv.rgDescriptions){
			if(!inv.rgDescriptions[key].market_name.match(/Campagne|Insigne|Offre|Campain|Offer/g)){
				weapons.push(inv.rgDescriptions[key].market_hash_name);
			}
		}
		return weapons;
	}else{
		return false;
	}
};
module.exports.getWeapons = getWeapons;

/*
*  @inv : inventory of the player
*
* @return : all market url for one inventory
*/
var getPricesUrl = function(inv){
	price=[];
	if(inv.success){
		for(var key in inv.rgDescriptions){
			if(!inv.rgDescriptions[key].market_name.match(/Campagne|Insigne|Offre|Campain|Offer/g)){
				price.push("/market/priceoverview/?country=US&currency=3&appid=730&market_hash_name="+ encodeURIComponent(inv.rgDescriptions[key].market_hash_name));
			}
		}
		return price;
	}else{
		return false;
	}
};
module.exports.getPricesUrl = getPricesUrl;
/*
*  @urls : markets urls.
*  @callback function.
*
* @return : list of prices. (success , lowest_price, volume , median_price).
*/
var getPrices = function(urls,callback){
	var responses = [];
	var completed = 0;
	for(url in urls){
		var options = {
			host: 'steamcommunity.com',
			path: urls[url],
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		http.get(options, function(res) {
			// console.log("statusCode: ", res.statusCode);
			var response = '';

			res.on('data', function(data) {
				response += data;
			});

			res.on('end', function() {
				var responseObject;
				try{
					// console.log(response)
					responseObject = JSON.parse(response);
					if(responseObject.success){
						// console.log("successssssss");
						responses.push(response);
						completed++;
						if (completed == urls.length) {
							callback(responses);
						}
					}
				}catch(e){
					completed++;
					console.log("/!\\ Warning /!\\ error in getPrices function ",e);
				}
			});
		});
	}
};
module.exports.getPrices = getPrices;

/*
*  @p : list of prices
* @return : sum of all lowest prices.
*/
var totalPrice = function(p){
	var total=0;
	// console.log(p);
	var pParsed;
	/*try{
		// pParsed=JSON.parse(p);
	}catch(e){
		// console.log(p);
		// console.log(e);
	}*/
	for(var i=0;i<p.length-1;i++){
		pParsed = JSON.parse(p[i])
		// console.log(pParsed.median_price);
		try{
			if(pParsed.success){
				console.log("p.successss",pParsed.lowest_price.split("&")[0]);
				total+=parseFloat(pParsed.lowest_price.split("&")[0].replace(",","."));
			}
		}catch(e){
			console.log("Error in total price function : ",e)
		}
	}
	return total;
	console.log(total);
}
module.exports.totalPrice = totalPrice;

var getPrice = function(url,callback){
	var options = {
		host: 'steamcommunity.com',
		path: url,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	//http://steamcommunity.com/profiles/76561198103551811/inventory/json/730/2
	http.get(options, function(res) {
		console.log("statusCode: ", res.statusCode);
		// console.log("headers: ", res.headers);
		res.setEncoding('utf-8');
		var response = '';

		res.on('data', function(data) {
			response += data;
		});

		res.on('end', function() {
			console.log(response);
			callback(JSON.parse(response));
		});

	}).on('error', function(e) {
		console.error(e);
	});
};
module.exports.getPrice = getPrice;