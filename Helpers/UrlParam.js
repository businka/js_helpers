export default class UrlParam {
  param = {}

  constructor() {
    this.parseUrl()
  }

  parseUrl() {
    let _location = decodeURI(location.search)
    let pos = _location.indexOf("?");
    if (pos !== -1) {
      let query = _location.substr(pos + 1);
      let result = {};
      query.split("&").forEach(function (param) {
        if (!param) return;
        let _param = param.split("=");
        if (!_param) return;
        result[_param[0]] = _param[1];
      });
      this.param = result;
    }
  }

  get(name, def) {
    return Object.prototype.hasOwnProperty.call(this.param, name) ? decodeURI(this.param[name]) : def;
  }

  add(name, value) {
    this.param[name] = value;
    this.updateUrl();
  }

  del(name) {
    delete this.param[name];
    this.updateUrl();
  }

  updateUrl() {
    let param = '';
    for (let key in this.param)
      if (Object.prototype.hasOwnProperty.call(this.param, key)) {
        param += param ? '&' : '?';
        param += key + "=" + this.param[key];
      }
    window.history.pushState(null, null, param);
  }
}

export function navigate (url) {
  url = decodeURIComponent(url)
  const dest_url = window.location.origin + url
  if ('/?#'.indexOf(url[0]) === -1) {
    throw new Error(`Bad url for redirect: ${dest_url}`)
  }
  window.location.href = dest_url
}
