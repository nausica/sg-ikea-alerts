/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var AlertsStore = require('../stores/alertsStore');
var actions = require('../actions/actions');

var Display = React.createClass({

  mixins: [
    Router.Navigation,
    Router.State,
    Reflux.ListenerMixin
  ],

  componentDidMount: function() {
    this.listenTo(AlertsStore, this.toggleStatus);
  },

  getInitialState: function() {
    var alertId = this.getParams().id;
    return {
      alert: AlertsStore.getAlert(alertId)
    }
  },

  toggleStatus: function() {
    this.setState({
      alert: AlertsStore.getAlert(this.getParams().id)
    });
  },

  render: function() {
    return (
      <div>
      <dl className="dl-horizontal">
        <dt>Name</dt>
        <dd>{this.state.alert.name}</dd>
        <dt>Code</dt>
        <dd>{this.state.alert.code}</dd>
        <dt>Email</dt>
        <dd>{this.state.alert.email}</dd>
        <dt>Active?</dt>
        <dd>{this.state.alert.active}</dd>
      </dl>
      <div className="col-sm-offset-2">
        <button type="button" className="btn btn-primary" onClick={ actions.toggleStatus.bind(this, this.state.alert) }>Toggle Active</button>
      </div>
      </div>
    );
  }

});

module.exports = Display;
