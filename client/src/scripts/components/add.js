/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var _ = require('lodash');
var AlertsStore = require('../stores/alertsStore');
var actions = require('../actions/actions');

var AddForm = React.createClass({

  mixins: [
    require('react-router').Navigation, // needed for transitionto
  ],

  getInitialState: function() {
    return {
      alert: {
        id: Math.floor((Math.random() * 10000) + 1),
        name: '',
        code: '',
        email: '',
        active: 'Yes'
      },
      errors: {}
    }
  },

  renderTextInput: function(id, label, help) {
    return this.renderField(id, label, help,
      <input type="text" className="form-control" id={id} ref={id} key={id} value={this.state.alert[id]} onChange={this.handleChange.bind(this, id)}/>
    )
  },

  renderField: function(id, label, help, field) {
    return <div className={$c('form-group', {'has-error': id in this.state.errors})}>
      <label htmlFor={id} className="col-sm-2 control-label">{label}</label>
      <div className="col-sm-6">
        {field} <span className="help-block m-b-none">{help}</span>
      </div>
    </div>
  },

  // update the state when they type stuff a the text box
  handleChange: function(field, e) {
    var thisAlert = this.state.alert;
    thisAlert[field] = e.target.value;
    this.setState({alert: thisAlert});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var errors = {}
    var required = ['name', 'code', 'email'];
    // check for required fields
    required.forEach(function(field) {
      if (!this.state.alert[field]) {
        errors[field] = 'This field is required.'
      }
    }.bind(this));
    // update the state with any errors
    this.setState({errors: errors});
    // if no errors, emit action to add it
    if (_.keys(errors).length === 0) {

      //AlertsStore.addAlert(this.state.alert);
      actions.addAlert(this.state.alert);
      // refresh the form and errors
      this.setState({
        alert: {},
        errors: {}
      });
      this.transitionTo('home');
    }
  },

  render: function() {

    return (
      <div>
        <div className="row">
          <div className="col-lg-8">
            <div className="ibox float-e-margins">
              <div className="ibox-content">

                <form onSubmit={ this.handleSubmit } className="form-horizontal">
                  {this.renderTextInput('name', 'Name', '')}
                  {this.renderTextInput('code', 'Code', '')}
                  {this.renderTextInput('email', 'Email', '')}
                  <div className="form-group">
                      <div className="col-sm-4 col-sm-offset-2">
                          <button className="btn btn-primary" type="submit">Add Alert</button>
                      </div>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  }

});

module.exports = AddForm;

function $c(staticClassName, conditionalClassNames) {
  var classNames = []
  if (typeof conditionalClassNames == 'undefined') {
    conditionalClassNames = staticClassName
  }
  else {
    classNames.push(staticClassName)
  }
  for (var className in conditionalClassNames) {
    if (!!conditionalClassNames[className]) {
      classNames.push(className)
    }
  }
  return classNames.join(' ')
}
