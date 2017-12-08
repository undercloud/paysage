;(function (scope) {
    "use strict";

    var core = {
        whitelist: [
            // dom
            "el",
            "template",
            "render",
            "renderError",
            //hooks
            "beforeCreate",
            "created",
            "beforeMount",
            "mounted",
            "beforeUpdate",
            "updated",
            "activated",
            "deactivated",
            "beforeDestroy",
            "destroyed",
            "errorCaptured",
            //options
            "props",
            "propsData",
            "computed",
            "watch",
            // misc
            "name",
            "delimiters",
            "functional",
            "model",
            "mixins",
            "directives"
        ],
        assign: function (map, prototype, isPrototype) {
            var keys = (
                isPrototype
                ? Object.keys(prototype)
                : Object.getOwnPropertyNames(prototype)
            );

            for (var i = 0; i < keys.length; i++) {
                var x = keys[i];

                if (this.whitelist.includes(x)) {
                    map[x] = prototype[x];
                } else {
                    var descriptor = Object.getOwnPropertyDescriptor(prototype, x);

                    if (!!descriptor.get || !!descriptor.set) {
                        map.computed[x] = {
                            get: descriptor.get,
                            set: descriptor.set
                        };
                    } else if (typeof prototype[x] === "function" || x === "draw") {
                        map.methods[x] = prototype[x];
                    }
                }
            }
        },
        extractVars: function (prototype, map) {
            for (var x in prototype) {
                if (prototype.hasOwnProperty(x)) {
                    if (!(this.whitelist.includes(x))) {
                        if (x === "draw") continue;

                        var descriptor = Object.getOwnPropertyDescriptor(prototype, x);
                        if (typeof prototype[x] != "function" && !descriptor.get && !descriptor.set) {
                            map[x] = prototype[x];
                        }
                    }
                }
            }

            return map;
        },
        compose: function () {
            var args = arguments;
            var start = args.length - 1;

            return function () {
                var i = start;
                var result = args[start].apply(this, arguments);
                while (i--) result = args[i].call(this, result);

                return result;
            };
        },
        bindNode: function (selector, component) {
            try {
                var root = (
                    selector instanceof NodeList
                    ? selector
                    : (
                        selector instanceof HTMLElement
                        ? [selector]
                        : document.querySelectorAll(selector)
                    )
                );
            } catch (e) {
                
            }

            return root.map(function(node){
                node.appendChild(
                    (new DOMParser())
                        .parseFromString(component, "application/xml")
                        .documentElement
                );

                return node.lastElementChild;
            });
        },
        createSerializer: function(source, statics) {
            return function () {
                var data = core.extractVars(source, statics);
                data = JSON.stringify(data);
                data = JSON.parse(data);

                return data;
            };
        }
    };

    var Paysage = {
        Component: function () {},
        createClass: function(source) {
            var isClass = (typeof source == "function");

            var map = {
                computed: {},
                methods: {
                    draw: function () {
                        throw new Error("Method draw is not implemented");
                    }
                }
            };

            var statics = {};
            if (isClass) {
                core.assign(map, source, true);
                core.extractVars(source, statics);
                source = source.prototype;
            }

            core.assign(map, source);

            if (true !== map.functional && typeof map.data == "undefined") {
                map.data = core.createSerializer(source, statics);
            }

            source.constructor = source.constructor.bind(source);

            var resolveConstructor = (
                !isClass
                ? source.constructor
                : function () {
                    source = new source.constructor();

                    var fn = function(key){
                        this[key] = source[key];
                    };

                    Object.keys(source).forEach(fn,this)
                }
            );

            map.beforeCreate = (
                typeof map.beforeCreate == "undefined"
                ? resolveConstructor
                : core.compose(
                    map.beforeCreate,
                    resolveConstructor
               )
            );

            if (typeof map.methods.draw == "string" || map.methods.draw instanceof String) {
                map.template = map.methods.draw;
            } else if (0 === map.methods.draw.length) {
                map.template = map.methods.draw();
            } else {
                map.render = map.methods.draw;
            }

            return map;
        },
        mount: function (selector, component, options) {
            if (1 === arguments.length) {
                return [new Vue({el: selector})];
            }

            options = options || {};

            if (typeof component == "string") {
                return core.bindNode(selector, component).map(function(node){
                    return new Vue(Object.assign(
                        {el: node},
                        options
                    ));
                });
            }

            return [new Vue(Object.assign(
                {el: selector},
                component || {},
                options
            ))];
        },
        register: function (name, component, options) {
            var map = Object.assign(
                typeof component == "function"
                ? this.createClass(component)
                : component,
                options || {}
            );

            return Vue.component(name, map);
        }
    };

    if (typeof module != "undefined" && typeof module.exports != "undefined") {
        module.exports = Paysage;
    } else if (typeof define != "undefined" && typeof define.amd != "undefined") {
        define([], function() {
            return Paysage;
        });
    } else {
        scope.Paysage = Paysage;
    }
}(this));
