(function () {
    'use strict';
})();

var rebound = require("rebound");
var $ = require("jquery");

//UTILS
(function() {
    window.createSpring = function createSpring(springSystem, friction, tension, rawValues) {
        var spring = springSystem.createSpring();
        var springConfig;
        if (rawValues) {
            springConfig = new rebound.SpringConfig(friction, tension);
        } else {
            springConfig = rebound.SpringConfig.fromOrigamiTensionAndFriction(friction, tension);
        }
        spring.setSpringConfig(springConfig);
        spring.setCurrentValue(0);
        return spring;
    };
    window.xlat = function xlat(el, x, y) {
        el.style.mozTransform =
            el.style.msTransform =
                el.style.webkitTransform =
                    el.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';
    };
    window.scale = function scale(el, val) {
        el.style.mozTransform =
            el.style.msTransform =
                el.style.webkitTransform =
                    el.style.transform = 'scale3d(' + val + ', ' + val + ', 1)';
    };
    window.xfrm = function xfrm(el, xlatX, xlatY, scale, rot) {
        xlatX = typeof xlatX === 'undefined' ? 0 : xlatX;
        xlatY = typeof xlatY === 'undefined' ? 0 : xlatY;
        scale = typeof scale === 'undefined' ? 1 : scale;
        rot = typeof rot === 'undefined' ? 0 : rot;
        var xfrm =
            'translate3d(' + xlatX + 'px, ' + xlatY + 'px, 0px) ' +
            'scale3d(' + scale + ', ' + scale + ', 1) ' +
            'rotate(' + rot + 'deg)';
        el.style.mozTransform = el.style.msTransform = el.style.webkitTransform = el.style.transform = xfrm;
    };
    window.drawGridLines = function(canvas, ctx, graphScale) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.moveTo(0, -1 * graphScale + canvas.height / 2);
        ctx.lineTo(canvas.width, -1 * graphScale + canvas.height / 2);
        ctx.moveTo(0, 1 * graphScale + canvas.height / 2);
        ctx.lineTo(canvas.width, 1 * graphScale + canvas.height / 2);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth = 0.25;
        ctx.beginPath();
        for (var i = 0; i < 600; i+= 10) {
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
        }
        for (var i = 0; i < 600; i+=10) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
        }
        ctx.strokeStyle = '#0000ff';
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.closePath();
    };
    window.mapValueFromRangeToRange = function(value, fromLow, fromHigh, toLow, toHigh) {
        fromRangeSize = fromHigh - fromLow;
        toRangeSize = toHigh - toLow;
        valueScale = (value - fromLow) / fromRangeSize;
        return toLow + (valueScale * toRangeSize);
    };
    window.downEvt = window.ontouchstart !== undefined ? 'touchstart' : 'mousedown';
    window.upEvt = window.ontouchend !== undefined ? 'touchend' : 'mouseup';
// Create a couple of utilities.
    var slice = Array.prototype.slice;
    var concat = Array.prototype.concat;
    window.bind = function(func, context) {
        args = slice.call(arguments, 2);
        return function() {
            func.apply(context, concat.call(args, slice.call(arguments)));
        };
    };
    window.extend = function(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
})();

// HAMBURGER
(function() {
    var hb = {};
// import a couple of utils from rebound.
    var deg2rad = rebound.MathUtil.degreesToRadians;
    var mapVal = rebound.MathUtil.mapValueInRange;
// HamburgerButton animates between a 3 bar menu icon and an X icon using a
// Rebound spring to drive the animation. You can configure its container, size
// and color.
    hb.HamburgerButton = function(container, size, color) {
        this.canvas = document.createElement('canvas');
        this.canvas.id="hamburger";
        this.ctx = this.canvas.getContext('2d');
// Configure all the styles and dimensions for the button.
        this.padding = size * 0.1;
        this.size = size - this.padding * 2;
        this.width = this.size*1.35;
        this.height = this.size;
        this.canvas.width = this.width + this.padding *2;
        this.canvas.height = size;
        this.barHeight = this.size / 6;
        this.rotatedXlat = Math.sqrt((this.barHeight * this.barHeight) / 2);
        this.radius = this .size * 0.05;
        var ab = (this.size - this.rotatedXlat);
        this.rotatedWidth = Math.sqrt(ab * ab + ab * ab);
        this.color = color;
// Clear out the target container.
        this.container = container;
        this.container.innerHTML = '';
// Create our animation spring. Here you could also pass in a custom SpringConfig
// if you wanted to get a more or less bouncy animation curve.
        this.springSystem = new rebound.SpringSystem();
        this.animationSpring = this.springSystem.createSpring();
        this.animationSpring.addListener(this);
// Perform and initial render to the canvas and apend the example canvas to
// the container.
        this.render();
        container.appendChild(this.canvas);
        this.canvas.addEventListener('click', bind(this.toggle, this));
    };
    extend(hb.HamburgerButton.prototype, {
        /**
         * Switch the spring between its open (0) and closed (1) states. This will
         * drive the spring to animate, which will trigger rendering of the component.
         */
        toggle: function() {
            if (this.animationSpring.getEndValue() === 1) {
                this.animationSpring.setEndValue(0);
            } else {
                this.animationSpring.setEndValue(1);
            }
        },
        /**
         * Listen to the spring and call render whenever it updates.
         */
        onSpringUpdate: function(spring) {
            this.render();
        },
        /**
         * This just draws a rounded rect with the configured corner radius and dimensions.
         */
        drawBar: function(width) {
            this.ctx.fillStyle = this.color;
            this.ctx.moveTo(0, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(this.radius, 0);
            this.ctx.lineTo(width - this.radius, 0);
            this.ctx.quadraticCurveTo(width, 0, width, this.radius);
            this.ctx.lineTo(width, this.barHeight - this.radius);
            this.ctx.quadraticCurveTo(width, this.barHeight, width - this.radius, this.barHeight);
            this.ctx.lineTo(this.radius, this.barHeight);
            this.ctx.quadraticCurveTo(0, this.barHeight, 0, this.barHeight - this.radius);
            this.ctx.lineTo(0, this.radius);
            this.ctx.quadraticCurveTo(0, 0, this.radius, 0);
            this.ctx.closePath();
            this.ctx.fill();
        },
        /**
         * On every frame of the animation, render will draw the current state of
         * the animation based on interpolation of the springs value between 0 and 1.
         * Driving an animation off of a zero to one spring is a really simple way
         * to coordinate multiple transitions on a common animation spring.
         * `rebound.MathUtil.mapValueInRange` is helpful for converting numbers between
         * an input range and an output range.
         */
        render: function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.save();
            this.ctx.translate(this.padding, this.padding);
            var xlatX, xlatY, rot, width;
            var pos = this.animationSpring.getCurrentValue();
            var val = this.animationSpring.getCurrentValue();
            xlatX = mapVal(val, 0, 1, 0, this.rotatedXlat);
            rot = mapVal(val, 0, 1, 0, 45);
            width = mapVal(val, 0, 1, this.width, this.rotatedWidth);
// draw top bar
            this.ctx.save();
            this.ctx.translate(xlatX, 0);
            this.ctx.rotate(deg2rad(rot));
            this.drawBar(width);
            this.ctx.restore();
// draw middle bar
            this.ctx.save();
            xlatX = mapVal(val, 0, 1, 0, this.width / 3.5);
            width = mapVal(val, 0, 1, this.width, 0);
            this.ctx.translate(xlatX, this.height / 2 - this.barHeight / 2);
            this.drawBar(width);
            this.ctx.restore();
// draw bottom bar
            this.ctx.save();
            xlatY = mapVal(val, 0, 1, this.height - this.barHeight, this.height - this.rotatedXlat);
            rot = mapVal(val, 0, 1, 0, -45);
            width = mapVal(val, 0, 1, this.width, this.rotatedWidth);
            this.ctx.translate(0, xlatY);
            this.ctx.rotate(deg2rad(rot));
            this.drawBar(width);
            this.ctx.restore();
            this.ctx.restore();
        }
    });
    // Export the control.
    window.hamburgerButton = hb;
})();
function once (fn) {
    var f = function () {
        if (f.hasResult) return f.value;
        f.hasResult = true;
        f.value = fn.apply(this,
            arguments);
        fn = null;
        return f.value;
    };
    f.hasResult = false;
    return f;
}
$(document).ready(function () {
//    FastClick.attach(document.body);
    once(function(arg) {
        (function(container, size, color, bgColor) {
            var ex = document.createElement('div');
            ex.className = 'Layout-hamburger';
            container.appendChild(ex);
            ex.style.backgroundColor = bgColor;
            ex.style.opacity = 1.0;
            ex.style.marginTop = (size * -0.01) + 'px';
            new hamburgerButton.HamburgerButton(ex, size, color);
        })(document.getElementById('hamburgerButton'), 28, '#000000');
    })();
    $("#hamburger").click(function(){
        app.toggleSidebarVisibility();
    });
//    $("#hamburgerButton").click(function(){
//        app.toggleSidebarVisibility();
//    });
    $('body').on('click', 'a.menuitem', function() {
        $("#hamburger").trigger("click");
        window.scrollTo(0,0);
    });
});