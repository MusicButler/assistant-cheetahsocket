cheetahControllers.controller("MainController", ["$scope", "Socket", function ($scope, Socket) {
    $scope.playing = false;
    $scope.volume = 0;
    $scope.connected = false;
    $scope.toggle = function () {
        Socket.emit("butler:toggle");
    };

    $scope.next = Socket.emit.bind(Socket, "butler:nextone");
    $scope.previous = Socket.emit.bind(Socket, "butler:prevone");

    Socket.on('butler:connected', function (info) {
        $scope.$apply(function () {
            $scope.connected = true;
            $scope.playing = info.playing
            $scope.volume = info.volume;
        });
    });
    Socket.on('butler:playing', function (info) {
        $scope.$apply(function () {
            $scope.playing = info;
        });
    });
    Socket.on("disconnect", function () {
        $scope.$apply(function () {
            $scope.connected = false;
        });
    });
}]);
