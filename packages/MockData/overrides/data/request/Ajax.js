Ext.define('Override.data.request.Ajax', {
    override : 'Ext.data.request.Ajax',

    openRequest : function (options, requestOptions, async) {
        var xhr = !options.nosim && MockData.Manager.getXhr(requestOptions.method, requestOptions.url, options, async);

        if (!xhr) {
            xhr = this.callParent(arguments);
        }

        return xhr;
    }
});
