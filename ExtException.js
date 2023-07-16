import {isEmptyObject} from "./BaseHelper";


export class ExtException extends Error {

    constructor({message, detail, parent, action, dump = {}, stack2 = []} = {}) {
        super('');
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = 100
        this.message = message
        this.detail = detail
        this.action = action
        this.dump = dump
        console.log(stack2)
        this.stack2 = stack2 // todo добавить trace через new Error.stack
        this.new_msg = !!message
        if (parent) {
            if (parent instanceof ExtException) {
                this.add_parent_to_stack(parent)
                if (!this.message) {
                    this.message = parent.message
                    this.detail = parent.detail
                    this.code = parent.code
                    this.dump = parent.dump
                }
            } else if (parent instanceof Error || parent instanceof DOMException) {
                if (!this.message) {
                    this.message = 'Unknown error'
                }
                if (!this.detail) {
                    this.detail = String(parent)
                }

                this.stack2.push({
                    'message': String(parent),
                    'trace': String(parent.stack).split('\n')[1]
                })

            }
            // if (parent instanceof ExtException) {
            //     this.initFromExtException(parent, param)
            // }
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
            stack: this.stack2,
            __name__: this.constructor.name
        }

    }

    toString() {
        return JSON.stringify(this.toDict());
    }
}

export default ExtException

