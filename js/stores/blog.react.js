
//var api = 'http://myapi.dev/robbestad';
var api = 'http://api.robbestad.com/robbestad';
var _blogdata = {};
var _changeListeners = [];
var _initCalled = false;

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

var BlogStore = {

    init: function () {
        if (_initCalled)
            return;

        _initCalled = true;

        getJSON(api, function (err, res) {
            res._embedded.robbestad.forEach(function (item) {
                _blogdata[item.id] = item;
            });

            BlogStore.notifyChange();
        });
    },
//
//    addItem: function (item, cb) {
//        postJSON(api, { item: item }, function (res) {
//            _blogdata[res.item.id] = res.item;
//            BlogStore.notifyChange();
//            if (cb) cb(res.item);
//        });
//    },
//
//    removeItem: function (id, cb) {
//        deleteJSON(api + '/' + id, cb);
//        delete _blogdata[id];
//        BlogStore.notifyChange();
//    },

    getItems: function () {
        var array = [];

        for (var id in _blogdata)
            array.push(_blogdata[id]);

        return array;
    },

    getItem: function (article) {
        return _blogdata[article];
    },

    notifyChange: function () {
        _changeListeners.forEach(function (listener) {
            if ('function' !== typeof listener)
                throw TypeError('listener must be a function');

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

module.exports = BlogStore;