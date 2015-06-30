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
  request.put('http://localhost:3000/'+alert._id, alert, function () {console.log("done")});

}
actions.addAlert.preEmit = function (alert) {
  request.post('http://localhost:3000', alert, function () {console.log("done")});
};
actions.deleteAlert.preEmit = function(alert) {
  request
    .del('http://localhost:3000/'+alert._id)
    .end(function(err, res){

  });
};

module.exports = actions;
