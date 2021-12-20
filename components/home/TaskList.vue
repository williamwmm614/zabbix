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
				pduTaskList: [],
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
			...mapGetters(['CUR_VMC_ID', 'HOST_ACTIVATED']),
		},

		watch: {
			CUR_VMC_ID(val) {
				if (val) {
					this.showVmcTaskListComponent = true
					// this.getVmcPartitionData(val)
					// this.clearVmcInterval()
				}
			},
			
			HOST_ACTIVATED(index) {
				this.showVmcTaskListComponent = false
				this.showPduTaskListComponent = false
				if (index >= 7 && index <= 10) {
					// this.clearVmcInterval()
					this.showPduTaskListComponent = true
				} else {
					this.getVmcPartitionData(this.CUR_VMC_ID)
					this.showVmcTaskListComponent = true
					// this.repeatGetVmcData(this.CUR_VMC_ID)
				}
			}
		},

		mounted() {
			this.getPduPartitionData()
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
			
			// 定时获取VMC数据，不根据主机轮询获取，5S获取一次
			repeatGetVmcData(vmcId) {
				console.log(vmcId)
				const _this = this
				setInterval(() => {
					_this.getVmcPartitionData(vmcId)
				}, 3 * 1000)
			},
			
			// 获取 VMC 任务栈数据
			async getVmcPartitionData(vmcId) {
				this.showTaskList = false
				let {
					data: partitionData
				} = await this.$axios.get(`${this.$apis.vmc}/${vmcId}`)
				this.partitionData = partitionData
				this.vmcTaskList = this.partitionData.partitions
				
				const {partitionCount, taskCount} = partitionData 
				this.set_vmc_task_count(taskCount)
				this.set_vmc_partition_count(partitionCount)
				this.showTaskList = true
			},
	
			// 直接获取两个PDU的任务栈
			async getPduPartitionData() {
				this.showPduTaskList = false
				this.pduTaskCount = 0
				this.pduTaskList = []
				let {data: rtuData} = await this.$axios.get(`${this.$apis.rtu}/48`)
				this.pduTaskCount += rtuData.taskCount
				let {data: rtu2Data} = await this.$axios.get(`${this.$apis.rtu}/49`)
				this.pduTaskCount += rtu2Data.taskCount
				this.pduTaskList.push(rtuData)
				this.pduTaskList.push(rtu2Data)
				this.showPduTaskList = true
			},

			clearAreaInterval() {
				clearInterval(this.areaTimer)
				this.areaTimer = null
				this.areaActiveIndex = 1
			},

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
