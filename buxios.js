import axios from 'axios'
import {redirectToSignIn, getAppUrl} from '../BubotCore/components/Session/session'
import {navigate} from './UrlParam'
import ExtException from './ExtException'

export default {
    post: async function (url, data, config) {
        try {
            return await axios.post(url, data, config)
        } catch (err) {
            processError(err.response)
        }
    },
    get: async function (url, config) {
        try {
            return await axios.get(url, config)
        } catch (err) {
            processError(err.response)
        }
    }
}

function processError(response) {

    let contentType = undefined
    if (response.headers) {
        contentType = response.headers['content-type']
    }
    let destPath
    let url = getAppUrl()
    switch (response.status) {
        case 401:
            redirectToSignIn(window.location.pathname + window.location.search)
            break
        case 409:
            destPath = `${url.base}${url.appName}Account/select`
            if (destPath !== window.location.pathname)
                navigate(`${destPath}?redirect=${url.base}${url.appName}${url.path}${window.location.search}`)
            break
    }
    if (contentType && contentType.toLowerCase().indexOf('application/json') >= 0) {
        throw  new ExtException(response.data)
    } else {
        throw(new ExtException({
            message: `${response.status} ${response.statusText}`,
            detail: response.data
        }))
    }
}
