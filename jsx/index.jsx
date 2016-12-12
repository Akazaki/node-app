var React = require('react');
var ReactDOM = require('react-dom');

var Index = React.createClass({
  render: function() {
    return (
      <div className="index">
        <h1>Hello React!</h1>
      </div>
    );
  }
});

ReactDOM.render(<Index />, document.getElementById('root'));