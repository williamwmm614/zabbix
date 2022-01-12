<template>
	<div class="vmc-host-run-state-wrapper">
		<div class="container">
			<div class="vmc-container">
				<div class="vmc-name"><span>{{ vmc1Name }}</span></div>
				
				<div class="host-wrapper">
					<div
						class="host"
						v-for="(host, index) in vmc1HostList"
						:key="host.host"
						:class="{'host-activated': hostActiveIndex === index + 1}"
						@click="handleHostClick(index + 1, host)">
						<img :src="hostRunImg">
						<!-- <img v-if="host.available === 1" :src="hostRunImg">
						<img v-else :src="hostDoneImg"> -->
						<p>{{ host.host }}</p>
					</div>
				</div>
			</div>
		</div>
		
		<div class="container">
			<div class="vmc-container">
				<div class="vmc-name"><span>{{ vmc2Name }}</span></div>
						
				<div class="host-wrapper">
					<div
						class="host"
						v-for="(host, index) in vmc2HostList"
						:key="host.host"
						:class="{'host-activated': hostActiveIndex === index + 4}"
						@click="handleHostClick(index + 4, host)">
						<img :src="hostRunImg">
						<!-- <img v-else :src="hostDoneImg"> -->
						<!-- <img v-if="host.available === 1" :src="hostRunImg">
						<img v-else :src="hostDoneImg"> -->
						<p>{{ host.host }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex'
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
			}
		},

		data() {
			return {
				hostRunImg: require('@/assets/images/hostState/host-run.png'),
				hostDoneImg: require('@/assets/images/hostState/host-done.png'),
				hostActiveIndex: 0,
				hostTimer: null,
				localHostData: {},
				localCurHostId: 0,
				vmc1HostList: [],
				vmc2HostList: []
			}
		},
		
		computed: {
			...mapGetters(['INTERACTION_PARENT_MODULE_NAME'])
		},
		
		mounted() {
			this.localHostData = this.$storage.getVmcPduData()
			const localCurHostData = this.$storage.getCurHostData()
			this.localCurHostId = localCurHostData.hostId
			
			const {vmcData} = this.localHostData
			const {vmc1, vmc2} = vmcData
			this.vmc1HostList = [vmc1.hostA, vmc1.hostB, vmc1.hostC]
			this.vmc2HostList = [vmc2.hostA, vmc2.hostB, vmc2.hostC]
			
			// this.repeatHost('FIRST')
		},

		methods: {
			...mapMutations([
				'set_cur_host_id',
				'set_host_activated'
			]),
			
			// 主机点击事件
			handleHostClick(index, host) {
				if (this.INTERACTION_PARENT_MODULE_NAME === 'RCRWQY') return
				if (index === this.hostActiveIndex) return
				this.hostActiveIndex = index
				this.$emit('emitHostClick', host)
			},
			
			// 存储轮询主机ID
			async setHostIdVuex(hostIndex) {
				const {vmcData, pduData} = this.localHostData
				const {vmc1, vmc2} = vmcData
				const {pdu1, pdu2} = pduData
				const hostIdJson = {
					1: vmc1.hostA.hostId,
					2: vmc1.hostB.hostId,
					3: vmc1.hostC.hostId,
					4: vmc2.hostA.hostId,
					5: vmc2.hostB.hostId,
					6: vmc2.hostC.hostId
				}
				
				const hostDataJson = {
					1: vmc1.hostA,
					2: vmc1.hostB,
					3: vmc1.hostC,
					4: vmc2.hostA,
					5: vmc2.hostB,
					6: vmc2.hostC,
				}
				
				// this.set_host_activated(hostIndex)
				this.set_cur_host_id(hostIdJson[hostIndex])
				this.$storage.setCurHostData(hostDataJson[hostIndex])
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
				}
				// else {
				// 	this.hostActiveIndex = 1
				// }
				
				this.setHostIdVuex(this.hostActiveIndex)
			},
			
			repeatHost(type) {
				const _this = this
				this.setFirstData(type)
				
				// this.hostTimer = setInterval(this.handleHost, 10 * 1000)
				// this.$once('hook:beforeDestroy', () => {
				// 	_this.clearHostIntervalTask()
				// })
				
				// this.handleHost()
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
				line-height: 45px;
				text-align: center;
				background: url('@/assets/images/hostState/title-bg.png') no-repeat;
				background-size: 100% 100%;
				color: #DFEEF3;
				font-size: 16px;
				font-weight: bold;
				// @include flex-level-center;
			}

			.host-wrapper {
				flex: 0.9;
				@include flex-space-around;

				.host {
					text-align: center;
					cursor: pointer;

					p {
						color: $main-text-color;
						font-weight: bold;
						font-size: 15px;
					}
					
					img{
						width: 5.625rem;
					}
					
					&-activated {
						img{
							background: linear-gradient(0deg, transparent 50%, #d77a29 50%) repeat-y,   // 左边框
							            linear-gradient(0deg, transparent 50%, #d77a29 50%) repeat-y,  // 右边框
							            linear-gradient(90deg, transparent 50%, #d77a29 50%) repeat-x, // 上边框
							            linear-gradient(90deg, transparent 50%, #d77a29 50%) repeat-x; // 下边框
							
							background-size: 2px 12px, 2px 12px, 12px 2px, 12px 2px;
							background-position:  0, 100% 0, 0 0, 0 100%;
							// animation: lineScroll 1s infinite linear;
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
