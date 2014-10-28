Ext.define('Test.view.main.MainModel', {
    extend : 'Ext.app.ViewModel',
    alias  : 'viewmodel.test-main-main',

    requires : [
        'Test.store.Direct',
        'Test.store.Grid'
    ],

    stores : {
        direct : {
            type     : 'test-direct',
            autoLoad : true
        },
        grid   : {
            type     : 'test-grid',
            autoLoad : true
        }
    }
});
