var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config');
var connection = mysql.createConnection(config.mysql);

router.get('/:deviceid/:devicesecret/all', function(req, res, next) {
  new Promise(function(resolve, reject) {
    connection.query('SELECT * FROM `readings` WHERE device_id=? ORDER BY `time` DESC LIMIT 1', req.params.deviceid, function(err, rows) {
      if(err) {
        reject(err);
        return;
      }
      if(rows.length > 0) {
        resolve(rows[0]);
      }
      return;
    });
  }).then(function(record) {
    res.json({
      success: true,
      temperature: {
        centigrade: record.centigrade,
        fahrenheit: record.fahrenheit,
        kelvin: record.kelvin,
        heatindex: record.heatindex
      },
      dewpoint: record.dewpoint,
      humidity: record.humidity
    });
  }).catch(function(error) {
    res.json({
      success: false,
      error: error
    });
  })
});

router.get('/:deviceid/:devicesecret/temp/:type', function(req, res, next) {
  switch(req.params.type) {
  	case 'kelvin':
  	case 'k':
      selectColumn('kelvin')
        .then(function(temperature) {
          res.json({
            success: true,
            temperature: temperature
          })
        }).catch(function(error) {
          res.json({
            success: false,
            error: error
          })
        })
  		break;
  	case 'centigrade':
  	case 'c':
  		selectColumn('centigrade')
        .then(function(temperature) {
          res.json({
            success: true,
            temperature: temperature
          })
        }).catch(function(error) {
          res.json({
            success: false,
            error: error
          })
        })
      break;
    case 'fahrenheit':
    case 'f':
      selectColumn('fahrenheit')
        .then(function(temperature) {
          res.json({
            success: true,
            temperature: temperature
          })
        }).catch(function(error) {
          res.json({
            success: false,
            error: error
          })
        })
      break;
  }
});

router.get('/:deviceid/:devicesecret/dewpoint', function(req, res, next) {
  if(req.body) {
  	var params = req.body;
  	new Promise(function(resolve, reject) {
  		connection.query('SELECT dewpoint FROM `readings` WHERE device_id=? ORDER BY `time` DESC LIMIT 1', req.params.deviceid, function(err, rows) {
  			if(err) {
  				reject(err);
  				return;
  			}
  			if(rows.length > 0) {
  				resolve(rows[0].dewpoint);
          return;
  			} else {
          reject('No records returned.');
          return;
        }
  			return;
  		})
  	}).then(function(dewpoint) {
  		res.send(dewpoint);
  	}).catch(function(error) {
  		res.send({
        success: false,
        error: error
      })
  	})
  }
});

router.get('/:deviceid/:devicesecret/:humidity', function(req, res, next) {
  //todo humidity
});

router.post('/write', function(req, res, next) {
  if(req.body) {
  	var params = req.body;
  	new Promise(function(resolve, reject) {
      checkAuthenticated(params.device_id, params.device_secret)
        .then(function(success) {
          if(success) {
            connection.query('SELECT device_secret FROM `devices` WHERE device_id=?', params.device_id, function(err, rows) {
              if(err) {
                reject(err);
                return;
              }
              if(rows.length > 0) {
                if(req.params.devicesecret == rows[0].device_secret) {
                  connection.query('INSERT INTO `readings` (device_id,'
                    +'centigrade, fahrenheit, humidity, kelvin, dewpoint,' +
                    'time) VALUES (?,?,?,?,?,?,NOW())',
                    [params.device_id, params.centigrade, params.fahrenheit, params.humidity, params.kelvin, params.dewpoint],
                    function(err) {
                      if(err) {
                        reject(err);
                        return;
                      }
                      resolve(true);
                      return;
                    });
                } else {
                  reject('Failed authentication.');
                }
              }
              return;
            })
          }
          
        })
  		
  	}).then(function(success) {
      res.json({ success: success });
    }).catch(function(error) {
      res.json({
        success: false,
        error: error
      })
    }) 
  }
});

function checkAuthenticated(device_id, device_secret) {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT device_secret FROM `devices` WHERE device_id=?', device_id, function(err, rows) {
      if(err) {
        reject(err);
        return;
      }
      if(rows.length > 0) {
        if(devicesecret == rows[0].device_secret) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
      return;
    })
  })
}

function selectColumn(column) {
  return new Promise(function(resolve, reject) {
        connection.query('SELECT ' + column + ' FROM `readings` WHERE device_id=? ORDER BY `time` DESC LIMIT 1', req.params.deviceid, function(err, rows) {
          if(err) {
            reject(err);
            return;
          }
          if(rows.length > 0) {
            resolve(rows[0].kelvin);
            return;
          } else {
            reject('No records returned.');
            return;
          }
          return;
        })
      })
}

module.exports = router;
