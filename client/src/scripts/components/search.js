'use strict';
/** @jsx React.DOM */
var React = require('react/addons');
var Reflux = require('reflux');

var actions = require('../actions/actions');
var ItemStore = require('../stores/itemStore');
var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;

var Loader = require('react-loader');

var SelectedItem = React.createClass({

  handleClick: function(e) {
    this.props.addAlert();
  },

  render: function() {
    return (
      <div className="selected-div center-block">
            <div className="content-wrapper">
              <div className="text-wrapper">
                <p>{this.props.item.name}</p>
                <p>{this.props.item.itemNumber}</p>
                <p>{this.props.item.price}</p>
              </div>
              <span className="alert-button">
                <Button bsStyle='primary' onClick={this.handleClick} disabled={this.props.item.disabled}>Add Alert</Button>
              </span>
            </div>
            <div className="thumb-wrapper">
              <img src={this.props.item.url} border="0" alt={this.props.item.name} title={this.props.item.name} height="100" class="zoomMousePointer"/>
            </div>
      </div>
    );
  }
});

var Search = React.createClass({

  mixins: [
    Reflux.listenTo(ItemStore, 'onItemUpdate')
  ],

  getInitialState: function() {
    var itemData = ItemStore.getDefaultData();

    return {
      query: '',
      item: itemData,
      item_loaded: true
    }
  },

  validationState: function() {
    var length = this.state.query.length;
    if (length >= 8) { return 'success'; }
    else if (length > 0) { return 'error'; }
  },

  handleChange: function() {
    var query =  this.refs.searchInput.getValue();
    this.setState({
      query: query,
      item_loaded: false
    });
    actions.retrieveItem(query);
  },

  onItemUpdate: function(itemData) {
    var newState = React.addons.update(this.state, {
      item: {$set: itemData},
      item_loaded: {$set: true}
    });
    this.setState(newState);
  },

  addAlert: function() {
    var alert = {};
    alert.name = this.state.item.name;
    alert.code = this.state.query;
    alert.email = this.props.profile.email;
    alert.active = true;
    // Add code + email
    actions.addAlert(alert);
  },

  render: function() {
    const searchButton = <Button bsStyle='primary' onClick={this.handleChange}>Search</Button>;
    return (
        <div>
            <div className="search-box">
                <div className="query-div center-block">
                      <Input
                        type='text'
                        value={this.props.query}
                        placeholder='Create an alert for...'
                        help='e.g. 00173901'
                        hasFeedback
                        ref='searchInput'
                        groupClassName='group-class'
                        labelClassName='label-class'
                        buttonAfter={searchButton}/>
                </div>
                <Loader loaded={this.state.item_loaded} lines={13} length={28} width={14} radius={42} opacity={0.25}>
                  <SelectedItem item={this.state.item} addAlert={this.addAlert}/>
                </Loader>
            </div>
      </div>
    );
  }
});
module.exports = Search;
