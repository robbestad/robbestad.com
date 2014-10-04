/** @jsx React.DOM */

'use strict';

var React = require('react'),

    Sidebar = React.createClass({
        render: function() {
            var style;
            if(!this.props.visible){
                style={
                    display:'none',
                    visibility:'hidden',
                    height:"100%",
                    width:"0px",
                    marginTop:'40px',
                    zIndex:'0',
                    position:'absolute',
                    left:0

                }
            } else {
                style={
                    display:'block',
                    visibility:'visible',
                    marginTop:'40px',
                    position:'absolute',
                    left:0,
                    width:this.props.width <= 768 ? this.props.width-3 : (this.props.width-3)/2+"px",
                    height:'100%',
                    zIndex:'998',
                    overflowScroll:'touch'
                }
            }
            var bg={
                backgroundColor:'#e0e0e0',
                borderRight:'1px solid #aaaaaa',
                borderLeft:'1px solid #aaaaaa',
                boxShadow:'3px 0px 0px 0px #cccccc'
            };
            if(window.innerWidth>=768){
                style={
                    display:'none',
                    visibility:'hidden',
                    height:0,
                    width:0
                }
            }

            return (
                <div style={style} className="responsiveList sideBar">
                    <ul className="slider sliderItem" style={bg} dangerouslySetInnerHTML={{__html: this.props.blogTitles}} />
                </div>
            )
        }
    });

module.exports = Sidebar;
