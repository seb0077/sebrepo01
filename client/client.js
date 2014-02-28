var app = angular.module('myApp', ['ngRoute', 'Services']);

app.config(function($routeProvider){
   $routeProvider
       .when('/', {
           templateUrl: 'part_start.html'
       })
       .when('/sockettests', {
           templateUrl: 'part_sockettests.html',
           controller: 'sockettests_controller'
       })
    .when('/chat', {
        templateUrl: 'part_chat.html',
        controller: 'chat_controller'
    });
    $routeProvider.otherwise({redirectTo: '/'});
});



app.controller('sockettests_controller', function($scope, $interval, Socket){
    $scope.messages = [];
    var i = 1;

    var timer = $interval(function(){
        var nowTime = Date.now();
        var data = {
            num: i,
            time: nowTime
        };
        Socket.emit("sockettest_send", data);
        i++;
    }, 100, 50);

    Socket.on("sockettest_receive", function(data){
        var nowTime = Date.now();
        var msg = data.num + ": " + (nowTime - data.time) + " msec";
        $scope.messages.push(msg);
    });
});



app.controller('chat_controller', function($scope, $interval, Socket){
    $scope.loading = true;
    $scope.readys = [];

    var timer = $interval(function(){
        $scope.systemtime = Date.now();
    }, 300, 50);

    Socket.on("hello", function(name){
        $scope.name = name;
        $scope.loading = false;
        $scope.readys.push("hello event arrived!");
    });

    Socket.on("ready", function(){
        $scope.readys.push("ready event arrived!");
    });

    $scope.setReady = function(){
        Socket.emit("ready");
        $scope.readys.push("i am ready!");
    };

    $scope.sendMessage = function(){
        $scope.readys.push($scope.message);
        Socket.emit('eSendMessage', $scope.message);
    };

    Socket.on("eBroadcastMessage", function(message){
        $scope.readys.push(message);
    });
});
