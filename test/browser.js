/**
 * Created by schwarzkopfb on 15/8/25.
 */

var utils,
    exports = {},
    global  = window

utils = exports

var require = function (name) {
    switch(name) {
        case '../enumerated':
            return window.Enum
            break

        case 'assert':
            var assert = function (value, message) {
                if(message)
                    document.write('<span style="color: ' + (value ? 'green' : 'red') + '">' + message + '</span></br>')

                if(!value)
                    passed--
            }

            assert.equal = function (value1, value2, message) {
                assert(value1 === value2, message)
            }

            assert.throws = function (fn, message) {
                var err

                try {
                    fn()
                }
                catch(ex) {
                    err = ex
                }

                assert(err,  message)
            }

            return assert
            break

        case './utils':
            return utils
            break

        default: break
    }
}