# Enumerated

## What's Enumerated?

A simple, lightweight, easy-to-use and high performance implementation of Enum type for JavaScript. 
Enumerated uses lookup tables and bit operators internally, so blazingly fast and also provides a friendly interface to reduce the time you spend on exploring and integrating the module. 
It's really lightweight - ~400 sloc - but contains all the usual features you need. 

## Note

A more detailed readme, proper examples and unit tests will be added soon.

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

// make it case insensitive

var days = Enum('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', { ignoreCase: true })

days.get('monday') // { key: 'monday', value: 'Monday' }
days.get('fRiDaY') // { key: 'friday', value: 'Friday' }

var selectedDays = days.saturday | days.sunday

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
    c = new Enum({ a: 1, b: 2, c: 3 }) // new operator is optional 

```

Examples of useful Enum instance members:

```js

var fruitNames = { apple: 'red', orange: 'orange', grape: 'green', banana: 'yellow', pineapple: 'brown' },
    fruits     = Enum(fruitNames),
    selected   = fruits.apple | fruits.banana
     
fruits.valueOf(selected)  // 'red', because it returns the first item
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

fruits.toJSON()         // { apple: 'red', orange: 'orange', grape: 'green', banana: 'yellow', pineapple: 'brown' }
fruits.toJSON(selected) // [ 'red', 'yellow' ]

JSON.stringify(fruits)  // '{"apple":"red","orange:"orange","grape:"green",banana:"yellow","pineapple":"brown"}'

// todo: add fromJSON here

fruits.toString() // '[object Enum]'
  
console.log(fruits)
/*

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

var fruits = Enum.fromJSON('{"apple":"red","orange:"orange","grape:"green",banana:"yellow","pineapple":"brown"}')

Enum.global = true // set it true to expose Enum constructor into the global context
 
Enum.item(fruits.apple).in(fruits.banana | fruits.apple)     // true
Enum.item(fruits.apple).in(fruits.orange | fruits.pineapple) // false
Enum.item(fruits.apple).in(fruits.apple)                     // true
Enum.item(fruits.apple).in(fruits.pineapple)                 // false

Enum.item(fruits.apple).isSingle()                   // true
Enum.item(fruits.apple).isMultiple()                 // false
Enum.item(fruits.apple | fruits.orange).isSingle()   // false
Enum.item(fruits.apple | fruits.orange).isMultiple() // true

Enum.MAX_LENGTH // 32 or 64, the maximum count of items in an Enum instance. depends on the integer size of the system

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