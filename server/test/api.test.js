var assert = require('assert');
var request = require('superagent');
var server = require('../server');
var users = require('../users');
var status = require('http-status');

describe('/alerts', function() {
  var app;

  before(function() {
    app = server(3000);
  });

  after(function() {
    app.close();
  });

  it('returns alert if id found', function(done) {
    users.list = ['test'];
    request.get('http://localhost:3000/5579168d461cc15b24f52b79').end(function(err, res) {
      console.log(res);
      assert.ifError(err);
      assert.equal(res.status, status.OK);
      var result = JSON.parse(res.text);
      assert.deepEqual({ user: 'test' }, result);
      done();
    });
  });
  /*
  it('returns 404 if user named `params.name` not found', function(done) {
    users.list = ['test'];
    request.get('http://localhost:3000/user/notfound').end(function(err, res) {
      assert.ifError(err);
      assert.equal(res.status, status.NOT_FOUND);
      var result = JSON.parse(res.text);
      assert.deepEqual({ error: 'Not Found' }, result);
      done();
    });
  });
*/
});
