/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

//var sweetAlert = require("./alert");
//sweetAlert("Oops...", "Something went wrong!", "error");
//var Metagrid = require ("./components/metagrid");
var Metagrid = require ("react-grid");

var Routes = Router.Routes;
var Link = Router.Link;
var NotFoundRoute = Router.NotFoundRoute;
var $ = require('jquery')(window);
var jQuery = require('jquery');
var appr = require('./app-ready');
var moment = require ('moment');
var StickyDiv = require ('react-stickydiv');

var api = 'http://api.robbestad.com/robbestad';
var _blogData = {};
var _changeListeners = [];
var _initCalled = false;



React.initializeTouchEvents(true);

var menuBreakpoint=3068;

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

var BlogStore = {

    init: function () {
        if (_initCalled)
            return;

        _initCalled = true;

        getJSON(api, function (err, res) {
            res._embedded.robbestad.forEach(function (item) {
//                _blogData[item.id] = item;
                _blogData[item.url] = item;
            });

            BlogStore.notifyChange();
        });
    },


    getItems: function () {
        var array = [];

        for (var id in _blogData)
            array.push(_blogData[id]);

        return array;
    },

    getItem: function (id) {
        console.table(id);
        return _blogData[id];
    },

    getItemByUrl: function (url) {
        return _blogData[url];
    },


    notifyChange: function () {
        _changeListeners.forEach(function (listener) {
            listener();
        });
    },

    addChangeListener: function (listener) {
        _changeListeners.push(listener);
    },

    removeChangeListener: function (listener) {
        _changeListeners = _changeListeners.filter(function (l) {
            return listener !== l;
        });
    }

};

var Menu = React.createClass({
    mixins: [SetIntervalMixin ],
    getInitialState: function() {
        this.addResizeAttach();
        return {
            scrollPosition:{
                0:0,1:0
            },
            width: document.body.clientWidth,
            height: window.innerHeight
        };
    },
    componentWillMount: function () {
    },
    componentDidMount: function() {
        this.setInterval(this.tick, 150);
    },
    componentWillUnmount: function () {
    },
    tick: function() {
        var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset :
            (document.documentElement || document.body.parentNode || document.body).scrollTop;
        var menuTop=0;
        if(undefined !== this.state.scrollPosition) {
            var state = this.state;
            state.scrollTop = scrollTop;
            state.menuTop = menuTop;
            state.width = window.innerWidth;
            state.height = window.innerHeight;
            state.scrollPosition = {
                0: this.state.scrollPosition[0],
                1: this.state.scrollPosition[1]
            };
            this.setState(state);
        }
    },
    onResize: function(){
        var state=this.state;
        state.width= window.innerWidth;
        state.height= document.body.clientHeight;
        this.setState(state);
        //$("#disqus_thread").css("width",window.innerWidth+"px");
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
    render: function () {
        var width = ((document.body.clientWidth) / 3) - 2;

        var liStyle = {
            float: 'left',
            width: width+"px",
            padding: '15px 5px',
            borderTop: '0',
            height:'40px',
            zIndex: 2
        };

        var ulStyle = {
            display: 'block',
            height: '30px',
            marginBottom: '10px',
            listStyle: 'none outside none',
            margin: '0px',
            padding: '0px',
            textAlign: 'center',
            zIndex:2
        };

        var liFontStyle = {
            width: width+"px"
        };

        var divStyle= {
            display: 'block',
            position: 'fixed',
            top: '0px',
            width: document.body.clientWidth+"px",
            zIndex:5,
            borderRadius: '2px',
            background: 'linear-gradient(to bottom, #fff, #f7f7f7)',
            borderBottom: '1px solid #e1e1e1',
            boxShadow:'0 1px 3px #dadada'
        };


        var inFront={
            zIndex:3
        };

        var top=0;

        return (
            <div style={divStyle} id="menu" >
                <ul style={ulStyle}>
                    <li style={liStyle}>
                        <div style={inFront}
                            className="" id="hamburgerButton"  />
                    </li>
                    <li  style={liFontStyle} className="menuHeader">
                        <div style={inFront}>Robbestad.com</div>
                    </li>
                    <li style={liFontStyle}>
                        <div className="Layout-search fa fa-search" />
                    </li>
                </ul>
            </div>
            );

    }
});

var App = React.createClass({
    getInitialState: function() {
        return {
            blogitems: BlogStore.getItems(),
            loading: true,
            sidebarVisible: false
        };
    },
    hideSidebar:function(){
        var state=this.state,
            b=jQuery("body"),
            cf=jQuery(".container-fluid"),
            sb=jQuery(".sideBar");
        sb.css("overflowY", "auto");
        cf.css("position", "relative");
        sb.css("height", "0px");
        cf.css("opacity", 1);
        b.css("overflow","visible");
        state.sidebarVisible=!state.sidebarVisible;
        this.setState(state);
    },
    toggleSidebarVisibility:function() {
        var state=this.state,
            b=jQuery("body"),
            cf=jQuery(".container-fluid"),
            sb=jQuery(".sideBar");

        if(state.sidebarVisible){
            sb.css("overflowY", "auto");
            cf.css("position", "relative");
            sb.css("height", "0px");
            cf.css("opacity", 1);
            jQuery("body").css("overflow","visible");

        } else if(b.width()<=menuBreakpoint){
            var scrollPosition = [
                    self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
                    self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
            ];
            var width = this.state.width < menuBreakpoint ? this.state.width : this.state.width/2;

            sb.css("overflowY", "auto");
            cf.css("position", "fixed");
            cf.css("opacity", 0);
            sb.css("height", "100%");
            window.scrollTo(0, 0);
            sb.animate({
                width: width + "px"
            }, 0, function () {
                // success
                window.scrollTo(0, 0);
                jQuery(".sliderItem").animate({
                    opacity: 1,
                    backgroundColor: "#e0e0e0"
                }, 100, function () {
                    // success
                });
            });

            state.scrollPosition = {
                0: scrollPosition[1],
                1: scrollPosition[0]
            };
        } else {
            // desktop
            jQuery(".sideBar").css("position","absolute");
            jQuery(".sideBar").css("height",document.body.clientHeight+"px");
            jQuery("body").css("overflow","hidden");
        }
        state.sidebarVisible=!state.sidebarVisible;
        this.setState(state);
    },

    componentWillMount: function () {
        BlogStore.init();
        window.app=this;
    },

    componentWillReceiveProps: function(){
        jQuery(".article").addClass("animated fadeIn")
            .delay(500).queue(function(){
            jQuery(this).removeClass("animated fadeIn").dequeue();
        });
        jQuery(".myspinner").css("visibility","hidden");

    },
    componentDidMount: function() {
        BlogStore.addChangeListener(this.updateContacts);
        //if(undefined !== window.spinner) window.spinner.showSpinner();
    },

    componentWillUnmount: function () {
        BlogStore.removeChangeListener(this.updateContacts);
    },

    updateContacts: function (blogitems) {
        if (!this.isMounted())
            return;

        this.setState({
            blogitems: BlogStore.getItems(),
            loading: false
        });

        jQuery(".myspinner").css("visibility","hidden");
        //if(undefined !== window.spinner) window.spinner.hideSpinner();
    },

    render: function() {
        var sidebarVisible=this.state.sidebarVisible;
        var sidebarWidth = document.body.clientWidth;
        var footerStyle={
            borderRadius: '2px',
            paddingTop:'10px',
            background: 'linear-gradient(to bottom, #fff, #f7f7f7)',
            borderTop: '1px solid #e1e1e1',
            boxShadow:'0  0 3px #dadada'
        }

        var center={
            textAlign:'center',
            margin:'0 auto',
            minWidth:'100px'
        }

        return (
            <div>
                <Menu />

                <Sidebar sidebarVisible={sidebarVisible} width={sidebarWidth} />
            
                <section className="container-fluid">
                  <div className="row-fluid">
                    <div className="sidebar col-md-1 col-lg-1 hidden-xs hidden-sm">
                        <StickyDiv togglepoint="64" top="45" width="100" 
                        style={center}>
                            <a target="_blank" href="https://www.npmjs.org/package/react-stickydiv">
                            <img src="img/npm_1x.png" 
                            srcset="img/npm_1x.png 480w, img/npm_2x.png 640w, img/npm_3x.png 800w" 
                            width="100" height="39" /> </a>
                            Set your divs sticky with with&nbsp; 
                            <a target="_blank" href="https://www.npmjs.org/package/react-stickydiv">react-stickydiv</a>
                        </StickyDiv>

                    </div>
                    <div className="article col-sm-12 col-xs-12 col-md-10 col-lg-10">
                        <div className="myspinner" />
                        {this.props.activeRouteHandler()}
                    </div>
                    <div 
                        className="sidebar col-md-1 col-lg-1 
                            hidden-xs hidden-sm">
                    </div>
                    </div>
                </section>

                <footer id="footer" style={footerStyle} className="col-xs-12 col-md-12 col-sm-12 col-lg-12 ">
                    <div id="footer-inside" className="innerXsPadding">
                        <div id="text-2" className="widget widget_text">
                            <div className="textwidget">
                                <Link to="/" className="footeritem">Home</Link>
                            </div>
                        </div>
                        <div id="text-4" className="widget widget_text">
                            <div className="textwidget"></div>
                        </div>
                        <div id="text-7" className="widget widget_text">
                            <div className="textwidget">
                                <a href="https://twitter.com/svenardocom"
                                    className="footeritem"
                                    onclick="_gaq.push(['_trackEvent', 'outbound-widget', 'https://twitter.com/svenardocom', 'Twitter']);"
                                    target="_blank">Twitter</a>
                            </div></div></div>
                 </footer>


            </div>

            );
    }
});

var Index = React.createClass({
    getInitialState: function() {
        return {
            blogitems: BlogStore.getItems()
        };
    },
    componentWillMount: function () {
        BlogStore.init();
        window.sidebar=this;
    },

    componentDidMount: function() {
        BlogStore.addChangeListener(this.updateContacts);

    },

    componentWillUnmount: function () {
        BlogStore.removeChangeListener(this.updateContacts);
    },

    updateContacts: function (blogitems) {
        if (!this.isMounted())
            return;

        this.setState({
            blogitems: BlogStore.getItems()
        });
        jQuery( ".frontPage" ).addClass( "visible animated fadeIn" );
    },
    render: function() {
        var blogitems = this.state.blogitems.slice(0,5).map(function(article) {
            var url = article.url.split("/");
            var urlParams={
                year:url[3],
                month:url[4],
                name:url[5]
            };

            var ul={
                listStyle: 'none'
            };

            var padding={
                paddingTop:'35px'
            }

            var updated = moment(new Date(article.updated).getTime()).fromNow();
//            var excerpt = article.content.match(/<q(.*?)<\/q/);

            return (<section className="">
                <li key={article.id} style={padding}>
                    <div className="date-title">{updated}</div>
                <Link to="blog" params={urlParams}>
                    <h2 className="fp-title">{article.title}</h2>
                </Link>
                </li>
            </section>)
        });
        return (
            <section className="innerXsPadding">

                <ul className="frontPage" >

                    <li key="appIndex">
                        <h1 className="entry-title">Robbestad.com</h1>
                        <p className="fp-desc">A blog about app- &amp; game programming</p>
                    </li>
                        {blogitems}
                    </ul>
            </section>
            );
    }
});

var Article = React.createClass({

    mixins: [ Router.Transitions ],

    getStateFromStore: function(props) {
        props = props || this.props;
        var url="http://www.robbestad.com/"+props.params.year+"/"+props.params.month+"/"+props.params.name;
        return {
            item: BlogStore.getItemByUrl(url)
        };
    },

    getInitialState: function() {
        return this.getStateFromStore();
    },

    componentDidMount: function() {
        BlogStore.addChangeListener(this.updateItems);
        window.scrollTo(0,0);
    },

    componentWillUnmount: function () {
        BlogStore.removeChangeListener(this.updateItems);
    },

    componentWillReceiveProps: function(newProps) {
        this.setState(this.getStateFromStore(newProps));
    },

    updateItems: function () {
        if (!this.isMounted())
            return;



        this.setState(this.getStateFromStore())
    },



    render: function() {
        var article = this.state.item || {};
        var title = article.title;
        //var published = moment(new Date(article.published).getTime()).fromNow();
        var updated = moment(new Date(article.updated).getTime()).fromNow();
        var content = article.content;
        return (
                <section className="innerXsPadding">
                    <div className="date-title">{updated}</div>
                    <h2 className="entry-title">{title}</h2>
                    <section dangerouslySetInnerHTML={{__html: content}} />
                    <div id="disqus_thread"></div>
        </section>
            );
    }
});

var Sidebar = React.createClass({
    getInitialState: function() {
        return {
            blogitems: BlogStore.getItems(),
            loading: true
        };
    },
    componentWillMount: function () {
        BlogStore.init();
        window.sidebar=this;
    },

    componentDidMount: function() {
        BlogStore.addChangeListener(this.updateContacts);
    },

    componentWillUnmount: function () {
        BlogStore.removeChangeListener(this.updateContacts);
    },

    updateContacts: function (blogitems) {
        if (!this.isMounted())
            return;

        this.setState({
            blogitems: BlogStore.getItems(),
            loading: false,
            sidebarVisible: false
        });
    },
    render: function() {
        var blogitems = this.state.blogitems.slice(0,9).map(function(article) {
            var url = article.url.split("/");

            var urlParams={
                year:url[3],
                month:url[4],
                name:url[5]
            };

            return <li key={article.id}><Link to="blog" className="menuitem"
                params={urlParams}>{article.title}</Link></li>
        });

        var style={
            display:'block',
            visibility:'visible',
            marginTop:'40px',
//            position:'fixed',
//            height:'100%',
            position:'absolute',
            left:0,
            top:document.body.scrollTop+"px",
            width:this.props.width <= menuBreakpoint ? this.props.width-3 : (this.props.width-3)/2+"px",
            backgroundColor: '#fff',
            zIndex:2,
            overflowScroll:'touch'
        };

        if(this.props.width <= menuBreakpoint && this.props.sidebarVisible){
            style={
                display:'block',
                visibility:'visible',
                marginTop:'40px',
                position:'relative',
                left:0,
                height:'100%',
                backgroundColor: '#fff',
                zIndex:2,
                overflowScroll:'touch'
            }
        }
        if(!this.props.sidebarVisible) {
            style = {
                display: 'none',
                visibility: 'hidden',
                height: "100%",
                width: "0px",
                marginTop: '40px',
                zIndex: 0,
                position: 'absolute',
                left: 0
            };
        }
        var bg={
            borderRight:'1px solid #aaaaaa',
            borderLeft:'1px solid #aaaaaa',
            boxShadow:'3px 0px 0px 0px #FFFFFF',
        };
        var noPadding={
            padding:0
        }
        return (
            <div style={style} className="responsiveList sideBar">
                <section className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={noPadding}>
                <ul className="slider sliderItem" style={bg} >
                {blogitems}
                 </ul>
                 </section>
                <section className="hidden-xs hidden-sm col-md-6 col-lg-6">

                    <h3>Search</h3>
                    <p>Search...</p>
                </section>
            </div>
            )
    }
});

var NotFound = React.createClass({
    render: function() {
        return <h2>Not found</h2>;
    }
});

// Request utils.

function getJSON(url, cb) {
    var req = new XMLHttpRequest();
    req.onload = function() {
        if (req.status === 404) {
            cb(new Error('not found'));
        } else {
            cb(null, JSON.parse(req.response));
        }
    };
    req.open('GET', url);
    req.send();
}

function postJSON(url, obj, cb) {
    var req = new XMLHttpRequest();
    req.onload = function() {
        cb(JSON.parse(req.response));
    };
    req.open('POST', url);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.send(JSON.stringify(obj));
}

function deleteJSON(url, cb) {
    var req = new XMLHttpRequest();
    req.onload = cb;
    req.open('DELETE', url);
    req.send();
}

var routes = (
    <Route handler={App}>
        <DefaultRoute handler={Index}/>
        <Route name="blog" path=":year/:month/:name" handler={Article}/>
        <NotFoundRoute handler={NotFound}/>
    </Route>
    );

React.renderComponent(
    <Routes children={routes}/>,
    document.getElementById('App')
);

