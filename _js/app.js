/**
 *
 * @jsx React.DOM
 */

var React = require('react');

var $ = require('jquery')(window);

var TodoApp = require('./components/TodoApp.react');

React.renderComponent(
  <TodoApp />,
  document.getElementById('myapp')
);
