const {config} = require('../config')
// import { Base64 } from 'js-base64'
const {Base64} = require('js-base64')
const tips = {
  1: '抱歉，出现了一个错误',
  10001: '参数错误',
  10002: '资源不存在'
}

class Http {
  request ({url, method='GET', data={}}) {
    return new Promise((resolve, reject) => {
      this._request(method, url, data, resolve, reject)
    })
  }

  _request (method, url, data, resolve, reject) {
    wx.request({
      method,
      url: `${config.APP_BASE_URL}${url}`,
      data,
      header: {
        'content-type': 'application/json',
        Authorization: this._encode()
      },
      success: (res) => {
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
          resolve(res.data)
        } else {
          this._show_error(res.data.error_code)
          reject && reject()
        }
      }
    })
  }

  _show_error (errorCode) {
    if (!errorCode || !tips[errorCode]) {
      errorCode = 1
    }
    const tip = tips[errorCode]
    wx.showModal({
      title: '错误',
      content: tip ? tip : tips[1]
    })
  }

  _encode () {
    const token = wx.getStorageSync('token')
    if (token) {
      return 'Basic ' + Base64.encode(token + ':')
    }
    return ""
  }
}

module.exports = {Http}