Ext.define('Override.data.JsonP', {
    override : 'Ext.data.JsonP',

    createScript : function(url, params, options) {
        var fullUrl = Ext.urlAppend(url, Ext.Object.toQueryString(params)),
            script  = !options.nosim && MockData.Manager.getXhr('GET', fullUrl, options, true);

        if (!script) {
            script = this.callParent([url, params, options]);
        }

        return script;
    },

    loadScript : function(request) {
        var script = request.script;

        if (script && script.isSimXhr) {
            request.script       = document.createElement('div'); //work around the Ext.fly(request.script).destroy(); call
            script.jsonpCallback = request.params[request.callbackKey];
            script.send(null);
        } else {
            this.callParent([request]);
        }
    }
});
