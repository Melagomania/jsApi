function Page() {
    this.tabsLinks = document.getElementById('tabs');
    this.tabs = document.getElementsByClassName('content-block');
    this.activeTabIndex = 0;

    this.fullscreenEnabled = false;
};

Page.prototype.init = function () {
    this.setLinkListeners();
    this.setFullscreenTogglersHandler();
};

Page.prototype.setFullscreenTogglersHandler = function () {
    var _this = this;
    document.getElementById('content').addEventListener('click', function (e) {
        if (e.target.classList.contains('fullscreen-toggler')) {
            if (!_this.fullscreenEnabled) {
                _this.enterFullscreenMode();
                _this.fullscreenEnabled = true;
                e.target.textContent = '-';
            } else {
                _this.exitFullscreenMode();
                _this.fullscreenEnabled = false;
                e.target.textContent = '+';
            }
        }
    });
};

Page.prototype.setLinkListeners = function () {
    this.tabsLinks.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            var url = e.target.getAttribute('href');
            Router.navigate(url);
        }
    });
};

Page.prototype.changeTab = function (newActiveTabIndex) {
    this.tabs[this.activeTabIndex].style.display = 'none';
    this.activeTabIndex = newActiveTabIndex;
    this.tabs[this.activeTabIndex].style.display = 'block';
};

Page.prototype.enterFullscreenMode = function () {
    if (this.tabs[this.activeTabIndex].requestFullscreen) {
        this.tabs[this.activeTabIndex].requestFullscreen();
    } else if (this.tabs[this.activeTabIndex].mozRequestFullScreen) {
        this.tabs[this.activeTabIndex].mozRequestFullScreen();
    } else if (this.tabs[this.activeTabIndex].webkitRequestFullscreen) {
        this.tabs[this.activeTabIndex].webkitRequestFullscreen();
    } else if (this.tabs[this.activeTabIndex].msRequestFullscreen) {
        this.tabs[this.activeTabIndex].msRequestFullscreen();
    }
};

Page.prototype.exitFullscreenMode = function () {
    console.log('333');
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};

var page = new Page();
page.init();


function Geolocation() {
    this.locationHistory = [];
    this.locationWatch = null;
}

Geolocation.prototype.startWatch = function () {
    var _this = this;
    this.locationWatch = navigator.geolocation.watchPosition(function (position) {
        if (!_this.locationHistory.length) {
            _this.locationHistory.push(position);
        } else {
            //TODO: fix IF
            if (_this.locationHistory[_this.locationHistory.length - 1].latitude !== position.latitude || _this.locationHistory[_this.locationHistory.length - 1].longitude !== position.longitude) {
                console.log('333');
                _this.locationHistory.push(position);

            }
        }
        console.log(_this.locationHistory);
    });
};

var geolocation = new Geolocation();

var Router = {
    routes: [],
    mode: null,
    root: '/',
    config: function (options) {
        this.mode = options && options.mode && options.mode == 'history' &&
        !!(history.pushState) ? 'history' : 'hash';
        this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
        return this;
    },
    getFragment: function () {
        var fragment = '';
        if (this.mode === 'history') {
            fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, '');
            fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
        } else {
            var match = window.location.href.match(/#(.*)$/);
            fragment = match ? match[1] : '';
        }
        return this.clearSlashes(fragment);
    },
    clearSlashes: function (path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
    add: function (re, handler) {
        if (typeof re == 'function') {
            handler = re;
            re = '';
        }
        this.routes.push({
            re: re,
            handler: handler
        });
        return this;
    },
    remove: function (param) {
        for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
            if (r.handler === param || r.re.toString() === param.toString()) {
                this.routes.splice(i, 1);
                return this;
            }
        }
        return this;
    },
    flush: function () {
        this.routes = [];
        this.mode = null;
        this.root = '/';
        return this;
    },
    check: function (f) {
        var fragment = f || this.getFragment();
        for (var i = 0; i < this.routes.length; i++) {
            var match = fragment.match(this.routes[i].re);
            if (match) {
                match.shift();
                this.routes[i].handler.apply({}, match);
                if (!match && i === this.routes.length - 1) {
                    this.routes[i].handler.apply({}, 'task-list');
                }
                return this;
            }
        }
        return this;
    },
    listen: function () {
        var self = this;
        var current = self.getFragment();
        var fn = function () {
            if (current !== self.getFragment()) {
                current = self.getFragment();
                self.check(current);
            }
        }
        clearInterval(this.interval);
        this.interval = setInterval(fn, 50);
        return this;
    },

    navigate: function (path) {
        path = path ? path : '';
        if (this.mode === 'history') {
            history.pushState(null, null, this.root + this.clearSlashes(path));
        } else {
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        }
        return this;
    }
}

Router.config({
    mode: 'history'
});

Router.add(/geolocation/, function () {
    page.changeTab(1);
    geolocation.startWatch();
})
    .add(/synccalculation/, function () {
        page.changeTab(2);
        console.log('sync');

    })
    .add(/webworker/, function () {
        page.changeTab(3);
        console.log('webw');
    })
    .add(function () {
        page.changeTab(0);
        Router.navigate('/');
        console.log('default');
    })
    .check().listen();


(function () {
    'use strict';

    var ITERATIONS = 100000000;

    //Function that generates random coordinates for point(x:[-r,r), y:[-r,r))
    //and checks if it is in a circle with radius r
    var generatePoint = function () {
        var r = 16;
        var x = Math.random() * r * 2 - r;
        var y = Math.random() * r * 2 - r;
        return (Math.pow(x, 2) + Math.pow(y, 2) < Math.pow(r, 2))
    };

    //Return estimated value of Pi after all iterations
    var computePi = function () {
        var inCircle = 0;
        var i;
        for (i = 0; i < ITERATIONS; i++) {
            if (generatePoint()) {
                inCircle++;
            }
        }
        return inCircle / ITERATIONS * 4;
    };

    //Performs synchronous calculations of Pi after click on button
    document.querySelector('#syncstart').addEventListener('click', function () {
        document.querySelector('#syncresult').innerHTML = computePi();
    });
})();


