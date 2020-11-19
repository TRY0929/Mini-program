// components/classic/nav/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    first: Boolean,
    latest: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    leftDisSrc: 'images/triangle.dis@left.png',
    leftSrc: 'images/triangle@left.png',
    rightSrc: 'images/triangle@right.png',
    rightDisSrc: 'images/triangle.dis@right.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLeft () {
      if (!this.properties.latest) {
        this.triggerEvent('left', {}, {})
      }
    },
    onRight () {
      if (!this.properties.first) {
        this.triggerEvent('right', {}, {})
      }
    }
  }
})
