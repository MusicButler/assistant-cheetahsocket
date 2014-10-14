cheetahControllers.controller("MainController", ["$scope", "Socket", function ($scope, Socket) {
    $scope.playing = false;
    $scope.volume = 0;
    $scope.connected = false;
    $scope.song = {};
    $scope.status = {};
    $scope.queue = {};
    $scope.playlist = [];
    var toast = document.querySelector("#message-toast")
    $scope.toast = {
        message: "Test de batard",
        duration: 5000
    };
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
    Socket.on('butler:message', function (data) {
        showMessage({message: data.message});
    });
    Socket.on('butler:added', function (data) {
        var message = data.song.title || "A song has been";
        message += " added to playlist";
        showMessage({message: message});
        $scope.$apply(function () {
            $scope.playlist.splice(data.pos, 0, data.song);
        });
    });
    Socket.on('butler:playlist', function (playlist) {
        $scope.playlist = playlist;
    })
    var showMessage = function (data) {
        $scope.$apply(function () {
            $scope.toast.message = data.message;
        });
        toast.show();
    }
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
    $scope.playNext = function () {
        Socket.emit('butler:queue', $scope.queue);
        $scope.queue.url = "";
        console.log($scope.queue);
    };
    $scope.playNow = function (index) {
        Socket.emit('butler:playnumber', index);
    }
}]);
