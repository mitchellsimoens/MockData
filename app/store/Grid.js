Ext.define('Test.store.Grid', {
    extend : 'Ext.data.Store',
    alias  : 'store.test-grid',

    require : [
        'Test.model.Grid'
    ],

    model : 'Test.model.Grid',

    proxy : {
        type   : 'ajax',
        url    : 'grid.json',
        reader : {
            rootProperty : 'data'
        }
    }
});
