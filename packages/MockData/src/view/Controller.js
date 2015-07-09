Ext.define('MockData.view.Controller', {
    extend : 'Ext.app.ViewController',
    alias  : 'controller.mockdata-controller',

    init : function() {
        var me    = this,
            grid  = me.lookupReference('requestgrid'),
            store = grid.getStore();

        me.mon(store, {
            scope       : me,
            datachanged : me.updateRequestTitle
        });

        me.updateRequestTitle(store);
    },

    onRequestSelectionChange : function(selModel, selected) {
        var detail   = this.lookupReference('requestdetail'),
            request  = this.lookupReference('requesttab'),
            response = this.lookupReference('responsefield'),
            record   = selected[0],
            text;

        detail.setCollapsed(!record);

        if (record) {
            text = record.get('response');

            if (record.get('type') === 'xml') {
            } else {
                try {
                    text = JSON.stringify(Ext.decode(text), null, 4);
                } catch (e) {}
            }

            request.update(record.getData());
            response.setValue(text);
        } else {
            request.update({});
            response.setValue('');
        }
    },

    clearRequests : function() {
        var grid = this.lookupReference('requestgrid');

        grid.getStore().removeAll();
    },

    updateRequestTitle : function(store) {
        var panel        = this.getView(),
            initialTitle = panel.initialTitle,
            count        = store.getCount();

        if (!initialTitle) {
            initialTitle = panel.initialTitle = panel.title;
        }

        if (count) {
            initialTitle += ' (' + count + ')';
        }

        panel.setTitle(initialTitle);
    }
});
