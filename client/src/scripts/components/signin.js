'use strict';
/** @jsx React.DOM */
var React       = require('react');


var Signin = React.createClass({
    render: function() {
        return (
            <div className="login-box auth0-box before">
                <a onClick={this.props.lock.show} className="btn btn-primary btn-lg btn-login btn-block">Sign In</a>
            </div>
        );
    }
});

module.exports = Signin;
