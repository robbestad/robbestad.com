/** @jsx React.DOM */

(function(){
    'use strict';
})();

var SetIntervalMixin = {
    componentWillMount: function() {
        this.intervals = [];
    },
    setInterval: function() {
        this.intervals.push(setInterval.apply(null, arguments));
    },
    componentWillUnmount: function() {
        this.intervals.map(clearInterval);
    }
};
var React = require('react'),

  Masthead = React.createClass({
    mixins: [SetIntervalMixin], // Use the mixin
    componentDidMount: function() {
        this.setInterval(this.tick, 20); // Call a method on the mixin

    },
      getInitialState: function(){
          return {
            countdown:1.25
          }
      },
    tick: function() {
        var scrollTop = (window.pageYOffset !== undefined) ?
        window.pageYOffset : (document.documentElement
            || document.body.parentNode || document.body).scrollTop,
            width=document.body.clientWidth;

        if(this.state.countdown>=0){
            this.setState({
                countdown: this.state.countdown-0.015
            });
        }

        var dontShowVal;
        if($(".container-fluid").innerHeight()<document.body.clientHeight){
            dontShowVal=true;
        }
        else
        if(this.refs.masthead.getDOMNode().style.opacity <= 0
            && scrollTop > 0){
            dontShowVal=true;
        } else if(window.location.hash==="#nosplash"){
            dontShowVal=true;
        } else if(window.innerWidth<768){
            dontShowVal=true;
        }
        else dontShowVal = this.props.dontShow;

        this.setProps({scrollTop: -scrollTop, logoTop:scrollTop/1.75,
            width: width, dontShow:dontShowVal});

    },
    render: function() {
        var reducify=40;
        var modifier = Math.abs(this.props.scrollTop/reducify);
        var opacity = 1-modifier > 0 ? 1-(modifier) : 0;
        opacity = this.props.scrollTop > 0 ? 1 : opacity;
        opacity=(opacity-(1-this.state.countdown));
        var z = opacity > 0.01 ? 90 : 0;
        //var display = z === -1 ? 'none' : 'block';
        var width = z === -1 ? 0 : window.innerWidth;
        var height = z === -1 ? 0 : window.innerHeight;
        //console.log(height+ "x" + width + ":" + opacity + ":" +z +">"+this.props.dontShow);
        if(this.props.dontShow === true){
            opacity=0;
        }

        var divStyle= {
            position: 'fixed',
            //top: this.props.scrollTop,
            left: '0',
            top: '0',
            width: width,
            height: height,
            background: 'url(/common-assets/bg.png) repeat 50% 50%',
            backgroundSize:'cover',
            fontFamily:'Arial, Verdana, sans-serif',
            transform: 'translateZ(0) scale(1)',
            zIndex: z,
            //display:display,
            opacity: opacity,
            textAlign: 'center'
        };
        var logoStyle = {
            top: ((window.innerHeight/2)-100)+"px",
            color: 'white',
            fontSize: '7rem',
            left: (window.innerWidth/2)-(567/2)+"px",
            position: 'fixed'
        };
      return (<div ref="masthead" style={divStyle}>
        <div className="animated zoomIn" style={logoStyle}><img src="/common-assets/robcom.png" /></div>
        </div>)
    }
});

module.exports = Masthead;
