/**
 * Created by schwarzkopfb on 15/8/21.
 */

function arrayEqual(arr1, arr2) {
    if(!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length)
        return false

    for(var i = 0, l = arr1.length; i < l; i++)
        if(!~arr2.indexOf(arr1[ i ]))
            return false

    return true
}

exports.arrayEqual = arrayEqual

function indexOfObjectInArray(obj, arr) {
    for(var i = 0, l = arr.length; i < l; i++)
        if(objectEqual(obj, arr[i]))
            return i

    return -1
}

function arrayDeepEqual(arr1, arr2) {
    if(!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length)
        return false

    for(var i = 0, l = arr1.length; i < l; i++)
        if(!~indexOfObjectInArray(arr1[ i ], arr2))
            return false

    return true
}

exports.arrayDeepEqual = arrayDeepEqual

function objectEqual(obj1, obj2) {
    if(!(obj1 instanceof Object) || !(obj2 instanceof Object) || Object.keys(obj1).length !== Object.keys(obj2).length)
        return false

    for(var key in obj1)
        if(obj1.hasOwnProperty(key) && obj1[ key ] !== obj2[ key ])
            return false

    return true
}

exports.objectEqual = objectEqual