/** @jsx React.DOM */

'use strict';

var React = require('react'),

    Search = React.createClass({

        _onKeyDown: function(event) {
            // If there are no visible elements, don't perform selector navigation.
            // Just pass this up to the upstream onKeydown handler
            console.log("on key down");
            if (!this.refs.sel) {
                return this.props.onKeyDown(event);
            }

            var handler = this.eventMap()[event.keyCode];

            if (handler) {
                handler(event);
            } else {
                return this.props.onKeyDown(event);
            }
            // Don't propagate the keystroke back to the DOM/browser
            return false;
        },
        _onTextEntryUpdated: function() {
            var value = this.refs.entry.getDOMNode().value;
            this.setState({visible: this.getOptionsForValue(value, this.state.options),
                selection: null,
                entryValue: value});
            return false;
        },


        render: function() {

            var style;
            if(!this.props.visible){
                style={
                    display:'none',
                    visibility:'hidden',
                    height:0,
                    width:0,
                    margin:0,
                    position:"auto"
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
                    minHeight:window.innerHeight+"px",
                    backgroundColor:'#e0e0e0',
                    zIndex:'998',
                    borderRight:'1px solid #aaaaaa',
                    borderLeft:'1px solid #aaaaaa',
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
                return (
                    <div />
                )
            } else {
                return (
                    <div style={style}>
                        <ul className="search responsiveList" style={bg}>
                            <li className="searchItem">Search is under construction...:)</li>
                        </ul>
                    </div>
                )
            }
        }
    });

module.exports = Search;
