//details.js
//获取应用实例
let wxCharts = require('../../utils/wxcharts.js');
const moment = require('../../moment.min.js');
const app = getApp();

Page({
  data: { // "navigationBarTitleText": "北京智信远景大数据分析"
    id:'',
    accessToken:'',
    nickName:'',
    switchIconShow:false,
    companyList:[],
    currentCompany:'',
    currentCompanyId:'',
    companysListShow:false,
    selectedCompany:'',
    selectedCompanyId:'',
    dataTime: moment().subtract(1, 'months').format('YYYY-MM'),
    onlineNum:0,
    items: [
      { container_id: 'fortem', title: '一网供温分布' },
      { container_id: 'backtem', title: '二网回温分布' },
      { container_id: 'traffic', title: '一网瞬时流量分布' }
    ],
    graphConfig:[
      { router: 'fortem', 
        canvasId: 'fortem', 
        type: 'line',
        categories: ['2016-08', '2016-09', '2016-10', '2016-11', '2016-12', '2018-01'], 
        data: [70, 40, 65, 19, 34, 95], 
        unit: '℃'
      },
      {
        router: 'backtem',
        canvasId: 'backtem',
        type: 'column',
        categories: ['2016-08', '2016-09', '2016-10', '2016-11', '2016-12', '2018-01'],
        data: [45, 50, 75, 60, 80, 39],
        unit: '℃'
      },
      {
        router: 'traffic',
        canvasId: 'traffic',
        type: 'area',
        categories: ['2016-08', '2016-09', '2016-10', '2016-11', '2016-12', '2018-01'],
        data: [68, 50, 79, 31, 47, 56],
        unit: 't/h'
      }
    ],

    longitude: '',
    latitude: ''
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    wx.getStorage({
      key: 'token',
      success: res => {
        this.setData({
          accessToken: res.data.accessToken
        })
        this.getCompanyList();
      }  
    })
    // this.getDate();
    this.getLocaltion();
  },
  getUser: function () {
    if (app.globalData.userInfo) {
      this.setData({
        nickName: app.globalData.userInfo.nickName
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          nickName: res.userInfo.nickName
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            nickName: res.userInfo.nickName
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 获取公司列表
  getCompanyList:function(){
    wx.showToast({ //加载loading
      title: 'Loading',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    wx.request({
      url: app.globalData.url+'/public/company',
      method: 'GET',
      data:{
        company_id: this.data.id,
        access_token: this.data.accessToken
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:res => {
        console.log(res);
        if (!res.data.result){
          wx.redirectTo({
            url: '../login/login',
          })
        }else{
          wx.hideToast(); //关闭loading
          if (res.data.result.rows.length > 0) {
            this.setData({
              switchIconShow: true,
              companyList: res.data.result.rows,
              currentCompany: res.data.result.company[0].company_name,
              currentCompanyId: res.data.result.company[0].company_id
            })
          }
          this.setData({
            selectedCompany: res.data.result.company[0].company_name,
            selectedCompanyId: res.data.result.company[0].company_id
          })
          wx.setNavigationBarTitle({
            title: res.data.result.company[0].company_name
          })
          let This = this.data.graphConfig;
          this.getStationOnline();
          for (let i in This) {
            this.getKeyIndicators(This[i].canvasId, This[i].type, This[i].categories, This[i].data, This[i].unit);
          }
        }
      }
    })
  },
  switchCompany:function(){
    if (this.data.companysListShow === false){
      this.setData({
        companysListShow:true
      })
    }else{
      this.setData({
        companysListShow: false
      })
    }
  },
  // 选择分公司
  selectedCompany:function(e){
    console.log(e);
    wx.setNavigationBarTitle({
      title: e.target.dataset.name
    })
    this.setData({
      companysListShow: false,
      selectedCompanyId: Number(e.target.id),
      selectedCompany: e.target.dataset.name
    })
    let This = this.data.graphConfig;
    this.getStationOnline();
    for (let i in This) {
      this.getKeyIndicators(This[i].canvasId, This[i].type, This[i].categories, This[i].data, This[i].unit);
    }
  },
  // 改变日期
  bindDateChange: function (e) {
    console.log(e)
    this.setData({
      dataTime:e.detail.value
    })
    let This = this.data.graphConfig;
    this.getStationOnline();
    for (let i in This) {
      this.getKeyIndicators(This[i].canvasId, This[i].type, This[i].categories, This[i].data, This[i].unit);
    }
  },
  // 获取当前年月、公司下换热站在线数目
  getStationOnline:function(){
    wx.request({
      url: app.globalData.url+'/public/online',
      data:{
        data_time: this.data.dataTime,
        company_id: this.data.selectedCompanyId,
        access_token: this.data.accessToken
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:res => {
        console.log(res);
        this.setData({
          onlineNum:res.data.result.number
        })
      }
    })
  },
  //退出
  exit:function(){
    wx.redirectTo({
      url: '../login/login'
    })
    wx.clearStorage();
  },
  // 获取关键指标数据加载图表
  getKeyIndicators: function (canvasId, type, categories, data, unit){
    console.log(this.data.selectedCompanyId);
    wx.request({
      url: app.globalData.url + '/indicators',
      data:{
        data_time:this.data.dataTime,
        company_id: this.data.selectedCompanyId,
        access_token:this.data.accessToken
      },
      success:res => {
        console.log(res);
        this.chartTemplate(canvasId, type, categories, data, unit);
      }
    })
  },
  // 图表模板
  chartTemplate: function (canvasId,type, categories,data,unit){
    let windowWidth = 320;
    let windowHeight = 200;
    try {
      let res = wx.getSystemInfoSync();
      console.log(res);
      windowWidth = res.windowWidth;
      windowHeight = 400 / (750 / windowWidth);
    } catch (e) {
      // 
    };
    new wxCharts({
      canvasId: canvasId,
      type: type,
      categories: categories,
      legend:false,
      series: [{
        data: data
      }],
      yAxis: {
        format: function (val) {
          return val + unit;
        }
      },
      width: windowWidth,
      height: windowHeight
    });
  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    this.setData({
      dataTime: moment().subtract(1, 'months').format('YYYY-MM')
    })
    this.getCompanyList();
    wx.stopPullDownRefresh()
  },
  // 用户点击右上角分享
  onShareAppMessage: function () {
    return {
      title: '北京智信远景大数据',
      desc: '最具权威的数据分析小程序!',
      path: '/details/details'
    }
  },
  // 获取当前位置
  getLocaltion: function () {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log(res);
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
    })
  },

  // API功能
  apiFunction: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../' + e.target.id + '/' + e.target.id,
    })
  },
  //
  showChart: function (e) {
    wx.navigateTo({
      url: '../chart/chart'
    })
  },
  // 显示地图页
  showMap: function () {
    // navigate/redirect
    wx.navigateTo({
      url: '../map/map?longitude=' + this.data.longitude + '&latitude=' + this.data.latitude
    })
  },
  














  getUser: function (callback) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        nickName: app.globalData.userInfo.nickName
      })
      console.log(this.data.nickName);
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          nickName: res.userInfo.nickName
        })
        console.log(this.data.nickName);

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            nickName: res.userInfo.nickName
          })
        }
      })
    }
    callback && callback();
  }
})
