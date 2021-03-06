var API_KEY = "8040a1d3";
//module.exports = API_KEY;

var express = require('express');
var bodyParser = require('body-parser');
var http = require('https');
//const API_KEY = require('./apiKey');

var server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());


server.post('/', (req, res) => {

    var movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';
    
//	https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=salman%20khan&prop=info&inprop=url&utf8=&format=json
var reqUrl = encodeURI(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${movieToSearch}&prop=info&inprop=url&utf8=&format=json`);	

//var reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${API_KEY}`);
    http.get(reqUrl, (responseFromAPI) => {
        var completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            var movie = JSON.parse(completeResponse);
		var abc=`${movie.query.search[0].snippet}`
		//let dataToSend =JSON.stringify(movie);
		abc= abc.replace(/<[^>]*>/g, '');
          // let dataToSend = movieToSearch === 'The Godfather' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
          let dataToSend  = abc;
		dataToSend+=`.   \r\n \r\n\r\n Let me know if you have a question or want to hear some jokes `

			

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'get-details'
            });
        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-details'
        });
    });
});





server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});
