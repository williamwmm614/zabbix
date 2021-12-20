<template>
	<div class="home-wrapper">
		<div class="home-container">
			<section class="page-title-section">
				<img v-if="INTERACTION_PARENT_MODULE_NAME === 'RCGL'" class="title-img" :src="titleUrl">
				<img v-if="INTERACTION_PARENT_MODULE_NAME === 'JZBJ'" class="title-img" :src="jzbjTitleImg">
				<img class="back-img" :src="backUrl" @click="handleBack">
			</section>

			<section class="main-container">
				<div class="left-wrapper">
					<img class="scale-img" :src="scaleImgUrl">

					<div class="content-container">
						<div class="title">主机拓扑结构</div>
						<div class="topology-container">
							<topology></topology>
						</div>
					</div>
				</div>

				<div class="right-wrapper">
					<article class="first-module-container">
						<!-- 交互区域 -->
						<RcglAction v-if="INTERACTION_PARENT_MODULE_NAME === 'RCGL'"></RcglAction>
						<JzbjAction v-if="INTERACTION_PARENT_MODULE_NAME === 'JZBJ'"></JzbjAction>
					</article>
					<article class="second-module-container">
						<!-- 数据监控 -->
						<data-monitoring></data-monitoring>
					</article>
					<article class="third-module-container">
						<!-- 轨道计算图 -->
						<track-chart></track-chart>
					</article>
				</div>
			</section>
		</div>
	</div>
	</div>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex'
	import RcglAction from '@/components/interactiveExperience/RcglAction.vue'
	import JzbjAction from '@/components/interactiveExperience/JzbjAction.vue'
	import DataMonitoring from '@/components/DataMonitoring.vue'
	import TaskMonitoring from '@/components/TaskMonitoring.vue'
	import TrackChart from '@/components/trackChart/index.vue'
	import Topology from '@/components/Topology.vue'

	export default {
		name: 'index',

		components: {
			RcglAction,
			JzbjAction,
			DataMonitoring,
			TaskMonitoring,
			TrackChart,
			Topology
		},

		data() {
			return {
				scaleImgUrl: require('@/assets/images/banner/scale.png'),
				backUrl: require('@/assets/images/interactiveExperience/back.png'),
				titleUrl: require('@/assets/images/title/rongcuoguanli.png'),
				jzbjTitleImg: require('@/assets/images/title/jizhongbingji.png'),
				toggleDom: true,
				curTime: '',
				timer: null
			}
		},

		computed: {
			...mapGetters([
				'INTERACTION_PARENT_MODULE_NAME'
			])
		},
		
		mounted() {
			this.getCurTime()
		},

		methods: {
			...mapMutations([
				'set_cur_vmc_id',
				'set_cur_host_id',
				'set_interaction_parent_module_name'
			]),

			getCurTime() {
				const _this = this
				this.curTime = this.$dateFormat(new Date().getTime())
				this.timer = setInterval(() => {
					_this.curTime = _this.$dateFormat(new Date().getTime())
				}, 1000)

				this.$once('hook:beforeDestroy', () => {
					clearInterval(_this.timer)
					_this.timer = null
				})
			},
			
			handleBack() {
				this.set_cur_vmc_id(0)
				this.set_cur_host_id(0)
				this.$router.go(-1)
			}
		}
	};
</script>

<style lang="scss" scoped>
	.mr {
		margin-right: 20px;
	}

	.cur-time {
		position: absolute;
		top: 0;
		right: 30px;
		color: #F3FCFF;
		font-size: 22px;
		font-weight: 600;
		font-family: fangsong;
	}

	.home-wrapper {
		width: 100%;
		height: 100%;
		@include flex-level-center;

		.home-container {
			position: relative;
			width: 100%;
			height: 100%;
			@include flex-space-between;
			flex-flow: column;

			.main-container {
				width: 98%;
				height: calc(100vh - 80px);
				margin: auto;
				position: relative;
				display: flex;

				.left-wrapper {
					flex: 1.3;
					position: relative;

					.scale-img {
						width: 15px;
						height: 100%;
						position: absolute;
						left: 0;
					}

					.content-container {
						position: relative;
						left: 30px;

						.title {
							width: 162px;
							height: 45px;
							background: url(@/assets/images/banner/module-title-bg.png) no-repeat;
							background-size: 100% 100%;
							font-size: 20px;
							color: #DFEEF3;
							@include flex-level-center;
						}

						.topology-container {
							width: 100%;
							height: calc(100vh - 45px - 100px);
							margin-top: 20px;
						}
					}
				}

				.right-wrapper {
					flex: 1;
					margin-left: 50px;
					display: flex;
					flex-flow: column;

					.first-module-container {
						flex: 1;
					}

					.second-module-container {
						flex: 1;
						margin: 15px 0;
					}

					.third-module-container {
						flex: 1;
					}
				}
			}

			.area {
				width: 90%;
				@include flex-space-between;

				section {
					flex: 1;
					height: 100%;
				}
			}

			.top-area {
				flex: 0.5;
				margin: 20px 0 70px;
			}

			.bottom-area {
				flex: auto;

				&-new {
					flex: auto;
				}
			}
		}
	}

	.new-flex {
		flex: 0.6 !important;
	}
	
	/deep/.interactive-experience-wrapper{
		.title {
			height: 40px !important;
		}
	}
	
	/deep/.data-monitoring-wrapper{
		.title {
			height: 45px !important;
		}
	}
	
	/deep/.track-chart-wrapper{
		.title {
			height: 40px !important;
		}
	}
</style>
