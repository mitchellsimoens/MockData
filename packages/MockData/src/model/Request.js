Ext.define('MockData.model.Request', {
    extend : 'MockData.model.Base',

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
