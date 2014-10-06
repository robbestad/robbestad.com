/** @jsx React.DOM */

'use strict';
var React = require('react');
var BlogStore  = require('../stores/blog.react');
var Router = require('react-router');
var Article = React.createClass({
    mixins: [ Router.Transitions ],
    getProp:function(obj, objName) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i) && (i == objName)) {
            return obj[i];
        }
    }
    return void 0;
    },

    render:function(){
        var article = BlogStore.getItem(this.props.params.id);
        var title = this.getProp(article,"title");
        var content = this.getProp(article,"content");
        var published = this.getProp(article,"published");
        return (<div><h3>{title}</h3><section dangerouslySetInnerHTML={{__html: content}} /></div>)
    }
});
module.exports = Article;