/** @jsx React.DOM */
var Reflux = require('reflux');
var request = require('superagent');

var actions = Reflux.createActions({
  'listenToAlerts': {},
  'toggleStatus': {},
  'addAlert': {},
  'retrieveItem': {},
  'deleteAlert' : {}
});


actions.toggleStatus.preEmit = function(alert) {
  alert.active = !alert.active;
  request.put('/api/'+alert._id, alert, function () {console.log("done")});
}

actions.addAlert.preEmit = function (alert) {
  request.post('/api/', alert, function () {console.log("done")});
};
actions.deleteAlert.preEmit = function(alert) {
  request
    .del('/api/'+alert._id)
    .end(function(err, res){

  });
};

module.exports = actions;
