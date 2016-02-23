var express = ('express');
var app = express();
var PORT = process.env.PORT || 3000;

app.get('/', function(req, res) {
	res.send('gaurav')
});

app.listen(PORT, function() {
	console.log('app is working on port no 3000');
});