/**
 * @jsx React.DOM
 */
'use strict';
var Search = require('./search.jsx');
var Sidebar = require('./sidebar.react');
//var $ = require('jquery');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Routes = Router.Routes;
var Link = Router.Link;
var NotFoundRoute = Router.NotFoundRoute;
var BlogStore  = require('../stores/blog.react');

React.initializeTouchEvents(true);

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

var Menu = React.createClass({
    mixins: [SetIntervalMixin ],
    getInitialState: function() {
        this.addResizeAttach();

        return {
            blogLinks: BlogStore.getItems(),
            loading: true,
            overflow:true,
            scrollPosition:{
                0:0,1:0
            },
            width: document.body.clientWidth,
            height: window.innerHeight,
            sliderVisible:false,
            searchVisible:false,
            isFetching:false
        };
    },

    componentWillMount: function () {
        BlogStore.init();
    },

    componentDidMount: function() {
        BlogStore.addChangeListener(this.updateItems);
        this.setInterval(this.tick, 150);
    },

    componentWillUnmount: function () {
        BlogStore.removeChangeListener(this.updateItems);
    },
    updateItems: function (contacts) {
        if (!this.isMounted())
            return;

        var state = this.state;
        state.blogLinks= BlogStore.getItems();
        state.loading = false;
        this.setState(state);
    },

    getDefaultProps: function(){
      return {
          blogData: [],
          blogTitles: [],
          onKeyDown: function(event) { return true; }
      }
    },
    tick: function() {
        var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        var menuTop = document.getElementById("menu").style.position;
        if(undefined !== this.state.scrollPosition){

        this.replaceState({
            blogLinks:BlogStore.getItems(),
            loading:this.state.loading,
            scrollTop: scrollTop,
            menuTop:menuTop,
            width: window.innerWidth,
            scrollPosition:{
                    0:this.state.scrollPosition[0],
                    1:this.state.scrollPosition[1]
            },
            isFetching:this.state.isFetching,
            searchVisible:this.state.searchVisible,
            sliderVisible:this.state.sliderVisible,
            height: window.innerHeight, overflow:this.state.overflow});
        }
        if(0 === this.props.blogData.length)
            this.setProps({ blogData: this.props.blogData, blogTitles: this.getBlogTitles()});


    },

    onResize: function(){
        this.replaceState({
            blogLinks:BlogStore.getItems(),
            loading:this.state.loading,
            width: window.innerWidth,
            height:document.body.clientHeight,searchVisible:this.state.searchVisible,
            sliderVisible:this.state.sliderVisible});
            $("#disqus_thread").css("width",window.innerWidth+"px")
            if(window.innerWidth>=768){
                if(this.state.searchVisible){
                    this.toggleSearchClick();
                }
                if(this.state.sliderVisible){
                    this.toggleNavClick();
                }
                if(this.state.sliderVisible || this.state.sliderVisible){
                    var state=this.state;
                    state.searchVisible=false;
                    state.sliderVisible=false;

                    this.setState(state);
                }
            }
        },
    addResizeAttach: function() {
        if(window.attachEvent) {
            window.attachEvent('onresize', this.onResize);
        }
        else if(window.addEventListener) {
            window.addEventListener('resize', this.onResize, true);
        }
        else {
            //The browser does not support Javascript event binding
        }
    },
    removeAttachmentResize: function() {
        if(window.detachEvent) {
            window.detachEvent('onresize', this.onResize);
        }
        else if(window.removeEventListener) {
            window.removeEventListener('resize', this.onResize);
        }
        else {
            //The browser does not support Javascript event binding
        }
    },

//    fetchBlogData: function(){
//        var react = this;
//        $.ajax({
//            url: "http://api.robbestad.com/robbestad",
//            crossDomain:true,
//            dataType: "json",
//            success:function(data,text,xhqr){
//                $.each(data, function(i, item) {
//                    if("object" === typeof item["robbestad"] ){
//                        react.setProps({ blogData: item["robbestad"], blogTitles: react.getBlogTitles()});
//                    }
//                });
//            }
//        });
//
//    },
    getBlogTitles:function(){
        var results;
        if(undefined !== this.state.blogLinks){
            results = this.state.blogLinks;
            var items='';

//            var links = this.state.blogLinks.map(function(item) {
//                return <li key={item.id}><Link to="article" params={item}>- {item.title}</Link></li>
//            });
//            return links;

            for(var i=0; i < this.state.blogLinks.length; i++)
                items+= "<li key='" + i + "'><a href=\"/#/article/"+this.state.blogLinks[i].id+"\">" +
                          this.state.blogLinks[i].title +
                          "</a></li>" ;

            return items;
        } else {
            return 'Loading';
        }
    },
    isMobile: function(){
        var isPhone=false;
        if(window.screen.width<768){
            isPhone=true;
        }
        return isPhone;
    },
    resetContainer: function(){
        var b=$("body");
        var cf=$(".container-fluid");

        cf.css("position","relative");
        cf.css("width",'100%');
        cf.css("visibility","visible");
        cf.css("overflow","visible");
        cf.css("display","block");
        cf.css("height","100%");
        cf.css("left",0);
        //cf.css("top",0);
        cf.animate({
            opacity: 1
        }, 20, function() {
        });
        b.css("overflow","visible");

        if(undefined !== this.state.scrollPosition && this.isMobile()){
            window.scrollTo(this.state.scrollPosition[1], this.state.scrollPosition[0]);

        }
    },
    toggleSearchClick: function(){
            var closeNav = this.state.searchVisible ? true : false;
            var b=$("body");
            var cf=$(".container-fluid");
            var scrollPosition = [
                self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
                self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
            ];
            if(closeNav){
                this.resetContainer();
            } else {
                var width = this.state.width < 768 ? this.state.width : this.state.width/2;
                //b.css("width",window.innerWidth+"px");
                b.css("overflowX","hidden");
                if(this.isMobile()){
                    //window.scrollTo(0, 0);
                    cf.css("position","absolute");
                    cf.css("visibility","hidden");
                    cf.css("overflowY","hidden");
                    cf.css("height",568+"px");
                } else
                    cf.css("right",width+"px");
                cf.css("overflow","hidden");
            }

        this.replaceState({
            searchVisible: !this.state.searchVisible,
            scrollPosition:{
                0:scrollPosition[1],
                1:scrollPosition[0]
            }
        });
    },

    toggleNavClick: function(e) {
        if("hamburger" !== e.target.id) return;
        var closeNav = this.state.sliderVisible ? true : false;
        var b=$("body");
        var cf=$(".container-fluid");
        var scrollPosition = [
            self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
            self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
        ];

        if(closeNav){
            this.resetContainer();
        } else {

            var width = this.state.width < 768 ? this.state.width : this.state.width/2;

            if(this.isMobile()){
                $(".sliderItem").css("opacity",0);
                cf.animate({
                    background:"#ffffff",
                    opacity:0
                }, 100, function() {
                    b.css("overflowX","hidden");
                    cf.css("position","fixed");
                    window.scrollTo(0, 0);
                    $(".sideBar").animate({
                        width: width+"px"
                    }, 0, function(){
                        // success
                        window.scrollTo(0, 0);
                        $(".sliderItem").animate({
                            opacity: 1,
                            backgroundColor:"#e0e0e0"
                        }, 100, function(){
                            // success
                        });
                    });

                });


            } else {
                //b.css("overflowX","hidden");
                //cf.css("position","fixed");
                $(".sliderItem").css("opacity",0);
                cf.animate({
                    background:"#ffffff",
                    opacity:0
                }, 100, function() {
                    b.css("overflowX","hidden");
                    cf.css("position","fixed");
                    //window.scrollTo(0, 0);
                    $(".sideBar").animate({
                        width: width+"px"
                    }, 0, function(){
                        // success
                        window.scrollTo(0, 0);
                        $(".sliderItem").animate({
                            opacity: 1,
                            backgroundColor:"#e0e0e0"
                        }, 100, function(){
                            // success
                        });
                    });

                });

            }
            }
        var state=this.state;
        state.sliderVisible=!this.state.sliderVisible;
        state.scrollPosition={
            0:scrollPosition[1],
            1:scrollPosition[0]
        };

        this.setState(state);

    },

    render: function () {
//        var links = this.state.blogLinks.map(function(item) {
//            return <li key={item.id}><Link to="article" params={item}>- {item.title}</Link></li>
//        });


        var width = ((document.getElementById("App").clientWidth) / 3) - 2;
        var reduceFactor=200;
        var padding=31;
        var opacity = this.state.scrollTop/reduceFactor <= 1.0 ? this.state.scrollTop/reduceFactor > 0.0 ? this.state.scrollTop/reduceFactor : 0.0 : 1.0;
        if(window.innerWidth>=768){
            var b=$("body");
            var cf=$(".container-fluid");
            cf.css("position","relative");
            cf.css("width", b.width()+"px");
            cf.css("visibility","visible");
            cf.css("overflow","visible");
            cf.css("left",0);
            cf.css("height","100%");
            b.css("overflow","visible");
        }
        $(".mainRow").css("paddingTop",padding+'px');
        var divStyle= {
            display: 'block',
            position: 'fixed',
            top: '0px',
            width: document.getElementById("App").clientWidth+"px",
            backgroundColor: '#f1f1f1',
            zIndex:'9999999',
            borderRadius: '5px',
            borderBottom: '1px solid #a5a5a5',
            boxShadow:'3px 0px 3px 1px #cccccc'

        };

        var liStyle = {
            float: 'left',
            width: width+"px",
            padding: '15px 5px',
            borderTop: '0',
            height:'40px',
            zIndex: 999
        };

        var ulStyle = {
            display: 'block',
            height: '30px',
            marginBottom: '10px',
            listStyle: 'none outside none',
            margin: '0px',
            padding: '0px',
            textAlign: 'center',
            zIndex:'99999'
        };

        var liFontStyle = {
            fontFamily: 'Lobster, Open Sans',
            fontSize:'2rem',
            float: 'left',
            width: width+"px",
            padding: '5px 5px',
            borderTop: '0',
            zIndex: 999,
            height:'40px'
        };

         var aFontStyleMini = {
            fontFamily: 'Lobster, Open Sans',
            fontSize:'1.3rem'

        };

        var searchVisible=this.state.searchVisible;
        var sliderVisible=this.state.sliderVisible;
        var width=this.state.width;
        var height=this.state.height;
        if(window.innerWidth>=768) {
            searchVisible=false;
            sliderVisible=false;
            width=0;
            height=0;
        }
        var inFront={
            zIndex:99999999
        };

        var top=0;
        return (<section>
            <div style={divStyle} id="menu">
                <ul style={ulStyle}>
                    <li  style={liStyle} className="hidden-lg"  >
                        <div onClick={this.toggleNavClick} style={inFront} id="hamburgerButton"  />
                    </li>
                    <li  style={liFontStyle}>
                        <div  onClick={this.toggleNavClick} style={inFront}    >Robbestad.com</div>
                    </li>
                    <li style={liFontStyle}>
                        <div onClick={this.toggleSearchClick} className="Layout-search fa fa-search" />
                    </li>
                </ul>
            </div>
            <Search height={height} width={width}
                visible={searchVisible}  />
            <Sidebar height={height} width={width} top={top}
                visible={sliderVisible} blogTitles={this.props.blogTitles} />
        </section>
        );

    }
});
module.exports = Menu;
