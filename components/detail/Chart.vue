<template>
  <div class="chart-wrapper">
    <div
      v-for="dom in chartDom"
      :index="dom"
      :id="dom"
      v-if="id === dom"
      :style="{'width': `${chartWidth}px`, 'height': `${chartHeight}px`}"
      class="container">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'chart',

    props: {
      isFresh: {
        type: Boolean,
        default: false
      },

      id: {
        type: String,
        default: 'cpu-chart'
      },

      chartWidth: {
        type: Number,
        default: 600
      },

      chartHeight: {
        type: Number,
        default: 300
      },

      title: {
        type: String,
        default: ''
      },

      xAxisData: {
        type: Array,
        default: () => []
      },

      yAxisData: {
        type: Array,
        default: () => []
      },

      yMin: {
        type: Number,
        default: 0,
      },

      yMax: {
        type: Number,
        default: 0,
      },

      splitNumber: {
        type: Number,
        default: 0
      },

      interval: {
        type: Number,
        default: 0
      },

      legendData: {
        type: Array,
        default: []
      },

      seriesData: {
        type: Object,
        default: () => {}
      },

      seriesDataNew: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        chartDom: ['cpuChart', 'memoryChart', 'diskChart', 'contextChart', 'netChart' ,'ioChart', 'sysLoadChart'],
        myChart: null,
        chartOption: {
          title: {
            text: '',
            left: 'center',
            textStyle: {
              color: '#FFF',
              fontWeight: 'normal'
            },
            top: 5,
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params, ticket, callback) {
              let str = `<span>${params[0].name}</span></br>`
              let result = ''
              for(let i = 0; i < params.length; i++) {
                let symbol = '%'
                let value = params[i].value
                const seriesName = params[i].seriesName
                if (seriesName.includes('使用率')) {
                  symbol = '%'
                } else if (seriesName.includes('内存')) {
                  symbol = 'GB'
                } else if (seriesName.includes('Interface')) {
                  symbol = 'Mb/s'
                } else if (seriesName.includes('Context')) {
                  symbol = '次'
                } else {
                  symbol = ''
                }

                result += `${params[i].marker}${params[i].seriesName}：<b>${value}${symbol}</b></br>`
              }
              return `${str}${result}`
            }
          },
          color: ['#91cc75', '#fac858', '#73c0de'],
          legend: {
            data: ['cpu使用率', '系统使用率', '用户使用率'],
            bottom: 0,
            left: 5,
            textStyle: {
              color: '#FFF'
            }
          },
          grid: {
            left: '1%',
            right: '2%',
            bottom: '10%',
            top: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            // boundaryGap: false,
            splitLine: {
              show: true,
              lineStyle: {
                opacity: 0.5
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#FFF'
            },
            axisLine: {
              lineStyle: {
                opacity: 0
              }
            },
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 60,
            splitLine: {
              lineStyle: {
                opacity: 0.5
              }
            },
            axisLabel: {
              color: '#FFF',
              formatter: '{value}%'
            },
            axisLine: {
              show: false
            },
            data: [],
          },
          series: [
            {
              name: 'cpu使用率',
              type: 'line',
              smooth: 0,
              symbol: 'none',
              areaStyle: {
                opacity: 0.2
              },
              lineStyle: {
                width: 1
              },
              data: [],
            },
            {
              name: '系统使用率',
              type: 'line',
              smooth: 0,
              symbol: 'none',
              areaStyle: {
                opacity: 0.2
              },
              lineStyle: {
                width: 1
              },
              data: [],
            },
            {
              name: '用户使用率',
              type: 'line',
              smooth: 0,
              symbol: 'none',
              areaStyle: {
                opacity: 0.2
              },
              lineStyle: {
                width: 1
              },
              data: [],
            },
            {
              name: '用户使用率',
              type: 'line',
              smooth: 0,
              symbol: 'none',
              areaStyle: {
                opacity: 0.2
              },
              lineStyle: {
                width: 1
              },
              data: [],
            },
            {
              name: '用户使用率',
              type: 'line',
              smooth: 0,
              symbol: 'none',
              areaStyle: {
                opacity: 0.2
              },
              lineStyle: {
                width: 1
              },
              data: [],
            },
            {
              name: '用户使用率',
              type: 'line',
              smooth: 0,
              symbol: 'none',
              areaStyle: {
                opacity: 0.2
              },
              lineStyle: {
                width: 1
              },
              data: [],
            }
          ]
        }
      }
    },

    watch: {
      isFresh(val) {
        if (val) this.initChart()
      }
    },

    mounted() {
    },

    methods: {
      setChartOption() {
        this.$set(this.chartOption.title, 'text', this.title)
        this.chartOption.color = ['#91cc75', '#fac858', '#73c0de']
        this.chartOption.legend.data = this.legendData
        this.chartOption.yAxis.min = this.yMin
        this.chartOption.yAxis.max = this.yMax
        this.chartOption.xAxis.axisLabel.rotate = 10
        this.chartOption.grid.bottom = '5%'
        this.chartOption.xAxis.axisLabel.margin = 15
        this.chartOption.xAxis.axisLabel.align = 'center'
        this.chartOption.xAxis.data = this.xAxisData
        this.chartOption.yAxis.data = this.yAxisData

        this.chartOption.series[0].name = this.legendData[0]
        if (this.seriesData) this.chartOption.series[0].data = this.seriesData.data

        if (this.title === 'CPU') {
          this.chartOption.xAxis.axisLabel.interval = 10
          this.chartOption.yAxis.axisLabel.formatter = '{value}%'
          this.chartOption.series[1].name = this.legendData[1]
          this.chartOption.series[1].data = this.seriesData.data1
          this.chartOption.series[2].name = this.legendData[2]
          this.chartOption.series[2].data = this.seriesData.data2
        }

        if (this.title === '内存') {
          this.chartOption.series[1].name = this.legendData[1]
          this.chartOption.series[1].data = this.seriesData.data1
          this.chartOption.series[1].areaStyle.opacity = 0
          this.chartOption.yAxis.axisLabel.formatter = function (value, index) {
            if (value === 0) return value
            return `${value}GB`
          }
        }

        if (this.title === '磁盘读写速率') {
          this.chartOption.series[1].name = this.legendData[1]
          this.chartOption.series[1].data = this.seriesData.data1
          this.chartOption.yAxis.axisLabel.formatter = function (value, index) {
            return value
          }
        }

        if (this.title === '每秒上下文切换次数') {
          this.chartOption.yAxis.axisLabel.formatter = function (value, index) {
            return value
          }
        }

        if (this.title === '每秒网络带宽使用') {
          this.chartOption.color = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#ea7ccc']
          this.chartOption.xAxis.axisLabel.margin = 15
          if (this.legendData.length === 2) {
            this.chartOption.grid.bottom = '5%'
          }

          if (this.legendData.length === 4) {
            this.chartOption.grid.bottom = '10%'
          }

          if (this.legendData.length === 6) {
            this.chartOption.grid.bottom = '20%'
          }

          for(let i in this.seriesDataNew) {
            this.chartOption.series[i].name = this.legendData[i]
            this.chartOption.series[i].data = this.seriesDataNew[i].value
          }
          this.chartOption.yAxis.axisLabel.formatter = function (value, index) {
            if (value === 0) return `${value} b/s`
            return `${value} Mb/s`
          }
        }

        if (this.title === '系统负载') {
          this.chartOption.series[1].name = this.legendData[1]
          this.chartOption.series[1].data = this.seriesData.data1
          this.chartOption.series[2].name = this.legendData[2]
          this.chartOption.series[2].data = this.seriesData.data2
          this.chartOption.yAxis.axisLabel.formatter = '{value}'
        }
      },

      initChart() {
        this.setChartOption()
        if (this.myChart) this.myChart.dispose()
        let _chartDom = null
        _chartDom = document.getElementById(this.id)
        let myChart = this.$ECharts.init(_chartDom)
        this.myChart = myChart
        myChart.setOption(this.chartOption)

        window.onresize = function () {
          myChart.resize()
        }
      }
    }
  }
</script>
