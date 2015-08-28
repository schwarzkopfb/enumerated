## Modules
<dl>
<dt><a href="#module_enumerated">enumerated</a></dt>
<dd><p>A simple, lightweight, easy-to-use and high performance implementation of enumerated type for JavaScript.</p>
</dd>
</dl>
## Classes
<dl>
<dt><a href="#Enum">Enum</a></dt>
<dd></dd>
</dl>
<a name="module_enumerated"></a>
## enumerated
A simple, lightweight, easy-to-use and high performance implementation of enumerated type for JavaScript.

**Author:** Schwarzkopf Balázs <schwarzkopfb@icloud.com>  
<a name="Enum"></a>
## Enum
**Kind**: global class  

* [Enum](#Enum)
  * [new Enum(descriptor, [options])](#new_Enum_new)
  * _instance_
    * [.keys](#Enum+keys) : <code>Array.&lt;String&gt;</code>
    * [.values](#Enum+values) : <code>Array.&lt;String&gt;</code>
    * [.items](#Enum+items) : <code>Array.&lt;{key:String, value: \*}&gt;</code>
    * [.length](#Enum+length) : <code>Number</code>
    * [.valueOf(n)](#Enum+valueOf) ⇒ <code>\*</code>
    * [.keyOf(n)](#Enum+keyOf) ⇒ <code>String</code>
    * [.valuesOf(n)](#Enum+valuesOf) ⇒ <code>Array</code>
    * [.keysOf(n)](#Enum+keysOf) ⇒ <code>Array</code>
    * [.valueByKey(key)](#Enum+valueByKey) ⇒ <code>\*</code>
    * [.valuesByKeys(keys)](#Enum+valuesByKeys) ⇒ <code>Array</code>
    * [.keyByValue(value)](#Enum+keyByValue) ⇒ <code>String</code>
    * [.keysByValues(values)](#Enum+keysByValues) ⇒ <code>Array.&lt;String&gt;</code>
    * [.fromValue(value)](#Enum+fromValue) ⇒ <code>Number</code>
    * [.fromValues(value)](#Enum+fromValues) ⇒ <code>Number</code>
    * [.fromKey(key)](#Enum+fromKey) ⇒ <code>Number</code>
    * [.fromKeys(value)](#Enum+fromKeys) ⇒ <code>Number</code>
    * [.item(key)](#Enum+item) ⇒ <code>Object</code>
    * [.get(key)](#Enum+get) ⇒ <code>Object</code>
    * [.fromJSON(value)](#Enum+fromJSON) ⇒ <code>Number</code>
    * [.toJSON([value])](#Enum+toJSON) ⇒ <code>Object</code> &#124; <code>Array</code>
    * [.switch(on)](#Enum+switch) ⇒ <code>Object</code>
    * [.inspect()](#Enum+inspect) ⇒ <code>String</code>
    * [.toString()](#Enum+toString) ⇒ <code>String</code>
  * _static_
    * [.MAX_LENGTH](#Enum.MAX_LENGTH) : <code>Number</code>
    * [.global](#Enum.global) : <code>Boolean</code>
    * [.fromJSON(value)](#Enum.fromJSON) ⇒ <code>[Enum](#Enum)</code>
    * [.item(item)](#Enum.item) ⇒ <code>Object</code>
    * [.switch(on)](#Enum.switch) ⇒ <code>Object</code>

<a name="new_Enum_new"></a>
### new Enum(descriptor, [options])
Class representing a custom enumerated type containing the specified items given to the constructor.


| Param | Type | Description |
| --- | --- | --- |
| descriptor | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> &#124; <code>Object</code> | An array, object or set of string arguments specifying the elements of this instance. |
| [options] | <code>Object</code> | An object containing options about the desired behaviour of this instance. |
| options.ignoreCase | <code>Boolean</code> | If set to true, this instance will ignore case of the keys of its elements. |
| options.single | <code>Boolean</code> | If set to true, this instance will not be flaggable. |

**Example**  
```js
var colors  = new Enum('red', 'green', 'blue'),
    numbers = Enum({ one: 1, two: 2, three: 3 }) // new operator is optional

var selectedColors = colors.red | colors.blue

colors.keysOf(selectedColors) // [ 'red', 'blue' ]
colors.valuesOf(selectedColors) // [ 'red', 'blue' ]

selectedColors |= colors.green // extend selectedColors with colors.green

colors.keysOf(selectedColors) // [ 'red', 'green', 'blue' ]

selectedColors ^= colors.red // remove colors.red from selectedColors

colors.keysOf(selectedColors) // [ 'green', 'blue' ]

selectedColors ^= colors.green | colors.blue // remove colors.green and colors.blue from selectedColors in one step

colors.keysOf(selectedColors) // []

// not flaggable enum

var state        = Enum('initial', 'pending', 'processing', 'finished', { single: true }),
    currentState = state.processing

state.valueOf(currentState) // 'processing'

currentState |= state.finished // extend currentState with state.finished

state.valueOf(currentState) // throws Error('This enum allows only one single choice.')

// case insensitive enum

var days = Enum('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', { ignoreCase: true })

days.get('monday') // { key: 'monday', value: 'Monday' }
days.get('fRiDaY') // { key: 'friday', value: 'Friday' }

// items will be accessible lowercased with the dot or index operator if ignoreCase option is set to true
var selectedDays = days.saturday | days['sunday']
```
<a name="Enum+keys"></a>
### enum.keys : <code>Array.&lt;String&gt;</code>
Get an array of keys of the elements in this Enum instance.

**Kind**: instance property of <code>[Enum](#Enum)</code>  
**Read only**: true  
**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.keys // [ 'red', 'green' ]
```
<a name="Enum+values"></a>
### enum.values : <code>Array.&lt;String&gt;</code>
Get an array of values of the elements in this Enum instance.

**Kind**: instance property of <code>[Enum](#Enum)</code>  
**Read only**: true  
**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.values // [ 1, 2 ]
```
<a name="Enum+items"></a>
### enum.items : <code>Array.&lt;{key:String, value: \*}&gt;</code>
Get an array of elements in this Enum instance.

**Kind**: instance property of <code>[Enum](#Enum)</code>  
**Read only**: true  
**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.items // [ { key: 'red', value: 1 }, { key: 'green', value: 2 } ]
```
<a name="Enum+length"></a>
### enum.length : <code>Number</code>
Get the count of elements in this Enum instance.

**Kind**: instance property of <code>[Enum](#Enum)</code>  
**Read only**: true  
**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.length // 2
```
<a name="Enum+valueOf"></a>
### enum.valueOf(n) ⇒ <code>\*</code>
Returns associated value from an integer representing an Enum element.
If value contains more than one element, it'll return the first one.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>Number</code> | An integer value that specifies one or more elements of this Enum type. |

**Example**  
```js
var colors   = Enum({ red: 1, green: 2 }),
    selected = colors.red | colors.green

colors.valueOf(selected) // 1
```
<a name="Enum+keyOf"></a>
### enum.keyOf(n) ⇒ <code>String</code>
Returns associated key from an integer representing an Enum element.
If value contains more than one element, it'll return the first one.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>Number</code> | An integer value that specifies one or more elements of this Enum type. |

**Example**  
```js
var colors   = Enum({ red: 1, green: 2 }),
    selected = colors.red | colors.green

colors.valueOf(selected) // 'red'
```
<a name="Enum+valuesOf"></a>
### enum.valuesOf(n) ⇒ <code>Array</code>
Returns an array of associated values from an integer representing one or more Enum elements.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>Number</code> | An integer value that specifies one or more elements of this Enum type. |

**Example**  
```js
var colors   = Enum({ red: 1, green: 2 }),
    selected = colors.red | colors.green

colors.valueOf(selected) // [ 1, 2 ]
```
<a name="Enum+keysOf"></a>
### enum.keysOf(n) ⇒ <code>Array</code>
Returns an array of associated keys from an integer representing one or more Enum elements.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>Number</code> | An integer value that specifies one or more elements of this Enum type. |

**Example**  
```js
var colors   = Enum({ red: 1, green: 2 })
    selected = colors.red | colors.green

colors.valueOf(selected) // [ 'red', 'green' ]
```
<a name="Enum+valueByKey"></a>
### enum.valueByKey(key) ⇒ <code>\*</code>
Returns associated value of an element of this Enum instance by its key.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type |
| --- | --- |
| key | <code>String</code> | 

**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.valueByKey('green') // 2
```
<a name="Enum+valuesByKeys"></a>
### enum.valuesByKeys(keys) ⇒ <code>Array</code>
Returns associated values of elements of this Enum instance by related keys.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type |
| --- | --- |
| keys | <code>Array.&lt;String&gt;</code> &#124; <code>String</code> | 

**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.valuesByKeys([ 'red', 'green' ]) // [ 1, 2 ]
colors.valuesByKeys('green', 'red')     // [ 2, 1 ]
```
<a name="Enum+keyByValue"></a>
### enum.keyByValue(value) ⇒ <code>String</code>
Returns associated key of an element of this Enum instance by its value.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type |
| --- | --- |
| value | <code>\*</code> | 

**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.keyByValue(2) // 'green'
```
<a name="Enum+keysByValues"></a>
### enum.keysByValues(values) ⇒ <code>Array.&lt;String&gt;</code>
Returns associated keys of elements of this Enum instance by related values.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type |
| --- | --- |
| values | <code>\*</code> &#124; <code>Array</code> | 

**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.keysByValues([ 1, 2 ]) // [ 'red', 'green' ]
colors.keysByValues(1, 2) // [ 'red', 'green' ]
```
<a name="Enum+fromValue"></a>
### enum.fromValue(value) ⇒ <code>Number</code>
Returns an integer representing one element of this Enum instance by related value.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value of the chosen element. |

**Example**  
```js
var colors  = Enum({ red: 1, green: 2 }),
    colors2 = Enum('red', 'green')

colors.fromValue(1) // 1, because 2^0=1, so 1 represents the first element of the enum
colors2.fromValue('green') // 2, because 2^1=2, so 2 represents the second number of the enum

colors.keysOf(colors.fromValue(1) | colors.fromValue(2)) // [ 'red', 'green' ]
```
<a name="Enum+fromValues"></a>
### enum.fromValues(value) ⇒ <code>Number</code>
Returns an integer representing one or more elements of this Enum instance by related values.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> &#124; <code>Array</code> | The values of the chosen elements. |

**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.fromValues([ 1, 2 ]) // 3, because 2^0 | 2^1 = 3, so 3 represents the first and second elements of the enum
colors.fromValues(1, 2) // 3, same as previous

colors.keysOf(colors.fromValues(1, 2)) // [ 'red', 'green' ]
```
<a name="Enum+fromKey"></a>
### enum.fromKey(key) ⇒ <code>Number</code>
Returns an integer representing one element of this Enum instance by related key.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key of the chosen element. |

**Example**  
```js
var colors  = Enum({ red: 1, green: 2 }),
    colors2 = Enum('red', 'green')

colors.fromKey('red') // 1, because 2^0=1, so 1 represents the first element of the enum
colors2.fromKey('green') // 2, because 2^1=2, so 2 represents the second number of the enum

colors.valuesOf(colors.fromKey('red') | colors.fromKey('green')) // [ 1, 2 ]
```
<a name="Enum+fromKeys"></a>
### enum.fromKeys(value) ⇒ <code>Number</code>
Returns an integer representing one or more elements of this Enum instance by related keys.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> | The keys of the chosen elements. |

**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.fromKeys([ 'red', 'green' ]) // 3, because 2^0 | 2^1 = 3, so 3 represents the first and second elements of the enum
colors.fromKeys('red', 'green') // 3, same as previous

colors.valuesOf(colors.fromKeys('red', 'green')) // [ 1, 2 ]
```
<a name="Enum+item"></a>
### enum.item(key) ⇒ <code>Object</code>
Returns an object representing one element of this Enum instance by related key or index.
The returned object has three members:
- 'key': the key of the element
- 'value': the value of the element
- 'in': method to test item against an integer value representing elements of this enum

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> &#124; <code>Number</code> | The key or index of the chosen element. |

**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.item('red').value // 1
colors.item(1).key // 'green', because elements are indexed from zero

colors.item('red').in(colors.green | colors.red) // true
colors.item('green').in(colors.red) // false
```
<a name="Enum+get"></a>
### enum.get(key) ⇒ <code>Object</code>
Returns an object representing one element of this Enum instance by related key or index.
The returned object has three members:
- 'key': the key of the element
- 'value': the value of the element

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> &#124; <code>Number</code> | The key or index of the chosen element. |

**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.get('red').value // 1
colors.get(1).key // 'green', because elements are indexed from zero
```
<a name="Enum+fromJSON"></a>
### enum.fromJSON(value) ⇒ <code>Number</code>
Returns an integer representing one or more elements of this Enum instance from a JSON serialized enum value.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> &#124; <code>Object</code> | JSON serialized enum value. |

**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.fromJSON('[1,2]') // 3, because 2^0 | 2^1 = 3, so 3 represents the first and second elements of the enum
colors.fromJSON([ 2 ]) // 2, because 2^1 = 2, so 2 represents the second element of the enum
```
<a name="Enum+toJSON"></a>
### enum.toJSON([value]) ⇒ <code>Object</code> &#124; <code>Array</code>
Returns the JSON serialised extraction of the Enum instance or value.
If there is a value passed to this method then the extraction will represent that value instead of the Enum instance itself.
The value should be restored later with Enum.fromJSON() or the fromJSON() method of the same Enum instance that created the serialised output.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [value] | <code>Number</code> | The value containing one or more elements of this enum. |

**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.toJSON() // { descriptor: { red: 1, green: 2 }, options: { ignoreCase: false, single: false } }
colors.toJSON(colors.green) // [ 2 ]

colors = Enum('red', 'green', { single: true })

var serialisedColors = colors.toJSON() // { descriptor: { red: 'red', green: 'green' }, options: { ignoreCase: false, single: true } }
var serialisedValueOfColors = colors.toJSON(colors.green) // [ 'green' ]

Enum.fromJSON(serialisedColors) // Enum('red', 'green', { single: true })
colors.fromJSON(serialisedValueOfColors) // colors.green = 2, because 2^1 = 2, so 2 represents the second element of the enum
```
<a name="Enum+switch"></a>
### enum.switch(on) ⇒ <code>Object</code>
Returns an object that have a member called 'case'. You can emulate a switch statement for flagged enums with this helper method.
The 'case' method supports chaining.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| on | <code>Number</code> | An integer value representing one or more elements of this Enum instance to switch on. |

**Example**  
```js
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

//output:
//user likes apple
//user likes strawberry
//user likes banana
```
<a name="Enum+inspect"></a>
### enum.inspect() ⇒ <code>String</code>
Returns a pretty printed string representation of this Enum instance.
Useful when you pass this instance to console.log() which uses inspect() method to display an object if possible.

**Kind**: instance method of <code>[Enum](#Enum)</code>  
**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.inspect()

//output:
//Enum({
//    "red": 1,
//    "green": 2
//})
```
<a name="Enum+toString"></a>
### enum.toString() ⇒ <code>String</code>
Override Object.prototype.toString() for Enum instances. Returns '[object Enum]'.

**Kind**: instance method of <code>[Enum](#Enum)</code>  
**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

colors.toString() // '[object Enum]'
```
<a name="Enum.MAX_LENGTH"></a>
### Enum.MAX_LENGTH : <code>Number</code>
Get maximum count of elements in an Enum instance in the current environment.

**Kind**: static property of <code>[Enum](#Enum)</code>  
**Read only**: true  
**Example**  
```js
Enum.MAX_LENGTH // 31 or 63 depending on the integer size of the system
```
<a name="Enum.global"></a>
### Enum.global : <code>Boolean</code>
Set it true to expose Enum constructor to the global context.

**Kind**: static property of <code>[Enum](#Enum)</code>  
**Example**  
```js
require('enumerated').global = true

// from this point Enum constructor has been exposed to the global context,
// so feel free to use it anywhere

var colors = Enum('red', 'green')
```
<a name="Enum.fromJSON"></a>
### Enum.fromJSON(value) ⇒ <code>[Enum](#Enum)</code>
Instantiates an Enum from a JSON serialised representation of it. Designed to work with the output of Enum().toJSON().

**Kind**: static method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> &#124; <code>Object</code> | JSON serialized enum. |

**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

var json = colors.toJSON() // { descriptor: { red: 1, green: 2 }, options: { ignoreCase: false, single: false } }

Enum.fromJSON(json) // Enum({ red: 1, green: 2 }, { ignoreCase: false, single: false })

json = JSON.stringify(colors) // '{"descriptor":{"red":1,"green":2},"options":{"ignoreCase":false,"single":false}}

Enum.fromJSON(json) // Enum({ red: 1, green: 2 }, { ignoreCase: false, single: false })
```
<a name="Enum.item"></a>
### Enum.item(item) ⇒ <code>Object</code>
Returns an object representing one element of an Enum instance by an integer value.
The returned object has three members:
- 'isSingle': method to check if the passed value is single
- 'isMultiple': method to check if the passed value is flagged
- 'in': method to test item against an integer value representing elements of the enum

**Kind**: static method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>Number</code> | The integer number representing one or more elements of an enum. |

**Example**  
```js
var colors = Enum({ red: 1, green: 2 })

Enum.item(colors.red).isSingle() // true
Enum.item(colors.red).isMultiple() // false
Enum.item(colors.red | colors.green).isSingle() // false
Enum.item(colors.red | colors.green).isMultiple() // true
Enum.item(colors.red).in(colors.red | colors.green) // true
Enum.item(colors.red).in(colors.green) // false
Enum.item(colors.red).in(colors.red) // true
```
<a name="Enum.switch"></a>
### Enum.switch(on) ⇒ <code>Object</code>
Returns an object that have a member called 'case'. You can emulate a switch statement for flagged enums with this helper method.
The 'case' method supports chaining.

**Kind**: static method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| on | <code>Number</code> | An integer value representing one or more elements of an enum to switch on. |

**Example**  
```js
var fruits      = Enum('apple', 'orange', 'strawberry', 'lemon', 'banana'),
    likedFruits = fruits.apple | fruits.strawberry | fruits.banana

Enum.switch(likedFruits)
      .case(fruits.apple, function() { console.log('user likes apple') })
      .case(fruits.orange, function() { console.log('user likes orange') })
      .case(fruits.strawberry, function() { console.log('user likes strawberry') })
      .case(fruits.lemon, function() { console.log('user likes lemon') })
      .case(fruits.banana, function() { console.log('user likes banana') })

//output:
//user likes apple
//user likes strawberry
//user likes banana
```
