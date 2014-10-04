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

Background = React.createClass({
    getInitialState: function () {
        return {
            opacity:1.0
        }
    },
        mixins: [SetIntervalMixin], // Use the mixin
    componentDidMount: function() {
        this.setInterval(this.tick, 1); // Call a method on the mixin
    },

   componentWillMount: function (props, state) {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('touchmove', this.onMouseMove);
   },
       tick: function() {
        var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        var width=document.body.clientWidth;
        this.setProps({scrollTop: -scrollTop, logoTop:scrollTop/1.75, width: width});
/*        console.log(scrollTop);*/
      //if(this.state.opacity>0)
          this.setState({opacity:scrollTop/1000})

    },

    onMouseMove: function (e) {
/*      if(this.state.opacity>0)
        this.setState({opacity:this.state.opacity-0.09})
*/    },
    render: function () {
        var myStyle= {
        width: window.outerWidth,
        height: window.outerHeight,
        position: 'absolute',
        backgroundColor:'#dd0',
        zIndex:'1',
        opacity:this.state.opacity
      }
      return (<div style={myStyle}></div>)
    }

});


module.exports = Background;
