<template>
	<div class="detail-page-wrapper">
		<!-- <div class="back-btn" @click="handleBack">
			<i class="element-icons icon-back"></i>
			返回
		</div> -->
		
		<img class="back-img" :src="backImg" @click="handleBack">

		<div class="content-wrapper">
			<div class="info-row base-info-row">
				<div class="col left">
					<div class="sub-col base-col">
						<div class="info">
							<div class="title">运行时间</div>
							<div class="value">{{ $formatSecondsTime(baseInfo.runTime) }}</div>
						</div>
						<div class="info">
							<div class="title">CPU核数</div>
							<div class="value">{{ detailData.hostDetailData['system.cpu.num'].value }}</div>
						</div>
						<div class="info">
							<div class="title">总内存</div>
							<div class="value">
								{{ formatMemoryTotal(detailData.hostDetailData['vm.memory.size[total]'].value) }}GB
							</div>
						</div>
					</div>

					<div class="sub-col usage-col">
						<div class="info">
							<div class="title">CPU利用率</div>
							<div class="value">
								<dv-percent-pond :config="detailData.usage.cpuConfig" />
								<div class="percent">{{ detailData.usage.cpuConfig.value }}%</div>
							</div>
						</div>
						<div class="info">
							<div class="title">内存利用率</div>
							<div class="value">
								<dv-percent-pond :config="detailData.usage.memoryConfig" />
								<div class="percent">{{ detailData.usage.memoryConfig.value }}%</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col right">
					<div class="sub-col total-col">
						<div class="title">磁盘空间</div>
						<div v-if="detailData.hostDetailData['vfs.fs.size[/,total]'].value" class="value">
							<span class="val">{{ formatMemoryTotal(detailData.hostDetailData['vfs.fs.size[/,total]'].value) }}</span>
							<span class="unit">GB</span>
						</div>
					</div>
					<div class="sub-col used-col">
						<div class="title">已用空间</div>
						<div v-if="baseInfo.diskUsedSpace" class="value">
							<span class="val">{{ baseInfo.diskUsedSpace }}</span>
							<span class="unit">GB</span>
						</div>
					</div>
					<div class="sub-col disk-usage-col">
						<div class="title">磁盘利用率</div>
						<div class="value">
							<dv-water-level-pond :config="diskConfig" style="width:150px; height:150px" />
						</div>
					</div>
				</div>
			</div>

			<div class="info-row chart-row_first">
				<div class="chart-container">
					<chart
						:isFresh="cpuChartData.isFresh"
						:id="cpuChartData.id"
						:title="cpuChartData.title"
						:yMin="cpuChartData.yMin"
						:yMax="cpuChartData.yMax"
						:xAxisData="cpuChartData.xAxisData"
						:legendData="cpuChartData.legendData"
						:seriesData="cpuChartData.seriesData">
					</chart>
				</div>
				<div class="chart-container">
					<chart
						:isFresh="cpuChartData.isFresh"
						:id="memoryChartData.id"
						:title="memoryChartData.title"
						:yMin="memoryChartData.yMin"
						:yMax="memoryChartData.yMax"
						:xAxisData="memoryChartData.xAxisData"
						:legendData="memoryChartData.legendData"
						:seriesData="memoryChartData.seriesData">
					</chart>
				</div>
				<div class="chart-container">
					<chart
						:isFresh="cpuChartData.isFresh"
						:id="diskChartData.id"
						:title="diskChartData.title"
						:yMin="diskChartData.yMin"
						:yMax="diskChartData.yMax"
						:xAxisData="diskChartData.xAxisData"
						:legendData="diskChartData.legendData"
						:seriesData="diskChartData.seriesData">
					</chart>
				</div>
			</div>
			<div class="info-row chart-row_second">
				<div class="chart-container">
					<chart
						:isFresh="cpuChartData.isFresh"
						:id="contextChartData.id"
						:title="contextChartData.title"
						:xAxisData="contextChartData.xAxisData"
						:yMin="contextChartData.yMin"
						:yMax="contextChartData.yMax"
						:legendData="contextChartData.legendData"
						:seriesData="contextChartData.seriesData">
					</chart>
				</div>

				<div class="chart-container">
					<chart
						:isFresh="netChartData.isFresh"
						:id="netChartData.id"
						:title="netChartData.title"
						:yMin="netChartData.yMin"
						:yMax="netChartData.yMax"
						:xAxisData="netChartData.xAxisData"
						:legendData="netChartData.legendData"
						:seriesDataNew="netChartData.seriesData">
					</chart>
				</div>

				<div class="chart-container">
					<chart
						:isFresh="sysLoadChartData.isFresh"
						:id="sysLoadChartData.id"
						:title="sysLoadChartData.title"
						:yMin="sysLoadChartData.yMin"
						:yMax="sysLoadChartData.yMax"
						:xAxisData="contextChartData.xAxisData"
						:legendData="sysLoadChartData.legendData"
						:seriesData="sysLoadChartData.seriesData">
					</chart>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Chart from '@/components/detail/Chart.vue'
	import {mapMutations} from 'vuex'
	export default {
		name: 'detail',

		components: {
			Chart
		},

		data() {
			return {
				backImg: require('@/assets/images/interactiveExperience/back.png'),
				showPercentChart: false,
				diskConfig: {
					data: [],
					shape: 'round',
					colors: ['#E6842E', '#E6842E']
				},
				dataTimer: null,
				timeTimer: null,
				legendReg: /(?<=\[\").*(?=\"\])/g,

				detailData: {},
				baseInfo: {
					runTime: '', // 运行时间
					diskUsedSpace: '', // 已用空间
				},

				// CPU
				cpuChartData: {
					isFresh: false,
					id: 'cpuChart',
					title: 'CPU',
					xAxisData: [],
					yMin: 0,
					yMax: 100,
					legendData: ['cpu使用率', '系统使用率', '用户使用率'],
					seriesData: {
						data: [],
						data1: [],
						data2: []
					}
				},

				// 内存
				memoryChartData: {
					isFresh: false,
					id: 'memoryChart',
					title: '内存',
					xAxisData: [],
					yMin: 0,
					yMax: 0,
					legendData: ['可用内存', '总内存'],
					seriesData: {
						data: [],
						data1: []
					}
				},

				// 磁盘利用率
				diskChartData: {
					isFresh: false,
					id: 'diskChart',
					title: '磁盘利用率',
					xAxisData: [],
					yMin: 0,
					yMax: 0,
					legendData: ['磁盘读取', '磁盘写入'],
					seriesData: {
						data: [],
						data1: []
					}
				},

				// 每秒上、下分区切换次数
				contextChartData: {
					isFresh: false,
					id: 'contextChart',
					title: '每秒上、下分区切换次数',
					xAxisData: [],
					yMin: 0,
					yMax: 0,
					legendData: ['Context switches per second'],
					seriesData: {
						data: []
					}
				},

				// 每秒网络带宽使用
				netChartData: {
					isFresh: false,
					id: 'netChart',
					title: '每秒网络带宽使用',
					yMin: 0,
					yMax: 2,
					xAxisData: [],
					legendData: [],
					seriesData: []
				},

				// 系统负载
				sysLoadChartData: {
					isFresh: false,
					id: 'sysLoadChart',
					title: '系统负载',
					yMin: 0,
					yMax: 5,
					xAxisData: [],
					legendData: ['1min 负载', '5min 负载', '15min 负载'],
					seriesData: {
						data: [],
						data1: [],
						data2: []
					}
				},

				keyArr: [
					'system.cpu.util',
					'system.cpu.util[,system]',
					'system.cpu.util[,user]',
					'vm.memory.size[total]',
					'vm.memory.size[available]',
					'vfs.dev.read.rate[sda]',
					'vfs.dev.write.rate[sda]',
					'system.cpu.switches',
					'system.cpu.load[all,avg1]',
					'system.cpu.load[all,avg5]',
					'system.cpu.load[all,avg15]'
				],

				netKeysArr: []
			}
		},

		created() {
			this.getHostData()
		},

		mounted() {
			this.getChartData()
			this.startRunTimeInterval()
			this.startDataInterval()
		},

		methods: {
			...mapMutations(['set_host_activated']),
			
			handleBack() {
				this.set_host_activated(0)
				this.$router.go(-1)
			},

			formatMemoryTotal(val) {
				return (val / 1024 / 1024 / 1024).toFixed(3)
			},

			getHostData() {
				this.detailData = this.$storage.getHostData()

				this.diskConfig.data = [this.detailData.usage.diskConfig.value]
				// this.detailData.usage.cpuConfig.borderWidth = 2
				// this.detailData.usage.cpuConfig.borderRadius = 3
				this.detailData.usage.cpuConfig.textColor = 'transparent'
				// this.detailData.usage.cpuConfig.colors = ['#73bf69', '#73bf69']
				// this.detailData.usage.memoryConfig.borderWidth = 2
				// this.detailData.usage.memoryConfig.borderRadius = 3
				this.detailData.usage.memoryConfig.textColor = 'transparent'
				// this.detailData.usage.memoryConfig.colors = ['#73bf69', '#73bf69']
			},

			// 获取网络
			async getNetLegendData() {
				this.netKeysArr = []
				this.netChartData.seriesData = []
				this.netChartData.legendData = []
				const {
					data: inLegendData
				} = await this.$axios.get(`/api/zabbix/keys/regular?hostid=${this.detailData.hostId}&key=net.if.in`)
				let inLegendDataRes = inLegendData.map((e, index) => {
					if (index <= 2) return e
				}).filter(e => e !== undefined)

				const {
					data: outLegendData
				} = await this.$axios.get(`/api/zabbix/keys/regular?hostid=${this.detailData.hostId}&key=net.if.out`)
				let outLegendDataRes = outLegendData.map((e, index) => {
					if (index <= 2) return e
				}).filter(e => e !== undefined)
				this.netKeysArr = [...inLegendDataRes, ...outLegendDataRes]
				return this.netKeysArr
			},

			async getChartData() {
				const _this = this
				const limit = 120
				this.resetChartFresh()
				let items = [
					{
						key: 'system.uptime',
						limit: 1
					}, // 运行时间
					{
						key: 'vm.memory.utilization',
						limit: 1
					}, // 内存使用率
					{
						key: 'vfs.fs.size[/,used]',
						limit: 1
					}, // 磁盘已用空间
					{
						key: 'vfs.fs.size[/,pused]',
						limit: 1
					}, // 磁盘利用率
					{
						key: 'system.cpu.util',
						limit
					},
					{
						key: 'system.cpu.util[,system]',
						limit
					},
					{
						key: 'system.cpu.util[,user]',
						limit
					},
					{
						key: 'vm.memory.size[total]',
						limit
					},
					{
						key: 'vm.memory.size[available]',
						limit
					},
					{
						key: 'vfs.dev.read.rate[sda]',
						limit
					}, // 磁盘读取
					{
						key: 'vfs.dev.write.rate[sda]',
						limit
					},
					{
						key: 'system.cpu.switches',
						limit
					},
					{
						key: 'system.cpu.load[all,avg1]',
						limit
					},
					{
						key: 'system.cpu.load[all,avg5]',
						limit
					},
					{
						key: 'system.cpu.load[all,avg15]',
						limit
					},
				]

				let netKeysArr = await this.getNetLegendData()
				for (let i in netKeysArr) {
					let key = netKeysArr[i]
					let typeVal = key.match(this.legendReg)[0]
					if (key.includes('.in')) {
						this.netChartData.legendData.push(`Interface ${typeVal}: Bits received`)
					} else if (key.includes('.out')) {
						this.netChartData.legendData.push(`Interface ${typeVal}: Bits sent`)
					}
					items.push({
						key,
						limit
					})
				}

				let json = {
					hostid: this.detailData.hostId,
					items
				}
				const {
					data: chartData
				} = await this.$axios.post(`${this.$apis.host}`, json)

				// 设置运行时间
				if (this.baseInfo.runTime === '') {
					let timeResult = chartData.find(e => e.key === 'system.uptime')
					this.baseInfo.runTime = timeResult.items[0].value
				}

				// 内存利用率
				let memoryResult = chartData.find(e => e.key === 'vm.memory.utilization')
				if (memoryResult) {
					const {
						value
					} = this.detailData.usage.memoryConfig
					let result = Number(memoryResult.items[0].value).toFixed(1)
					if (value !== result) {
						this.detailData.usage.memoryConfig.value = result
						this.detailData.usage.memoryConfig = {
							...this.detailData.usage.memoryConfig
						}
					}
				}

				// 已用空间
				let diskUsedSpaceResult = chartData.find(e => e.key === 'vfs.fs.size[/,used]')
				if (diskUsedSpaceResult) {
					this.baseInfo.diskUsedSpace = this.formatMemoryTotal(diskUsedSpaceResult.items[0].value)
				}

				// 磁盘利用率
				let diskUsageResult = chartData.find(e => e.key === 'vfs.fs.size[/,pused]')
				if (diskUsageResult) {
					const {
						data
					} = this.diskConfig
					let result = Number(diskUsageResult.items[0].value).toFixed(1)
					if (data[0] !== result) {
						this.diskConfig.data = [result]
						this.diskConfig = {
							...this.diskConfig
						}
					}
				}

				this.keyArr.forEach(key => {
					let result = chartData.find(e => e.key === key)
					if (result) {
						let {
							items
						} = result
						_this.resetItemsData(key, items)
					}
				})

				netKeysArr.forEach(key => {
					let result = chartData.find(e => e.key === key)
					if (result) {
						let {
							items
						} = result
						_this.resetItemsData(key, items)
					}
				})
			},

			resetChartFresh() {
				this.cpuChartData.isFresh = false
				this.memoryChartData.isFresh = false
				this.diskChartData.isFresh = false
				this.contextChartData.isFresh = false
				this.netChartData.isFresh = false
				this.sysLoadChartData.isFresh = false
			},

			// 运行时间定时递增
			startRunTimeInterval() {
				const _this = this
				this.timeTimer = setInterval(() => {
					_this.baseInfo.runTime++
				}, 1000)

				this.$once('hook:beforeDestroy', () => {
					clearInterval(this.timeTimer)
					this.timeTimer = null
				})
			},

			// 其他模块数据 30秒刷新一次
			startDataInterval() {
				const _this = this
				this.dataTimer = setInterval(() => {
					_this.getChartData()
				}, 10000)

				this.$once('hook:beforeDestroy', () => {
					clearInterval(this.dataTimer)
					this.dataTimer = null
					this.resetChartFresh()
				})
			},

			// 格式化请求到的数据
			resetItemsData(key, items) {
				const _this = this
				let arr = items
				arr.forEach(item => {
					let clock = item.clock * 1000 // 将时间戳 s 转换为 ms
					let result = _this.$dateFormat(clock).split(' ')[1]
					item.clock = result

					// 格式化 cpu 图表数据
					if (key === 'system.cpu.util' || key === 'system.cpu.util[,system]' || key ===
						'system.cpu.util[,user]') {
						item.value = Number(item.value).toFixed(1)
					}

					// 格式化 内存 图表数据
					if (key === 'vm.memory.size[total]' || key === 'vm.memory.size[available]') {
						item.value = _this.formatMemoryTotal(Number(item.value))
					}

					// 磁盘读写速率
					if (key === 'vfs.dev.read.rate[sda]' || key === 'vfs.dev.write.rate[sda]') {
						item.value = Number(item.value).toFixed(1)
					}

					// 上下文
					if (key === 'system.cpu.switches') item.value = Math.round(Number(item.value))

					// 每秒网络带宽使用
					let isExistNetKey = this.netKeysArr.indexOf(key)
					if (isExistNetKey !== -1) {
						item.value = (Number(item.value) / 1024 / 1024).toFixed(2)
					}
				})
				this.setData(key, arr)
			},

			setData(key, items) {
				const _this = this
				let xAxisData = items.map(item => item.clock)
				let seriesData = items.map(item => Number(item.value))

				// CPU
				if (key === 'system.cpu.util' || key === 'system.cpu.util[,system]' || key === 'system.cpu.util[,user]') {
					this.cpuChartData.isFresh = true
					this.cpuChartData.xAxisData = xAxisData
					if (key === 'system.cpu.util') {
						const {
							value
						} = this.detailData.usage.cpuConfig
						if (value !== seriesData[0]) {
							this.detailData.usage.cpuConfig.value = seriesData[0]
							this.detailData.usage.cpuConfig = {
								...this.detailData.usage.cpuConfig
							}
						}
						this.cpuChartData.seriesData.data = seriesData
					}
					if (key === 'system.cpu.util[,system]') this.cpuChartData.seriesData.data1 = seriesData
					if (key === 'system.cpu.util[,user]') this.cpuChartData.seriesData.data2 = seriesData
				}

				// 内存
				if (key === 'vm.memory.size[total]' || key === 'vm.memory.size[available]') {
					this.memoryChartData.isFresh = true
					this.memoryChartData.xAxisData = xAxisData
					if (key === 'vm.memory.size[available]') {
						this.memoryChartData.seriesData.data = seriesData
					}
					if (key === 'vm.memory.size[total]') {
						this.memoryChartData.yMax = seriesData[0]
						this.memoryChartData.seriesData.data1 = seriesData
					}
				}

				// 磁盘读写速率
				if (key === 'vfs.dev.read.rate[sda]' || key === 'vfs.dev.write.rate[sda]') {
					this.diskChartData.isFresh = true
					this.diskChartData.xAxisData = xAxisData
					this.diskChartData.yMin = Math.min(...seriesData)
					this.diskChartData.yMax = Math.max(...seriesData)
					if (key === 'vfs.dev.read.rate[sda]') this.diskChartData.seriesData.data = seriesData
					if (key === 'vfs.dev.write.rate[sda]') this.diskChartData.seriesData.data1 = seriesData
				}

				// 上下文切换次数
				if (key === 'system.cpu.switches') {
					this.contextChartData.isFresh = true
					this.contextChartData.xAxisData = xAxisData
					this.contextChartData.yMin = Math.min(...seriesData)
					this.contextChartData.yMax = Math.max(...seriesData)
					this.contextChartData.seriesData.data = seriesData
				}

				// 每秒网络带宽使用
				let isExistNetKey = this.netKeysArr.indexOf(key)
				if (isExistNetKey !== -1) {
					this.netChartData.isFresh = true
					this.netChartData.xAxisData = xAxisData
					this.netChartData.yMax = Math.max(...seriesData)
					this.netChartData.seriesData.push({
						key,
						value: seriesData
					})
				}

				// 系统负载
				if (key === 'system.cpu.load[all,avg1]' || key === 'system.cpu.load[all,avg5]' || key ===
					'system.cpu.load[all,avg15]') {
					this.sysLoadChartData.isFresh = true
					this.sysLoadChartData.xAxisData = xAxisData

					if (key === 'system.cpu.load[all,avg1]') this.sysLoadChartData.seriesData.data = seriesData
					if (key === 'system.cpu.load[all,avg5]') this.sysLoadChartData.seriesData.data1 = seriesData
					if (key === 'system.cpu.load[all,avg15]') this.sysLoadChartData.seriesData.data2 = seriesData
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	$box-bg-color: rgba($color: #044676, $alpha: 0.6); // #0a3a69 #002431 #055384
	$box-text-color: #E6842E;
	
	/deep/ .dv-percent-pond {
		width: 80%;
		height: 25px;
	}

	.empty-div {
		width: 80%;
		height: 25px;
	}

	.detail-page-wrapper {
		.back-btn {
			cursor: pointer;
			width: 100px;
			height: 40px;
			margin: 10px;
			border-radius: 5px;
			background: #063d7d;
			color: #FFF;
			@include flex-level-center;

			.element-icons {
				font-size: 23px;
			}
		}
		
		.back-img{
			margin: 10px;
			cursor: pointer;
		}

		.content-wrapper {
			height: calc(100vh - 60px);
			display: flex;
			flex-flow: column;
			align-items: center;

			.info-row {
				flex: 1;
				width: 99%;

				.chart-container {
					flex: 1;
					background-color: $box-bg-color;
					border-radius: 5px;
					@include flex-level-center;

					&:nth-child(2) {
						margin: 0 15px;
					}
				}
			}

			.base-info-row {
				flex: 0.8;
				display: flex;

				.col {
					flex: 1;
				}

				.left {
					margin-right: 15px;
					display: flex;

					.sub-col {
						flex: 1;
						border-radius: 5px;

						.info {
							flex: 1;
							flex-flow: column;
							@include flex-space-around;
							border-radius: 5px;
							background-color: $box-bg-color; // #002431 #063d7d

							&:nth-child(2) {
								margin: 10px 0;
							}

							.title {
								color: #FFF;
								font-size: 16px;
							}

							.value {
								color: $box-text-color;
								font-size: 20px;
								font-weight: bolder;
							}
						}
					}

					.base-col {
						flex: 0.6;
						display: flex;
						flex-flow: column;
					}

					.usage-col {
						display: flex;
						flex-flow: column;
						margin: 0 15px;

						.info {
							&:nth-child(2) {
								margin: 0;
								margin-top: 10px;
							}
						}

						.value {
							width: 90%;
							@include flex-space-between;
						}
					}

					.partition-col {
						flex: 0.4;
						background-color: $box-bg-color;

						.title {
							color: #FFF;
							text-align: center;
							padding-top: 10px;
						}
					}
				}

				.right {
					display: flex;

					.sub-col {
						flex: 1;
						border-radius: 5px;
						background-color: $box-bg-color;

						.title {
							color: #FFF;
							font-size: 20px;
							padding-top: 10px;
							text-align: center;
						}

						.value {
							flex: 1;
							color: $box-text-color;
							font-weight: bolder;
							font-size: 25px;
							@include flex-vertical-center;

							.val {
								font-size: 35px;
							}

							.unit {
								padding: 5px 0 0 10px;
							}
						}
					}

					.total-col {
						flex: 0.5;
						@include flex-vertical-center;
						flex-flow: column;
					}

					.used-col {
						flex: 0.5;
						margin: 0 15px;
						@include flex-vertical-center;
						flex-flow: column;

						.value {
							color: #f2495c;
						}
					}

					.disk-usage-col {
						@include flex-vertical-center;
						flex-flow: column;

						.value {
							width: 90%;
							@include flex-level-center;
						}
					}
				}
			}

			.chart-row {
				&_first {
					display: flex;
					margin: 15px 0;
				}

				&_second {
					display: flex;
					margin-bottom: 15px;
				}
			}
		}
	}
</style>
