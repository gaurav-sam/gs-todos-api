var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('gaurav')
});

app.listen(PORT, function() {
	console.log('app is working on port no 3000');
});

var todos  = [];
var todoId = 1;

app.get('/todos', function(req, res) {
	res.json(todos);
})

// console.log(todos[0].id)
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	var matchedTodo = _.findWhere(todos, {id : todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

//fetch all todo data
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed'); // pick only description and completed

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		res.status(404).send();
	}

	body.id = todoId++;
	body.description = body.description.trim();

	todos.push(body);

	res.json(body);


});

// if (todos[i].id === todoId) {
// 			res.send(todos[i]);
// 		}
