/** @jsx React.DOM */

var React = require('react');

var Layout = require('../components/layout.jsx');
var HomePage = require('./homepage.jsx');

var RootPage = React.createClass({
    render: function() {

        var routeName = this.props.routeName;

        if (routeName === '' || routeName === 'home') {
            return (<Layout />);
        } else {
            return <h1>Route {routeName} not found</h1>;
        }
    }
});
module.exports = RootPage;