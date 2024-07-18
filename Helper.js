import {findByKey} from "./ArrayHelper";

export default class Helper {
    static objGetPathValue(obj, objPath, delimiter) {
        let _path
        if (typeof objPath === 'string' || objPath instanceof String) {
            if (delimiter) {
                _path = objPath.split(delimiter)
            } else {
                _path = [objPath]
            }
        }
        let _obj = obj
        try {
            let i = 0
            const size = _path.length
            while (i < size) {
                const elem = _path[i]
                if (obj instanceof Object) {
                    _obj = _obj[elem]
                } else if (Array.isArray(_obj)) {
                    if (Number.isInteger(elem)) {
                        _obj = _obj[elem]
                    } else {
                        const index = findByKey(_obj, _path[i + 1], elem)
                        if (index >= 0) {
                            _obj = _obj[index]
                            i += 1
                        } else {
                            return null
                        }
                    }
                }
                if (!_obj) {
                    break
                }
                i += 1
            }
            return _obj
        } catch (e) {
            if (obj) {
                throw new Error('obj_get_path_value: not object')
            } else {
                throw new Error('Object obj_get_path_value: not defined')
            }
        }
    }

    static copyViaJson(config) {
        return JSON.parse(JSON.stringify(config))
    }
}
