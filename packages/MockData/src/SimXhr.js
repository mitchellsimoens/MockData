/**
 * @author Don Griffin
 * @author Mitchell Simoens
 *
 * Simulates an XMLHttpRequest object's methods and properties but is backed by a
 * {@link Ext.ux.ajax.Simlet} instance that provides the data.
 */
Ext.define('MockData.SimXhr', {
    readyState : 0,

    async    : null,
    endpoint : null,
    params   : null,
    url      : null,
    method   : null,

    isSimXhr : true,

    constructor : function(config) {
        var me = this;

        Ext.apply(me, config);

        me.requestHeaders = {};
    },

    abort : function() {
        var me = this;

        if (me.timer) {
            clearTimeout(me.timer);
            me.timer = null;
        }
        me.aborted = true;
    },

    getAllResponseHeaders : function() {
        var headers = [];

        if (Ext.isObject(this.responseHeaders)) {
            Ext.Object.each(this.responseHeaders, function(name, value) {
                headers.push(name + ': ' + value);
            });
        }

        return headers.join('\x0d\x0a');
    },

    getResponseHeader : function(header) {
        var headers = this.responseHeaders;
        return (headers && headers[header]) || null;
    },

    open : function(method, url, async, user, password) {
        var me = this;

        me.method   = method;
        me.url      = url;
        me.async    = async !== false;
        me.user     = user;
        me.password = password;

        me.setReadyState(1);
    },

    overrideMimeType : function(mimeType) {
        this.mimeType = mimeType;
    },

    schedule : function() {
        var me    = this,
            delay = me.endpoint.delay || 0;

        if (delay) {
            me.timer = setTimeout(function() {
                me.onTick();
            }, delay);
        } else {
            me.onTick();
        }
    },

    send : function(body) {
        var me     = this,
            store  = me.getRequestsStore(),
            data   = {
                url     : me.url,
                method  : me.method,
                body    : body,
                async   : me.async,
                params  : me.parseObj(me.params),
                headers : me.parseObj(me.requestHeaders)
            };

        me.record = store.add(data)[0];

        me.body = body;

        if (me.async) {
            me.schedule();
        } else {
            me.onComplete();
        }
    },

    setReadyState : function(state) {
        var me = this;

        if (me.readyState != state) {
            me.readyState = state;
            me.onreadystatechange();
        }
    },

    setRequestHeader : function(header, value) {
        this.requestHeaders[header] = value;
    },

    onreadystatechange : Ext.emptyFn,

    onComplete : function() {
        var me = this,
            callback;

        me.readyState = 4;
        me.exec();

        callback = me.jsonpCallback;

        if (callback) {
            var text = callback + '(' + me.responseText + ')';

            eval(text);
        }
    },

    onTick : function() {
        var me   = this,
            type = me.responseXML ? 'xml' : 'json';

        me.timer = null;
        me.onComplete();
        me.onreadystatechange && me.onreadystatechange();

        me.record.set({
            type            : type,
            delay           : me.endpoint.delay || 0,
            status          : me.status,
            statusText      : me.statusText,
            response        : type === 'json' ? me.responseText : me.responseXML,
            responseHeaders : me.parseObj(me.responseHeaders)
        });

        me.record.commit();

        delete me.record;
    },

    exec : function() {
        var me       = this,
            endpoint = me.endpoint,
            origFn   = endpoint.fn,
            fn       = origFn,
            data     = endpoint.data,
            status, statusText, type, tpl;

        if (!Ext.isFunction(fn)) {
            status     = fn.status;
            statusText = fn.statusText;
            type       = fn.type;
            data       = fn.data;
            fn         = fn.fn;
        }

        if (!type) {
            type = endpoint.url.split('.').pop();
        }

        type = me.parseType(type);

        if (fn) {
            data = fn.call(endpoint.scope, me.params, origFn);
        }

        me.status     = status || 200;
        me.statusText = statusText || 'Ok';

        if (type === 'xml') {
            tpl = origFn.tpl;

            if (tpl && typeof data === 'object') {
                if (!tpl.isTemplate) {
                    tpl = origFn.tpl = new Ext.XTemplate(tpl);
                }

                data = tpl.apply(data);
            }

            me.responseText = data;
            me.responseXML  = me.parseXmlString(data);
        } else {
            if (type === 'json') {
                data = Ext.encode(data);
            }

            me.responseXML  = null;
            me.responseText = data;
        }
    },

    parseXmlString : function(xml) {
        var doc;

        if (window.DOMParser) {
            doc = new DOMParser().parseFromString(xml, 'text/xml');
        } else if (window.ActiveXObject) {
            doc = new ActiveXObject('Microsoft.XMLDOM');
            doc.async = 'false';
            doc.loadXML(xml);
        }

        return doc;
    },

    parseType : function(type) {
        type = type || 'json';

        if (type) {
            if (type !== 'json' && type !== 'xml' && type !== 'string') {
                type = 'json';
            }
        }

        return type;
    },

    getRequestsStore : function() {
        return MockData.Manager.getRequestsStore();
    },

    parseObj : function(obj) {
        var parsed = [],
            name;

        if (obj) {
            for (name in obj) {
                if (obj.hasOwnProperty(name)) {
                    parsed.push({
                        name  : name,
                        value : obj[name]
                    });
                }
            }
        }

        return parsed;
    }
});