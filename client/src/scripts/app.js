'use strict';
/** @jsx React.DOM */
var React = require('react');
var $     = require('jquery');

// view components
var LoggedIn = require('./loggedIn');

var App = React.createClass({

  componentWillMount: function() {
    this.setupAjax();
    this.createLock();
    this.setState({idToken: this.getIdToken()})
  },

  createLock: function() {
    this.lock = new Auth0Lock('aeHA0aanrspNIwyp0RVYDqEgCJ8Cbp5I', 'journeylabs.auth0.com');
  },

  setupAjax: function() {
    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('userToken')) {
          xhr.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('userToken'));
        }
      }
    });
  },

  getIdToken: function() {
    var idToken = localStorage.getItem('userToken');
    var authHash = this.lock.parseHash(window.location.hash);
    if (!idToken && authHash) {
      if (authHash.id_token) {
        idToken = authHash.id_token
        localStorage.setItem('userToken', authHash.id_token);
      }
      if (authHash.error) {
        console.log("Error signing in", authHash);
      }
    }
    return idToken;
  },

  isTokenExpired: function() {
    // Detect if JWT is expired
    // is_expired = parse_json(UrlBase64Decode(token.split('.')[1])).exp < current_date_unix_format
    var token = this.state.idToken;
    var exp = JSON.parse(window.atob(token.split('.')[1])).exp;
    return  exp < Math.floor(Date.now() / 1000);
  },

  showLock: function() {
    this.lock.show();
  },

  render: function() {
    if (this.state.idToken) {
      if (this.isTokenExpired()) {
        localStorage.removeItem('userToken');
      } else {
        return (
          <LoggedIn lock={this.lock} idToken={this.state.idToken} />
          );
      }
    }
    return (
      <div className="login-box auth0-box before">
        <a onClick={this.showLock} className="btn btn-primary btn-lg btn-login btn-block">Sign In</a>
      </div>
    )
  }
});

React.render(<App />,
  document.getElementById('app'));
