<template>
	<div class="vmc-host-state-wrapper">
		<div class="title">
			<div class="container">
				<img :src="titleIcon">
				<span>VMC运行状态图</span>
			</div>
		</div>

		<div class="content-container">
			<div class="top">
				<!-- 运行状态 -->
				<vmc-run-state
					:vmc1Name="vmc1Data.name"
					:vmc2Name="vmc2Data.name"
					:vmc1HostList="vmc1Data.hostList"
					:vmc2HostList="vmc2Data.hostList">
				</vmc-run-state>
			</div>

			<div class="bottom">
				<div class="area-task-row vmc1-task-row">
					<task :taskList="vmc1Data.taskList"></task>
				</div>

				<div class="area-task-row vmc2-task-row">
					<task :taskList="vmc2Data.taskList"></task>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	// 交互体验区vmc主机运行状态
	import VmcRunState from '../global/VmcHostRunState.vue'
	import Task from '../global/Task.vue'

	export default {
		name: 'index',

		components: {
			Task,
			VmcRunState
		},

		data() {
			return {
				titleIcon: require('@/assets/images/title/title-icon.png'),
				localHostData: {},
				vmcHostList: [],
				vmc1Data: {
					id: 0,
					name: '',
					hostList: [],
					taskList: []
				},
				vmc2Data: {
					id: 0,
					name: '',
					hostList: [],
					taskList: []
				},
				showSection: false
			}
		},

		mounted() {
			this.initData()
		},

		methods: {
			initData() {
				this.showSection = false
				this.localHostData = this.$storage.getVmcPduData()
				const {vmcData} = this.localHostData
				const {vmc1, vmc2} = vmcData
				this.vmc1Data.id = vmc1.id
				this.vmc1Data.name = vmc1.name
				this.vmc1Data.hostList = [vmc1.hostA, vmc1.hostB, vmc1.hostC]
				this.vmc2Data.id = vmc2.id
				this.vmc2Data.name = vmc2.name
				this.vmc2Data.hostList = [vmc2.hostA, vmc2.hostB, vmc2.hostC]
				this.getVmcPartitionData(this.vmc1Data.id, 'VMC1')
				this.getVmcPartitionData(this.vmc2Data.id, 'VMC2')
				this.showSection = true
			},
			
			// 获取VMC分区任务数据
			async getVmcPartitionData(vmcId, type) {
				let {
					data: partitionData
				} = await this.$axios.get(`${this.$apis.vmc}/${vmcId}`)
				const listData = partitionData.partitions
				if (type === 'VMC1') this.vmc1Data.taskList = listData
				if (type === 'VMC2') this.vmc2Data.taskList = listData
			},
		}
	}
</script>

<style lang="scss" scoped>
	.vmc-host-state-wrapper {
		width: 100%;
		height: 100%;
		background: url('@/assets/images/interactiveExperience/banner3.png') no-repeat;
		background-size: 100% 100%;
		display: flex;
		flex-flow: column;

		.title {
			display: flex;
			align-items: center;
			height: 35px;

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

		.content-container {
			flex: 1;
			padding: 15px;
			display: flex;
			flex-flow: column;

			.top {
				flex: 0.25;
				margin-bottom: 15px;
			}

			.bottom {
				flex: 1;
				display: flex;
			}

			.area-task-row {
				flex: 1;
				
				&:first-child{
					margin-right: 25px;
				}

				/deep/.list-container {
					height: 100%;
					margin-top: 0;

					.area-name {
						height: 40px;
						font-size: 17px;
					}

					.task .list .item:not(:last-child) {
						margin-bottom: 7px;
					}
				}
			}
		}
	}
</style>
