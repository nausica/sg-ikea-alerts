'use strict';
/** @jsx React.DOM */
var React       = require('react');
var Reflux      = require('reflux');
var AlertsStore = require('../stores/alertsStore');
var actions     = require('../actions/actions');

var Panel = require('react-bootstrap').Panel;
var Table = require('react-bootstrap').Table;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Button = require('react-bootstrap').Button;

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
      <h3>My alerts ({this.state.alerts.length})</h3>
    );


    var rows = this.state.alerts.map(function(alert, i) {
      return (
        <tr key={i}>
        <td>{alert.name} ({alert.code})</td>
        <td>
          <Toggle
          defaultChecked={alert.active}
          onChange={actions.toggleStatus.bind(this, alert)}/>
        </td>
        <td>
          <a className="delete-alert"
          onClick={actions.deleteAlert.bind(this, alert)}>
            <Glyphicon glyph='trash' />
          </a>
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
                    <th>Item</th>
                    <th>Active?</th>
                    <th>&nbsp;</th>
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
