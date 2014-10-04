/**
 * @jsx React.DOM
 */

(function(){
    'use strict';
})();

var React = require('react');

React.initializeTouchEvents(true);

    Sidebar = React.createClass({
        getInitialState: function () {
            return {
                pos: {'x': 0, 'y': 0},
                relativePos: {'x': 0, 'y': 0},
                dragging: false,
                prevY:0,
                windowHeight:window.outerHeight
            }
        },
    componentDidUpdate: function(){
      //this.replaceState({windowHeight:window.outerHeight});

    },
    componentDidMount: function(){
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('touchmove', this.onMouseMove);
        window.addEventListener('touchstart', this.onMouseDown);
        window.addEventListener('mousedown', this.onMouseDown);


    },
        onMouseMove: function (e) {
           // if (!this.state.dragging) return;

            //var startX = typeof e.clientX === 'undefined' ? e.changedTouches[0].clientX : e.clientX,
            //    startY = typeof e.clientY === 'undefined' ? e.changedTouches[0].clientY : e.clientY;
            //var prevY=this.state.prevY;
            //if(prevY===0) prevY=e.changedTouches[0].clientY-1;
            //var thisY=e.changedTouches[0].clientY;
            //
            //var nextY=this.state.pos.y;
            //nextY=0;
            //if((this.state.pos.y - (prevY+thisY))<0){
            //    nextY-=(this.state.pos.y - (prevY+thisY));
            //} else {
            //    nextY-=(this.state.pos.y - (prevY+thisY));
            //}
            //
            //this.setState({
            //    pos: {
            //        x:  0,
            //        y: nextY
            //    },
            //    relativePos: {
            //        'x': 0,
            //        'y': nextY - this.state.relativePos.y
            //    },
            //    prevY: nextY,
            //    windowHeight:this.state.windowHeight
            //});

            e.stopPropagation();
            var startY = typeof e.clientY === 'undefined' ? e.changedTouches[0].clientY : e.clientY;
            var prevY=this.state.prevY;
            if(prevY === 0 ) prevY = startY;
            var y = (prevY - startY);;//+(prevY - startY);
            //console.log("y:"+y + ": state" + prevY +" touch" + startY);
            var m;
            if(y>0 && y<25){
                m=y*2;
            } else if(y>-25 && y<0){
                m=y*2;
            }
            else
            if(y>0){
                m=35;
            } else {
                m=-35;
            }

            this.setState({
                pos: {
                    x:  0,
                    y: this.state.pos.y - y
                },
                prevY: startY,
                windowHeight:this.state.windowHeight
            });



        },
        lockBody: function(){
            var isPhone=false,
                body = $("body"),
                container=$(".container-fluid");

            if(window.screen.width<=640){
                isPhone=true;
            }

                // lock scroll position, but retain settings for later
                var scrollPosition = [
                    self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
                    self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
                ];

                if(isPhone){
                //    window.scrollTo(scrollPosition[0], scrollPosition[1]);
                    body.css("position","fixed");
                }

                this.setState({
                    overflow:false,
                    scrollPosition:{
                        0:window.document.body.scrollTop,
                        1:0
                    },
                    sliderVisible: true,
                    width: window.innerWidth,
                    height:window.innerHeight
                });

                body.css("overflow","hidden");
                container.css("overflow","hidden");
        },
        onMouseDown: function (e) {
            //e.preventDefault();
            //var dragging = !this.state.dragging;
            //this.lockBody();
            //if(dragging){
            //    window.addEventListener('mousemove', this.onMouseMove);
            //    window.addEventListener('touchmove', this.onMouseMove);
            //} else {
            //    window.addEventListener('mousemove', this.onMouseMove);
            //    window.addEventListener('touchmove', this.onMouseMove);
            //}
            //var startX = typeof e.clientX === 'undefined' ? e.changedTouches[0].clientX : e.clientX,
            //    startY = typeof e.clientY === 'undefined' ? e.changedTouches[0].clientY : e.clientY;
            //var relY=this.state.relativePos.y;
            //relY=0;
            //startY= e.target.style.top
            //console.log(e.target.style.top);
            //startX - this.state.relativePos.x,
            //this.setState({
            //        dragging: dragging,
            //        relativePos: {
            //            'x': 0,
            //            'y': startY - relY
            //        },
            //        windowHeight:this.state.windowHeight
            //    }
            //)
        },
    render: function() {

        //var windowHeight = 'undefined' !== this.state.windowHeight ?
        //    this.state.windowHeight : window.outerHeight;
        var backgroundColor = "#0d0";
        var y=this.state.pos.y;

        var sidebarStyle = {
            background: 'none repeat scroll 0% 0% #D6EDFF',
            height:$("body").height()+"px",
            top: y + 'px',
            //backgroundColor: backgroundColor,
            border: '1px solid blue',
            color: 'black',
            padding: '15px 0 0 0',
            width: "250px",
            textAlign: 'center',
            position: 'absolute',
            display: 'block',
            zIndex:'1',
            opacity:'0.7'
        };
    return (
       <div ref="sidebar" style={sidebarStyle}>
1<br/>
2<br/>
3<br/>
4<br/>
5<br/>
6<br/>
2<br/>
3<br/>
4<br/>
5<br/>
6<br/>
2<br/>
3<br/>
4<br/>
5<br/>
6<br/>
2<br/>
3<br/>
4<br/>
5<br/>
6<br/>
2<br/>
3<br/>
4<br/>
5<br/>
6<br/>
2<br/>
3<br/>
4<br/>
5<br/>
6<br/>
       </div>
      )
    }
});

module.exports = Sidebar;
