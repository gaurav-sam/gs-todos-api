var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect' : 'sqlite',
    'storage' : __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    description : {
        type : Sequelize.STRING,
        allowNull: false,
        validation : {
            len: [1,250]
        }
    },
    completed : {
        type : Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync().then(function () {


    console.log('Everything is working fine...');


    Todo.findById(1).then(function (todo) {
        if (todo) {
            console.log(todo.toJSON());
        } else {
            console.log('no data found !');
        }
    })


    // This is fo insert and find result

    // Todo.create({
    //     description : 'walking my dog'
    // }).then(function (todo) {
    //     return Todo.create({
    //         description : 'go to market'
    //     })
    // }).then(function () {
    //     return Todo.findAll({
    //         where : {
    //             description : {
    //                 $like: '%walkin%'
    //             }
    //         }
    //     });
    // }).then(function (todos) {
    //     if (todos) {
    //         todos.forEach(function(todo){
    //             console.log(todo.toJSON());
    //         });
    //     } else {
    //         console.log('no data found')
    //     }
    // }).catch(function (e) {
    //     console.log(e);
    // })
});
