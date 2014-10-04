/**
 * @jsx React.DOM
 */
(function () {
    'use strict';
})();

var ReactTouch = require('react-touch');
var RoutedLink = require('react-touch/lib/routing/RoutedLink');
var LeftNavContainer = require('react-touch/lib/interactions/leftnav/LeftNavContainer');
var SIDEBAR_WIDTH = 242;
var TOPBAR_HEIGHT = 51; // + 1 for the border
var Header = require('./Header.jsx');

var Layout = React.createClass({
    handleNavClick: function () {
        this.refs['leftNavContainer']._handleTap();

    },
    getInitialState: function() {
        return {
            title: [],
            id: []
        };
    },
    toggleNavClick: function () {
        this.refs['leftNavContainer']._handleTap();
        if(!this.refs['leftNavContainer'].isNavOpen()){
            // lock scroll position, but retain settings for later
            var scrollPosition = [
                self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
                self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
            ];
            var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
            html.data('scroll-position', scrollPosition);
            html.data('previous-overflow', html.css('overflow'));
            html.css('overflow', 'hidden');
            window.scrollTo(scrollPosition[0], scrollPosition[1]);

        } else {
            // un-lock scroll position
            var html = jQuery('html');
            var scrollPosition = html.data('scroll-position');
            html.css('overflow', html.data('previous-overflow'));
            window.scrollTo(scrollPosition[0], scrollPosition[1])
        }
    },
    componentDidMount: function(){
        this.getTitlesAndLinks();
    },
    getTitlesAndLinks: function(){
        var react = this;
        $.getJSON( "http://api.robbestad.com/robbestad", function( data ) {
            var titles=[];
            var ids=[];
            $.each(data, function (key, val) {
                if ("object" === typeof val["robbestad"]) {
                    for (var i = 0; i < val["robbestad"].length; i++) {
                        titles.push(val["robbestad"][i].title);
                        ids.push(val["robbestad"][i].id);
                    }
                }
            });
            react.setState({
                title: titles,
                id: ids
            });
        });
    },

    render: function () {
        var content=[];
        //console.log(this.state.title[0])
        for (var i = 0; i < this.state.title.length; i++) {
            content.push(<a key={i} className="Layout-navLink" onClick={this.handleNavClick}
            href={'index.php?id='+ this.state.id[i]+'#nosplash'}
            >
                 {this.state.title[i]}
                 </a>);
        }

        var button = (
            <div onClick={this.toggleNavClick} className="Layout-hamburger fa fa-bars" />
        );

        var topContent = (
            <Header className="Layout-topBar">Robbestad.com</Header>
        );


        var sideContent = (
            <div className="Layout-nav">
                {content}
            </div>
        );
        return (
            <div className="hidden-md hidden-sm hidden-lg">
                    <LeftNavContainer
                    ref="leftNavContainer"
                    button={button}
                    topContent={topContent}
                    sideContent={sideContent}

                    topHeight={TOPBAR_HEIGHT}
                    sideWidth={SIDEBAR_WIDTH}>
                        <div className="Layout-content">
                    {this.props.children}
                        </div>
                    </LeftNavContainer>
            </div>
        )
    }

});

Layout.TOPBAR_HEIGHT = TOPBAR_HEIGHT; // account for border

module.exports = Layout;
