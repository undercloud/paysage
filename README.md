# paysage
Vuejs Reactive Components

coming soon...

## draw and JSX
https://github.com/vuejs/babel-plugin-transform-vue-jsx
```JS
draw() {
    return (
        `<div>
            Hello World
        </div>`
    )
}
```

```JS
draw: '<div></div>'
```

```JS
draw(h) {
    return h(
        'div', 'Hello World'
    )
}
```

```
// h must be in scope
draw(h) {
    return (
        <div>Hello World</div>
    )
}
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