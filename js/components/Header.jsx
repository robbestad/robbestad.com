/**
 * @jsx React.DOM
 */
(function(){
    'use strict';
})();

var React = require('react');

//require('./header.css');

var Header = React.createClass({
    render: function() {
        return (
            <header className="Header">
        {this.props.children}
            </header>
        )
    }
});

module.exports = Header;