
// pages/index/index.js
const app = getApp();
Page({
  // 页面的初始数据
  data: {
    username:'',
    password:'',
    checked:false,
    seen:true
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.getInfo();
  },
  // 获取用户登录信息
  getInfo:function(){
    wx.getStorage({
      key:'storageInfo',
      success:res => {
        this.setData({
          checked:true,
          username:res.data.userInfo.username,
          password: res.data.userInfo.password
        })
      }
    })
  },
  // 获取input的值
  bindKeyInput: function (e) {
    console.log(e);
    if (e.currentTarget.id === 'name') {
      this.setData({
        username: e.detail.value
      })
    } else {
      this.setData({
        password: e.detail.value
      })
    }
  },
  // 登录成功后页面跳转
  bindViewTap: function () {
    console.log(app.globalData.url)
    var r_this = this;
    wx.request({
      url: app.globalData.url + '/public/login',
      method:'POST', 
      data:{
        username: this.data.username,
        password: this.data.password
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded' //
      },
      success:res => {
        console.log(res);
        if(res.data.code === 200){
          wx.setStorage({
            key: 'token',
            data: {
              accessToken: res.data.result.access_token
              },
          })
          // navigate/redirect
          wx.redirectTo({
            url: '../index/index?id=' + res.data.result.company_id
          })
          this.storageChange();
        } else if (res.data.code === 40001){
          wx.showModal({
            title:'提示',
            showCancel:false,
            confirmColor:'#3a51f9',
            content: res.data.message
          })
        }  
      }
    })
  },
  // 记住登录信息
  switchChange:function(e){
    console.log(e);
    this.setData({
      checked:e.detail.value
    })
  },
  // storage事件
  storageChange:function(){
    if(this.data.checked === true){
      wx.setStorage({
        key: 'storageInfo',
        data: {
          userInfo: { username: this.data.username, password: this.data.password }
        }
      }) 
    }else{
      wx.clearStorage();
    }
  },
  
  



/**
checkboxChange:function(e){
    console.log(e);
    if (e.detail.value.length===1){
      this.setData({
         checked:true
       })  
    }else{
      this.setData({
        checked: false
      })
    }
  },
  */



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