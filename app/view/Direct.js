Ext.define('Test.view.Direct', {
    extend : 'Ext.grid.Panel',
    xtype  : 'test-direct',

    bind : '{direct}',

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
            xtype : 'pagingtoolbar',
            dock  : 'bottom',
            bind  : {
                store : '{direct}'
            }
        }
    ]
});
