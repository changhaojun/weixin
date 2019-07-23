// pages/map/map.js
Page({
  data: {
    longitude: '',
    latitude: '',
    markers: [{
      iconPath: "../../utils/assets/logo.png",
      id: 0,
      latitude: 108.96309828,
      longitude: 34.2877999,
      width: 35,
      height: 45
    }]
  },
  onLoad: function (options) {
    this.setData({
      longitude: options.longitude,
      latitude: options.latitude
    })
    wx.setNavigationBarTitle({
      title: '地图',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fcad00',
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