/**
 * @jsx React.DOM
 */
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

var BlogData = React.createClass({
    mixins: [SetIntervalMixin], // Use the mixin
    componentDidMount: function() {
        this.setInterval(this.tick, 200); // Call a method on the mixin
        this.fetchBlogData();
    },
    tick: function() {
      //this.fetchBlogData();
      //  if('undefined' !== typeof this.refs.blogdata.getDOMNode())
      //      console.log(this.refs.blogdata.getDOMNode().style.innerHeight);
    },
    setInitialProps: function(){
      blogData: false
    },
    setData:function(data){
     // console.log(data);
    },
    fetchBlogData: function(){
      var react = this;
      $.ajax({
        url: "http://api.robbestad.com/robbestad",
        crossDomain:true,
        dataType: "json",
        success:function(data,text,xhqr){
            $.each(data, function(i, item) {
              if("object" === typeof item["robbestad"] ){
                react.setProps({ blogData: item["robbestad"]});
              }
            });
        }
      });

    },
    render: function () {
        if(undefined === this.props.blogData) return(<div>Loading</div>);
        // console.log(this.props.blogData)
        var results = this.props.blogData;
        return (<div ref="blogdata" >
                   {results.map(function(result) {
                      return <div key={result.id}>{result.title}
                      <p key={result.id}>{result.content}</p>
                       </div>
                    })}
                </div>
           );
    }
});

module.exports = BlogData;
