var myApp = angular.module('myApp',[]);

myApp.controller('MyController', ['$scope', function($scope) {
    $scope.messages = [];
    $scope.connectedUsers = [];
    $scope.currentMessage = "";
    $scope.login = "ARN";
    var url ="http://10.130.193.35:1337";

    var socket = io.connect(url);
    var size = 10;
    var chanson = ["Un régiment de fromage blanc", "déclare la guerre aux camemberts", "le porsalut n'a pas  voulu", "car le roquefort était trop fort", "<h2>ENCORE PLUS FORT</h2>"];
    socket.emit("login", $scope.login);
    $scope.messages.push($scope.login+ " connexion ");
    socket.on("sync", function(data){
        console.log(data);
        switch(data.action){
            case "NEWUSER" :
                $scope.messages.push(data.login + " s'est connecté");
                break;

            case "DISCONNECTED" :
                $scope.messages.push(data.login + " s'est déconnecté");
                break;
            case "MESSAGE":
                $scope.messages.push(data.login+" : "+data.data);
                break;
            default:
                $scope.messages.push(data);
                break;
        }
        $scope.$apply();
        var elem = document.getElementById('messages');
        elem.scrollTop = elem.scrollHeight;
    });

    var i=0;
    setInterval(function(){
        if(i >= chanson.length){
            i=0;
            size = size+5;
        }
        $scope.currentMessage = chanson[i];
        $scope.sendMessage();
        i++;
    },2000);
    $scope.sendMessage = function(){
        socket.emit("msg", {uid : 1337, action: "MESSAGE", data: $scope.currentMessage});
        $scope.currentMessage= "";
    }
}]);