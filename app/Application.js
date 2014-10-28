/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('Test.Application', {
    extend : 'Ext.app.Application',

    name : 'Test',

    requires : [
        'Ext.direct.*'
    ],

    launch : function () {
        Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

        Ext.Ajax.request({
            url     : 'test.json',
            method  : 'PUT',
            params  : {
                foo : 'bar'
            },
            rawData : 'This is some rawData',
            headers : {
                MockDataHeader : 'Customer header here'
            }
        });

        FooAction.test();
    }
});
