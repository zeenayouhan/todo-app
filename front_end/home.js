var app = angular.module("todoApp", []);
app.controller("todoCtrl", function($scope, $http) {

    $http.get("/retrieve").then(function(response) {
        $scope.todoList = response.data.todos;
    });

    $scope.todoAdd = function() {
        $http.post("/insert", {todoText: $scope.todoInput, done: false}).then(function(response) {
            $scope.todoList.push({_id: response.data._id, todoText: response.data.todoText, done: false});
            $scope.todoInput = "";
        });
    };

    $scope.remove = function(id) {
       var todo = $scope.todoList[id];

       $http.delete("/remove?id=" + todo._id).then(function() {
            $scope.todoList.splice(id, 1);
       });
    };

    $scope.markTodoComplete = function(id, box) {
           var todo = $scope.todoList[id];

           $http.put("/update", todo).then(function(response) {
                $scope.todoList[id] = response.data;
           });
    };


});
