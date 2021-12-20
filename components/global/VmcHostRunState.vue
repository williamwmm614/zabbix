<template>
	<div class="vmc-host-run-state-wrapper">
		<div class="container">
			<div class="vmc-container">
				<div class="vmc-name">{{ vmc1Name }}</div>
				
				<div class="host-wrapper">
					<div
						class="host"
						:class="hostActiveIndex === index + 1 ? 'host-activated' : ''"
						v-for="(host, index) in vmc1HostList"
						:key="host.host">
						<img v-if="host.available === 1" :src="hostRunImg">
						<img v-else :src="hostDoneImg">
						<p>{{ host.host }}</p>
					</div>
				</div>
			</div>
		</div>
		
		<div class="container">
			<div class="vmc-container">
				<div class="vmc-name">{{ vmc2Name }}</div>
						
				<div class="host-wrapper">
					<div
						class="host"
						:class="hostActiveIndex === index + 4 ? 'host-activated' : ''"
						v-for="(host, index) in vmc2HostList"
						:key="host.host">
						<img v-if="host.available === 1" :src="hostRunImg">
						<img v-else :src="hostDoneImg">
						<p>{{ host.host }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapMutations, mapGetters} from 'vuex'
	export default {
		name: 'VmcHostRunState',

		props: {
			vmc1Name: {
				type: String,
				default: ''
			},
			
			vmc2Name: {
				type: String,
				default: ''
			},

			vmc1HostList: {
				type: Array,
				default: () => []
			},
			
			vmc2HostList: {
				type: Array,
				default: () => []
			}
		},

		data() {
			return {
				hostRunImg: require('@/assets/images/hostState/host-run.png'),
				hostDoneImg: require('@/assets/images/hostState/host-done.png'),
				hostActiveIndex: 1,
				hostTimer: null,
				localHostData: {},
				localCurHostId: 0
			}
		},
		
		mounted() {
			this.localHostData = this.$storage.getVmcPduData()
			const localCurHostData = this.$storage.getCurHostData()
			this.localCurHostId = localCurHostData.hostId
			setTimeout(() => {
				this.repeatHost('FIRST')
			}, 500)
		},

		methods: {
			...mapMutations([
				'set_cur_host_id'
			]),
			
			// 存储轮询主机ID
			setHostIdVuex(hostIndex) {
				const {vmcData, pduData} = this.localHostData
				const {vmc1, vmc2} = vmcData
				const {pdu1, pdu2} = pduData
				const hostIdJson = {
					1: vmc1.hostA.hostId,
					2: vmc1.hostB.hostId,
					3: vmc1.hostC.hostId,
					4: vmc2.hostA.hostId,
					5: vmc2.hostB.hostId,
					6: vmc2.hostC.hostId,
					7: pdu1.hostId,
					8: pdu2.hostId
				}
				
				this.set_cur_host_id(hostIdJson[hostIndex])
			},
			
			clearHostIntervalTask() {
				clearInterval(this.hostTimer)
				this.hostTimer = null
			},
			
			setFirstData(type) {
				if (type === 'FIRST') {
					// 查找本地 hostId 是对应哪一台主机，找到其下标, 从该台主机进行轮询
					let vmc1HostList = this.vmc1HostList
					let vmc2HostList = this.vmc2HostList
					const hostListAll = vmc1HostList.concat(vmc2HostList)
					let existIndex = hostListAll.findIndex(e => e.hostId === this.localCurHostId)
					this.hostActiveIndex = existIndex !== -1 ? existIndex + 1 : 1
				} else {
					this.hostActiveIndex = 1
				}
				
				this.setHostIdVuex(this.hostActiveIndex)
			},
			
			repeatHost(type) {
				const _this = this
				this.setFirstData(type)
				
				this.hostTimer = setInterval(this.handleHost, 10 * 1000)
				this.$once('hook:beforeDestroy', () => {
					_this.clearHostIntervalTask()
				})
			},
			
			handleHost() {
				if (this.hostActiveIndex === 6) {
					this.clearHostIntervalTask()
					this.repeatHost()
					return
				}
				this.hostActiveIndex++
				this.setHostIdVuex(this.hostActiveIndex)
			}
		}
	}
</script>

<style lang="scss" scoped>
	$main-text-color: #95AAC9;

	.vmc-host-run-state-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: centr;

		.container {
			width: 100%;
			height: 100%;
			background: url('@/assets/images/hostState/state-bg2.png') no-repeat;
			background-size: 100% 100%;
			
			&:first-child{
				margin-right: 25px;
			}
			
			.vmc-container{
				width: 90%;
				height: 100%;
				margin: auto;
				@include flex-space-between;
			}

			.vmc-name {
				width: 85px;
				height: 40px;
				background: url('@/assets/images/hostState/title-bg.png') no-repeat;
				background-size: 100% 100%;
				color: #DFEEF3;
				font-size: 16px;
				font-weight: bold;
				@include flex-level-center;
			}

			.host-wrapper {
				flex: 0.9;
				@include flex-space-around;

				.host {
					text-align: center;

					p {
						color: $main-text-color;
						font-weight: bold;
						font-size: 15px;
					}
					
					&-activated {
						img{
							background: linear-gradient(0deg, transparent 50%, #d77a29 50%) repeat-y,   // 左边框
							            linear-gradient(0deg, transparent 50%, #d77a29 50%) repeat-y,  // 右边框
							            linear-gradient(90deg, transparent 50%, #d77a29 50%) repeat-x, // 上边框
							            linear-gradient(90deg, transparent 50%, #d77a29 50%) repeat-x; // 下边框
							
							background-size: 2px 12px, 2px 12px, 12px 2px, 12px 2px;
							background-position:  0, 100% 0, 0 0, 0 100%;
							animation: lineScroll 1s infinite linear;
						}
					}
					
					@keyframes lineScroll {
					  from {}
					  to {
					    // 比如第一个表示0 -12px在动画中表示左边框一秒内上移12px,视觉上就形成了向上滑动的效果
					    background-position: 0 -12px, 100% 12px, 12px 0, -12px 100%;
					  }
					}
				}
			}
		}
	}
</style>
