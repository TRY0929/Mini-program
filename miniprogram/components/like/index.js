// components/like/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    like: {
      type: Boolean
    },
    count: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    likeSrc: "images/like.png",
    dislikeSrc: "images/like@dis.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLike (e) {
      let like = this.properties.like
      let count = this.properties.count
      count = like ? count-1 : count+1
      this.setData({
        like: !like,
        count: count
      })
      this.triggerEvent('like', {
        behavior: this.properties.like ? 'like' : 'cancel'
      }, {})
    }
  }
})
