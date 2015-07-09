Ext.define('Test.view.main.Main', {
    extend : 'Ext.container.Container',
    xtype  : 'test-main-main',

    requires : [
        'Test.view.main.MainController',
        'Test.view.main.MainModel',
        'Test.view.Direct',
        'Test.view.Grid',

        'MockData.view.Panel'
    ],

    controller : 'test-main-main',

    viewModel : {
        type : 'test-main-main'
    },

    layout : {
        type : 'border'
    },

    items : [
        {
            xtype  : 'panel',
            region : 'west',
            title  : 'Test',
            html   : '<ul><li>This area is commonly used for navigation, for example, using a "tree" component.</li></ul>',
            width  : 250,
            split  : true
        },
        {
            xtype  : 'tabpanel',
            region : 'center',
            title  : 'Grid Tests',
            items  : [
                {
                    xtype : 'test-grid',
                    title : 'Grid'
                },
                {
                    xtype : 'test-direct',
                    title : 'Direct'
                }
            ]
        },
        {
            xtype  : 'mockdata-panel',
            region : 'south',
            height : 400
        }
    ]
});
