var express = require('express');
var router = express.Router();

router.get('/:devicekey/temp/:type', function(req, res, next) {
  switch(req.params.type) {
  	case 'kelvin':
  	case 'k':
  		res.send('69');
  }
});

router.get('/:devicekey/hi', function(req, res, next) {
  
});

router.get('/:devicekey/humidity', function(req, res, next) {
  
});

router.get('/:devicekey/:param/write', function(req, res, next) {
  
});

module.exports = router;
