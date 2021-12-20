<template>
	<div class="data-monitoring-wrapper">
		<div class="title">
			<div class="container">
				<div class="left">
					<img :src="titleIcon">
					<span>数据监控</span>
				</div>
				
				<div v-if="INTERACTION_PARENT_MODULE_NAME === 'HOME'" class="right">
					<div class="view-detail" @click="handleViewDetail">
					  <i class="element-icons icon-xiangqing"></i>
					  查看详情
					</div>
				</div>
			</div>
		</div>
		
		<!-- VMC信息 -->
		<section class="data-show-section vmc-info-section">
			<div class="left-container">
				<div class="data-row">
					<img :src="memoryIcon">
					<div class="info">
						<label>分区数：</label>
						<span class="value">{{ VMC_PARTITON_COUNT }}</span>
					</div>
				</div>
				<div class="data-row">
					<img :src="taskIcon">
					<div class="info">
						<label>任务数：</label>
						<span class="value">{{ VMC_TASK_COUNT }}</span>
					</div>
				</div>
			</div>
		
			<div class="right-container">
				<div v-if="showChart" class="progress-row">
					<label>CPU：</label>
					<dv-percent-pond :config="vmcCpuConfig" style="width:100%; height:20px;" />
					<span class="percent-value">{{ vmcCpuConfig.value }}%</span>
				</div>
				
				
				<div v-if="showChart" class="progress-row">
					<label>DSP：</label>
					<dv-percent-pond :config="vmcDspConfig" style="width:100%; height:20px;" />
					<span class="percent-value">{{ vmcDspConfig.value }}%</span>
				</div>
			</div>
		</section>
		
		<div class="line-img">
			<img :src="lineImg">
		</div>

		<!-- 主机信息 -->
		<section class="data-show-section">
			<div class="left-container">
				<div class="data-row">
					<img :src="hostIcon">
					<div class="info">
						<label>计算机：</label>
						<span class="value">{{ hostName }}</span>
					</div>
				</div>
				<div class="data-row">
					<img :src="runTimeIcon">
					<div class="info">
						<label>运行时间：</label>
						<span class="value">{{ $formatSecondsTime(hostDetailData['system.uptime'].value) }}</span>
					</div>
				</div>
				<div class="data-row">
					<img :src="cpuIcon">
					<div class="info">
						<label>CPU核数：</label>
						<span class="value">{{ hostDetailData['system.cpu.num'].value }}</span>
					</div>
				</div>
				<div class="data-row">
					<img :src="memoryIcon">
					<div class="info">
						<label>总内存：</label>
						<span class="value">{{ formatMemoryTotal(hostDetailData['vm.memory.size[total]'].value) }}GB</span>
					</div>
				</div>
			</div>

			<div class="right-container">
				<div v-if="showChart" class="progress-row">
					<label>CPU利用率：</label>
					<dv-percent-pond :config="cpuConfig" style="width:100%; height:20px;" />
					<span class="percent-value">{{ cpuConfig.value }}%</span>
				</div>
				<div v-if="showChart" class="progress-row">
					<label>内存利用率：</label>
					<dv-percent-pond :config="memoryConfig" style="width:100%; height:20px;" />
					<span class="percent-value">{{ memoryConfig.value }}%</span>
				</div>
				<div v-if="showChart" class="progress-row">
					<label>磁盘利用率：</label>
					<dv-percent-pond :config="diskConfig" style="width:100%; height:20px;" />
					<span class="percent-value">{{ diskConfig.value }}%</span>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		name: 'DataMonitoring',
		
		props: {
			referencePage: {
				type: String,
				default: 'HOME'
			},
		},

		data() {
			return {
				titleIcon: require('@/assets/images/title/title-icon.png'),
				cpuIcon: require('@/assets/images/dataMonitor/cpu.png'),
				hostIcon: require('@/assets/images/dataMonitor/host-name.png'),
				runTimeIcon: require('@/assets/images/dataMonitor/run-time.png'),
				memoryIcon: require('@/assets/images/dataMonitor/total-memory.png'),
				partitionIcon: require('@/assets/images/dataMonitor/partition.png'),
				taskIcon: require('@/assets/images/dataMonitor/task.png'),
				lineImg: require('@/assets/images/task/line.png'),

				// VMC进度条信息
				vmcCpuConfig: {
					value: 66,
					lineDash: [5, 4],
					borderWidth: 1,
					borderRadius: 0,
					colors: ['#0063af', '#0063af']
				},
				
				vmcDspConfig: {
					value: 50,
					lineDash: [5, 4],
					borderWidth: 1,
					borderRadius: 0,
					colors: ['#0063af', '#0063af']
				},

				// 主机进度条信息
				cpuConfig: {
					value: 66,
					lineDash: [5, 4],
					borderWidth: 1,
					borderRadius: 0,
					colors: ['#E6842E', '#E6842E']
				},
				memoryConfig: {
					value: 48,
					lineDash: [5, 3],
					borderWidth: 1,
					borderRadius: 0,
					colors: ['#E6842E', '#E6842E']
				},
				diskConfig: {
					value: 29,
					lineDash: [5, 3],
					borderWidth: 1,
					borderRadius: 0,
					colors: ['#E6842E', '#E6842E']
				},

				curHostId: 0,
				showChart: false,
				hostList: [],
				hostName: '',
				localCurHostData: {},
				hostDetailData: {
					'system.uptime': {
						value: ''
					}, // 运行时间
					'system.cpu.num': {
						value: ''
					}, // CPU 核数
					'vm.memory.size[total]': {
						value: ''
					}, // 总内存
					'system.cpu.util': {
						value: ''
					}, // CPU利用率
					'vm.memory.utilization': {
						value: ''
					}, // 内存利用率
					'vfs.fs.size[/,pused]': {
						value: ''
					}, // 磁盘利用率

					// 总空间
					'vfs.fs.size[/,total]': {
						value: ''
					},

					// 已用空间
					'vfs.fs.size[/,used]': {
						value: ''
					}
				},
			}
		},

		computed: {
			...mapGetters([
				'CUR_HOST_ID',
				'VMC_TASK_COUNT',
				'VMC_PARTITON_COUNT',
				'INTERACTION_PARENT_MODULE_NAME',
			])
		},

		watch: {
			CUR_HOST_ID(val) {
				if (val) {
					this.curHostId = val
					this.getHostInfo()
					this.getAllHostData()
				}
			}
		},
		
		mounted() {
			if (this.referencePage === 'RCRWQY' || this.referencePage === 'GZFC') {
				this.localCurHostData = this.$storage.getCurHostData()
				this.curHostId = this.localCurHostData.hostId
				this.hostName = this.localCurHostData.ip
				this.getHostInfo()
			}
		},

		methods: {
			...mapMutations(['set_cur_vmc_id', 'set_cur_host_id']),
			
			// 查看详情
			handleViewDetail() {
				const localCurHostData = this.$storage.getCurHostData()
				const {hostId} = localCurHostData
				this.$storage.setHostData({
					hostId,
					hostDetailData: this.hostDetailData,
					usage: {
						cpuConfig: this.cpuConfig,
						memoryConfig: this.memoryConfig,
						diskConfig: this.diskConfig,
					}
			    })
				this.set_cur_vmc_id(0)
				this.set_cur_host_id(0)
				this.$router.push('/detail')
			},
			
			formatMemoryTotal(val) {
				return val ? (val / 1024 / 1024 / 1024).toFixed(3) : 0
			},

			async getAllHostData() {
				const hostData = this.$storage.getCurHostData()
				this.hostName = hostData.ip
			},

			async getHostInfo() {
				const _this = this
				this.showChart = false
				const hostId = this.curHostId

				let json = {
					hostid: hostId,
					items: [
						{
							key: 'system.uptime',
							limit: 1
						},
						{
							key: 'system.cpu.num',
							limit: 1
						},
						{
							key: 'vm.memory.size[total]',
							limit: 1
						},
						{
							key: 'system.cpu.util',
							limit: 1
						},
						{
							key: 'vm.memory.utilization',
							limit: 1
						},
						{
							key: 'vfs.fs.size[/,pused]',
							limit: 1
						},
						{
							key: 'vfs.fs.size[/,total]',
							limit: 1
						},
						{
							key: 'vfs.fs.size[/,used]',
							limit: 1
						},
					]
				}
				const {
					data: hostInfo
				} = await this.$axios.post(`${this.$apis.host}`, json)

				let keys = Object.keys(this.hostDetailData)
				keys.map(key => {
					let result = hostInfo.find(e => e.key === key)
					if (result) {
						let {
							items
						} = result
						if (items.length) {
							this.$set(_this.hostDetailData[key], 'value', items[0].value)
						} else {
							this.$set(_this.hostDetailData[key], 'value', '')
						}
					}
				})

				// CPU利用率
				let cpu = `${Number(this.hostDetailData['system.cpu.util'].value).toFixed(1)}`
				this.$set(this.cpuConfig, 'value', cpu)

				// 内存利用率
				let memory = `${Number(this.hostDetailData['vm.memory.utilization'].value).toFixed(1)}`
				this.$set(this.memoryConfig, 'value', memory)

				// 磁盘利用率
				let disk = `${Number(this.hostDetailData['vfs.fs.size[/,pused]'].value).toFixed(1)}`
				this.$set(this.diskConfig, 'value', disk)
				this.showChart = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.data-monitoring-wrapper {
		width: 100%;
		height: 100%;
		background: url('@/assets/images/banner/action-area-bg.png') no-repeat;
		background-size: 100% 100%;
		display: flex;
		flex-flow: column;

		.title {
			display: flex;
			align-items: center;
			height: 37px;

			.container {
				width: 100%;
				height: 100%;
				padding-left: 15px;
				@include flex-space-between;
				
				.left{
					display: flex;
					align-items: center;
					
					span {
						color: #DFEEF3;
						font-size: 16px;
						padding-left: 10px;
					}
				}
				
				.right{
					color: #E6842E;
					font-weight: bolder;
					cursor: pointer;
				}
			}
		}

		.data-show-section {
			@include flex-vertical-center;
			padding: 0 20px;
			flex: 1;

			.left-container {
				flex: 0.7;
				height: 100%;
				display: flex;
				flex-flow: column;
				justify-content: space-around;

				.data-row {
					display: flex;
					align-items: center;

					.info {
						font-size: 15px;
						font-family: Alibaba-PuHuiTi-M;

						label {
							color: #95AAC9;
							@include text-justify;
							padding-left: 10px;
						}

						span {
							color: #E6842E;
							font-weight: 600;
						}
					}
				}
			}

			.right-container {
				flex: 1;
				height: 100%;
				display: flex;
				flex-flow: column;
				justify-content: space-around;

				.progress-row {
					display: flex;
					align-items: center;
					color: #95AAC9;
					font-size: 15px;

					label {
						@include text-justify;
						width: 11em;
						padding-right: 10px;
						text-align-last: end;
					}

					.percent-value {
						color: #E1EDFE;
						font-weight: bold;
						font-size: 18px;
						padding-left: 10px;
					}
				}
			}
		}
	}
	
	.vmc-info-section{
		flex: 0.5 !important;
		
		.info{
			.value{
				color: #0063af !important;
			}
		}
	}
	
	.line-img {
		padding: 0 20px;
		display: flex;
		
		img{
			width: 100%;
		}
	}
</style>
