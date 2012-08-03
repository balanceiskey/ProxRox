var https = require('https'),
	http = require('http'),
	net = require('net'),
	url = require('url'),
	port = process.argv[2];

if (port === null || port === undefined){
	console.log('No port number :(');
	return false;
}

var server = http.createServer(function(request, response){
	console.log('Ooooo a request!');
	console.log('request url', request.url);
	var query_params = url.parse(request.url, true).query,
		request_url = query_params.url,
		callback = query_params.callback;

	//url validation 
	if (
		request_url === undefined ||
		request_url === '' ||
		request_url.indexOf('https://') < 0 
	){
		return response.end();
	} 

	console.log('query_params', query_params);
	console.log('request_url', request_url);

	//strip protocol
	if (request_url.indexOf('https://') < 0) return response.end();
	request_url = request_url.substr(8, request_url.length);

	if (!request_url) {
		return response.end();
	}

	var	host = request_url.substr(0, request_url.indexOf('/')),
		path = request_url.substr(host.length, request_url.length);   

	console.log('host', host);
	console.log('path', path);

	https.get(
		{ 
			host: host, 
			path: path 
		}, 
		function(res) {
		  var data = '';

		  res.on('data', function(chunk) {
		  	if (Buffer.isBuffer(chunk)){
		  		data += chunk;
		  	}
		  });

		  res.on('end', function(){
		  	data = callback + '(' + data + ');';
		  	console.log('response is done');
		  	response.writeHead(200, {
		  		'Content-Length': data.length,
		  		'Content-Type': 'text/javascript'
		  	});
		  	response.write(data);
			response.end('\n');
		  });
		}	
	);
});

server.listen(port, function(){
	console.log("\nSven is listening to your every desire on port " 
		+ port + ". He's here for you.");
});

console.log("Hello, I'm a friendly Node Http server, but my friends call my Sven.");



