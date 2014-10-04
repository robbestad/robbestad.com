/** @jsx React.DOM */

var React = require('react');

//require('./message.css');

var Message = React.createClass({
    render: function() {
        return <div className="Message">{this.props.children}</div>;
    }
});

module.exports = Message;