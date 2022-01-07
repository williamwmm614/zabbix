<template>
	<div class="track-chart-wrapper">
		<div class="title">
			<div class="container">
				<img :src="titleIcon">
				<span>轨道计算图</span>
			</div>
		</div>
		<div class="vmc-chart-section">
			<div id="chart" style="width: 100%; height:250px;"></div>
		</div>
	</div>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex'

	export default {
		name: 'TaskMonitoring',

		data() {
			return {
				titleIcon: require('@/assets/images/title/title-icon.png'),
				moduleTitle: 'VMC运行状态图',

				curTime: '',
				vmcId: 0,
				localVmcData: {},
				myChart: null,
				chartOption: {
					title: {
						text: ''
					},
					tooltip: {
						trigger: 'axis'
					},

					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						top: '10%',
						containLabel: true
					},
					formatter: function(params, ticket, callback) {
						let str = `<span>${params[0].name}</span></br>`
						let result = ''
						for (let i = 0; i < params.length; i++) {
							if (params[i].componentSubType !== 'effectScatter') {
								let value = params[i].value
								let seriesName = params[i].seriesName
								result += `${params[i].marker}${seriesName}：<b>${value}</b></br>`
							}

						}
						return `${str}${result}`
					},
					xAxis: {
						splitLine: {
							show: true,
							lineStyle: {
								color: ['#002f47'],
							}
						},
						show: true,
						type: 'category',
						boundaryGap: false,
						axisLabel: {
							color: '#829db8',
							textStyle: {
								align: 'center'
							}
						},
						axisLine: {
							lineStyle: {
								color: '#002f47',
								width: 1
							}
						},

						data: ['', '', '', '', '', '', '']
					},
					yAxis: {
						splitLine: {
							
							   
							lineStyle: {
								color: ['#002f47'],
							}
						},
						type: 'value',
						axisLabel: {
							color: '#829db8'
						},
						axisLine: {
							lineStyle: {
								color: '#002f47',
								width: 1
							}
						},
						min: 0,
						max: 0,
						data: []
					},
					series: [{
							name: 'X坐标',
							type: 'line',
							smooth: 0.5,
							data: []
						},
						{
							name: 'Y坐标',
							type: 'line',
							smooth: 0.5,
							data: []
						},
						{
							name: 'Z坐标',
							type: 'line',
							smooth: 0.5,
							data: []
						}
					]
				},

				effectScatterArr: [{
						type: 'effectScatter',
						coordinateSystem: 'cartesian2d',
						data: [],
						symbolSize: 1,
						showEffectOn: 'render',
						rippleEffect: {
							brushType: 'fill',
							number: 1,
						},
						hoverAnimation: true,
						itemStyle: {
							normal: {
								color: '#00DC49',
								shadowBlur: 1,
								shadowColor: '#333'
							}
						},
						zlevel: 1
					},
					{
						type: 'effectScatter',
						coordinateSystem: 'cartesian2d',
						data: [],
						symbolSize: 1,
						showEffectOn: 'render',
						rippleEffect: {
							brushType: 'fill',
							number: 1,
						},
						hoverAnimation: true,
						itemStyle: {
							normal: {
								color: '#00DC49',
								shadowBlur: 5,
								shadowColor: '#333'
							}
						},
						zlevel: 1
					},
					{
						type: 'effectScatter',
						coordinateSystem: 'cartesian2d',
						data: [],
						symbolSize: 1,
						showEffectOn: 'render',
						rippleEffect: {
							brushType: 'fill',
							number: 1,
						},
						hoverAnimation: true,
						itemStyle: {
							normal: {
								color: '#00DC49',
								shadowBlur: 5,
								shadowColor: '#333'
							}
						},
						zlevel: 1
					}
				]
			}
		},

		computed: {
			...mapGetters([
				'CUR_HOST_ID',
				'HOST_ACTIVATED',
				'INTERACTION_PARENT_MODULE_NAME'
			])
		},

		watch: {
			HOST_ACTIVATED(val) {
				// if (this.INTERACTION_PARENT_MODULE_NAME === 'RCGL' || this.INTERACTION_PARENT_MODULE_NAME === 'JZBJ') {
				// 	const {
				// 		vmc1,
				// 		vmc2
				// 	} = this.localVmcData
				// 	if (val <= 3) this.vmcId = vmc1.id
				// 	if (val > 3 && val <= 6) this.vmcId = vmc2.id
				// 	this.getTrackData()
				// }
			},
			
			CUR_HOST_ID: {
				immediate: true,
				handler(id) {
					// console.log(id);
					if (id !== 0 && id !== 48 && id !== 49) {
						setTimeout(() => {
							if (this.INTERACTION_PARENT_MODULE_NAME === 'RCGL' || this.INTERACTION_PARENT_MODULE_NAME === 'JZBJ') {
								console.log(id);
								this.getTrackData(id)
							}
						}, 500)
					}
				}
			}
		},

		mounted() {
			// this.initData()
		},

		methods: {
			initData() {
				const localHostData = this.$storage.getVmcPduData()
				const {
					vmcData
				} = localHostData
				this.localVmcData = vmcData
				this.vmcId = this.localVmcData.vmc1.id
				this.getTrackData()
			},

			getCurTime() {
				this.curTime = new Date().getTime()
			},

			setYAxisMinMax(xs, ys, zs) {
				let xMin = Math.min(...xs)
				let yMin = Math.min(...ys)
				let zMin = Math.min(...zs)
				let xMax = Math.max(...xs)
				let yMax = Math.max(...ys)
				let zMax = Math.max(...zs)
				let resultMin = Math.min(xMin, yMin, zMin)
				let resultMax = Math.max(xMax, yMax, zMax)
				this.chartOption.yAxis.min = resultMin
				this.chartOption.yAxis.max = resultMax
			},

			// 获取轨道图数据
			async getTrackData(id) {
				console.log(id);
				this.getCurTime()
				this.chartOption.series = [{
						name: 'X坐标',
						type: 'line',
						smooth: 0.5,
						data: []
					},
					{
						name: 'Y坐标',
						type: 'line',
						smooth: 0.5,
						data: []
					},
					{
						name: 'Z坐标',
						type: 'line',
						smooth: 0.5,
						data: []
					}
				]

				let {
					data: trackData
				} = await this.$axios.get(`${this.$apis.vmc}/${id}`)
				
				console.log(trackData);
				const {x, y, z, timestamp} = trackData
				// let timestamps = trackData[0].xyzs.map(e => this.$dateFormat(e.timestamp).split(' ')[1])
				// let xs = trackData[0].xyzs.map(e => e.x)
				// let ys = trackData[0].xyzs.map(e => e.y)
				// let zs = trackData[0].xyzs.map(e => e.z)
				let xs = [100, 200, 300]
				let ys = [400, 500, 600]
				let zs = [1234, 4321, 456]
				let timestampNew = [this.$dateFormat(timestamp).split(' ')[1]]
				this.setYAxisMinMax(xs, ys, zs)

				// 如果最新一条数据时间和当前时间差超过30秒，则最后一条数据点闪烁
				const diffVal = this.curTime - timestamp
				if (diffVal > (30 * 1000)) {
					const symbolSize = 10
					let xLastData = xs[xs.length - 1]
					xs[xs.length - 1] = {
						value: xLastData,
						symbolSize
					}

					let yLastData = ys[ys.length - 1]
					ys[ys.length - 1] = {
						value: yLastData,
						symbolSize
					}

					let zLastData = zs[zs.length - 1]
					zs[zs.length - 1] = {
						value: zLastData,
						symbolSize
					}
				}

				this.chartOption.xAxis.data = timestampNew
				this.chartOption.series[0].data = xs
				this.chartOption.series[1].data = ys
				this.chartOption.series[2].data = zs
				this.effectScatterArr[0].data = xs
				this.effectScatterArr[1].data = ys
				this.effectScatterArr[2].data = zs
				// this.chartOption.series = this.chartOption.series.concat(this.effectScatterArr)

				this.initCharts()
			},

			initCharts() {
				if (this.myChart) this.myChart.dispose()
				let myChart = this.$ECharts.init(document.getElementById('chart'))
				this.myChart = myChart
				myChart.setOption(this.chartOption)
				window.onresize = function() {
					myChart.resize()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.track-chart-wrapper {
		width: 100%;
		height: 100%;
		background: url('@/assets/images/banner/action-area-bg.png') no-repeat;
		background-size: 100% 100%;
		display: flex;
		flex-flow: column;

		.title {
			display: flex;
			align-items: center;
			height: 45px;

			.container {
				height: 100%;
				padding-left: 15px;
				@include flex-level-center;

				span {
					color: #DFEEF3;
					font-size: 16px;
					padding-left: 10px;
				}
			}
		}
	}
</style>
