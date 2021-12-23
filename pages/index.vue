<template>
	<div class="home-wrapper">
		<div class="home-container">
			<section class="page-title-section">
				<!-- <img class="title-img" :src="fsfqTitleImg"> -->
				<h3>开放式综合电子演示验证系统地面软件</h3>
				<span class="cur-time">{{ curTime }}</span>
			</section>

			<section class="main-container">
				<div class="left-wrapper">
					<div class="content-container">
						<div class="title">主机拓扑结构</div>
						<div class="topology-container">
							<Topology></Topology>
						</div>
					</div>
				</div>

				<div class="right-wrapper">
					<article class="first-module-container">
						<!-- 交互区域 -->
						<interactive-experience></interactive-experience>
					</article>
					<article class="second-module-container">
						<!-- 数据监控 -->
						<data-monitoring></data-monitoring>
					</article>
					<article class="third-module-container">
						<!-- 任务实时监控 -->
						<task-monitoring></task-monitoring>
					</article>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex'
	import InteractiveExperience from '@/components/interactiveExperience/index.vue'
	import DataMonitoring from '@/components/DataMonitoring.vue'
	import TaskMonitoring from '@/components/TaskMonitoring.vue'
	import Topology from '@/components/Topology.vue'

	export default {
		name: 'index',

		components: {
			InteractiveExperience,
			DataMonitoring,
			TaskMonitoring,
			Topology,
		},

		data() {
			return {
				fsfqTitleImg: require('@/assets/images/title/fenshifenqu.png'),
				rwssjkTitleImg: require('@/assets/images/title/renwujiankong.png'),
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

		watch: {
			INTERACTION_PARENT_MODULE_NAME(val) {
				// console.log(`当前交互体验区主模块名称：${val}`);
				// 当交互模块有值时，则表明触发了交互模块，反之显示原拓扑结构和轮播图
				this.toggleDom = val ? false : true
			}
		},

		mounted() {
			this.init()
		},

		methods: {
			...mapMutations(['set_interaction_parent_module_name']),

			init() {
				this.getCurTime()
				this.set_interaction_parent_module_name('HOME')
			},

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
			
			.page-title-section{
				height: 60px !important;
				line-height: 60px !important;
				h3{
					flex: 1;
					font-size: 30px;
					color: #f0fafe;
					text-align: center;
					font-family: serif;
				}
			}

			.main-container {
				width: 98%;
				height: calc(100vh - 80px);
				margin: auto;
				position: relative;
				display: flex;

				.left-wrapper {
					flex: 1.3;
					position: relative;

					.content-container {
						position: relative;

						.title {
							width: 162px;
							height: 45px;
							background: url(../assets/images/banner/module-title-bg.png) no-repeat;
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
						flex: 0.5;
						/deep/.interactive-experience-wrapper{
							.title{
								height: 28px;
							}
							
							.action-section{
								 article{
									  img{
										  width: 70px;
										  height: 70px;
									  }
								 }
							}
							
							.img-rotate-wrapper{
								.icon{
									width: 30px;
									height: 30px;
								}
							}
						}
					}

					.second-module-container {
						flex: 0.8;
						margin: 15px 0;
						
						/deep/.data-monitoring-wrapper{
							 .title{
								height: 45px;
							 }
						}
					}

					.third-module-container {
						flex: 1;
						
						/deep/.task-monitoring-wrapper {
							.title {
								height: 35px;
							}
						}
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
</style>
