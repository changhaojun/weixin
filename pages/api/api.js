// pages/api/api.js
Page({
  data: {
    
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'API',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#215e21',
    })
  },
  // 扫一扫
  scan:function(){
    wx.scanCode({
      onlyFromCamera: true, // 只允许从相机扫描
      success: (res) => {
        console.log(res)
      }
    })
  },
  // 显示地图页
  showMap: function () {
    // navigate/redirect
    wx.navigateTo({
      url: '../map/map?longitude=' + this.data.longitude + '&latitude=' + this.data.latitude
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