/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Routes = Router.Routes;
var Link = Router.Link;
var NotFoundRoute = Router.NotFoundRoute;
var $ = require('jquery')(window);
var appr = require('./app-ready');



var api = 'http://api.robbestad.com/robbestad';
var _blogData = {};
var _changeListeners = [];
var _initCalled = false;


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

var BlogStore = {

    init: function () {
        if (_initCalled)
            return;

        _initCalled = true;

        getJSON(api, function (err, res) {
            res._embedded.robbestad.forEach(function (item) {
                _blogData[item.id] = item;
            });

            BlogStore.notifyChange();
        });
    },

    addContact: function (contact, cb) {
        postJSON(api, { contact: contact }, function (res) {
            _blogData[res.contact.id] = res.contact;
            BlogStore.notifyChange();
            if (cb) cb(res.contact);
        });
    },

    removeContact: function (id, cb) {
        deleteJSON(api + '/' + id, cb);
        delete _blogData[id];
        BlogStore.notifyChange();
    },

    getContacts: function () {
        var array = [];

        for (var id in _blogData)
            array.push(_blogData[id]);

        return array;
    },

    getContact: function (id) {
        return _blogData[id];
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
//        if(undefined !== document.getElementById("Menu"))
//            menuTop = document.getElementById("Menu").style.position;
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
            fontFamily: 'Raleway, freight-text-pro',
            fontSize:'2rem',
            float: 'left',
            width: width+"px",
            padding: '5px 5px',
            borderTop: '0',
            zIndex: 999,
            height:'40px'
        };

        var aFontStyleMini = {
            fontFamily: 'freight-text-pro, tk-freight-text-pro, Lobster, Open Sans',
            fontSize:'1.3rem'

        };


        var divStyle= {
            display: 'block',
            position: 'fixed',
            top: '0px',
            width: document.body.clientWidth+"px",
            zIndex:'9999999',
            borderRadius: '5px',
            borderBottom: '1px solid #a5a5a5',
            boxShadow:'3px 0px 3px 1px #FFFFFF'

        };
        var inFront={
            zIndex:99999999
        };

        var top=0;

        return (
            <div style={divStyle} id="menu" >
                <ul style={ulStyle}>
                    <li style={liStyle} className="hidden-lg">
                        <div style={inFront}
                            className="" id="hamburgerButton"  />
                    </li>
                    <li  style={liFontStyle}>
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
            blogitems: BlogStore.getContacts(),
            loading: true,
            sidebarVisible: false
        };
    },

    toggleSidebarVisibility:function() {
        var state=this.state;
        state.sidebarVisible=!state.sidebarVisible;
        this.setState(state);
    },

    componentWillMount: function () {
        BlogStore.init();
        window.app=this;
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
            blogitems: BlogStore.getContacts(),
            loading: false
        });
    },

    render: function() {
        var blogitems = this.state.blogitems.map(function(contact) {
            return <li key={contact.id}><Link to="contact" params={contact}>{contact.title}</Link></li>
        });
        var sidebarVisible=this.state.sidebarVisible;
        var sidebarWidth = document.body.clientWidth;
        return (
            <div>
                <Menu />
                <Sidebar sidebarVisible={sidebarVisible} width={sidebarWidth} />
                <section className="container-fluid">
                  <div className="row-fluid">
                    <div className="sidebar col-md-1 col-lg-1 hidden-xs hidden-sm">
                        left
                    </div>
                    <div className="article col-sm-12 col-xs-12 col-md-10 col-lg-10">
                        {this.props.activeRouteHandler()}
                    </div>
                    <div className="sidebar col-md-1 col-lg-1 hidden-xs hidden-sm">
                        right
                    </div>
                </div>
            </section>
            </div>
            );
    }
});

var Index = React.createClass({
    render: function() {
        return <h1>Address Book</h1>;
    }
});

var Contact = React.createClass({

    mixins: [ Router.Transitions ],

    getStateFromStore: function(props) {
        props = props || this.props;
        return {
            contact: BlogStore.getContact(props.params.id)
        };
    },

    getInitialState: function() {
        return this.getStateFromStore();
    },

    componentDidMount: function() {
        BlogStore.addChangeListener(this.updateContact);
    },

    componentWillUnmount: function () {
        BlogStore.removeChangeListener(this.updateContact);
    },

    componentWillReceiveProps: function(newProps) {
        this.setState(this.getStateFromStore(newProps));
    },

    updateContact: function () {
        if (!this.isMounted())
            return;

        this.setState(this.getStateFromStore())
    },

    destroy: function() {
        BlogStore.removeContact(this.props.params.id);
        this.transitionTo('/');
    },

    render: function() {
        var contact = this.state.contact || {};
        var name = contact.title;
        var content = contact.content;

        return (
                <section className="innerXsPadding">
                    <div className="date-title">August 31, 2014</div>
                    <h2 className="entry-title">{name}</h2>

                <section dangerouslySetInnerHTML={{__html: content}} />

                </section>
            );
    }
});
// <button onClick={this.destroy}>Delete</button>

var Sidebar = React.createClass({
    getInitialState: function() {
        return {
            blogitems: BlogStore.getContacts(),
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
            blogitems: BlogStore.getContacts(),
            loading: false
        });
    },
    render: function() {
        var blogitems = this.state.blogitems.map(function(contact) {
            return <li key={contact.id}><Link to="contact" className="menuitem" params={contact}>{contact.title}</Link></li>
        });
        var style;
        if(!this.props.sidebarVisible){
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
            borderRight:'1px solid #aaaaaa',
            borderLeft:'1px solid #aaaaaa',
            boxShadow:'3px 0px 0px 0px #FFFFFF'
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
                <ul className="slider sliderItem" style={bg} >
                {blogitems}
                 </ul>
            </div>
            )
    }
});

var NewContact = React.createClass({

    mixins: [ Router.Transitions ],

    createContact: function(event) {
        event.preventDefault();
        BlogStore.addContact({
            first: this.refs.first.getDOMNode().value,
            last: this.refs.last.getDOMNode().value
        }, function(contact) {
            this.transitionTo('contact', { id: contact.id });
        }.bind(this));
    },

    render: function() {
        return (
            <form onSubmit={this.createContact}>
                <p>
                    <input type="text" ref="first" placeholder="First name"/>
                    <input type="text" ref="last" placeholder="Last name"/>
                </p>
                <p>
                    <button type="submit">Save</button> <Link to="/">Cancel</Link>
                </p>
            </form>
            );
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
        <Route name="new" path="contact/new" handler={NewContact}/>
        <Route name="contact" path="contact/:id" handler={Contact}/>
        <NotFoundRoute handler={NotFound}/>
    </Route>
    );

React.renderComponent(
    <Routes children={routes}/>,
    document.getElementById('App')
);

