<a name="Enum"></a>
## Enum
Enum

**Kind**: global class  

* [Enum](#Enum)
  * [new Enum(descriptor, [options])](#new_Enum_new)
  * [.valueOf(n)](#Enum+valueOf) ⇒ <code>\*</code>
  * [.keyOf(n)](#Enum+keyOf) ⇒ <code>\*</code>
  * [.valuesOf(n)](#Enum+valuesOf) ⇒ <code>\*</code>
  * [.keysOf(n)](#Enum+keysOf) ⇒ <code>\*</code>

<a name="new_Enum_new"></a>
### new Enum(descriptor, [options])
Class representing a custom enumerated type containing the specified items given to the constructor.


| Param | Type | Description |
| --- | --- | --- |
| descriptor | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> &#124; <code>Object</code> | An array, object or set of string arguments specifying the elements of this instance. |
| [options] | <code>Object</code> | An object containing options about the desired behaviour of this instance. |

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
var colors   = Enum({ red: 1, green: 2 })
    selected = colors.red | colors.green

colors.valueOf(selected) // 1
```
<a name="Enum+keyOf"></a>
### enum.keyOf(n) ⇒ <code>\*</code>
Returns associated key from an integer representing an Enum element.
If value contains more than one element, it'll return the first one.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>Number</code> | An integer value that specifies one or more elements of this Enum type. |

**Example**  
```js
var colors   = Enum({ red: 1, green: 2 })
    selected = colors.red | colors.green

colors.valueOf(selected) // 'red'
```
<a name="Enum+valuesOf"></a>
### enum.valuesOf(n) ⇒ <code>\*</code>
Returns an array of associated values from an integer representing one or more Enum elements.

**Kind**: instance method of <code>[Enum](#Enum)</code>  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>Number</code> | An integer value that specifies one or more elements of this Enum type. |

**Example**  
```js
var colors   = Enum({ red: 1, green: 2 })
    selected = colors.red | colors.green

colors.valueOf(selected) // [ 1, 2 ]
```
<a name="Enum+keysOf"></a>
### enum.keysOf(n) ⇒ <code>\*</code>
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
