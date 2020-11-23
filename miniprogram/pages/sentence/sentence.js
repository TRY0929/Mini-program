// pages/sentence/sentence.js
const {JournalModel} = require('../../models/journal')
const journalModel = new JournalModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latest: null,
    first: false,
    last: true,
    total: 0
  },

  prevJournal () {
    const total = this.data.total
    const index = this.data.latest.index
    if (index !== 1)  {
      journalModel.getPrev(index)
      .then(res => {
        this.setData({
          latest: res,
          first: res.index === 1,
          last: res.index === total
        })
      })
    }
  },

  nextJournal () {
    const total = this.data.total
    const index = this.data.latest.index
    if (index !== total) {
      journalModel.getNext(index)
      .then(res => {
        this.setData({
          latest: res,
          first: res.index === 1,
          last: res.index === total
        })
      })
    }
  },

  onClock () {
    wx.navigateTo({
      url: '/pages/clock/clock'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    journalModel.getLatest().then(res => {
      this.setData({
        latest: res,
        total: res.index
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})