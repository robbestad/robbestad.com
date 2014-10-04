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

    FastSin = React.createClass({
        getInitialState: function () {
            return {
                //windowWidth: window.innerWidth,
                myTicker: 1,
                length:2048
            }
        },
        getDefaultProps: function () {
            return {
                mySinTable: false
            }
        },
        componentWillMount: function() {
            //this.calculcateDivs(this.state.length);
        },
        mixins: [SetIntervalMixin], // Use the mixin
        componentDidMount: function() {
            this.setInterval(this.ticker, 20); // Call a method on the mixin
        },
        ticker: function() {
            this.setState({
                myTicker: this.state.myTicker+1
            });
        },
        fastSin: function(steps){
                var table = [],
                    ang = 0,
                    angStep = (Math.PI *2) / steps;
                do {
                    table.push(Math.sin(ang));
                    ang += angStep
                } while (ang < Math.PI * 2);
                return table;
        },
        draw: function(){
            var divs = [];
            for (var i=0; i < window.innerWidth; i++) {
                divs += '<div style = "position:absolute;width:1px;height:0px;'
                + 'background-color:#0d0; top:280px; left: '
                + i + 'px;"></div>';
            }
            return divs;
        },
        //
        //calculcateDivs: function (num){
        //    // Define sinTable
        //    var sinTable;
        //    var maxSize=this.state.length*4; //was 4096
        //
        //    if(!this.props.sinTable){
        //        sinTable = this.fastSin(maxSize);
        //        this.props.sinTable = sinTable;
        //    }
        //    sinTable = this.props.sinTable; if(!sinTable) return (<div></div>);
        //
        //    // Define page
        //    var pageWidth = document.getElementById("fastsin").offsetWidth,
        //        x=this.state.myTicker;
        //
        //    var drawGraph = function(color, distance, ang, freq, height) {
        //        var height2 = height * 2, divs = [];
        //        for (var i = 0; i < pageWidth/distance; i++) {
        //            var hue;
        //            if(!color)
        //                hue = 'rgb(' + (Math.floor(Math.random() * 40)) + ',' + (Math.floor(Math.random() * 40)) +
        //                ',' + (Math.floor(Math.random() * 40)) + ')';
        //            else
        //                hue = color;
        //            var barStyle={
        //                top: 160 - height + sinTable[(ang + (i * freq)) & (maxSize-1)] * height + 'px',
        //                height: height2 + 'px',
        //                position:'absolute',
        //                width:'7px',
        //                backgroundColor:hue,
        //                left:i*distance+'px',
        //                opacity:'0.2'
        //            };
        //            divs.push(<div key={i} style={barStyle}></div>);
        //        }
        //        return divs;
        //    };
        //    for(var x = 0; x<num; x++){
        //        this.props.divs.one[x]=drawGraph('#F1903B', 7, x * 55, 72 - (sinTable[(x) &  (maxSize-1)] *15), 45
        //            - (sinTable[(x*5) &  (maxSize-1)] * 20));
        //        //this.props.divs.two[x]=drawGraph('#F1E3AD', 3, x * 55, 46 - (sinTable[(x) &  (maxSize-1)] *15), 45
        //        //    - (sinTable[(x*5) &  (maxSize-1)] * 20));
        //    }
        //    this.props.calculated=true;
        //    console.log(num+' :: '+x+" :: DONE !");
        //},
        render: function() {
            var divStyle = {
                position: 'fixed'
            };

            // Define sinTable
            var sinTable;
            if(!this.props.sinTable){
                sinTable = this.fastSin(4096);
                this.props.sinTable = sinTable;
            }
            sinTable = this.props.sinTable; if(!sinTable) return (<div></div>);

            // Define page
            var pageWidth = document.getElementById("fastsin").offsetWidth,
                x=this.state.myTicker;

            var drawGraph = function(color, distance, ang, freq, height) {
                var height2 = height * 2, divs = [];
                for (var i = 0; i < pageWidth/distance; i++) {
                    var hue;
                    if(!color)
                        hue = 'rgb(' + (Math.floor(Math.random() * 40)) + ',' + (Math.floor(Math.random() * 40)) +
                        ',' + (Math.floor(Math.random() * 40)) + ')';
                    else
                        hue = color;
                    var barStyle={
                        top: 160 - height + sinTable[(ang + (i * freq)) & 4095] * height + 'px',
                        height: height2 + 'px',
                        position:'absolute',
                        width:'4px',
                        backgroundColor:hue,
                        left:i*distance+'px',
                        opacity:'0.4'
                    };
                    divs.push(<div key={i} style={barStyle}></div>);
                }
                return divs;
            };
            var pi=Math.PI;
            //divs=drawGraph('#F1E3AD', 4, x * 55, 72 - (sinTable[(x) & 4095] *15), 45 - (sinTable[(x*5) & 4095] * 20));
            divs=drawGraph('#F1E3AD', 4,x * 50, 32 - (Math.sin((x * 20 * pi) / 2048) * 16), 50 - (Math.sin((x * 10 * pi) / 2048) * 20));

            //divs2=drawGraph('#F1903B', 6, x * 55, 46 - (sinTable[(x) & 4095] *15), 45 - (sinTable[(x*5) & 4095] * 20));

            return (
                <div ref="myDiv" style={divStyle}>
                    {divs}
                </div>
            )
        }
        //render: function() {
        //    if(!this.props.calculated) return(<div></div>)
        //    var myStyle = {
        //        //width: '480px',
        //        //height: '320px',
        //        //bgColor: '#000',
        //        position: 'fixed'
        //    };
        //
        //    divs=this.props.divs.one[this.state.myTicker];
        //    //divs2=this.props.divs.two[this.state.myTicker++];
        //
        //    //console.log(this.state.myTicker);
        //
        //    return (
        //        <div ref="myDiv" style={myStyle}>
        //            {divs}
        //        </div>
        //        )
        //}
    });

module.exports = FastSin;
