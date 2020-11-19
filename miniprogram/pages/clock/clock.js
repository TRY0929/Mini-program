// miniprogram/pages/clock/clock.js
const {ClockModel} = require('../../models/clock')
const clockModel = new ClockModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentYear: 0, // 年
    currentMonth: 0, // 月
    currentDate: 0, // 日
    currentDay: 0, // 星期几
    checkStatus: {}, // 用户的打卡信息
    week: ['日', '一', '二', '三', '四', '五', '六'],
    days: [], // 放着这个月每天的打卡信息
    day: [], // 放着近七天的打卡信息
    sysW: 0,
    hasEmptyGrid: false, // 最开始有没有空着的
    emptyGrids: [],
    date: {},
    showCalender: 'none',
    judgeCurrentMonth: true, // 判断现在展示的是不是当前这个月份
    clocked: false, // 今天有没有打卡
    showPopup: false,
    continuityDays: 0,
    totalDays: 0
  },

  // 切换签过到的地方 显示文字还是图片 日历里
  toggleIconAndWord (e) {
    let index = e.currentTarget.dataset.index
    const days = this.data.days
    days[index].check = !days[index].check
    this.setData({
      days
    })
  },

  // 切换签过到的地方 显示文字还是图片 星期里
  toggleIconAndWordWeek (e) {
    let index = e.currentTarget.dataset.index
    const day = this.data.day
    day[index].check = !day[index].check
    this.setData({
      day
    })
  },

  // 打卡
  setClock () {
    const currentDate = this.data.currentDate
    this.setData({
      clocked: true
    })
    clockModel.setClock(this.data.currentYear, this.data.currentMonth, currentDate)
    this.showPopup()
    this.updateDaysAndDay(currentDate)
  },

  // 打卡之后更新 当前以有的数据
  updateDaysAndDay (currentDate) {
    const days = this.data.days
    days[currentDate - 1].src = '../../images/clock/daka.png'
    const day = this.data.day
    day.forEach(item => {
      if (item.date === currentDate) {
        item.src= '../../images/clock/daka.png'
      }
    })
    this.setData({
      days,
      day,
      continuityDays: this.data.continuityDays + 1,
      totalDays: this.data.totalDays + 1
    })
  },

  // 切换月份
  handleCalendar (e) {
    let currentMonth = this.data.currentMonth
    const handle = e.currentTarget.dataset.handle
    this.setData({
      currentMonth: handle==='prev' ? currentMonth-1 : currentMonth+1
    })
    this.setData({
      judgeCurrentMonth: this.data.currentMonth === new Date().getMonth() + 1
    })
    this.fixDate()
    this.initBeginEmpty()
    this.updateDays()
  },

  // 修改当前由于切换上下月可能造成的月份奇怪
  fixDate () {
    let currentMonth = this.data.currentMonth
    if (currentMonth === 0) {
      this.setData({
        currentYear: this.data.currentYear - 1,
        currentMonth: 12
      })
    } else if (currentMonth === 13) {
      this.setData({
        currentYear: this.data.currentYear + 1,
        currentMonth: 1
      })
    }
  },

  onShowCalender () {
    this.setData({
      showCalender: 'block'
    })
  },

  onHideCalender () {
    this.setData({
      showCalender: 'none'
    })
    this.recover()
  },

  recover () {
    this.initCurrent()
    this.updateDays()
    this.setData({
      judgeCurrentMonth: true
    })
  },

  showPopup () {
    this.setData({
      showPopup: true
    })
  },

  hidePopup () {
    this.setData({
      showPopup: false
    })
  },

  // 用当前年-月凑成一个字符串 用来查询的
  getYearMonthKey (year, month) {
    return `${year}-${month}`
  },

  // 获取某一天有没有打卡
  getDayClock (year, month, day) {
    const key = this.getYearMonthKey(year, month)
    const checkStatus = this.data.checkStatus[key]
    if (checkStatus) {
      const ans = checkStatus.filter(item => item.day === day)
      return ans.length > 0
    }
    return false
  },

  // 获取当前这一天前一天的年月日
  getPrevDay (year, month, day) {
    day--
    if (day <= 0) {
      month--
      if (month <= 0) {
        year--
        month = 12
      }
      day = this.getMonthDays(year, month)
    }
    return {
      year,
      month,
      day
    }
  },

  // 获取某年某月某日是星期几
  getDay (year, month, day) {
    return new Date(year, month - 1, day).getDay()
  },

  // 获取某年某月有多少天
  getMonthDays (year, month) {
    return new Date(year, month, 0).getDate()
  },

  // 更新现在显示的这个月的签到情况
  updateDays () {
    const year = this.data.currentYear
    const month = this.data.currentMonth
    const checkStatus = this.data.checkStatus

    const key = this.getYearMonthKey(year, month)
    const monthDays = this.getMonthDays(year, month)
    const days = []
    for (let i=1; i<=monthDays; i++) {
      days.push({
        date: i,
        src: '',
        check: false
      })
    }
    if (checkStatus[key]) {
      // 让打了卡的那一天显示图片
      checkStatus[key].forEach(item => {
        days[item.day - 1].src = '/images/clock/daka.png'
      })
    }
    this.setData({
      days
    })
  },

  // 以下全是初始化函数
  // 初始化当前日期
  initCurrent () {
    const date = new Date()
    const currentYear = date.getFullYear()
    const currentMonth = date.getMonth() + 1
    const currentDay = date.getDay()
    const currentDate = date.getDate()
    this.setData({
      date,
      currentYear,
      currentMonth,
      currentDay,
      currentDate
    })
  },

  // 初始化当前月份前面有几个空位置
  initBeginEmpty () {
    const year = this.data.currentYear
    const month = this.data.currentMonth
    const currentMonthBegin = this.getDay(year, month, 1)
    let emptyGrids = []
    if (currentMonthBegin > 0) {
      for (let i=0; i<currentMonthBegin; i++) {
        emptyGrids.push(i)
      }
      this.setData({
        hasEmptyGrid: true,
        emptyGrids
      })
    } else {
      this.setData({
        hasEmptyGrid: false,
        emptyGrids
      })
    }
  },

  // 初始化 月份 签到天数 没用数据库的时候就先全部变为0 后来从数据库里拿数据
  initDays () {
    return new Promise((resolve) => {
      const currentYear = this.data.currentYear
      const currentMonth = this.data.currentMonth
      let checkStatus = this.data.checkStatus
      // 发送api请求给后端去查数据库
      clockModel.queryUserClock()
      .then(res => {
        checkStatus = res
        this.setData({ 
          checkStatus
        })
        this.updateDays()
        if (resolve) resolve(checkStatus)
      })
    })
  },

  // 初始化 这一周 签到天数
  initDay () {
    let overMonth = 'no' // 标识这个星期是否横跨了一个月 后面查询签到情况的时候会用到
    const day = []
    const dates = []
    const currentMonth = this.data.currentMonth
    const currentYear = this.data.currentYear
    let thisMonthDays = this.getMonthDays(currentYear, currentMonth)
    let lastMonthDays
    let month, year

    let tmp = this.data.currentDate - this.data.currentDay
    if (tmp <= 0) {
      overMonth = 'prev'
      month = currentMonth - 1
      if (month < 1) {
        year = currentYear - 1
        month = 12
      }
      lastMonthDays = this.getMonthDays(year, month)
      tmp += lastMonthDays
    } else if (tmp + 7 > thisMonthDays) {
      overMonth = 'next'
      month = currentMonth + 1
      if (month > 12) {
        year = currentYear + 1
        month = 1
      }
    }

    let flag = false
    for (let i=0; i<7; i++) {
      dates.push(tmp++)
      // 上个月结束 这个月要开始了
      let src
      if (!flag && overMonth === 'prev' || flag && overMonth === 'next') {
        src = this.getDayClock(year, month, dates[i]) ? '../../images/clock/daka.png' : ''
      } else {
        src = this.getDayClock(currentYear, currentMonth, dates[i]) ? '../../images/clock/daka.png' : ''
      }
      if (overMonth === 'prev' && tmp > lastMonthDays || overMonth === 'next' && tmp > thisMonthDays) {
        tmp = 1
        flag = true
      }
      day.push({
        date: dates[i],
        src,
        check: false
      })
    }
    this.setData({
      day
    })
  },

  initClocked () {
    const clocked = this.getDayClock(this.data.currentYear, this.data.currentMonth, this.data.currentDate)
    this.setData({
      clocked: clocked ? true : false
    })
  },

  initContinuity () {
    let tmp = this.getPrevDay(this.data.currentYear, this.data.currentMonth, this.data.currentDate)
    let year = tmp.year
    let month = tmp.month
    let day = tmp.day
    let ans = this.data.clocked ? 1 : 0
    while(1) {
      if (this.getDayClock(year, month, day)) {
        ans++
        tmp = this.getPrevDay(year, month, day)
        year = tmp.year
        month = tmp.month
        day = tmp.day
      } else {
        break
      }
    }
    this.setData({
      continuityDays: ans
    })
  },

  initTotalDays () {
    let ans = 0
    const checkStatus = this.data.checkStatus
    for(let k in checkStatus) {
      ans += checkStatus[k].length
    }
    this.setData({
      totalDays: ans
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.initCurrent()
    this.initBeginEmpty()
    this.initDays()
      .then(() => {
        this.initClocked()
        this.initDay()
        this.initTotalDays()
        this.initContinuity()
      })
    var res = wx.getSystemInfoSync()
    this.setData({
        sysW: res.windowHeight / 12-5,//更具屏幕宽度变化自动设置宽度
    });
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