/** @jsx React.DOM */
var Reflux = require('reflux');
var _ = require('lodash');
var actions = require('../actions/actions');
var request = require('superagent');

var _item = {};

var itemStore  = Reflux.createStore({

  init: function() {
    _item = {
        url: '../images/ikea_sample.png',
        name: 'Quilt cover and 2 pillowcases, black/white',
        disabled: true
      };
    // register listenToItem function
    this.listenTo(actions.retrieveItem, this.retrieveItem);
  },

  // returns the private array of alerts
  getDefaultData: function() {
    return _item;
  },

  //
  retrieveItem: function(param) {
    var self = this;
    request
    .get('http://localhost:3000/item/'+param)
    .set({ Accept: 'application/json' })
    .end(function(response) {
      _item = response.body;
      _item.disabled = false;
      self.trigger(_item);
    })
  }

});

module.exports = itemStore;
