module.exports = {
    objHasOwnProperty,
    isEmptyObject,
    getType,
    updateObject,
    getPropValueByPath,
    copyTextToClipboard,

}

function getJsonType(value) {
    const legal = ['string', 'number', 'object', 'array', 'boolean', 'null', 'undefined']
    let node_type = typeof value;
    if (node_type === 'object') {
        if (value instanceof Array) {
            node_type = 'array';
        } else if (node_type === null) {
            node_type = 'null';
        }
    }
    if (legal.indexOf(node_type) < 0)
        throw new Error(`Bad type ${node_type} value ${value}`)
    return node_type;
}

function isEmptyObject(obj) {
    if (!obj) return true

    for (let elem in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, elem)) {
            return false
        }
    }
    return true
}

function objHasOwnProperty(obj, prop) {
    if (!obj || !prop)
        return false
    return Object.prototype.hasOwnProperty.call(obj, prop)
}

function getType(value) {
    let baseType = typeof value
    switch (typeof value) {
        case 'object':
            if (value instanceof Array)
                return 'array'
            else if (value === null)
                return 'null'
            return 'object'
        case 'symbol':
            return 'string'
        default:
            return baseType
    }
}

function _updateObject(base, source, path) {
    if (isEmptyObject(source))
        return base
    for (let elem in source) {
        if (!Object.prototype.hasOwnProperty.call(source, elem))
            continue
        let elemType
        try {
            elemType = getJsonType(source[elem])
        } catch (err) {
            throw new Error(`In object ${path} ${err}`)
        }
        switch (elemType) {
            case 'object':
                if (!objHasOwnProperty(base, elem)) {
                    base[elem] = {}
                }
                _updateObject(base[elem], source[elem], `${path}.${elem}`)
                break;
            case 'array':
                // if (!objHasOwnProperty(base, elem)) {
                //   base[elem] = []
                // }
                // base[elem] = base[elem].concat(source[elem])
                base[elem] = []
                base[elem] = base[elem].concat(source[elem])
                break;
            default:
                base[elem] = source[elem]
        }
    }
    return base
}

function updateObject(base, ...sources) {
    if (!sources.length)
        return base
    for (let i = 0; i < sources.length; i++) {
        _updateObject(base, sources[i])
    }
    return base
}


function getPropValueByPath(obj, path, def) {
    try {
        if (!path) {return obj}
        let _obj = obj
        let _path = path.split('.')
        let i
        for (i = 0; i < _path.length; i++) {
            if (Object.prototype.hasOwnProperty.call(_obj, _path[i])) {
                _obj = _obj[_path[i]]
            } else {
                return def
            }
        }
        return _obj
    } catch (e) {
        return def
    }
}

function fallbackCopyTextToClipboard(text, errorSelector = null) {
    const textArea = document.createElement("textarea");
    const errorContainer = document.querySelector(errorSelector) || document.body
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    errorContainer.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        // let msg = successful ? 'successful' : 'unsuccessful';
        // console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        alert(`Fallback: Oops, unable to copy ${err}`);
        //console.error('Fallback: Oops, unable to copy', err);
    }

    errorContainer.removeChild(textArea);
}

function copyTextToClipboard(text, errorSelector = null) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text, errorSelector);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        // console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        alert(`Async: Could not copy text: ${err}`);
        // console.error('Async: Could not copy text: ', err);
    });
}
