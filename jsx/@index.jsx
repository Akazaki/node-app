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
	entries(ctx) {
    	return {
			method: 'GET',
			url: `../api/test`
    	}
	}
});

ReactDOM.render(<Test />, document.getElementById('root'));