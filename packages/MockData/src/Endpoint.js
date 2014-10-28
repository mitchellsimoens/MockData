Ext.define('MockData.Endpoint', {
    requires : [
        'MockData.Manager'
    ],

    endpoints : {},

    constructor : function() {
        var endpoints = this.endpoints,
            endpoint, method, url, obj;

        for (method in endpoints) {
            endpoint = endpoints[method];

            for (url in endpoint) {
                obj = endpoint[url];

                MockData.Manager.register(method, url, obj, this);
            }
        }
    }
});
