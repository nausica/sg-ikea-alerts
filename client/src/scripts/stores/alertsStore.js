/** @jsx React.DOM */
var Reflux = require('reflux');
var _ = require('lodash');
var actions = require('../actions/actions');
var request = require('superagent');

var _alerts = [];

var alertsStore  = Reflux.createStore({

  init: function() {
    // set the private alerts variables to our initial array
    _alerts = [];
    // register addAlert action & bind to addAlert function
    this.listenTo(actions.addAlert, this.addAlert);
    // register toggleStatus action & bind to toggle function
    this.listenTo(actions.toggleStatus, this.toggle);
    // register listenToAlerts function
    this.listenTo(actions.listenToAlerts, this.listenToAlerts);
  },

  // returns the private array of alerts
  getDefaultData: function() {
    return _alerts;
  },

  //
  listenToAlerts: function(param) {
    var self = this;
    request
    .get('http://localhost:3000/?email='+param)
    .set({ Accept: 'application/json' })
    .end(function(response) {
      _alerts = response.body;
      self.trigger(_alerts);
    })
  },

  // returns a alert by id
  getAlert: function(alertId) {
    return _.where(_alerts, { '_id': alertId })[0];
  },

  // pushes the newly created alert to the private array of alerts
  addAlert: function(alert) {
    _alerts.push(alert);
    this.trigger(_alerts);
  },

  // callback for toggle action
  toggle: function(alert) {
    var alert = _.where(_alerts, { '_id': alert._id })[0];
    // toggle the alert status in the object
    if (alert.active) {
        alert.active = false;
    } else {
        alert.active = true;
    }
    // pass the data on to any listeners -- see toggleStatus in view.js)
    this.trigger();
  }

});

module.exports = alertsStore;
