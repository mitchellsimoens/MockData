Ext.define('Test.store.Direct', {
    extend : 'Ext.data.Store',
    alias  : 'store.test-direct',

    model : 'Test.model.Grid',

    proxy : {
        type     : 'direct',
        directFn : 'FooAction.getUsers',
        reader   : {
            type         : 'json',
            rootProperty : 'data'
        }
    }
});
