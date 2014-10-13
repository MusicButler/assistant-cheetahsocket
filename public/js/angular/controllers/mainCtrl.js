cheetahControllers.controller("MainController", ["$scope", "Socket", function ($scope, Socket) {
    $scope.playing = false;
    $scope.volume = 0;
    $scope.connected = false;
    $scope.song = {};
    $scope.status = {};
    var progressInterval = null;
    $scope.toggle = function () {
        Socket.emit("butler:toggle");
    };

    $scope.next = Socket.emit.bind(Socket, "butler:nextone");
    $scope.previous = Socket.emit.bind(Socket, "butler:prevone");

    Socket.on('butler:connected', function (info) {
        $scope.connected = true;
        $scope.updateInfos(info);
    });
    $scope.updateInfos = function (info) {
        $scope.$apply(function () {
            $scope.connected = true;
            $scope.playing = info.playing
            $scope.volume = info.volume;
            $scope.song = info.song;
            $scope.status = info.status;
            if ($scope.playing) {
                startProgress();
            } else {
                stopProgress();
            }
        });
    };
    Socket.on('butler:playing', $scope.updateInfos);
    Socket.on("disconnect", function () {
        $scope.$apply(function () {
            $scope.connected = false;
            stopProgress();
        });
    });
    var startProgress = function () {
        if (progressInterval === null) {
            progressInterval = setInterval(function () {
                $scope.$apply(function () {
                    $scope.status.position = Math.min($scope.status.duration, $scope.status.position + 1);
                })
            }, 1000);
        }
    }
    var stopProgress = function () {
        if (progressInterval !== null) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }
}]);
