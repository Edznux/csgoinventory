var express = require('express');
var steam = require('./lib/steam');

var app = express();

app.set ('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('index');
  // res.send('please enter your nickname after the url of this website. like : localhost:3000/edznux');
});

app.get('/:nickname', function(req, res){
	steam.getInventory(req.params.nickname,function(d){
		var wp = steam.getWeapons(d);
		var priceUrl = steam.getPricesUrl(d);
		var prices;
		steam.getPrices(priceUrl,function(data){
			// console.log(data);
			steam.clearErrors();
			total = steam.totalPrice(data);
			console.log(d);
			res.render('index',{"inventory": d, "value" : total,"err" :steam.errors});
			// res.send("Votre inventaire vaux : "+total + " <br> Avec " + steam.errors.length + " erreur(s)" + steam.errors);
		});
		// res.send("prout");	

		// console.log(wp);
		// console.log(priceUrl);
		// res.send(wp);
	});
});

app.listen(3636);