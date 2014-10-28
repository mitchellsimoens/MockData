Ext.define('MockData.view.Panel', {
    extend : 'Ext.panel.Panel',
    xtype  : 'mockdata-panel',

    requires : [
        'MockData.view.Controller',
        'MockData.view.Detail',
        'MockData.view.Grid'
    ],

    controller : 'mockdata-controller',
    title      : 'MockData Requests',

    layout : {
        type : 'border'
    },

    items : [
        {
            xtype     : 'mockdata-grid',
            region    : 'center',
            reference : 'requestgrid'
        },
        {
            xtype        : 'mockdata-detail',
            region       : 'east',
            reference    : 'requestdetail',
            width        : '50%',
            collapsible  : true,
            collapsed    : true,
            collapseMode : 'mini',
            split        : true
        }
    ]
});
