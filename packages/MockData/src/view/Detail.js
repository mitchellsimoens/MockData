Ext.define('MockData.view.Detail', {
    extend : 'Ext.tab.Panel',
    xtype  : 'mockdata-detail',

    requires : [
        'Ext.form.field.TextArea'
    ],

    cls    : 'mockdata-detail',
    header : false,

    items : [
        {
            xtype     : 'component',
            reference : 'requesttab',
            cls       : 'request-tab',
            title     : 'Request',
            tpl       : '<div><span class="header">Request URL:</span> {url}</div>' +
            '<div><span class="header">Request Method:</span> {method}</div>' +
            '<div><span class="header">Status Code:</span> {status} {statusText}</div>' +
            '<tpl if="headers">' +
                '<div class="section">' +
                    '<div class="header">Request Headers</div>' +
                    '<tpl for="headers"><div class="request-item"><strong>{name}:</strong> {value}</div></tpl>' +
                '</div>' +
            '</tpl>' +
            '<tpl if="params">' +
                '<div class="section">' +
                    '<div class="header">Parameters</div>' +
                    '<tpl for="params"><div class="request-item"><strong>{name}:</strong> {value}</div></tpl>' +
                '</div>' +
            '</tpl>' +
            '<tpl if="body">' +
                '<div class="section">' +
                    '<div class="header">Body</div>' +
                    '<div>{body}</div>' +
                '</div>' +
            '</tpl>'
        },
        {
            reference : 'responsetab',
            title     : 'Response',
            layout    : 'fit',
            items     : [
                {
                    xtype     : 'textareafield',
                    reference : 'responsefield'
                }
            ]
        }
    ]
});
