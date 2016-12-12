var React = require('react');
var Router = require('react-router');
var ReactDOM = require('react-dom');
var request = require('superagent');

var Index = React.createClass({
  render: function() {
    return (
      <p>aaaaaa!!</p>
    );
  }
});

var Test = React.createClass({
  render: function() {
    return (
      <p>bbbbbb!!</p>
    );
  }
});

ReactDOM.render(<Index />, document.getElementById('root'));