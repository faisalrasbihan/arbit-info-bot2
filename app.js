const express = require('express');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

const token = '518508255:AAGgg7FwwnebrOm9y4FNXglG0hKhgAEgiGI';
const bot = new TelegramBot(token, { polling: true });

const vipURL = {
	BTC:'https://vip.bitcoin.co.id/api/btc_idr/ticker',
	XRP:'https://vip.bitcoin.co.id/api/xrp_idr/ticker',
	ETH:'https://vip.bitcoin.co.id/api/eth_idr/ticker'
};

const cexURL = 'http://cex.io/api/tickers/USD';

const usdidr = 13300;

app.listen(process.env.PORT || 5000, function(){
	console.log('Server started on port 3000...');
	setInterval(function() {
		fugazy();
	}, 5000);
});

bot.on('message', (msg) => {
  	const chatId = msg.chat.id;
  	var arbitInfo = "arbitinfo";
  	console.log('Message id : ' + chatId);
  	console.log('Message text : ' + msg.text.toString())
  	bot.sendMessage(chatId, 'Ulrich suka nonton bokep');
	if (msg.text.toString().toLowerCase().indexOf(arbitInfo) === 0) {
		bot.sendMessage(chatId, 'Price Difference CEX & VIP:\n');
		var axiosPromise = [
		createAxiosRequest(vipURL.XRP, vipHandler), 
		createAxiosRequest(vipURL.BTC, vipHandler), 
		createAxiosRequest(vipURL.ETH, vipHandler),
		createAxiosRequest(cexURL, cexHandler)
	]
	axios.all(axiosPromise)
  		.then(axios.spread((VIP_XRP, VIP_BTC, VIP_ETH, cexTickers) => {
  				var CEX_XRP = cexTickers.filter(el => el.pair == 'XRP:USD')[0].last;
				var CEX_BTC = cexTickers.filter(el => el.pair == 'BTC:USD')[0].last;
				var CEX_ETH = cexTickers.filter(el => el.pair == 'ETH:USD')[0].last;
				var xrpDifference = ((CEX_XRP*usdidr)-VIP_XRP)/VIP_XRP;
  				var btcDifference = ((CEX_BTC*usdidr)-VIP_BTC)/VIP_BTC;
  				var ethDifference = ((CEX_ETH*usdidr)-VIP_ETH)/VIP_ETH;
  				var xrpMargin = 'XRP Difference : ' + (xrpDifference*100).toFixed(2) + '%';
  				var btcMargin = 'BTC Difference : ' + (btcDifference*100).toFixed(2) + '%';
  				var ethMargin = 'ETH Difference : ' + (ethDifference*100).toFixed(2) + '%';
  				var responseMessage = xrpMargin +'\n'+ btcMargin +'\n'+ ethMargin;
  				bot.sendMessage(chatId, responseMessage);
  			}));
	}

});

bot.onText(/\/start/, (msg) => {
	bot.sendMessage(msg.chat.id, "Welcome", {
	"reply_markup": {
	    "keyboard": [["ArbitInfo"]]
	    }
	});
});

var count = 0;
var allHandler = (VIP_XRP, VIP_BTC, VIP_ETH, cexTickers) => {
  			console.log('VIP XRP price : Rp. ' + VIP_XRP);
  			console.log('VIP BTC price : Rp. ' + VIP_BTC);
  			console.log('VIP ETH price : Rp. ' + VIP_ETH);
  			var CEX_XRP = cexTickers.filter(el => el.pair == 'XRP:USD')[0].last;
			var CEX_BTC = cexTickers.filter(el => el.pair == 'BTC:USD')[0].last;
			var CEX_ETH = cexTickers.filter(el => el.pair == 'ETH:USD')[0].last;
			console.log('CEX XRP price : USD ' + CEX_XRP);
  			console.log('CEX BTC price : USD ' + CEX_BTC);
  			console.log('CEX ETH price : USD ' + CEX_ETH);
  			var xrpDifference = ((CEX_XRP*usdidr)-VIP_XRP)/VIP_XRP;
  			var btcDifference = ((CEX_BTC*usdidr)-VIP_BTC)/VIP_BTC;
  			var ethDifference = ((CEX_ETH*usdidr)-VIP_ETH)/VIP_ETH;
  			console.log('Difference XRP: ' + (xrpDifference*100).toFixed(2) + '%');
  			console.log('Difference BTC: ' + (btcDifference*100).toFixed(2) + '%');
  			console.log('Difference ETH: ' + (ethDifference*100).toFixed(2) + '%');
  			console.log('count: ' + count++ + '\n');
		}

function fugazy() {
	var axiosPromise = [
		createAxiosRequest(vipURL.XRP, vipHandler), 
		createAxiosRequest(vipURL.BTC, vipHandler), 
		createAxiosRequest(vipURL.ETH, vipHandler),
		createAxiosRequest(cexURL, cexHandler)
	]
	axios.all(axiosPromise)
  		.then(axios.spread(allHandler));
}

var vipHandler = (response) => { return response.data.ticker.last; }
var cexHandler = (response) => { return response.data.data; }

function createAxiosRequest(url, completionHandler) {
	return axios.get(url)
  		.then(completionHandler)
		.catch(function (error) {
		    console.log(error);
		});
}
