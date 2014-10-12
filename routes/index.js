var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  fs.readFile(__dirname + "/../public/index.html", "utf8", function (err, data) {
      res.end(data);
  });
});

module.exports = router;
