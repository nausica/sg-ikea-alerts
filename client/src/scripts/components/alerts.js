'use strict';
/** @jsx React.DOM */
var React       = require('react');
var Reflux      = require('reflux');
var AlertsStore = require('../stores/alertsStore');
var actions     = require('../actions/actions');

var Panel = require('react-bootstrap').Panel;
var Table = require('react-bootstrap').Table;
var Toggle = require('react-toggle');

var Alerts = React.createClass({

  mixins: [
    Reflux.listenTo(AlertsStore, 'onAlertsUpdate')
  ],

  getInitialState: function() {
    var alertsData = AlertsStore.getDefaultData();
    return {
      loading: true,
      alerts: alertsData
    };
  },

  componentDidMount: function() {
    actions.listenToAlerts(this.props.profile.email);
  },

  onAlertsUpdate: function(alertsData) {
    this.setState({
      loading: false,
      alerts: alertsData
    });
  },

  render: function() {
    const title = (
      <h3>My alerts</h3>
    );

    console.log('render');
    console.log(this.state.alerts);

    var rows = this.state.alerts.map(function(alert, i) {
      return (
        <tr key={i}>
        <td>{alert.name}</td>
        <td>{alert.code}</td>
        <td>{alert.email}</td>
        <td>
          <Toggle
          defaultChecked={alert.active}
          aria-label="No label tag"
          onChange={actions.toggleStatus.bind(this, alert)}/>
        </td>
        </tr>
      )
    });

    return (
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <div className="my-alerts-div center-block">
            <Panel header={title}>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Email</th>
                    <th>Active?</th>
                  </tr>
                </thead>
                <tbody>
                { rows }
                </tbody>
              </Table>
            </Panel>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Alerts;
