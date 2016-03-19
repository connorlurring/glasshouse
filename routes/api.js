var express = require('express');
var router = express.Router();

router.get('/:devicekey/temp/:type', function(req, res, next) {
  switch(req.params.type) {
  	case 'kelvin':
  	case 'k':
  		res.send('69'); //todo real numbers and check fallthrough from previous case
  }
});

router.get('/:devicekey/hi', function(req, res, next) {
  //todo heat index
});

router.get('/:devicekey/humidity', function(req, res, next) {
  //todo humidity
});

router.get('/:devicekey/:param/write', function(req, res, next) {
  //todo object parsing
});

module.exports = router;
