# paysage
Vuejs Reactive Components


```JS
class HelloWorld extends Paysage.Component
{
    get props() {
        return ['to'];
    }

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

```JS
class SomeComponent extends Paysage.Component
{    
    static draw = '<div>Hello World</div>'
}
```

```JS
class SomeComponent extends Paysage.Component
{
    draw(h) {
        return h(
            'div', 'Hello World'
        )
    }
}
```
https://github.com/vuejs/babel-plugin-transform-vue-jsx
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

## Computed

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

## Register

```JS
Paysage.register(name, component [, options])
```

## Mount

```JS
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
