Ext.define('Override.data.Connection', {
    override : 'Ext.data.Connection',

    requires : [
        'MockData.Manager'
    ],

    request : function(options) {
        if (Ext.getVersion().major < 4) {
            //this is Sencha Touch 2
            return this._touchRequest(options);
        }

        return this.callParent([options]);
    },

    _touchRequest : function(options) {
        options = options || {};

        var me       = this,
            scope    = options.scope || window,
            username = options.username || me.username,
            password = options.password || me.password || '',
            async,
            requestOptions,
            request,
            headers,
            xhr;

        if (me.fireEvent('beforerequest', me, options) !== false) {
            requestOptions = me.setOptions(options, scope);

            if (me.isFormUpload(options)) {
                me.upload(options.form, requestOptions.url, requestOptions.data, options);

                return null;
            }

            // if autoabort is set, cancel the current transactions
            if (options.autoAbort || me.autoAbort) {
                me.abort();
            }

            // create a connection object
            async = options.async !== false ? (options.async || me.async) : false;
            async = true; //TODO !!!!!!!!!!!!!!!!!!!!!!!
            xhr   = me.openRequest(options, requestOptions, async, username, password);

            // XDR doesn't support setting any headers
            if (!me.isXdr) {
                headers = me.setupHeaders(xhr, options, requestOptions.data, requestOptions.params);
            }

            // create the transaction object
            request = {
                id      : ++Ext.data.Connection.requestId,
                xhr     : xhr,
                headers : headers,
                options : options,
                async   : async,
                binary  : options.binary || me.binary,
                timeout : setTimeout(function() {
                    request.timedout = true;
                    me.abort(request);
                }, options.timeout || me.getTimeout ? me.getTimeout() : me.timeout)
            };

            me.requests[request.id] = request;
            me.latestId = request.id;

            // bind our statechange listener
            if (async) {
                if (!me.isXdr) {
                    xhr.onreadystatechange = Ext.Function.bind(me.onStateChange, me, [request]);
                }
            }

            if (me.isXdr) {
                me.processXdrRequest(request, xhr);
            }

            // start the request!
            xhr.send(requestOptions.data);

            if (!async) {
                return me.onComplete(request);
            }

            return request;
        } else {
            Ext.callback(options.callback, options.scope, [options, undefined, undefined]);

            return null;
        }
    },

    openRequest : function(options, requestOptions, async, username, password) {
        var xhr = !options.nosim && MockData.Manager.getXhr(requestOptions.method, requestOptions.url, options, async);

        if (!xhr) {
            xhr = this.callParent([options, requestOptions, async, username, password]);
        }

        return xhr;
    }
});
