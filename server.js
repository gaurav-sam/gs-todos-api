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

// GET todos :?completed=true
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed : true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed : false});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function (todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}
	res.json(filteredTodos);
})

// GET Object by id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	var matchedTodo = _.findWhere(todos, {id : todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

//Post only description and  completed property and skipped other garbage properties
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

// Delete API
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id : todoId});
	if (!matchedTodo) {
		res.status(404).json({"error" : "no todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
})

// UPDATE API
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id : todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validateAttribures = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validateAttribures.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) || body.description.trim().length > 0) {
		validateAttribures.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validateAttribures);
	res.json(matchedTodo);
})
