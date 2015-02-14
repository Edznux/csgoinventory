var express = require('express');
var steam = require('./lib/steam');

var app = express();

app.get('/', function(req, res){
  res.send('please enter your nickname after the url of this website. like : localhost:3000/edznux');
});

app.get('/:nickname', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	steam.getInventory(req.params.nickname,function(d){
		var wp = steam.getWeapons(d);
		var priceUrl = steam.getPricesUrl(d);
		var prices;
		steam.getPrices(priceUrl,function(data){
			// console.log(data);
			prices = data;
			total = steam.totalPrice(prices)
			res.send("Votre inventaire vaux : "+total);
		});
		// res.send("prout");

		// console.log(wp);
		// console.log(priceUrl);
		// res.send(wp);
	});
});

app.listen(3000);