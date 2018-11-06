;(function (scope) {
    "use strict";

    var core = {
        whitelist: [
            // dom
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
            "components",
            "directives",
            "filter",
            "inheritAttrs"
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
            var root = null;
            if (selector instanceof NodeList) {
                root = selector;
            } else if (selector instanceof HTMLElement) {
                root = [selector];
            } else {
                root = document.querySelectorAll(selector);
            }

            var nodes = [];
            for (var index = 0; index < root.length; index++) {
                var node = root[index];
                var div = document.createElement('div');
                div.innerHTML = component;
                node.appendChild(div.firstChild);

                nodes.push(node.lastElementChild);
            }

            return nodes;
        },
        createSerializer: function(dynamics, statics) {
            return function () {
                var locals =  dynamics() || {};
                var globals = statics() || {};

                return Object.assign({}, globals, locals);
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
            core.extractVars(source, statics);
            if (isClass) {
                core.assign(map, source, true);
                source = source.prototype;
            }

            core.assign(map, source);

            var heap = null;
            var resolveConstructor = function () {
                heap = new source.constructor();
            };

            map.beforeCreate = (
                typeof map.beforeCreate == "undefined"
                ? resolveConstructor
                : core.compose(map.beforeCreate, resolveConstructor)
            );

            if (true !== map.functional) {
                map.data = core.createSerializer(
                    function() { return heap; },
                    function() { return statics; }
                );
            }

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
                return core.bindNode(selector, component).map(function(node) {
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
        register: function (component, name) {
            if (typeof component === "function") {
                if (arguments.length === 1) {
                    name = String(component && component.name);
                }

                if (!(Object.getPrototypeOf(component) === Paysage.Component)) {
                    throw new TypeError(name + " must be instanceof Paysage.Component");
                }
            }

            return Vue.component(
                name,
                typeof component === "function"
                ? this.createClass(component)
                : component
            );
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
