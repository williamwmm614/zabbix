<template>
	<div class="task-wrapper">
		<div class="task-list-container">
			<section class="header-container">
				<div class="info-row">
					<div class="info">
						<label>分区总数：</label>
						<span>{{ partitionCount }}</span>
					</div>
					<div class="info">
						<label>总任务数：</label>
						<span>{{ taskCount }}</span>
					</div>
				</div>
				<img :src="lineImg">
			</section>

			<section v-if="showHost" class="host-state-wrapper">
				<div class="vmc-host-row">
					<div class="host">
						<img v-if="localHostData.vmcData.vmc1.hostA.available === 1" :src="hostRunImg">
						<img v-else :src="hostDoneImg">
						<p>{{ $replaceStr(localHostData.vmcData.vmc1.hostA.host, '计算机') }}</p>
					</div>

					<div class="host">
						<img v-if="localHostData.vmcData.vmc1.hostB.available === 1" :src="hostRunImg">
						<img v-else :src="hostDoneImg">
						<p>{{ $replaceStr(localHostData.vmcData.vmc1.hostB.host, '计算机') }}</p>
					</div>

					<div class="host">
						<img v-if="localHostData.vmcData.vmc1.hostC.available === 1" :src="hostRunImg">
						<img v-else :src="hostDoneImg">
						<p>{{ $replaceStr(localHostData.vmcData.vmc1.hostC.host, '计算机') }}</p>
					</div>

					<div class="host">
						<img v-if="localHostData.vmcData.vmc2.hostA.available === 1" :src="hostRunImg">
						<img v-else :src="hostDoneImg">
						<p>{{ $replaceStr(localHostData.vmcData.vmc2.hostA.host, '计算机') }}</p>
					</div>

					<div class="host">
						<img v-if="localHostData.vmcData.vmc2.hostB.available === 1" :src="hostRunImg">
						<img v-else :src="hostDoneImg">
						<p>{{ $replaceStr(localHostData.vmcData.vmc2.hostB.host, '计算机') }}</p>
					</div>

					<div class="host">
						<img v-if="localHostData.vmcData.vmc2.hostC.available === 1" :src="hostRunImg">
						<img v-else :src="hostDoneImg">
						<p>{{ $replaceStr(localHostData.vmcData.vmc2.hostC.host, '计算机') }}</p>
					</div>
				</div>

				<div class="pdu-host-row">
					<div class="host pdu1">
						<img v-if="localHostData.pduData.pdu1.available === 1" :src="pduRunImg">
						<img v-else :src="pduDoneImg">
						<p>{{ localHostData.pduData.pdu1.host }}</p>
					</div>

					<div class="host pdu2">
						<img v-if="localHostData.pduData.pdu2.available === 1" :src="pduRunImg">
						<img v-else :src="pduDoneImg">
						<p>{{ localHostData.pduData.pdu2.host }}</p>
					</div>
					
					<div class="host pdu3">
						<img :src="pduDoneImg">
						<p>RTU-3</p>
					</div>
					
					<div class="host pdu4">
						<img :src="pduDoneImg">
						<p>RTU-4</p>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'HostState',

		data() {
			return {
				lineImg: require('@/assets/images/task/line.png'),
				hostDoneImg: require('@/assets/images/hostState/host-done.png'),
				hostRunImg: require('@/assets/images/hostState/host-run.png'),
				pduDoneImg: require('@/assets/images/hostState/pdu-done.png'),
				pduRunImg: require('@/assets/images/hostState/pdu-run.png'),
				localHostData: {},
				showHost: false,
				partitionCount: 0,
				taskCount: 0
			}
		},

		mounted() {
			this.initData()
		},

		methods: {
			initData() {
				const _this = this
				setTimeout(() => {
					_this.showHost = false
					_this.localHostData = this.$storage.getVmcPduData()
					_this.showHost = true
					_this.getPartitionData()
				}, 1000)
			},
			
			async getPartitionData() {
				let {
					data: partitionData
				} = await this.$axios.get(`${this.$apis.vmc}/${this.localHostData.vmcData.vmc1.id}`)
				
				let {
					data: partitionData2
				} = await this.$axios.get(`${this.$apis.vmc}/${this.localHostData.vmcData.vmc2.id}`)
			
				// 所有分区总数
				this.partitionCount = partitionData.partitionCount + partitionData2.partitionCount
			
				let {data: pduData} = await this.$axios.get(`${this.$apis.rtu}/${this.localHostData.pduData.pdu1.id}`)
				let {data: pduData2} = await this.$axios.get(`${this.$apis.rtu}/${this.localHostData.pduData.pdu2.id}`)
				this.taskCount = pduData.taskCount + pduData2.taskCount + partitionData.taskCount + partitionData2.taskCount
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

			.host-state-wrapper {
				flex: 1;
				@include flex-level-center;
				flex-flow: column;

				.host {
					text-align: center;

					p {
						color: $main-text-color;
						font-size: 15px;
						font-weight: 600;
					}
				}

				.vmc-host-row {
					width: 100%;
					padding-bottom: 20px;
					@include flex-space-around;
				}

				.pdu-host-row {
					width: 90%;
					@include flex-space-around;

					.pdu1 {
						padding-right: 10px;
					}
				}
			}
		}
	}
</style>
