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
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like : '%' + query.q + '%'
		}
	}

	db.todo.findAll({where : where}).then(function (todos) {
		res.json(todos);
	}, function (e) {
		res.status(500).send(e);
	});
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
