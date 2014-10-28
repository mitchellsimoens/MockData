Ext.define('MockData.store.Requests', {
    extend : 'Ext.data.Store',
    alias  : 'store.mockdata-requests',

    requires : [
        'MockData.model.Request'
    ],

    model   : 'MockData.model.Request',
    storeId : 'mockdata-requests'
});
