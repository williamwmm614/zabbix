<template>
	<div class="interactive-experience-wrapper">
		<section class="title">
			<div class="container">
				<img :src="titleIcon">
				<span>交互体验区</span>
			</div>
		</section>
		
		<!-- 集中并机 -->
		<section class="action-section jzbj-section">
			<div class="vmc-host-container">
				<div class="row">
					<article
						v-for="(item, index) in rcglImgsData.vmc1HostList"
						:key="item.host"
						@click="handleModuleClick(index + 1, item)">
						<img v-if="activatedModuleIndex === index + 1" :src="rcglImgsData.hostActiveImg" class="active-img">
						<img v-else :src="rcglImgsData.vmcFaultImg">
						<div class="name" :class="activatedModuleIndex === index + 1 ? 'name-active' : ''">
							<span>{{ item.host }} 故障</span>
						</div>
					</article>
				</div>
				<div class="row">
					<article
						v-for="(item, index) in rcglImgsData.vmc2HostList"
						:key="item.host"
						@click="handleModuleClick(index + 4, item)">
						<img v-if="activatedModuleIndex === index + 4" :src="rcglImgsData.hostActiveImg" class="active-img">
						<img v-else :src="rcglImgsData.vmcFaultImg">
						<div class="name" :class="activatedModuleIndex === index + 4 ? 'name-active' : ''">
							<span>{{ item.host }} 故障</span>
						</div>
					</article>
				</div>
			</div>
			
			<div class="pdus-container">
				<div class="row">
					<article
						v-for="(item, index) in rcglImgsData.rtuHostList"
						:key="item.host"
						@click="handleModuleClick(index + 7, item)">
						
						<!-- <img v-if="activatedModuleIndex === index + 7" :src="rcglImgsData.pduActiveImg" class="active-img">
						<img v-else :src="pduImgUrl"> -->
						<img :src="rcglImgsData.pduDoneImgUrl">
						<div class="name" :class="activatedModuleIndex === index + 7 ? 'name-active' : ''"><span>{{ item.host }} 故障</span></div>
					</article>
				</div>
				
				<div class="row">
					<article
						v-for="(item, index) in rcglImgsData.rtuHostList2"
						:key="item.host">
						
						<!-- <img v-if="activatedModuleIndex === index + 9" :src="rcglImgsData.pduActiveImg" class="active-img"> -->
						<img :src="rcglImgsData.pduDoneImgUrl">
						<div class="name"><span>{{ item.host }} 故障</span></div>
					</article>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				titleIcon: require('@/assets/images/title/title-icon.png'),
				pduImgUrl: require('@/assets/images/topology/pdu.png'),
				activatedModuleIndex: 0,
				// 容错管理图片
				rcglImgsData: {
					vmcFaultImg: require('@/assets/images/interactiveExperience/rcgl/vmc-fault.png'),
					vmcNormalImg: require('@/assets/images/interactiveExperience/rcgl/vmc-normal.png'),
					vmcStopImg: require('@/assets/images/interactiveExperience/rcgl/vmc-stop.png'),
					vmcWarningImg: require('@/assets/images/interactiveExperience/rcgl/vmc-warning.png'),
					hostActiveImg: require('@/assets/images/interactiveExperience/activeImgs/rcgl/host.png'),
					pduActiveImg: require('@/assets/images/interactiveExperience/activeImgs/rcgl/pdu.png'),
					pduDoneImgUrl: require('@/assets/images/topology/pdu-done.png'),
					vmc1HostList: [],
					vmc2HostList: [],
					rtuHostList: [],
					rtuHostList2: ['RTU-3', 'RTU-4']
				},
			}
		},
		
		mounted() {
			this.initData()
		},

		methods: {
			// 交互体验区模块点击事件
			async handleModuleClick(index, item) {
				this.activatedModuleIndex = index
				if (item) await this.$axios.get(`/api/udp/vmcs/${item.hostId}/hostMerge?host=${item.host}`)
			},
			
			initData() {
				const localHostData = this.$storage.getVmcPduData()
				const {vmcData} = localHostData
				const {vmc1, vmc2} = vmcData
				const {pduData} = localHostData
				const {pdu1, pdu2} = pduData
				this.rcglImgsData.vmc1HostList = [vmc1.hostA, vmc1.hostB, vmc1.hostC]
				this.rcglImgsData.vmc2HostList = [vmc2.hostA, vmc2.hostB, vmc2.hostC]
				this.rcglImgsData.rtuHostList = [pdu1, pdu2]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.interactive-experience-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		background: url('@/assets/images/banner/action-area-bg.png') no-repeat;
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

		.action-section {
			@include flex-space-around;
			flex: 1;

			article {
				width: 33.3%;
				flex-flow: column;
				@include flex-space-around;
				cursor: pointer;

				img {
					width: 70px;
					height: 70px;
				}
				
				.active-img{
					transform: scale(1.1);
				}

				.name {
					width: 100%;
					height: 30px;
					margin-top: 15px;
					background: url('@/assets/images/interaction/normal.png') no-repeat;
					background-size: 100% 100%;
					@include flex-level-center;
			
					span {
						font-size: 15px;
						font-weight: 600;
						background: linear-gradient(-2deg, #8EAFEF 0%, #FFFFFF 100%);
						background-size: 100% 100%;
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
					
					&-active {
						background: url('@/assets/images/interaction/active.png') no-repeat;
						background-size: 100% 100%;
					
						span {
							background: linear-gradient(-2deg, #E6842E 0%, #FFFFFF 100%);
							-webkit-background-clip: text;
							-webkit-text-fill-color: transparent;
						}
					}
				}
			}
			
			.vmc-host-container{
				flex: 1;
				.row {
					@include flex-vertical-center;
					justify-content: flex-start;
					
					&:last-child {
						padding-bottom: 10px;
					}
				}
			}
			
			.pdus-container{
				flex: 0.8;
				@include flex-level-center;
				flex-flow: column;
				
				.row{
					width: 100%;
					@include flex-level-center;
					
					article{
						width: 40%;
					}
				}
			}
		}
	}
</style>
