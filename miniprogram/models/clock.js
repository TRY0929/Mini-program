const {Http} = require('../utils/http')

class ClockModel extends Http {
  queryUserClock () {
    return this.request({
      url: '/clock/query',
      method: 'GET'
    }).then(res => {
      return res
    })
  }

  setClock (year, month, date) {
    return this.request({
      url: '/clock',
      method: 'POST',
      data: {
        year,
        month,
        date
      }
    })
  }
}

module.exports = {
  ClockModel
}