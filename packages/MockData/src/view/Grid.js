Ext.define('MockData.view.Grid', {
    extend : 'Ext.grid.Panel',
    xtype  : 'mockdata-grid',

    requires : [
        'Ext.grid.column.Boolean'
    ],

    cls   : 'mockdata-grid',
    store : 'mockdata-requests',

    listeners : {
        selectionchange : 'onRequestSelectionChange'
    },

    columns : [
        {
            text      : 'URL',
            dataIndex : 'url',
            flex      : 1
        },
        {
            text      : 'Method',
            dataIndex : 'method',
            width     : 100
        },
        {
            xtype     : 'booleancolumn',
            text      : 'Synchronous',
            dataIndex : 'async',
            width     : 100,
            trueText  : 'No',
            falseText : 'Yes'
        },
        {
            text      : 'Status',
            dataIndex : 'status',
            width     : 125,
            renderer  : function(value, metaData, record) {
                if (value) {
                    value += '<br />' + record.get('statusText');
                }

                return value;
            }
        },
        {
            text      : 'Time',
            dataIndex : 'delay',
            width     : 100,
            renderer  : function(value) {
                if (Ext.isDefined(value)) {
                    value += ' ms';
                }

                return value;
            }
        }
    ],

    tbar : [
        {
            text    : 'Clear',
            handler : 'clearRequests'
        }
    ]
});
