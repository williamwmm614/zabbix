<template>
	<div class="topology-page-wrapper">
		<div class="topology-page-container">
			<div class="host-row">
				<div class="left host-container">
					<div
						class="host" :class="hostActivatedIndex === 1 ? 'host-activated' : ''"
						@click="handleHostClick(1, vmcData.vmc1.hostA, 'HOST')">
						<img v-if="hostActivatedIndex === 1" :src="hostActiveGif">
						<img v-else :src="hostImgUrl">
						<p>{{ vmcData.vmc1.hostA.alias }}</p>
					</div>
					<div
						class="host" :class="hostActivatedIndex === 2 ? 'host-activated' : ''"
						@click="handleHostClick(2, vmcData.vmc1.hostB, 'HOST')">
						<img v-if="hostActivatedIndex === 2" :src="hostActiveGif">
						<img v-else :src="hostImgUrl">
						<p>{{ vmcData.vmc1.hostB.alias }}</p>
					</div>
					<div
						class="host" :class="hostActivatedIndex === 3 ? 'host-activated' : ''"
						@click="handleHostClick(3, vmcData.vmc1.hostC, 'HOST')">
						<img v-if="hostActivatedIndex === 3" :src="hostActiveGif">
						<img v-else :src="hostImgUrl">
						<p>{{ vmcData.vmc1.hostC.alias }}</p>
					</div>
				</div>
				
				<div class="right host-container">
					<div
						class="host" :class="hostActivatedIndex === 4 ? 'host-activated' : ''"
						@click="handleHostClick(4, vmcData.vmc2.hostA, 'HOST')">
						<img v-if="hostActivatedIndex === 4" :src="hostActiveGif">
						<img v-else :src="hostImgUrl">
						<p>{{ vmcData.vmc2.hostA.alias }}</p>
					</div>
					<div
						class="host" :class="hostActivatedIndex === 5 ? 'host-activated' : ''"
						@click="handleHostClick(5, vmcData.vmc2.hostB, 'HOST')">
						<img v-if="hostActivatedIndex === 5" :src="hostActiveGif">
						<img v-else :src="hostImgUrl">
						<p>{{ vmcData.vmc2.hostB.alias }}</p>
					</div>
					<div
						class="host" :class="hostActivatedIndex === 6 ? 'host-activated' : ''"
						@click="handleHostClick(6, vmcData.vmc2.hostC, 'HOST')">
						<img v-if="hostActivatedIndex === 6" :src="hostActiveGif">
						<img v-else :src="hostImgUrl">
						<p>{{ vmcData.vmc2.hostC.alias }}</p>
					</div>
				</div>
			</div>
			
			<!-- 交换机 -->
			<div class="switch-row">
				<svg-line-left></svg-line-left>
				<div class="switch">
					<img :src="switchImgUrl">
					<p>TTE交换机</p>
				</div>
				<svg-line-right></svg-line-right>
			</div>
			<div class="switch-row">
				<svg-line-bothway></svg-line-bothway>
				<div class="switch">
					<img :src="switchImgUrl">
					<p>接入交换机</p>
				</div>
			</div>
			
			<!-- PDU -->
			<div class="pdu-row">
				<svg-line-tree></svg-line-tree>
				<div class="pdu" @click="handleHostClick(7, pduData.pdu1, 'PDU')">
					<img v-if="hostActivatedIndex === 7" :src="pduActiveGif">
					<img v-else :src="pduImgUrl">
					<p>{{ pduData.pdu1.host }}</p>
				</div>
				
				<div class="pdu" @click="handleHostClick(8, pduData.pdu2, 'PDU')">
					<img v-if="hostActivatedIndex === 8" :src="pduActiveGif">
					<img v-else :src="pduImgUrl">
					<p>{{ pduData.pdu2.host }}</p>
				</div>
				
				<div class="pdu" @click="handleHostClick(9, pduData.pdu1, 'PDU')">
					<img v-if="hostActivatedIndex === 9" :src="pduActiveGif">
					<img v-else :src="pduDoneImgUrl">
					<p>RTU-3</p>
				</div>
				
				<div class="pdu" @click="handleHostClick(10, pduData.pdu2, 'PDU')">
					<img v-if="hostActivatedIndex === 10" :src="pduActiveGif">
					<img v-else :src="pduDoneImgUrl">
					<p>RTU-4</p>
				</div>
			</div>
		</div>

		<!-- 容错管理、集中并机模块激活时，在拓扑图下面显示 VMC运行状态 -->
		<!-- <vmc-run-state v-if="INTERACTION_PARENT_MODULE_NAME === 'RCGL' || INTERACTION_PARENT_MODULE_NAME === 'JZBJ'"></vmc-run-state> -->
	</div>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex'
	import SvgLineLeft from './svg/LineLeft.vue'
	import SvgLineRight from './svg/LineRight.vue'
	import SvgLineBothway from './svg/LineBothway.vue'
	import SvgLineTree from './svg/LineTree.vue'
	import VmcRunState from './vmcRunState/index.vue'

	export default {
		name: 'topologyChild',
		
		components: {
			"svg-line-left": SvgLineLeft,
			"svg-line-right": SvgLineRight,
			"svg-line-bothway": SvgLineBothway,
			"svg-line-tree": SvgLineTree,
			"vmc-run-state": VmcRunState
		},

		data() {
			return {
				switchImgUrl: require('@/assets/images/topology/switch.png'),
				hostImgUrl: require('@/assets/images/topology/host-normal.png'),
				// hostActiveGif: require('@/assets/images/gif/host.gif'),
				hostActiveGif: require('@/assets/images/gif/host-active.gif'),
				pduImgUrl: require('@/assets/images/topology/pdu.png'),
				pduDoneImgUrl: require('@/assets/images/topology/pdu-done.png'),
				pduActiveGif: require('@/assets/images/gif/rtu.gif'),

				hostActivatedIndex: 1, // 用于显示激活主机样式
				dynamicClass: {
					vmc: 1,
					host: 1,
					pdu: 0
				},

				vmcData: {
					vmc1: {
						id: 241,
						name: 'VMC1',
						hostA: {
							hostId: ''
						},
						hostB: {
							hostId: ''
						},
						hostC: {
							hostId: ''
						}
					},

					vmc2: {
						id: 242,
						name: 'VMC2',
						hostA: {
							hostId: ''
						},
						hostB: {
							hostId: ''
						},
						hostC: {
							hostId: ''
						}
					},
				},

				pduData: {
					pdu1: {
						id: 48,
						hostId: '',
					},

					pdu2: {
						id: 49,
						hostId: ''
					},
					
					pdu3: {
						id: 48,
						hostId: '',
					},
					
					pdu4: {
						id: 49,
						hostId: ''
					},
				},

				vmcTimer: null,
				hostTimer: null,
				pduTimer: null,
				
				hostClickCount: 0,
				hostClickCountTimer: null,
			}
		},

		computed: {
			...mapGetters([
				'CAROUSEL_IS_CLICKED',
				'CAROUSEL_CUR_PAGE',
				'INTERACTION_PARENT_MODULE_NAME'
			])
		},

		watch: {
			hostClickCount(val) {
				if (val === 10) {
					this.clearHostClickCountInterval()
					this.hostTimer = setInterval(this.handleHost, 10 * 1000)
					this.$once('hook:beforeDestroy', () => {
						this.clearIntervalTask('HOST')
					})
				}
			}
		},

		mounted() {
			this.getVmcConfigData()
			this.getTopologyData()
		},

		methods: {
			...mapMutations([
				'set_cur_vmc_id',
				'set_host_activated',
				'set_cur_host_id'
			]),

			async getVmcConfigData() {
				// const localVmcConfigData = this.$storage.getVmcConfig()
				// if (localVmcConfigData) {
				// 	this.resetVmcConfigData(localVmcConfigData)
				// 	return
				// }
				const {data: configData} = await this.$axios.get(`${this.$apis.config}`)
				this.$storage.setVmcConfig(configData)
				this.resetVmcConfigData(configData)
			},

			// SET VMC JSON
			resetVmcConfigData(configData) {
				this.$set(this.vmcData.vmc1.hostA, 'hostId', +configData['VMC1-A'])
				this.$set(this.vmcData.vmc1.hostB, 'hostId', +configData['VMC1-B'])
				this.$set(this.vmcData.vmc1.hostC, 'hostId', +configData['VMC1-C'])
				this.$set(this.vmcData.vmc2.hostA, 'hostId', +configData['VMC2-A'])
				this.$set(this.vmcData.vmc2.hostB, 'hostId', +configData['VMC2-B'])
				this.$set(this.vmcData.vmc2.hostC, 'hostId', +configData['VMC2-C'])
				this.$set(this.pduData.pdu1, 'hostId', +configData['RTU-1'])
				this.$set(this.pduData.pdu2, 'hostId', +configData['RTU-2'])
				this.$set(this.pduData.pdu3, 'hostId', +configData['RTU-1'])
				this.$set(this.pduData.pdu4, 'hostId', +configData['RTU-2'])
			},
			
			// Set HOST DATA OF VMC AND PDU 
			initHostData(topologyData) {
				for (let i = 0; i < 3; i++) {
					if (i === 0) {
						const result = topologyData.find(e => e.hostid === this.vmcData.vmc1.hostA.hostId)
						if (result) {
							this.$set(this.vmcData.vmc1.hostA, 'ip', result.ip)
							this.$set(this.vmcData.vmc1.hostA, 'host', result.host)
							this.$set(this.vmcData.vmc1.hostA, 'alias', this.$replaceStr(result.host, '计算机'))
							this.$set(this.vmcData.vmc1.hostA, 'available', result.available)
						}
						
						const result2 = topologyData.find(e => e.hostid === this.vmcData.vmc2.hostA.hostId)
						if (result2) {
							this.$set(this.vmcData.vmc2.hostA, 'ip', result2.ip)
							this.$set(this.vmcData.vmc2.hostA, 'host', result2.host)
							this.$set(this.vmcData.vmc2.hostA, 'alias', this.$replaceStr(result2.host, '计算机'))
							this.$set(this.vmcData.vmc2.hostA, 'available', result2.available)
						}
					}
				
					if (i === 1) {
						const result = topologyData.find(e => e.hostid === this.vmcData.vmc1.hostB.hostId)
						if (result) {
							this.$set(this.vmcData.vmc1.hostB, 'ip', result.ip)
							this.$set(this.vmcData.vmc1.hostB, 'host', result.host)
							this.$set(this.vmcData.vmc1.hostB, 'alias', this.$replaceStr(result.host, '计算机'))
							this.$set(this.vmcData.vmc1.hostB, 'available', result.available)
						}
				
						const result2 = topologyData.find(e => e.hostid === this.vmcData.vmc2.hostB.hostId)
						if (result2) {
							this.$set(this.vmcData.vmc2.hostB, 'ip', result2.ip)
							this.$set(this.vmcData.vmc2.hostB, 'host', result2.host)
							this.$set(this.vmcData.vmc2.hostB, 'alias', this.$replaceStr(result2.host, '计算机'))
							this.$set(this.vmcData.vmc2.hostB, 'available', result2.available)
						}
					}
				
					if (i === 2) {
						const result = topologyData.find(e => e.hostid === this.vmcData.vmc1.hostC.hostId)
						if (result) {
							this.$set(this.vmcData.vmc1.hostC, 'ip', result.ip)
							this.$set(this.vmcData.vmc1.hostC, 'host', result.host)
							this.$set(this.vmcData.vmc1.hostC, 'alias', this.$replaceStr(result.host, '计算机'))
							this.$set(this.vmcData.vmc1.hostC, 'available', result.available)
						}
				
						const result2 = topologyData.find(e => e.hostid === this.vmcData.vmc2.hostC.hostId)
						if (result2) {
							this.$set(this.vmcData.vmc2.hostC, 'ip', result2.ip)
							this.$set(this.vmcData.vmc2.hostC, 'host', result2.host)
							this.$set(this.vmcData.vmc2.hostC, 'alias', this.$replaceStr(result2.host, '计算机'))
							this.$set(this.vmcData.vmc2.hostC, 'available', result2.available)
						}
					}
				}
				
				const pduResult = topologyData.find(e => e.hostid === this.pduData.pdu1.hostId)
				if (pduResult) {
					this.$set(this.pduData.pdu1, 'ip', pduResult.ip)
					this.$set(this.pduData.pdu1, 'host', pduResult.host)
					this.$set(this.pduData.pdu1, 'available', pduResult.available)
					
					this.$set(this.pduData.pdu3, 'ip', pduResult.ip)
					this.$set(this.pduData.pdu3, 'host', pduResult.host)
					this.$set(this.pduData.pdu3, 'available', pduResult.available)
				}
				const pduResult2 = topologyData.find(e => e.hostid === this.pduData.pdu2.hostId)
				if (pduResult2) {
					this.$set(this.pduData.pdu2, 'ip', pduResult2.ip)
					this.$set(this.pduData.pdu2, 'host', pduResult2.host)
					this.$set(this.pduData.pdu2, 'available', pduResult2.available)
					
					this.$set(this.pduData.pdu4, 'ip', pduResult2.ip)
					this.$set(this.pduData.pdu4, 'host', pduResult2.host)
					this.$set(this.pduData.pdu4, 'available', pduResult2.available)
				}
				this.$storage.setVmcPduData({
					vmcData: this.vmcData,
					pduData: this.pduData
				})
			},

			// 获取拓扑图数据
			async getTopologyData() {
				const {
					data: topologyData
				} = await this.$axios.get(`${this.$apis.topology}`)
				this.initHostData(topologyData)
				// 触发主机轮询
				this.repeatHost()
			},
			
			/**
			 * 主机点击事件
			 * 逻辑：停掉VMC和主机轮询，点击主机时获取单个主机数据，回显至数据监控模块
			 */
			
			clearHostClickCountInterval() {
			  clearInterval(this.hostClickCountTimer)
			  this.hostClickCountTimer = null
			  this.hostClickCount = 0
			},
			
			handleHostClick(hostIndex, hostData, type) {
				const _this = this
				this.hostActivatedIndex = hostIndex
				this.set_host_activated(hostIndex) // 存储当前激活的主机下标
				this.setHostIdVuex(hostIndex)
				
				if (type === 'HOST') {
					// 存储 VMC 的ID
					let vmcId = 0
					if (this.hostActivatedIndex <= 3) {
						vmcId = this.vmcData.vmc1.id
					} else {
						if (this.hostActivatedIndex < 9 ) {
							vmcId = this.vmcData.vmc2.id
						}
					}
					this.set_cur_vmc_id(vmcId)
				}
				
				this.clearHostClickCountInterval()
				// 无操作 10s 后开启主机轮循
				this.hostClickCountTimer = setInterval(() => {
				  _this.hostClickCount++
				}, 1000)
				
				this.clearIntervalTask('HOST')
				this.clearIntervalTask('PDU')
				
				// TODO 无操作10s重新开始轮询主机
			},
			
			clearIntervalTask(type) {
				if (type === 'HOST') {
					clearInterval(this.hostTimer)
					this.hostTimer = null
				}
				if (type === 'PDU') {
					clearInterval(this.pduTimer)
					this.pduTimer = null
				}
			},
			
			// 存储轮询主机ID
			setHostIdVuex(hostIndex) {
				if (hostIndex === 11) return
				const hostDataJson = {
					1: this.vmcData.vmc1.hostA,
					2: this.vmcData.vmc1.hostB,
					3: this.vmcData.vmc1.hostC,
					4: this.vmcData.vmc2.hostA,
					5: this.vmcData.vmc2.hostB,
					6: this.vmcData.vmc2.hostC,
					7: this.pduData.pdu1,
					8: this.pduData.pdu2,
					9: this.pduData.pdu3,
					10: this.pduData.pdu4
				}
				
				const hostIdJson = {
					1: this.vmcData.vmc1.hostA.hostId,
					2: this.vmcData.vmc1.hostB.hostId,
					3: this.vmcData.vmc1.hostC.hostId,
					4: this.vmcData.vmc2.hostA.hostId,
					5: this.vmcData.vmc2.hostB.hostId,
					6: this.vmcData.vmc2.hostC.hostId,
					7: this.pduData.pdu1.hostId,
					8: this.pduData.pdu2.hostId,
					9: this.pduData.pdu3.hostId,
					10: this.pduData.pdu4.hostId,
				}
				
				this.set_cur_host_id(hostIdJson[hostIndex])
				// 把每次循环到的主机ID存储到本地供其他页面使用
				this.$storage.setCurHostData(hostDataJson[hostIndex])
			},
			
			/**
			 * 主机轮询
			 */
			setFirstData() {
				this.hostActivatedIndex = 1
				this.set_cur_vmc_id(this.vmcData.vmc1.id)
				this.set_host_activated(this.hostActivatedIndex) // 存储当前激活的主机下标
				this.setHostIdVuex(this.hostActivatedIndex)
			},
			
			repeatHost() {
				const _this = this
				this.setFirstData()
				this.hostTimer = setInterval(this.handleHost, 10 * 1000)
				this.$once('hook:beforeDestroy', () => {
					_this.clearIntervalTask('HOST')
				})
			},
			
			handleHost() {
				const _this = this
				// 当轮询到最后一台PDU后，暂停所以轮询，这时候显示所以主机的运行状态10S，10S后从头开始轮询主机
				if (this.hostActivatedIndex === 11) {
					this.clearIntervalTask('HOST')
					this.clearIntervalTask('PDU')
					this.set_cur_vmc_id(0)
					this.set_cur_host_id(0)
					// 10S重新显示分区任务，隐藏主机运行状态
					setTimeout(() => {
						this.setFirstData()
						this.repeatHost()
					}, 10 * 1000)
					return
				}
				
				this.hostActivatedIndex++

				// 存储 VMC 的ID
				let vmcId = 0
				if (this.hostActivatedIndex <= 3) {
					vmcId = this.vmcData.vmc1.id
				} else {
					if (this.hostActivatedIndex < 9 ) {
						vmcId = this.vmcData.vmc2.id
					}
				}
				this.set_cur_vmc_id(vmcId)
				this.setHostIdVuex(this.hostActivatedIndex)
				this.set_host_activated(this.hostActivatedIndex)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.topology-page-wrapper {
		display: flex;
		flex-flow: column;
		height: 100%;

		.topology-page-container {
			flex: 1;
			display: flex;
			flex-flow: column;
			
			img{
				height: 70px;
			}
			
			.active-img {
				height: 60px;
				padding-bottom: 10px;
			}
			
			p{
				color: #ABCDFF;
				font-size: 15px;
			}
			
			.host-row{
				flex: 0.6;
				display: flex;
				align-items: center;
				
				.host-container{
					flex: 1;
					width: 100%;
					height: 100%;
					background: url(../assets/images/topology/banner.png) no-repeat;
					background-size: 100% 100%;
					@include flex-space-around;
					
					.host{
						flex: 1;
						text-align: center;
						cursor: pointer;
						
						&-activated{
							img{
								height: 60px;
							}
							
							p{
								position: relative;
								bottom: -5px;
							}
						}
					}
				}
			}
			
			.switch-row{
				flex: 0.6;
				position: relative;
				@include flex-level-center;
				.switch{
					text-align: center;
				}
				
				.svg-line-left-wrapper{
					position: absolute;
					left: 250px;
					top: -15px;
				}
				
				.svg-line-right-wrapper{
					position: absolute;
					right: 250px;
					top: -15px;
				}
				
				.svg-line-bothway-wrapper{
					position: absolute;
					top: -25px;
				}
			}
			
			.pdu-row{
				flex: 1;
				@include flex-level-center;
				position: relative;
				.pdu{
					flex: 0.2;
					// width: 15%;
					text-align: center;
					cursor: pointer;
					padding-top: 30px;
				}
				
				.svg-line-tree-wrapper{
					position: absolute;
					top: -20px;
				}
			}
		}
	}
	
	
	// VMC 轮巡样式
	.vmc-activated {
		background: linear-gradient(0deg, transparent 50%, orange 50%) repeat-y, // 左边框
			linear-gradient(0deg, transparent 50%, orange 50%) repeat-y, // 右边框
			linear-gradient(90deg, transparent 50%, orange 50%) repeat-x, // 上边框
			linear-gradient(90deg, transparent 50%, orange 50%) repeat-x; // 下边框
	
		background-size: 3px 12px, 3px 12px, 12px 3px, 12px 3px;
		background-position: 0 0, 100% 0, 0 0, 0 100%;
		animation: lineScroll 1s infinite linear;
	}
	
	// 主机轮巡样式
	.host-activated-border {
		background: linear-gradient(0deg, transparent 50%, #F00 50%) repeat-y, // 左边框
			linear-gradient(0deg, transparent 50%, #F00 50%) repeat-y, // 右边框
			linear-gradient(90deg, transparent 50%, #F00 50%) repeat-x, // 上边框
			linear-gradient(90deg, transparent 50%, #F00 50%) repeat-x; // 下边框
	
		background-size: 3px 12px, 3px 12px, 12px 3px, 12px 3px;
		background-position: 0 0, 100% 0, 0 0, 0 100%;
		animation: lineScroll 1s infinite linear;
	}
	
	@keyframes lineScroll {
		from {}
	
		to {
			// 比如第一个表示0 -12px在动画中表示左边框一秒内上移12px,视觉上就形成了向上滑动的效果
			background-position: 0 -12px, 100% 12px, 12px 0, -12px 100%;
		}
	}
</style>
