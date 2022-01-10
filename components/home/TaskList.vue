<template>
	<div class="task-wrapper">
		<div class="task-list-container">
			<section class="header-container">
				<div v-if="showVmcTaskListComponent" class="info-row">
					<div class="info">
						<label>分区总数：</label>
						<span>{{ partitionData.partitionCount }}</span>
					</div>
					<div class="vmc-name">{{ partitionData.name }}</div>
					<div class="info">
						<label>总任务数：</label>
						<span>{{ partitionData.taskCount }}</span>
					</div>
				</div>
				
				<div v-if="showPduTaskListComponent" class="info-row">
					<div class="info">
						<label>总事务数：</label>
						<span>{{ pduTaskCount }}</span>
					</div>
				</div>
				<img :src="lineImg">
			</section>

			<!-- VMC 任务列表 -->
			<task v-if="showVmcTaskListComponent && showTaskList" :taskList="vmcTaskList"></task>
			<!-- PDU 任务列表 -->
			<pdu-task v-if="showPduTaskListComponent && showPduTaskList" :taskList="pduTaskList"></pdu-task>
		</div>
	</div>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex'
	import Task from '../global/Task.vue'
	import PduTask from '../global/PduTask.vue'

	export default {
		name: 'TaskList',

		components: {
			Task,
			PduTask
		},

		data() {
			return {
				lineImg: require('@/assets/images/task/line.png'),
				showTaskList: false,
				vmcTaskList: [],
				partitionData: {},
				
				showPduTaskList: false,
				pduTaskList: [],
				pduTaskCount: 0,
				
				showVmcTaskListComponent: false,
				showPduTaskListComponent: false,

				areaActiveIndex: 1,
				areaTimer: null,
				vmcTimer: null
			}
		},

		computed: {
			...mapGetters(['HOST_ACTIVATED', 'CUR_HOST_ID']),
		},

		watch: {
			CUR_HOST_ID: {
				immediate: true,
				handler(id) {
					if (id) {
						this.clearVmcInterval()
						this.showVmcTaskListComponent = false
						this.showPduTaskListComponent = false
						if (id === 48 || id === 49) {
							this.getPduPartitionData(id)
							this.showPduTaskListComponent = true
						} else {
							this.repeatGetVmcData(id)
							this.showVmcTaskListComponent = true
						}
					} 
				}
			}
		},

		mounted() {
		},

		methods: {
			...mapMutations([
				'set_vmc_task_count',
				'set_vmc_partition_count'
			]),
			
			clearVmcInterval() {
				clearInterval(this.vmcTimer)
				this.vmcTimer = null
			},
			
			// 定时获取VMC数据，不根据主机轮询获取，1S获取一次
			repeatGetVmcData(id) {
				const _this = this
				this.vmcTimer = setInterval(() => {
					_this.getVmcPartitionData(id)
				}, 1000)
				this.$once('hook:beforeDestroy', () => {
					_this.clearVmcInterval()
				})
			},
			
			// 获取 VMC 任务栈数据
			async getVmcPartitionData(hostId) {
				this.showTaskList = false
				let {
					data: partitionData
				} = await this.$axios.get(`${this.$apis.vmc}/${hostId}`)
				this.partitionData = partitionData
				this.vmcTaskList = this.partitionData.partitions
				this.showTaskList = true
			},
	
			// 直接获取两个PDU的任务栈
			async getPduPartitionData(id) {
				this.showPduTaskList = false
				this.pduTaskCount = 0
				this.pduTaskList = []
				let {data: rtuData} = await this.$axios.get(`${this.$apis.rtu}/${id}`)
				this.pduTaskCount = rtuData.taskCount
				this.pduTaskList.push(rtuData)
				this.showPduTaskList = true
			},

			clearAreaInterval() {
				clearInterval(this.areaTimer)
				this.areaTimer = null
				this.areaActiveIndex = 1
			},

			// 暂不使用
			repeatArea() {
				const len = this.taskList.length
				const _this = this
				let seconds = 30 / len * 1000
				this.areaTimer = setInterval(() => {
					if (_this.areaActiveIndex === len) {
						_this.clearAreaInterval()
						return
					}
					_this.areaActiveIndex++
				}, seconds)
			}
		}
	}
</script>

<style lang="scss" scoped>
	$main-text-color: #95AAC9;

	.task-wrapper {
		height: 100%;

		.task-list-container {
			height: 100%;
			padding: 10px;
			display: flex;
			flex-flow: column;

			.header-container {
				.info-row {
					@include flex-space-between;
					
					.vmc-name{
						color: $main-text-color;
						font-weight: bolder;
					}

					.info {
						font-size: 15px;

						label {
							color: $main-text-color;
						}

						span {
							color: #E6842E;
							font-weight: bold;
						}
					}
				}

				img {
					width: 100%;
				}
			}

			.list-wrapper {
				flex: 1;
				margin-top: 5px;
				@include flex-space-between;

				.task {
					// flex: 1;
					width: 20%;
					height: 100%;
					background: url(@/assets/images/task/banner.png) no-repeat;
					background-size: 100% 100%;
					display: flex;
					flex-flow: column;

					&:not(:last-child) {
						margin-right: 15px;
					}

					.area-name {
						height: 30px;
						color: #C9DBF5;
						font-size: 15px;
						font-weight: bolder;
						letter-spacing: 3px;
						@include flex-level-center;
					}

					.list {
						flex: 1;
						padding: 8px 0;
						display: flex;
						flex-flow: column;

						.item {
							width: 85%;
							height: 16.6%;
							margin: auto;
							background: url(@/assets/images/task/blue.png) no-repeat;
							background-size: 100% 100%;
							color: #C9DBF5;
							font-size: 15px;
							font-weight: bolder;
							@include flex-level-center;

							&:nth-child(3) {
								background: url(@/assets/images/task/green.png) no-repeat;
								background-size: 100% 100%;
							}

							&:last-child {
								background: url(@/assets/images/task/yellow.png) no-repeat;
								background-size: 100% 100%;
							}

							&:not(:last-child) {
								margin-bottom: 5px;
							}
						}
					}
				}
			}
		}
	}
</style>
