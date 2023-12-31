ObjectID = require('mongodb').ObjectID;

exports.retrieveTodos = function(db, callback) {
    db.collection("todos").find().toArray(function(err, docs) {
       callback(docs);
    });

}

exports.insertTodo = function(db, todo, callback) {
    db.collection("todos").insertOne(todo, function(error, result) {
        //Note that the todo now has an ID!
        if(!error) {
            callback(todo);
        } else {
            console.log("Error occured inserting doc: %s", JSON.stringify(todo));
        }
    });

}

exports.updateTodo = function(db, todo, callback) {
    var query = {"_id": new ObjectID(todo._id)};
    var updateDoc = {$set: {done: todo.done}};

    db.collection("todos").updateOne(query, updateDoc, function(error, result) {
        if(!error) {
            callback(todo);
        } else {
            console.log("Error occurred updating doc: %s", JSON.stringify(todo));
        }
    });

}

exports.removeTodo = function(db, todoId, callback) {
    var query = {"_id": new ObjectID(todoId)};

    db.collection("todos").remove(query, function(error, result) {
        if(!error) {
            callback(todoId);
        }
    });

}