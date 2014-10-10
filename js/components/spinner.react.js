/** @jsx React.DOM */

'use strict';
var React = require('react');

var Spinner = React.createClass({
    getInitialState:function(){
        return {
            spinnerVisible:true
        }
    },
//    componentWillMount: function () {
//        window.spinner=this;
//    },
    componentDidMount: function() {
        window.spinner=this;
    },
    toggleSpinner:function(){
        this.setState({spinnerVisible:!this.state.spinnerVisible});
    },
    hideSpinner:function(){
        this.setState({spinnerVisible:false});
    },
    showSpinner:function(){
        this.setState({spinnerVisible:true});
    },
    render: function() {
//        for (var i = 12; i > 0; i--) {
//            barStyle = {};
//            barStyle.WebkitAnimationDelay = barStyle.animationDelay =
//                (i + 12) / 10 + 's';
//
//            barStyle.WebkitTransform = barStyle.transform =
//                'rotate(' + (i * 30) + 'deg) translate(146%)';
//
//            bars.push(
//                <div style={barStyle} className="bars" key={i} />
//            );
//        }
//        var spinWheel=[];
//        var spinnerStyle={};
//        var spinnerStyle={
//            display:"block",
//            position: "relative",
//            width: "64px",
//            height: "64px",
//            margin: "0 auto",
//            zIndex: "99"
//        };
//        for (var i = 12; i > 0; i--) {
//            spinnerStyle = {};
//            spinnerStyle.WebkitAnimationDelay = spinnerStyle.animationDelay =
//                (i + 12) / 10 + 's';
//            spinnerStyle.WebkitTransform = spinnerStyle.transform =
//                'rotate(' + (i * 30) + 'deg)';
//            spinWheel.push(
//                <div style={spinnerStyle} className="spinner" key={i} />
//            );
//        }
//
//        if(!this.state.spinnerVisible){
//            spinnerStyle={
//                display:"none"
//            };
//        }
//
//        return (
//            <div className="spinner" >{spinWheel}</div>
//            );

        var spinnerStyle={
            display:"block",
            position: "relative",
            width: "64px",
            height: "64px",
            margin: "0 auto",
            zIndex: "99",
            visibility:"visible"
        };


        if(!this.state.spinnerVisible){
            spinnerStyle={
                visibility:"hidden"
            };
        }

        return (
            <div className="spinner" style={spinnerStyle} />
            );
    }
});

module.exports = Spinner;