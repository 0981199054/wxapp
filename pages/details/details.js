// pages/details/details.js
import IP from '../../utils/util.js'
Page({
  data: {
    movie:{},
    img: 'http://127.0.0.1:3333/img/'
  },
  onLoad: function(options) {
    wx.request({
      url: IP.IP + 'details', 
      data: {
        _id: options.id
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        this.setData({
          movie: res.data
        })
        console.log(this.data.movie)
      }
    })
  }
})