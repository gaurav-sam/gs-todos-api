var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

app.get('/', function(req, res) {
	res.send('gaurav')
});

app.listen(PORT, function() {
	console.log('app is working on port no 3000');
});

var todos = [{
	id : 1,
	description : 'task 1',
	complete : false
},{
	id : 2,
	description : 'task 2',
	complete : false
},{
	id : 3,
	description : 'task 3',
	complete : true
}];

app.get('/todos', function(req, res) {
	res.json(todos);
})

console.log(todos[0].id)
app.get('/todos/:id', function (req, res) {
	var matchId = parseInt(req.params.id, 10);
	var matchedTodo;
	for (var i = 0; i < todos.length; i++) {
		if (matchId === todos[i].id) {
			matchedTodo = todos[i];
		} 
	}

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
})

// if (todos[i].id === matchId) {
// 			res.send(todos[i]);
// 		} 