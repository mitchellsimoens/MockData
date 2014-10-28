Ext.define('Override.direct.RemotingProvider', {
    override : 'Ext.direct.RemotingProvider',

    parseResponse : function(response) {
        if (!Ext.isEmpty(response.responseText)) {
            //overridden to add Ext.isArray
            if (Ext.isObject(response.responseText) || Ext.isArray(response.responseText)) {
                return response.responseText;
            }

            return Ext.decode(response.responseText);
        }

        return null;
    },

    sendRequest : function(transaction) {
        var me   = this,
            done = function(transaction, response) {
                var time   = 0,
                    status = 200,
                    endpoint, statusText;

                if (Ext.isArray(transaction)) {
                    var i      = 0,
                        length = transaction.length;

                    for (; i < length; i++) {
                        endpoint = transaction[i].endpoint.fn;

                        if (endpoint.delay > time) {
                            time = endpoint.delay;
                        }

                        if (endpoint.status > status) {
                            status     = endpoint.status;
                            statusText = endpoint.statusText;
                        }

                        delete transaction[i].endpoint;
                    }
                } else {
                    endpoint   = transaction.endpoint;
                    time       = endpoint.delay;
                    status     = endpoint.status;
                    statusText = endpoint.statusText;

                    delete transaction.endpoint;
                }

                me.record.set({
                    response   : Ext.encode(response),
                    delay      : time       || 0,
                    status     : status     || 200,
                    statusText : statusText || 'OK'
                });

                me.record.commit();

                me.onData({
                    transaction : transaction
                }, true, {
                    responseText : response
                });
            },
            delay, config;

        if (Ext.isArray(transaction)) {
            me.sendTransactions(transaction, done);
        } else {
            config = MockData.Manager.getDirect(transaction);

            if (config) {
                delay = config.delay || 0;

                me.sendTransactionDelay(delay, transaction, config, done);
            }
        }
    },

    sendFormRequest : function(transaction) {
        this.sendRequest(transaction);
    },

    sendTransaction : function(transaction, config) {
        var action      = transaction.getAction ? transaction.getAction() : transaction.action,
            transMethod = transaction.getMethod ? transaction.getMethod() : transaction.method,
            method, args;

        if (config) {
            method = config.fn;

            if (method) {
                if (transaction.form) {
                    args = Ext.Object.fromQueryString(
                        Ext.dom.Element.serializeForm(transaction.form)
                    );
                } else {
                    args = transaction.data;
                }

                if (!args) {
                    args = [];
                }

                args.push(method);
                args.push(transaction);

                transaction.endpoint = config;

                return {
                    type   : 'rpc',
                    tid    : transaction.tid,
                    action : action,
                    method : transMethod,
                    result : method.fn.apply(config.scope, args)
                };
            } else {
                console.warn('The method:', transMethod, 'Was not found for the action:', action);
            }
        } else {
            console.warn('The action was not found:', transMethod);
        }
    },

    sendTransactions : function(transactions, done) {
        var order     = [],
            responses = {},
            origTrans = Ext.Array.slice(transactions),
            check     = function() {
                var tid;

                for (tid in responses) {
                    if (!responses[tid]) {
                        return false;
                    }
                }

                finish();

                return true;
            },
            finish   = function() {
                var i        = 0,
                    length   = order.length,
                    response = [];

                for (; i < length; i++) {
                    response.push(responses[order[i]]);
                }

                done(origTrans, response);
            },
            callback = function(transaction, response) {
                responses[transaction.tid] = response;

                check();
            },
            trans, config, delay;

        while (trans = transactions.pop()) {
            responses[trans.tid] = null;

            order.push(trans.tid);

            config = MockData.Manager.getDirect(trans);
            delay  = config.delay || 0;

            this.sendTransactionDelay(delay, trans, config, callback);
        }
    },

    sendTransactionDelay : function(delay, transaction, config, done) {
        var me = this;

        setTimeout(function() {
            me.doSendTransaction(transaction, config, done);
        }, delay);
    },

    doSendTransaction : function(transaction, config, done) {
        var response = this.sendTransaction(transaction, config);

        Ext.Array.remove(this.callBuffer, transaction);

        done(transaction, response);
    },

    combineAndSend : function() {
        var me     = this,
            buffer = me.callBuffer,
            len    = buffer.length,
            store  = me.getRequestsStore(),
            i      = 0,
            body;

        if (len > 0) {
            if (len === 1) {
                body = me.buildRequestObj(buffer[0]);
            } else {
                body = [];

                for (; i < len; i++) {
                    body.push(me.buildRequestObj(buffer[i]));
                }
            }

            me.record = store.add({
                type   : 'json',
                url    : me.url,
                method : 'POST',
                body   : Ext.encode(body),
                async  : true
            })[0];

            me.sendRequest(len == 1 ? buffer[0] : buffer);

            //do not clear the callBuffer
        }
    },

    getRequestsStore : function() {
        return MockData.Manager.getRequestsStore();
    },

    buildRequestObj : function(transaction) {
        var data = transaction.data;

        if (data) {
            data = data[0];
        }

        return {
            type   : 'rpc',
            tid    : transaction.tid,
            action : transaction.action,
            method : transaction.method,
            data   : data
        };
    }
});
