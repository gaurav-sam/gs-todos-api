var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
// var db = require('./db.js');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('gaurav')
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

	db.todo.findById(todoId).then(function (todo) {
        if (!!todo) {
			res.json(todo.toJSON());
        } else {
            res.status(400).send();
        }
    }, function (e) {
		res.status(500).send();
	});



	// var matchedTodo = _.findWhere(todos, {id : todoId});
	//
	// if (matchedTodo) {
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).send();
	// }
});

//Post only description and  completed property and skipped other garbage properties
app.post('/todos', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});

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

db.sequelize.sync().then(function () {
	app.listen(PORT, function() {
		console.log('app is working on port no 3000');
	});
})
