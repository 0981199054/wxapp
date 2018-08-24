//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
import IP from '../../utils/util.js'

var page = 1;
var rows = 5;
var sheight;


var loadMore = function(that) {
  that.setData({
    hidden: false
  });
  wx.request({
    url: IP.IP + 'hotPlay',
    data: {
      page: page,
      rows: rows
    },
    method: "POST",
    success: function(res) {
      if (res.data.rows.length!==0) {
        //  判断预售购票及7日之内上映时间
        res.data.rows.forEach(item => {
          item.flag = new Date(item.movie_time).getTime() - new Date().getTime()
          let year = new Date(item.movie_time).getFullYear() - new Date().getFullYear() //获取年差值
          let month = new Date(item.movie_time).getMonth() - new Date().getMonth() //获取月差值
          let day = new Date(item.movie_time).getDate() - new Date().getDate() //获取天差值
          if (year === 0 && month === 0 && day <= 7) {
            if (new Date().getDay() + new Date(item.movie_time).getDay() < 7)
              item.week = item.movie_time + '本周' + new Date(item.movie_time).getDay()
            else
              item.week = item.movie_time + '下周' + new Date(item.movie_time).getDay()
          } else {
            item.week = item.movie_time
          }
        })
        var list = that.data.tab1;
        for (var i = 0; i < res.data.rows.length; i++) {
          list.push(res.data.rows[i]);
        }
        that.setData({
          tab1: list
        });
        page++;
        setTimeout(()=>{
          that.setData({
            hidden: true
          })
        }, 300)
      }else{
        setTimeout(() => {
          that.setData({
            hidden: true
          })
        }, 300)
        that.setData({
          isShow: true
        });
        setTimeout(() => {
          that.setData({
            isShow: false
          })
        }, 1000)
      }
    }
  });
}

Page({
  data: {
    navbar: ['首映', '待映'],
    currentTab: 0,
    img: 'http://127.0.0.1:3333/img/',
    tab1: [],
    tab2: [],
    city: '',
    scrollHeight: 0,
    hidden: true,
    isShow:false
  },
  navbarTap: function(e) {
    console.log(e.currentTarget.dataset.idx)
    if (e.currentTarget.dataset.idx !== 0) {
      this.setData({
        currentTab: e.currentTarget.dataset.idx,
        scrollHeight: 0
      })
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.idx,
        scrollHeight: sheight
      })
    }
  },
  details: function(e) {
    wx.navigateTo({
      url: `../details/details?id=${e.currentTarget.dataset.item.movie[0]}`
    })
  },
  onLoad() {
    var that = this;
    wx.getSystemInfo({
      success: res => {
        sheight = res.windowHeight
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    loadMore(that);
    // 实例化腾讯地图API核心类
    var qqmapsdk = new QQMapWX({
      key: 'UYIBZ-HKRKW-FOURQ-RFAJT-LM7JF-WLFTJ' // 必填
    })
    wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: (addressRes) => {
              var address = addressRes.result.address_component.city;
              this.setData({
                city: address
              })
            }
          })
        }
      }),
      wx.request({
        url: IP.IP + 'hotShow', //仅为示例，并非真实的接口地址
        data: {
          page: 1,
          rows: 10
        },
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          this.setData({
            tab2: res.data.rows
          })
        }
      })
  } //页面滑动到底部
  ,
  bindDownLoad: function() {
    var that = this;
    loadMore(that);
  }

})