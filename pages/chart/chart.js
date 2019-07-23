// pages/line/line.js
const app = getApp();
import * as echarts from '../../ec-canvas/echarts';
// import test from '../../utils/test.js';

let data = {
  dataTime: '',
  companyId: null,
  accessToken : ''
}

// 第一个图表
function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  getData(canvas, chart);
  return chart;
};
// 获取图表数据
function getData(canvas, chart){
  wx.request({
    url: app.globalData.url + '/indicators',
    method: 'GET',
    data: {
      data_time: data.dataTime,
      company_id: data.companyId,
      tag_id: 21,
      access_token: data.accessToken
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: res => {
      console.log(res);
      const list = res.data.result.rows;

      option.dataset[0].source = res.data.result.rows;
      canvas.setChart(chart);
      chart.setOption(option);
    }
  })
};
// 配置项
const option = {
  title: {
    text: 'Echarts4',
    textStyle: {
      color: '#000',
      fontSize: '28rpx'
    }
  },
  legend: {
    data: ['Test'],
    top: '8%'
  },
  dataset: [
    {
      source: []
    }
  ],
  grid: {
    top: '25%',
    left: '3%',
    right: '5%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      formatter: data => {
        data = parseInt(data.split('-')[2]);
        return data;
      }
    }
  },
  yAxis: {},
  series: [
    {
      name: 'Test',
      type: 'line',
      areaStyle: {},
      symbolSize: 3,
      encode: {
        x: 2,
        y: 1,
      }
    }
  ]
}

//  第二个图表
function initChart2(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  wx.request({
    url: app.globalData.url + '/indicators',
    method: 'GET',
    data: {
      data_time: data.dataTime,
      company_id: data.companyId,
      tag_id: 16,
      access_token: data.accessToken
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: res => {
      console.log(res);
      const list = res.data.result.rows;

      const option = {
        title: {
          text: 'Echarts4',
          textStyle: {
            color: '#000',
            fontSize: '28rpx'
          }
        },
        legend: {
          data: ['Test'],
          top: '8%'
        },
        dataset: [
          {
            source: res.data.result.rows
          }
        ],
        grid: {
          top: '25%',
          left: '3%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisLabel: {
            formatter: data => {
              data = parseInt(data.split('-')[2]);
              return data;
            }
          }
        },
        yAxis: {},
        series: [
          {
            name: 'Test',
            type: 'bar',
            symbolSize: 3,
            itemStyle: {
              normal: {
                //颜色渐变
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    //浅色
                    { offset: 1, color: '#3988e3' },
                    //深色
                    { offset: 0, color: '#2d3ab6' }
                  ]
                )
              },
            },
            // itemStyle:{
            //   normal: {
            //     color: ''
            //   }
            // },
            encode: {
              x: 2,
              y: 1,
            }
          }
        ]
      }
      canvas.setChart(chart);
      chart.setOption(option);
    }
  })
  return chart;
};

Page({
  data: {
    ec: {
      onInit: initChart
    },
    ec2: {
      onInit: initChart2
    },
    dataTime: '2017-12'
  },
  onLoad:function(options){
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    data = {
      dataTime: this.data.dataTime,
      companyId: prevPage.data.id,
      accessToken: prevPage.data.accessToken
    }
    wx.setNavigationBarTitle({
      title: '图表',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#c23531',
    })
  }
});