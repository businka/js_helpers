import {isEmptyObject} from "./BaseHelper";


const codes = {};

export class ExtException extends Error {
    name = 'ExtException'
    code;
    message;
    detail;
    action;
    dump;
    new_msg;
    stack2;

    constructor(param) {
        super('');
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = 100;
        this.message = '';
        this.detail = '';
        this.action = '';
        this.dump = {};
        this.stack2 = []; // todo добавить trace через new Error.stack
        this.new_msg = false;
        if (typeof param != 'object') {
            this.message = `Bad init ExtException (${param})`
        }
        const parent = param.parent;
        if (parent) {
            if ((parent instanceof Error && !(parent instanceof ExtException)) || parent instanceof DOMException) {

                if (parent.message && parent.message[0] === '{') {
                    this.initFromExtException(JSON.parse(parent.message), param)
                } else {
                    this.code = 3000;
                    this.message = parent.message || String(parent);
                    if (!Object.prototype.hasOwnProperty.call(param, 'dump')) {
                        param['dump'] = {}
                    }
                    param['dump']['trace'] = String(parent.stack).split('\n')[1]
                }

            }
            if (parent instanceof ExtException) {
                this.initFromExtException(parent, param)
            }
            this.new_msg = Object.prototype.hasOwnProperty.call(param, 'message');
        }
        this._initFromDict(param);
        if (param.code) {
            this.code = param.code;
            this.message = param.message ? param.message : codes[param.code] || 'Неизвестная ошибка';
        }
    }

    _initFromDict(data) {
        let i,
            names = ['code', 'message', 'detail', 'action', 'dump'];
        for (i = 0; i < 6; i++) {
            if (Object.prototype.hasOwnProperty.call(data, names[i]) && data[names[i]] !== undefined) {
                this[names[i]] = data[names[i]];
            }
        }
        if (Object.prototype.hasOwnProperty.call(data, 'stack') && data['stack'] !== undefined) {
            this['stack2'] = data['stack'];
        }
    }

    initFromExtException(parent, param) {
        this.add_parent_to_stack(parent, param);
        this.message = parent.message;
        this.code = parent.code;
        this.detail = parent.detail;
        this.stack2 = parent.stack2;
    }

    add_parent_to_stack(parent, param) {
        if (!(parent instanceof ExtException)) {
            return;
        }
        this.stack2 = this.stack2.concat(parent.stack2);
        if (!parent.action && !parent.dump && !param.detail) {
            return;
        }
        let _stack = {}
        // _stack.parent.stack
        if (parent.action) {
            _stack.action = parent.action
        }

        if (this.new_msg) {
            _stack.messsge = parent.message;
        }

        if (parent.detail && param.detail) {
            _stack.detail = parent.detail;
        }
        if (!isEmptyObject(parent.dump)) {
            _stack['dump'] = parent.dump;
        }
        this.stack2.push(_stack);

    }

    addToStack(action, dump) {
        if (action) {
            const stack = {
                action
            };
            if (!isEmptyObject(dump)) {
                stack['dump'] = dump;
            }
            this.stack2.push(stack);
        }
    }

    toDict() {
        return {
            message: this.message,
            detail: this.detail,
            action: this.action,
            dump: this.dump,
            code: this.code,
            stack: this.stack2
        }

    }

    toString() {
        return JSON.stringify(this.toDict());
    }
}

export default ExtException

