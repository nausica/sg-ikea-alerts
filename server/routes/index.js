var express     = require('express');
var router      = express.Router();
var _           = require('lodash');
var jsdom       = require('jsdom');
var request     = require('superagent');

var Alert             = require('../models/alert');
var ItemAvailability  = require('../lib/itemAvailability');
var config            = require('../config.js');


/* GET all alerts */
router.get('/api', function(req, res) {
  var email = req.query.email;
  var query = email ? {'email': email} : {};
  Alert.find(query, function(err, alerts) {
    if (err)
      res.status(500).json(err);
    res.json(alerts);
  })
});

/* POST create alert */
router.post('/api', function(req, res) {
  var alert = new Alert(req.body);
  alert.save(function(err, alert) {
    if (err)
      res.send(err);
    res.json(alert); // returns the newly created alert
  });
});

/* PUT update a alert by id */
router.put('/api/:id', function(req, res) {
  Alert.findById(req.params.id, function (err, alert) {
    if (err) {
      res.send(err);
    } else {
      // assign submitted properties to object for updates
      _.extend(alert, req.body);
      alert.save(function(err, alert) {
        if (err)
          res.send(err);
        res.json(alert);
      });
    }
  });
});

/* GET alert by id */
router.get('/api/:id', function(req, res) {
  res.contentType('application/json');
  Alert.findById(req.params.id, function (err, alert) {
    if (err) {
      res.status(404).send(err);
    } else {
      if (!alert) {
        res.status(404).send("Not found");
      } else {
        res.json(alert);
      }
    }
  });
});

/* DELETE alert by id*/
router.delete('/api/:id', function (req, res) {
  Alert.remove({ _id: req.params.id }, function(err) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({"success": true});
    }
});

});

/* GET item info by code */
router.get('/api/item/:code', function(req, res) {
  console.log(req.params.code);
  jsdom.env(
    'http://www.ikea.com/sg/en/catalog/products/'+req.params.code+'/',
    ['http://code.jquery.com/jquery.js'],
    function (err, window) {
      if (err) {
        res.status(500).json(err);
      } else {
        var $ = window.jQuery;
        var result = {};
        var item_not_found = $('#errorPage').length;

        if (item_not_found) {
          res.status(404).json({'itemcode': req.params.code});
        } else {
          result.name = $('title').text();
          result.url = 'http://www.ikea.com' + $('#productImg').attr('src');
          res.json(result);
        }

      }
    }
  );
});

/* GET availability of an item by code */
router.get('/api/item/availability/:code', function(req, res) {

  var xml;
  var shop = {};
  var shops = [];
  var email = req.query.email;
  var url = 'http://www.ikea.com/sg/en/iows/catalog/availability/' + req.params.code;

  request
    .get(url)
    .end(function(err, second_res) {
      if (err) {
        res.send(err);
      } else {
        xml = second_res.text;
        if (email) {

          ItemAvailability
            .parse_and_mail(xml, email, function(info) {
              res.json(info);
            })

        } else {
           ItemAvailability
          .parse(xml)
          .then(function(shops) {
            res.json(shops);
          })
        }
      }
    });
});

/* GET availability of an alert by id and send email */
router.get('/api/manage/:id', function(req, res) {
  var email = req.query.email;

  Alert.findById(req.params.id, function (err, alert) {
    if (err) {
      res.send(err);
    } else {
      ItemAvailability
        .manage(alert, email, function(err, info) {
          if (err) {
            res.send(err);
          } else {
            res.json(info);
          }
        })
    }
  });
});

router.all('/*', function(req, res) {
  // This route deals enables HTML5Mode by forwarding missing files to the index.html
  // Just send the index.html for other files to support HTML5Mode
  console.log('/*');
  res.sendFile('index.html', { root: config.server.distFolder });
});

module.exports = router;
