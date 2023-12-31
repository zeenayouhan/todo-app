var urlUtils = require("url");
var persistence = require("./persistence");
var fileServer = require("fs");

exports.init = function (dbConnection, request, response){

    var urlParam = urlUtils.parse(request.url).pathname;

    if(urlParam === "/") {
        serveStaticPage(response, "front_end/home.html", "text/html");
    } else if(urlParam === "/home.js") {
        serveStaticPage(response, "front_end/home.js", "application/javascript");
    } else if(urlParam === "/angular.js") {
        serveStaticPage(response, "node_modules/angular/angular.min.js", "application/javascript");
    } else if(urlParam === "/home.css") {
        serveStaticPage(response, "front_end/home.css", "text/css");
    } else if(urlParam === "/retrieve" && request.method == "GET") {
        retrieveTodos(dbConnection, response);
    } else if(urlParam === "/insert" && request.method == "POST") {
        insertTodo(dbConnection, request, response);
    } else if(urlParam === "/update" && request.method == "PUT") {
        updateTodo(dbConnection, request, response);
    } else if(urlParam === "/remove" && request.method == "DELETE") {
        removeTodo(dbConnection, request, response);
    } else {
        returnResponse(response, {error: "Invalid path param: " + urlParam});
    }

}

function serveStaticPage(response, filePath, contentType) {
    var readableStream = fileServer.createReadStream(filePath);
    readableStream.on("error", function(chunk) {
        response.end("Error loading resource: " + filePath);
    });
    response.setHeader("Content-Type", contentType);
    readableStream.on("data", function(chunk) {
        response.write(chunk);
    });
    readableStream.on("end", function(chunk) {
        response.end();
    });

}

function retrieveTodos(dbConnection, response) {
    persistence.retrieveTodos(dbConnection, function(result) {
        var result = {"todos": result};
        returnResponse(response, result);
    });
}

function insertTodo(dbConnection, request, response) {
     var todo = "";
     request.on("data", function(data) {
        todo += data;
     });
     request.on("end", function() {
         persistence.insertTodo(dbConnection, JSON.parse(todo), function(insertedRecord) {
            returnResponse(response, insertedRecord);
         });
     });
}

function updateTodo(dbConnection, request, response) {
     var todo = "";
     request.on("data", function(data) {
        todo += data;
     });
     request.on("end", function() {
         persistence.updateTodo(dbConnection, JSON.parse(todo), function(insertedRecord) {
            returnResponse(response, insertedRecord);
         });
     });
}

function removeTodo(dbConnection, request, response) {
    var todoId = urlUtils.parse(request.url, true).query.id;
    persistence.removeTodo(dbConnection, todoId, function(result) {
        var result = {"removed": {"todoId": result}};
        returnResponse(response, result);
    });
}

function returnResponse(response, result) {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(result));
}