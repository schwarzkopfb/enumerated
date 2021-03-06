[![view on npm](http://img.shields.io/npm/v/enumerated.svg)](https://www.npmjs.com/package/enumerated)
[![npm module downloads per month](http://img.shields.io/npm/dm/enumerated.svg)](https://www.npmjs.com/package/enumerated)
[![Build Status](https://travis-ci.org/schwarzkopfb/enumerated.svg?branch=master)](https://travis-ci.org/schwarzkopfb/enumerated)
![Analytics](https://ga-beacon.appspot.com/UA-66872036-1/enumerated/README.md?pixel)

# Enumerated

## What's Enumerated?

A simple, lightweight, easy-to-use and high performance implementation of Enum type for JavaScript. 
Enumerated uses lookup tables and bit operators internally, so is blazingly fast and also provides a friendly interface to reduce the time you spend on exploring and integrating the module. 
It's really lightweight - ~420 sloc excluding comments - but contains all the usual features you need and works in modern browsers (IE8+) too.

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

numbers.valuesOf(selectedNumbers) // [ 2, 4 ]

selectedNumbers |= numbers.five // extend selectedNumbers with another value

numbers.keysOf(selectedNumbers) // [ 'two', 'four', 'five' ]

selectedNumbers ^= numbers.two // remove one item from selectedNumbers

numbers.valuesOf(selectedNumbers) // [ 4, 5 ]

selectedNumbers ^= numbers.five | numbers.four // remove two items in one step

numbers.valuesOf(selectedNumbers) // []

// not flaggable enum 

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

// make it case insensitive

var days = Enum('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', { ignoreCase: true })

days.get('monday') // { key: 'monday', value: 'Monday' }
days.get('fRiDaY') // { key: 'friday', value: 'Friday' }

// items will be accessible lowercased with the dot or index operator if ignoreCase option is set to true
var selectedDays = days.saturday | days['sunday']

// ...

```

If you don't want to require Enumerated again and again in different modules, but instead only once in the main module, do the following:

```js

require('enumerated').global = true

// after that point Enum constructor has been exposed to the global context, 
// so feel free to use it anywhere

var animals = Enum({
    eagle: 'bird',
    snake: 'reptile',
    cat:   'four-footed'
})

// ...

```

Examples of comparisons:
 
```js

var foodList = [ 'pizza', 'hamburger', 'macaroni', 'ketchup' ],
    food     = Enum(foodList)

var dinner = food.pizza | food.ketchup

Enum.item(food.pizza).in(dinner) // true
Enum.item(food.hamburger).in(dinner) // false

food.item('pizza').in(dinner) // true
food.item('hamburger').in(dinner) // false

dinner === food.ketchup | food.pizza // true
dinner === food.ketchup | food.hamburger // false
dinner === food.pizza // false

var food2 = Enum('pizza', 'hamburger', 'macaroni', 'ketchup')

food == food2 // false, since object is a reference type

food.pizza === food2.pizza // true, because under the hood Enum uses simple integers to mark items

food instanceof Enum // true
food.pizza instanceof Enum // false
typeof food === 'object' // true
typeof food.pizza === 'number' // true

```

Supported constructors:

```js

var a = Enum('a', 'b', 'c'),
    b = Enum([ 'a', 'b', 'c' ]), // equivalent with the previous
    c = new Enum({ a: 1, b: 2, c: 3 }), // new operator is optional 
    d = Enum('a', 'b', 'c', { ignoreCase: true /* default: false */ }), // you can pass an object containing the desired options as the last argument
    e = Enum([ 'a', 'b', 'c' ], { single: true /* default: false */ }) // usually the second argument will be the last :)

```

Examples of useful Enum instance members:

```js

var fruitNames = { apple: 'red', orange: 'orange', grape: 'green', banana: 'yellow', pineapple: 'brown' },
    fruits     = Enum(fruitNames),
    selected   = fruits.apple | fruits.banana
     
fruits.valueOf(selected)  // 'red', because it returns the first selected item
fruits.valuesOf(selected) // [ 'red', 'yellow' ]
fruits.keyOf(selected)    // 'apple'
fruits.keysOf(selected)   // [ 'apple', 'banana' ]

fruits.get('grape') // { key: 'grape', value: 'green' }
fruits.get(3) // { key: 'banana', value: 'yellow' }

fruits.valueByKey('grape')                 // 'green'
fruits.valuesByKeys('apple', 'pineapple')  // [ 'red', 'brown' ]
fruits.keyByValue('yellow')                // 'banana'
fruits.keysByValues([ 'orange', 'green' ]) // [ 'orange', 'grape' ], note that you also can pass an array as well to all the member functions expecting multiple parameters
fruits.item('apple').in(selected)          // true
fruits.item('orange').in(selected)         // false
fruits.item('fake').in(selected)           // false
fruits.length                              // 5
fruits.keys                                // [ 'apple', 'orange', 'grape', 'banana', 'pineapple' ]
fruits.values                              // [ 'red', 'orange', 'green', 'yellow', 'brown' ]
fruits.items /*

[
    { key: 'apple', value: 'red' },
    { key: 'orange', value: 'orange' },
    { key: 'grape', value: 'green' },
    { key: 'banana', value: 'yellow' },
    { key: 'pineapple', value: 'brown' }
]

*/

fruits.toJSON()         // { descriptor: { apple: 'red', orange: 'orange', grape: 'green', banana: 'yellow', pineapple: 'brown' }, options: { single: false, ignoreCase: false } }
fruits.toJSON(selected) // [ 'red', 'yellow' ]

JSON.stringify(fruits)  // '{"descriptor":{"apple":"red","orange":"orange","grape":"green","banana":"yellow","pineapple":"brown"},"options":{"single":false,"ignoreCase":false}}'

fruits.fromJSON('["red","yellow"]') === selected // true
  
console.log(fruits) /*

Enum({
    "apple": "red",
    "orange": "orange",
    "grape": "green",
    "banana": "yellow",
    "pineapple": "brown"
})

*/

```

Examples of useful Enum "static" members:

```js

var fruits = Enum.fromJSON('{"descriptor":{"apple":"red","orange":"orange","grape":"green","banana":"yellow","pineapple":"brown"},"options":{"single":false,"ignoreCase":false}}')

Enum.global = true // set it true to expose Enum constructor into the global context
 
Enum.item(fruits.apple).in(fruits.banana | fruits.apple)     // true
Enum.item(fruits.apple).in(fruits.orange | fruits.pineapple) // false
Enum.item(fruits.apple).in(fruits.apple)                     // true
Enum.item(fruits.apple).in(fruits.pineapple)                 // false

Enum.item(fruits.apple).isSingle()                   // true
Enum.item(fruits.apple).isMultiple()                 // false
Enum.item(fruits.apple | fruits.orange).isSingle()   // false
Enum.item(fruits.apple | fruits.orange).isMultiple() // true

Enum.MAX_LENGTH // 31 or 63, the maximum count of items in an Enum instance. depends on the integer size of the system

```

And there is some extra sugar:

```js

// for non-flaggable enums you can use the language's built-in switch statement

var state   = Enum('pending', 'finished', { single: true }),
    current = state.pending

switch(current) {
    case state.pending:
        // ...
        break
        
    case state.finished:
        // ...
        break
        
    default:
        // ...
        break
}

// unfortunately you can't do the same with flagged enums,
// but Enumerated is shipped with a handy helper method

var fruits      = Enum('apple', 'orange', 'strawberry', 'lemon', 'banana'),
    likedFruits = fruits.apple | fruits.strawberry | fruits.banana

function printCase(value) {
    console.log('user likes', value)
}

fruits.switch(likedFruits)
      .case('apple', printCase)
      .case('orange', printCase)
      .case('strawberry', printCase)
      .case('lemon', printCase)
      .case('banana', printCase)
      
/*

output:

user likes apple
user likes strawberry
user likes banana

*/

```

**Note:** Proper examples will be added soon to the examples folder.

## Installation

With npm:

    npm install --save enumerated
    
With git:
    
    git clone git://github.com/schwarzkopfb/enumerated.git
    cd enumerated
    npm test
    
## Browser usage

If you want to use Enumerated in a browser, just download and include [enumerated.min.js](https://raw.githubusercontent.com/schwarzkopfb/enumerated/master/enumerated.min.js) in your front-end project. Don't worry, it weights only about 5 kB.
    
## Documentation

The complete documentation with examples for all the instance and static members can be found [here](https://github.com/schwarzkopfb/enumerated/blob/master/docs.md).

## AMD (Requirejs) support

It's supported to load Enumerated with a module loader that follows the AMD pattern, like the deservedly popular [Requirejs](http://requirejs.org/).

```js

requirejs([ 'enumerated' ], function(Enum) {

    var mouseButtons = Enum('left', 'middle', 'right')
    
    // ...

})

```

## Unit tests

The project is entirely covered with unit tests. Of course you can `npm test` to run them in Node.js environment or click [here](https://rawgit.com/schwarzkopfb/enumerated/f58cab5fa5858720edf23e82b1a4bfe0f404b753/test/index.html) if you're curious about the results in a web browser.

## Benchmark

Performance is important, so I wrote a simple [benchmark](https://github.com/schwarzkopfb/enumerated/blob/master/bench/index.js) for the project.
The results on my MacBook Pro (Mid 2010) are the following:

- 50000000 get() calls performed in 1.36 seconds (36764705.88 ops/sec)
- 50000000 valueOf() calls performed in 2.88 seconds (17361111.11 ops/sec)
- 50000000 valuesOf() calls performed in 9.27 seconds (5393743.26 ops/sec)
- 1000000 fromValues() calls performed in 3.84 seconds (260416.67 ops/sec)
- 1000000 valuesByKeys() calls performed in 3.90 seconds (256410.26 ops/sec)
- 100000 constructor calls performed in 5.77 seconds (17331.02 ops/sec)

In the light of the results, the overhead compared to more primitive solutions is negligible.

You can run the benchmark on your machine with the following command:

    npm run benchmark

## License

[MIT license](https://github.com/schwarzkopfb/enumerated/blob/master/LICENSE).