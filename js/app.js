/** @jsx React.DOM */

(function(){
  'use strict';
}());

var React = require('react');

window.React = React;

var MyComponent = require('./components/mycomponent.jsx');
var Masthead = require('./components/masthead.jsx');
var Footer = require('./components/footer.jsx');
var Menu = require('./components/menu.jsx');
var Quiz = require('./components/quiz.jsx');
var Search = require('./components/search.jsx');
//var Sidebar = require('./components/sidebar.jsx');

React.renderComponent(<MyComponent />, document.getElementById('content'));
React.renderComponent(<Masthead myTitle="Robbestad.com" />, document.getElementById('masthead'));
React.renderComponent(<Footer />, document.getElementById('myfooter'));
React.renderComponent(<Menu><Search /></Menu>, document.getElementById('menu'));
//React.renderComponent(<Search />, document.getElementById('searchbar'));
//React.renderComponent(<Sidebar />, document.getElementById('sidebar'));

if(window.location.hash === "#quiz")
    React.renderComponent(<Quiz />, document.getElementById('quiz'));

