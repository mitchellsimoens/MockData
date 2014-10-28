Ext.define('MockData.view.Controller', {
    extend : 'Ext.app.ViewController',
    alias  : 'controller.mockdata-controller',

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
    }
});
