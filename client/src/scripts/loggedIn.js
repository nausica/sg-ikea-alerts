var React = require('react');

var Alerts   = require('./components/alerts');
var Search  = require('./components/search');
var LoggedIn = React.createClass({


  getInitialState: function() {
    return {
      profile: null
    }
  },

  componentDidMount: function() {
    this.props.lock.getProfile(this.props.idToken, function (err, profile) {
      if (err) {
        console.log("   ", err);
        alert("Error loading the Profile");
      }
      this.setState({profile: profile});
            console.log(profile)

    }.bind(this));
  },

  render: function() {
    if (this.state.profile) {
      return (
        <div>
            <h2>Welcome to Ikea Alerts, {this.state.profile.nickname}</h2>
            <Search profile={this.state.profile}/>
            <Alerts profile={this.state.profile}/>
        </div>
      );
    } else {
      return (
        <div class="loading">Loading profile</div>
      );
    }
  }
});

module.exports = LoggedIn;
