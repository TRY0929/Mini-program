const {Http} = require('../utils/http')
const {config} = require('../config')

class Token extends Http {
  static getToken () {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: `${config.APP_BASE_URL}/token`,
            method: 'POST',
            data: {
              account: res.code,
              type: 100
            },
            success: (res) => {
              const statusCode = res.statusCode.toString()
              if (statusCode.startsWith('2')) {
                const token = res.data
                wx.setStorageSync('token', token)
              }
            }
          })
        }
      },
    })
  }
}

module.exports = {
  Token
}