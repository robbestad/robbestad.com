/** @jsx React.DOM */

'use strict';
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Routes = Router.Routes;
var Link = Router.Link;
var NotFoundRoute = Router.NotFoundRoute;
var BlogStore  = require('../stores/blog.react');


var Article = require("./article.react");

var App = React.createClass({
    mixins: [ Router.Transitions ],
    getInitialState: function() {
        return {
            blogLinks: BlogStore.getItems(),
            loading: true
        };
    },

    componentWillMount: function () {
        BlogStore.init();
    },

    componentDidMount: function() {
        BlogStore.addChangeListener(this.updateItems);
    },

    componentWillUnmount: function () {
        BlogStore.removeChangeListener(this.updateItems);
    },
    updateItems: function (contacts) {
        if (!this.isMounted())
            return;

        this.setState({
            blogLinks: BlogStore.getItems(),
            loading: false
        });
    },



    render: function() {
        var links = this.state.blogLinks.map(function(item) {
            return <h2 key={item.id}><Link to="article" params={item}>- {item.title}</Link></h2>
        });

        return (
            <section className="container-fluid">

                <div className="header hidden-xs">
                    <ul className="nav nav-pills pull-right">
                        <li className="active"><a href="/index.php#nosplash">home</a></li>
                        <li><a href="index.php?content=about#nosplash">about</a></li>
                        <li><a href="mailto:anders@robbestad.com">contact</a></li>
                    </ul>
                    <a href="/">

                        <h1 className="text-muted">title</h1>
                    </a>
                </div>

                <div className="row-fluid">
                <div className="sidebar col-sm-4 col-md-3 col-lg-3 hidden-xs">
                    <div id="content">{links}</div>
                </div>
                <div className="article col-sm-8 col-md-9 col-lg-9 col-xs-12">
                    <div className="innerXsPadding">

                     {this.props.activeRouteHandler()}
                    </div>
                </div>
                </div>
            </section>
           );

      }
    });

module.exports = App;
