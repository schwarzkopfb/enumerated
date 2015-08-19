# Enumerated

## What's Enumerated?

A simple, lightweight, easy-to-use and high performance implementation of enumerated type for JavaScript.

## Note

A detailed readme file and proper examples will be added soon.

## Usage

```js

var Enum = require('enumerated')

var colors = new Enum('red', 'green', 'blue')
var selectedColors = colors.red | colors.blue

colors.valuesOf(selectedColors) // [ 'red', 'blue' ]

var numbers = Enum({
    one:   1,
    two:   2,
    three: 3,
    four:  4,
    five:  5
})

var selectedNumbers = numbers.four | numbers.two

numbers.valuesOf(selectedNumbers) // [ 4, 2 ]
numbers.keysOf(selectedNumbers) // [ 'four', 'two' ]

var states = Enum('pending', 'processing', 'finished', 'failed', { single: true })

var selectedState = states.processing

states.valueOf(selectedState) // 'processing'

var selectedStates = states.processing | states.pending

try {
    states.valuesOf(selectedStates)
}
catch(ex) {
    // throws "Error: This enum allows only one single choice."
}

```

If you don't want to require Enumerated again and again in different modules, but instead only once in the main module, do the following:

```js

require('enumerated').global = true

// after that point Enum constructor has been exposed to the global context, so feel free to use it anywhere

var animals = Enum({
    eagle: 'bird',
    pigeon: 'bird',
    cat: 'four-footed',
    dog: 'four-footed'
})

// ...

```

## Installation

With npm:

    npm install --save enumerated
    
With git:
    
    git clone git://github.com/schwarzkopfb/enumerated.git
    cd enumerated
    npm test

## License

[MIT license](https://github.com/schwarzkopfb/enumerated/blob/master/LICENSE).