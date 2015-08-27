## Modules
<dl>
<dt><a href="#module_enumerated">enumerated</a></dt>
<dd><p>A simple, lightweight, easy-to-use and high performance implementation of enumerated type for JavaScript.</p>
</dd>
</dl>
## Classes
<dl>
<dt><a href="#Enum">Enum</a></dt>
<dd><p>Enum</p>
</dd>
</dl>
<a name="module_enumerated"></a>
## enumerated
A simple, lightweight, easy-to-use and high performance implementation of enumerated type for JavaScript.

**Author:** Schwarzkopf Balázs <schwarzkopfb@icloud.com>  
<a name="Enum"></a>
## Enum
Enum

**Kind**: global class  

* [Enum](#Enum)
  * [new Enum(descriptor, [options])](#new_Enum_new)
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
