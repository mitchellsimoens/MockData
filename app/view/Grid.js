Ext.define('Test.view.Grid', {
    extend : 'Ext.grid.Panel',
    xtype  : 'test-grid',

    bind : '{grid}',

    columns : [
        {
            text      : 'Foo',
            dataIndex : 'foo',
            flex      : 1
        },
        {
            text      : 'Bar',
            dataIndex : 'bar',
            flex      : 1
        }
    ],

    dockedItems : [
        {
            xtype  : 'pagingtoolbar',
            dock   : 'bottom',
            bind   : {
                store : '{grid}'
            }
        }
    ]
});
