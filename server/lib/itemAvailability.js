var request     = require('superagent');
var nodemailer  = require('nodemailer')
var parseString = require('xml2js').parseString;
var request     = require('superagent');
var Q           = require('q');
var _           = require('lodash');


var ItemAvailability = (function() {

  const shops_map = {
    '045' : 'Alexandra',
    '022' : 'Tampines'
  };

  var publicAPI = {

    check: function(code) {
      var deferred = Q.defer();
      var url = 'http://www.ikea.com/sg/en/iows/catalog/availability/' + code;

      request
        .get(url)
        .end(function(err, response) {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve(response.text);
          }
      });

      return deferred.promise;
    },

    parse: function(xml) {
      var deferred = Q.defer();
      var parsed = {};

      parseString(xml, function (err, result) {
        var availability_json = result['ir:ikea-rest'].availability;

        var shops = [];
        _.forEach(availability_json, function(n) {
          _.forEach(n.localStore, function(m) {
            var shop = {};
            shop.buCode = shops_map[ m['$'].buCode ];
            shop.availableStock = m.stock[0].availableStock[0];
            shops.push(shop);
            parsed.itemCode = m.stock[0].partNumber[0];
          });
        });
        parsed.shops = shops;
        deferred.resolve(parsed);
      });
      return deferred.promise;
    },
    mail: function(availability, alert, email) {
      var deferred = Q.defer();
      var template = _.template('<div style="max-width:650px;background-color:#CBE2FD;font-family:Arial,sans-serif;padding:5px"><div style="min-height:36px;font-size:14px;font-weight:bold;padding-bottom:4px"><table style="display:inline;width:100%"><tbody><tr><td valign="middle" height="32px" style="padding:0"><%= header %></td></tr></tbody></table></div><div style="font-size:13px;background-color:#fff;padding:10px 7px 7px 7px"><span style=""><pre style="font-size:13px;font-family:Arial,sans-serif;white-space:pre-wrap;white-space:-moz-pre-wrap!important;word-wrap:break-word"><%= message %></pre></span><div style="min-height:1px;background-color:#ccc;padding:0px"></div><br><span style="color:#898989"><%= footer %></span><div style="text-align:right"></div></div></div>');
      var compiled = _.template('<% _.forEach(shops, function(shop) { %><p><%= shop.buCode %>: <%= shop.availableStock %></p><% }); %>');

      var transporter = nodemailer.createTransport();
      transporter.sendMail({
        from: 'Ikea Alerts <noreply@ikeaAlerts.com>',
        to: email,
        subject: 'hello',
        text: 'ddd',
        html: template({
          header: 'Availability '+ alert.name,
          message: compiled({'shops': availability.shops}),
          footer: '<a href="http://localhost:9000/">Edit alert</a> | <a href="http://www.ikea.com/sg/en/catalog/products/'+availability.itemCode+'">See the product in Ikea</a>'
        })
      }, function(err, info) {
        deferred.resolve(info);
      });
      return deferred.promise;
    },
    manage: function(alert, email, callback) {
      var deferred = Q.defer();

      publicAPI
        .check( alert.code )
        .then( function(xml) {
          return publicAPI.parse(xml)
        })
        .then( function(shops) {
          return publicAPI.mail(shops, alert, email)
        })
        .fail(function(err) {
          callback(err);
        })
        .done( function(info) {
          callback(null, info)
        });
    }
  };

  return publicAPI;
})();

module.exports = ItemAvailability;
