Ext.define('MockData.Manager', {
    singleton : true,

    requires : [
        'MockData.store.Requests'
    ],

    uses : [
        'MockData.SimXhr'
    ],

    urlRegex   : /([^?#]*)(#.*)?$/,
    dateRegex  : /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/,
    intRegex   : /^[+-]?\d+$/,
    floatRegex : /^[+-]?\d+\.\d+$/,

    endpoints : {},

    register : function(method, url, fn, scope) {
        var endpoint = this.getEndpoint(method);

        if (method === 'direct') {
            return this.registerDirect(endpoint, url, fn, scope);
        }

        this.doRegister(endpoint, url, fn, scope);
    },

    getEndpoint : function(method) {
        var endpoint = this.endpoints[method];

        if (!endpoint) {
            endpoint = this.endpoints[method] = {};
        }

        return endpoint;
    },

    getUrlConfig : function(method, url) {
        var endpoint = this.getEndpoint(method),
            config;

        if (endpoint) {
            config = endpoint[url];

            if (config) {
                return config;
            } else if (!config && method !== '*') {
                return this.getUrlConfig('*', url);
            }
        }
    },

    registerDirect : function(endpoint, url, fn, scope) {
        var actions = Ext.app.REMOTING_API.actions,
            fnName, obj;

        if (!actions[url]) {
            actions[url] = [];
        }

        for (fnName in fn) {
            obj = fn[fnName];

            if (Ext.isFunction(obj)) {
                obj = {
                    fn : obj
                };
            }

            if (!Ext.isDefined(obj.len)) {
                obj.len = obj.fn.length;
            }

            obj.name = fnName;

            actions[url].push(obj);

            this.doRegister(endpoint, url + '.' + fnName, obj, scope);
        }
    },

    doRegister : function(endpoint, url, fn, scope) {
        if (fn.init) {
            fn.init();
        }

        endpoint[url] = {
            fn    : fn,
            url   : url,
            delay : this.getDelay(fn),
            scope : scope
        };
    },

    getXhr : function(method, url, options, async) {
        var parsedUrl = url.split('?').shift(),
            endpoint  = this.getUrlConfig(method, parsedUrl),
            xhr;

        if (endpoint) {
            xhr = new MockData.SimXhr({
                async    : async,
                endpoint : endpoint,
                url      : parsedUrl,
                method   : method,
                params   : Ext.apply({}, options.params, this.parseQueryString(url))
            });

            return xhr;
        }
    },

    getDirect : function(transaction) {
        var endpoint = this.getEndpoint('direct'),
            action   = transaction.getAction ? transaction.getAction() : transaction.action,
            method   = transaction.getMethod ? transaction.getMethod() : transaction.method;

        return endpoint[action + '.' + method];
    },

    getDelay : function(obj) {
        return obj.delay;
    },

    parseQueryString : function(str) {
        var m   = this.urlRegex.exec(str),
            ret = {},
            pair, parts,
            key, value, i, n;

        if (m && m[1]) {
            parts = m[1].split('&');

            for (i = 0, n = parts.length; i < n; ++i) {
                if ((pair = parts[i].split('='))[0]) {
                    key   = decodeURIComponent(pair.shift());
                    value = this.parseParamValue((pair.length > 1) ? pair.join('=') : pair[0]);

                    if (!(key in ret)) {
                        ret[key] = value;
                    } else if (Ext.isArray(ret[key])) {
                        ret[key].push(value);
                    } else {
                        ret[key] = [ret[key], value];
                    }
                }
            }
        }

        return ret;
    },

    parseParamValue : function(value) {
        var m;

        if (Ext.isDefined(value)) {
            value = decodeURIComponent(value);

            if (this.intRegex.test(value)) {
                value = parseInt(value, 10);
            } else if (this.floatRegex.test(value)) {
                value = parseFloat(value);
            } else if (!!(m = this.dateRegex.test(value))) {
                value = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
            }
        }

        return value;
    },

    getRequestsStore : function() {
        return Ext.getStore('mockdata-requests');
    }
}, function() {
    Ext.app = Ext.app || {};

    Ext.app.REMOTING_API = {
        url     : 'direct/router',
        type    : 'remoting',
        actions : {}
    };

    new MockData.store.Requests();
});
