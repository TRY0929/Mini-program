//app.js
const {Token} = require('./models/token')

App({
  onLaunch: function () {
    const token = wx.getStorageSync('token')
    if (!token) {
      Token.getToken()
    }
  }
})
