/** @jsx React.DOM */

(function(){
  'use strict';
}());

var React = require('react');
window.React = React;

var App = require('./components/app.react.js');
var Masthead = require('./components/masthead.jsx');
var Footer = require('./components/footer.jsx');
var Menu = require('./components/menu.jsx');
var Quiz = require('./components/quiz.jsx');
var Search = require('./components/search.jsx');
//var Sidebar = require('./components/sidebar.jsx');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Routes = Router.Routes;
var Link = Router.Link;
var NotFoundRoute = Router.NotFoundRoute;
var Article = require('./components/article.react');

//React.renderComponent(<Masthead myTitle="Robbestad.com" />, document.getElementById('masthead'));
React.renderComponent(<Footer />, document.getElementById('Footer'));
React.renderComponent(<Menu><Search /></Menu>, document.getElementById('Menu'));

var Index = React.createClass({
    render: function() {
        return <h1>Welcome to my site...</h1>;
    }
});
var NotFound = React.createClass({
    render: function() {
        return <h2>Not found</h2>;
    }
});


var routes = (
    <Route handler={App}>
        <DefaultRoute handler={Index}/>
        <Route name="article" path="article/:id" handler={Article}/>

        <NotFoundRoute handler={NotFound}/>
    </Route>
    );
React.renderComponent(
    <Routes children={routes}/>,
    document.getElementById('App')
);

if(window.location.hash === "#quiz")
    React.renderComponent(<Quiz />, document.getElementById('quiz'));
