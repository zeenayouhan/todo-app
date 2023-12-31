var http = require("http");
var routes = require("./routes");
var MongoClient = require("mongodb").MongoClient;
var uri = "mongodb://10.68.73.101:27017/todos_db"; //TODO: point to the correct database
var port = 8000;

var mongoConnection = MongoClient.connect(uri, function(error, connection) {
    if(!error) {
        startHttpServer(connection);
        connection.on("close", function() {
            console.log("Connection lost!");
        });
        connection.on("reconnect", function() {
            console.log("Connection re opened!");
        });
    } else {
        console.log("Error connecting to: %s", uri);
    }
});

function startHttpServer(dbConnection) {
    var server = http.createServer();

     server.on("request", function(request, response) {
        routes.init(dbConnection, request, response);
     });

     server.on("error", function(error) {
        dbConnection.close();
        console.log("Error starting node server: " + error);
     });

     server.listen(port, function() {
        console.log("Server listening on port: %s", port);
     });

}