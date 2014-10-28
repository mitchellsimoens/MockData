Ext.define('Endpoint.Authorize', {
    extend    : 'MockData.Endpoint',
    singleton : true,

    endpoints : {
        '*'      : {
            'grid.json' : {
                fn : function() {
                    return {
                        success : true,
                        total   : 5,
                        data    : [
                            {
                                foo : 1,
                                bar : 'One'
                            },
                            {
                                foo : 2,
                                bar : 'Two'
                            },
                            {
                                foo : 3,
                                bar : 'Three'
                            },
                            {
                                foo : 4,
                                bar : 'Four'
                            },
                            {
                                foo : 5,
                                bar : 'Five'
                            }
                        ]
                    };
                }
            }
        },
        'PUT'    : {
            'test.json' : {
                delay      : 750,
                status     : 400,
                statusText : 'Bad request',
                fn         : function() {
                    return 'hello there';
                }
            }
        },
        'direct' : {
            FooAction : {
                getUsers : {
                    delay : 500,
                    fn    : function(params) {
                        return {
                            success : true,
                            total   : 5,
                            data    : [
                                {
                                    foo : 1,
                                    bar : 'One'
                                },
                                {
                                    foo : 2,
                                    bar : 'Two'
                                },
                                {
                                    foo : 3,
                                    bar : 'Three'
                                },
                                {
                                    foo : 4,
                                    bar : 'Four'
                                },
                                {
                                    foo : 5,
                                    bar : 'Five'
                                }
                            ]
                        };
                    }
                },
                test     : {
                    fn : function() {
                        return 'good';
                    }
                }
            }
        }
    }
});
