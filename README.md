# paysage
Vuejs Reactive Components


## Installation
`npm install paysage`

```JS
import Paysage from './paysage'

class HelloWorld extends Paysage.Component
{
    static props = ['to'];

    draw() {
        return (
            `<div>Hello {{ to }}</div>`
        )
    }
}

Paysage.register('HelloWorld', HelloWorld)
Paysage.mount('#app','<HelloWorld to="World" />')
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
        )
    }
}
```
Or define static template:
```JS
class SomeComponent extends Paysage.Component
{    
    static draw = '<div>Hello World</div>'
}
```
Also you can build HTML with `createElement` function
```JS
class SomeComponent extends Paysage.Component
{
    draw(createElement) {
        return createElement(
            'div', 'Hello World'
        )
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
        )
    }

```

## Properties
Properties can be defined by two way:
```JS
class SomeComponent extends Paysage.Component
{
    // define static property
    static props = ['foo'];

    constructor() {
        super();
        // define property on fly
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

## Computed
All getters and setters will be processed as computed properties:
```JS
class SomeComponent extends Paysage.Component
{
    get fullName() {
        return this.firstName + ' ' + this.lastName;
    }

    set fullName(newValue) {
        var names = newValue.split(' ')
        this.firstName = names[0]
        this.lastName = names[names.length - 1]
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

```JS
/*
name - component name
component - component instance
options - additional Vue options
*/

Paysage.register(name, component [, options])
```

## Mount

```JS
/*
selector - string or HTMLElement instance
component - HTML markup
options - additional Vue options
*/
Paysage.mount(selector [, component [, options]])
```

## es5

```JS
var HelloWorld = Paysage.createClass({
    constructor: function () {
        this.to = 'World';
    },
    draw: function() {
        return (
            '<div>Hello {{ to }}</div'
        )
    }
})

Paysage.register('HelloWorld', HelloWorld);
```
