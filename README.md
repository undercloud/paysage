# Paysage

<p align="center">
    <img src="https://raw.githubusercontent.com/undercloud/paysage/master/logo.png" />
</p>

Paysage is a helper for quickly and easily creating web components based on Vuejs.

## Installation
`npm install paysage`

## Usage
```JS
import Paysage from './paysage'

class HelloWorld extends Paysage.Component
{
    static props = ['to'];

    draw() {
        return (
            `<div>Hello {{ to }}</div>`
        );
    }
}

Paysage.register(HelloWorld, 'HelloWorld');
Paysage.mount('#app','<HelloWorld to="World" />');
```

## Draw and JSX
For creating HTML markup you must implement `draw` method:
```JS
class SomeComponent extends Paysage.Component
{
    draw() {
        return (
            `<div>
                Hello World
            </div>`
        );
    }
}
```

Or define static template:
```JS
class SomeComponent extends Paysage.Component
{    
    static draw = '<div>Hello World</div>';
}
```

Also you can build HTML with `createElement` function:
```JS
class SomeComponent extends Paysage.Component
{
    draw(createElement) {
        return createElement(
            'div', 'Hello World'
        );
    }
}
```
More about render function at https://vuejs.org/v2/guide/render-function.html

JSX also support with https://github.com/vuejs/babel-plugin-transform-vue-jsx plugin
```JSX
class SomeComponent extends Paysage.Component
{
    // h must be in scope
    draw(h) {
        return (
            <div>Hello World</div>
        );
    }

```

## Properties

You should not use the following names as properties or class methods, 
because they have special meanings in Vue:
`template`, `render`, `renderError`,
`props`, `propsData`, `computed`,
`watch`, `name`, `delimiters`,
`functional`, `model`, `mixins`,
`components`, `directives`, `filter`,
`inheritAttrs`

But if you define them, then they will work according to the built-in Vue logic.

Properties can be defined by two way:
```JS
class SomeComponent extends Paysage.Component
{
    /* 
        define static property,
        common for all instances 
    */
    static props = ['foo'];

    constructor() {
        super();
        /* 
            define property on fly,
            each instance has own variable copy
        */
        this.bar = 'Bar';
    }

    draw() {
        return (
            /*
                {{ foo }} and {{ bar }} available here,
                and in any method defined in this class
             */
        );
    }
}
```
More about properties at https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function

## Computed
All getters and setters will be processed as computed properties:
```JS
class SomeComponent extends Paysage.Component
{
    get fullName() {
        return this.firstName + ' ' + this.lastName;
    }

    set fullName(newValue) {
        var names = newValue.split(' ');
        this.firstName = names[0];
        this.lastName = names[names.length - 1];
    }
}
```
More about computed properties at https://vuejs.org/v2/guide/computed.html

## Events
Next events you can use as Vue's lifecycle hooks

* beforeCreate
* created
* beforeMount
* mounted
* beforeUpdate
* updated
* activated
* deactivated
* beforeDestroy
* destroyed
* errorCaptured

```JS
class SomeComponent extends Paysage.Component
{
    created() {
        ...
    }

    mounted() {
        ...
    }

    updated() {
        ...
    }
}
```

More about hooks at https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram

## Register
You must register component before use:
```JS
/*
component - component instance
name - component name, default equal instance name
*/
Paysage.register(component, name)
```

## Mount
Mount component to DOM:
```JS
/*
selector - string or HTMLElement instance
component - HTML markup or component instance
options - additional Vue options
*/
Paysage.mount(selector [, component [, options]])
```

## ES5
If you wanna use it without transpilling, use `createClass` helper:
```JS
var HelloWorld = Paysage.createClass({
    constructor: function () {
        this.to = 'World';
    },
    draw: function() {
        return (
            '<div>Hello {{ to }}</div>'
        )
    }
})

Paysage.register(HelloWorld, 'HelloWorld');
```
