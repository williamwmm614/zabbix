<template>
	<div class="data-monitoring-wrapper">
		<div class="title">
			<div class="container">
				<div class="left">
					<img :src="titleIcon">
					<span>数据监控</span>
				</div>
				
				<!-- <div v-if="INTERACTION_PARENT_MODULE_NAME === 'HOME'" class="right">
					<div class="view-detail" @click="handleViewDetail">
					  <i class="element-icons icon-xiangqing"></i>
					  查看详情
					</div>
				</div> -->
			</div>
		</div>
		
		<!-- VMC信息 -->
		<section v-if="hostData" class="data-show-section vmc-info-section">
			<div class="left-container">
				<div class="data-row">
					<img :src="memoryIcon">
					<div class="info">
						<label>分区数：</label>
						<span class="value">{{ CUR_HOST_ID === 48 || CUR_HOST_ID === 49 ? 0 : hostData.partitionCount }}</span>
					</div>
				</div>
				<div class="data-row">
					<img :src="taskIcon">
					<div class="info">
						<label>任务数：</label>
						<span class="value">{{ hostData.taskCount }}</span>
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
		<section v-if="hostData" class="data-show-section">
			<div class="left-container">
				<div class="data-row">
					<img :src="hostIcon">
					<div class="info">
						<label>计算机：</label>
						<span class="value">{{ hostName }}</span>
					</div>
				</div>
				<!-- <div class="data-row">
					<img :src="runTimeIcon">
					<div class="info">
						<label>运行时间：</label>
						<span class="value">{{ $formatSecondsTime(hostDetailData['system.uptime'].value) }}</span>
					</div>
				</div> -->
				<div class="data-row">
					<img :src="cpuIcon">
					<div class="info">
						<label>CPU核数：</label>
						<span class="value">1</span>
						<!-- <span class="value">{{ hostDetailData['system.cpu.num'].value }}</span> -->
					</div>
				</div>
				<div class="data-row">
					<img :src="memoryIcon">
					<div class="info">
						<label>总内存：</label>
						<span class="value">{{ (hostData.memory * 0.1).toFixed(1) }}GB</span>
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
				
				hostData: null,

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
				dataTimer: null
			}
		},

		computed: {
			...mapGetters([
				'CUR_HOST_ID',
				'HOST_ACTIVATED',
				'INTERACTION_PARENT_MODULE_NAME',
			])
		},

		watch: {
			CUR_HOST_ID(id) {
				if (id) {
					this.clearDataInterval()
					this.curHostId = id
					this.getAllHostData()
					if (id !== 48 && id !== 49) this.repeatGetData()
				}
			},
		},
		
		mounted() {
			this.localCurHostData = this.$storage.getCurHostData()
			this.curHostId = this.localCurHostData.hostId
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
			
			clearDataInterval() {
				clearInterval(this.dataTimer)
				this.dataTimer = null
			},
			
			repeatGetData() {
				const _this = this
				let module = this.INTERACTION_PARENT_MODULE_NAME !== 'RCRWQY' && this.INTERACTION_PARENT_MODULE_NAME !== 'GZFC'
				if (module) {
					this.dataTimer = setInterval(() => {
						_this.getHostInfo()
					}, 1000)
					
					this.$once('hook:beforeDestory', () => {
						_this.clearDataInterval()
					})
				} else {
					this.getHostInfo()
				}
			},

			async getAllHostData() {
				const hostData = this.$storage.getCurHostData()
				this.hostName = hostData.host
			},

			async getHostInfo() {
				const _this = this
				this.showChart = false
				this.hostData = null
				const hostId = this.curHostId
				
				let url = this.$apis.vmc
				let module = this.INTERACTION_PARENT_MODULE_NAME !== 'RCRWQY' && this.INTERACTION_PARENT_MODULE_NAME !== 'GZFC'
				if (this.hostName.includes('RTU') && module) url = this.$apis.rtu
				const {
					data: hostInfo
				} = await this.$axios.get(`${url}/${hostId}`)

				this.hostData = hostInfo
				
				const {
					cpu,
					dsp,
					cpuUtilize,
					diskUtilize,
					memoryUtilize
				} = hostInfo
				this.$set(this.vmcCpuConfig, 'value', cpu)
				// 轮询到DSP主机时，DSP值写死为0
				if (hostId === 17 || hostId === 18 || hostId === 32 || hostId === 33 || hostId === 34) {
					this.$set(this.vmcDspConfig, 'value', 0)
				} else {
					this.$set(this.vmcDspConfig, 'value', dsp)
				}

				// CPU利用率
				this.$set(this.cpuConfig, 'value', cpuUtilize)

				// 内存利用率
				this.$set(this.memoryConfig, 'value', memoryUtilize)

				// 磁盘利用率
				this.$set(this.diskConfig, 'value', diskUtilize)
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
						
						p {
							color: #95AAC9;
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
