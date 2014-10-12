cheetahServices.factory('Socket', [function () {
    return io.connect("http://spaceship.local:8008");
}]);
