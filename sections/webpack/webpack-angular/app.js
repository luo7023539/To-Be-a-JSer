window.Ready = function (cbk) {
    return function () {
        return Promise.all([].slice.call(arguments)).then(function (args) {
            if ('function' == typeof cbk) {
                return cbk.apply(null, args);
            }
        });
    };
};

window.Chunk = function (loading) {
    return function () {
        return new Promise(function (resolve, reject) {
            loading(function () {
                Promise.all([].slice.call(arguments)).then(function (args) {
                    if (args.length) {
                        resolve(args[0]);
                    } else {
                        reject();
                    }
                });
            });
        });
    };
};

define(Ready(function () {

    var app = angular.module('webpack-example', [
        'ui.router'
    ]);

    app.config([
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        '$injector',
        function ($controllerProvider, $compileProvider, $filterProvider, $provide, $injector) {
            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            app.factory = $provide.factory;
            app.service = $provide.service;
            app.provider = $provide.provider;
            app.value = $provide.value;
            app.constant = $provide.constant;
            app.decorator = $provide.decorator;

            window.Library = (function () {

                var providers = {
                    '$controllerProvider': $controllerProvider,
                    '$compileProvider': $compileProvider,
                    '$filterProvider': $filterProvider,
                    '$provide': $provide
                };

                var cache = {};

                return function Library(module) {

                    // already activated
                    if (cache[module]) {
                        return;
                    }

                    var module = angular.module(module);

                    var i;

                    if (module.requires) {
                        for (i = 0; i < module.requires.length; i++) {
                            Library(module.requires[i]);
                        }
                    }

                    var invokeArgs, provider, method, args;
                    for (i = 0; i < module._invokeQueue.length; i++) {
                        invokeArgs = module._invokeQueue[i];
                        provider = providers[invokeArgs[0]];
                        method = invokeArgs[1];
                        args = invokeArgs[2];
                        provider[method].apply(provider, args);
                    }

                    for (i = 0; i < module._configBlocks.length; i++) {
                        $injector.invoke(module._configBlocks[i]);
                    }

                    for (i = 0; i < module._runBlocks.length; i++) {
                        $injector.invoke(module._runBlocks[i]);
                    }

                    cache[module] = true;
                };
            })();
        }
    ]);

    app.config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        '$controllerProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider) {

            var router = require('./router');

            var routeList = router.map(function (route, idx) {
                console.log(route);
                $stateProvider
                    .state(route.state, {
                        url: route.url,
                        templateProvider: Chunk(function (resolve) {
                            require([
                                // route.controller
                                ('./pages/home/views/home.html'),
                                ('./pages/home/controller/homeCtrl.js')
                            ], resolve);
                        })
                    })
            });
            // $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise('/global/home');

            $stateProvider
                .state('global', {
                    abstract: true,
                    url: '/global',
                    templateProvider: Chunk(function (resolve) {
                        require([
                            './pages/root/views/root.html',
                            './pages/root/controller/rootCtrl.js'
                        ], resolve);
                    })
                })
                .state('global.home', {
                    url: '/home',
                    templateProvider: Chunk(function (resolve) {
                        require([
                            './pages/home/views/home.html',
                            './pages/home/controller/homeCtrl.js'
                        ], resolve);
                    }),
                    controller: 'homeCtrl'
                })
        }
    ]);

    return app;

}))
