import ExtException from './ExtException';

export default class Action {
  _stat = {};
  result;
  _name;
  _group;
  _begin;
  _end;
  _time = 0;

  constructor (name = undefined, group = 'other', begin = true) {
    this._name = name;
    this._group = group;
    if (begin) {
      this.setBegin();
    }
  }

  addStat (data) {
    try {
      let _stat;
      if (data instanceof Action) {
        _stat = data.getStat();
      } else {
        if (data && (Object.prototype.hasOwnProperty.call(data, 'result') || Object.prototype.hasOwnProperty.call(data, '_stat'))) {
          _stat = data['_stat'];
        } else {
          return data;
        }
      }
      if (_stat) {
        for (let group in _stat) {
          if (Object.prototype.hasOwnProperty.call(_stat, group)) {
            for (let action in _stat[group]) {
              if (Object.prototype.hasOwnProperty.call(_stat[group], action)) {
                this.updateStat(group, action, _stat[group][action])
              }
            }
          }
        }
      }
      return data.result;
    } catch (err) {
      return data;
    }
  }

  setBegin () {
    this._begin = new Date();
  }

  setEnd (result = undefined) {
    this._end = new Date();
    if (!this._begin) {
      this._begin = this._end;
    }
    let totalTime = this._end - this._begin;
    if (result !== undefined) {
      this.result = result;
    }
    if (this._name) {
      this.updateStat(this._group, this._name, { count: 1, time: totalTime - this._time });
    }
    return this;
  }

  updateStat (group, action, stat) {
    if (group === 'other') {
      group = this._group;
    }
    this._time += stat['time'];
    if (Object.prototype.hasOwnProperty.call(this._stat, group)) {
      if (Object.prototype.hasOwnProperty.call(this._stat[group], action)) {
        this._stat[group][action]['count'] += stat['count'];
        this._stat[group][action]['time'] += stat['time'];
      } else {
        this._stat[group][action] = stat;
      }
    } else {
      this._stat[group] = { [action]: stat };
    }
  }

  getStat () {
    return this._stat;
  }

  getException (extErrorParam) {
    extErrorParam['action'] = this._name;
    return new ExtException(extErrorParam);
  }
}
