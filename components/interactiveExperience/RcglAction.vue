<template>
	<div class="interactive-experience-wrapper">
		<section class="title">
			<div class="container">
				<img :src="titleIcon">
				<span>交互体验区</span>
			</div>
		</section>

		<!-- 容错管理 -->
		<section class="action-section rcgl-section">
			<div class="row">
				<article
					v-for="(item, index) in rcglImgsData.vmc1HostList"
					:key="item"
					@click="handleModuleClick(index + 1)">
					<img v-if="activatedModuleIndex === index + 1" :src="rcglImgsData.activeImg" class="active-img">
					<img v-else :src="rcglImgsData.vmcFaultImg">
					<div class="name" :class="activatedModuleIndex === index + 1 ? 'name-active' : ''"><span>{{ item }} 故障</span></div>
				</article>
			</div>
			<div class="row">
				<article
					v-for="(item, index) in rcglImgsData.vmc2HostList"
					:key="item"
					@click="handleModuleClick(index + 4)">
					<img v-if="activatedModuleIndex === index + 4" :src="rcglImgsData.activeImg" class="active-img">
					<img v-else :src="rcglImgsData.vmcFaultImg">
					<div class="name" :class="activatedModuleIndex === index + 4 ? 'name-active' : ''"><span>{{ item }} 故障</span></div>
				</article>
			</div>
		</section>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				titleIcon: require('@/assets/images/title/title-icon.png'),
				activatedModuleIndex: 0,
				// 容错管理图片
				rcglImgsData: {
					vmcFaultImg: require('@/assets/images/interactiveExperience/rcgl/vmc-fault.png'),
					vmcNormalImg: require('@/assets/images/interactiveExperience/rcgl/vmc-normal.png'),
					vmcStopImg: require('@/assets/images/interactiveExperience/rcgl/vmc-stop.png'),
					vmcWarningImg: require('@/assets/images/interactiveExperience/rcgl/vmc-warning.png'),
					activeImg: require('@/assets/images/interactiveExperience/activeImgs/rcgl/host.png'),
					vmc1HostList: [],
					vmc2HostList: [],
				},
			}
		},
		
		mounted() {
			this.initData()
		},

		methods: {
			// 交互体验区模块点击事件
			handleModuleClick(index) {
				this.activatedModuleIndex = index
			},
			
			initData() {
				const localHostData = this.$storage.getVmcPduData()
				const {vmcData} = localHostData
				const {vmc1, vmc2} = vmcData
				this.rcglImgsData.vmc1HostList = [vmc1.hostA.host, vmc1.hostB.host, vmc1.hostC.host]
				this.rcglImgsData.vmc2HostList = [vmc2.hostA.host, vmc2.hostB.host, vmc2.hostC.host]
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
			display: flex;
			flex-flow: column;
			flex: 1;
			
			.row {
				width: 90%;
				margin: auto;
				@include flex-vertical-center;
				justify-content: flex-start;
				
				&:last-child {
					padding-bottom: 10px;
				}
				
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
						
						&-active{
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
			}
		}
	}
</style>
