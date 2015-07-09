Ext.define('MockData.model.Request', {
    extend : 'Ext.data.Model',

    fields : [
        'type',
        'url',
        'method',
        'params',
        'body',
        'async',
        'response',
        'headers',
        'responseHeaders'
    ]
});
