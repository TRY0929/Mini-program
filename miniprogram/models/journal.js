const {Http} = require('../utils/http')

class JournalModel extends Http {
  getLatest () {
    return this.request({
      url: '/journal/latest',
      method: 'GET'
    }).then(res => {
      return res
    })
  }
  getPrev(index) {
    return this.request({
      url: `/journal/prev/${index-1}`,
      method: 'GET'
    }).then(res => {
      return res
    })
  }
  getNext(index) {
    return this.request({
      url: `/journal/next/${index+1}`,
      method: 'GET'
    }).then(res => {
      return res
    })
  }
}

module.exports = {
  JournalModel
}