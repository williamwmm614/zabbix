<template>
	<div class="rcrwqy-wrapper">
		<section class="page-title-section">
			<img class="title-img" :src="titleImg">
			<img class="back-img" :src="backUrl" @click="handleBack">
		</section>

		<section class="main-container">
			<div class="top-row">
				<div class="left">
					<!-- 交互区域 -->
					<RcrwqyAction></RcrwqyAction>
				</div>

				<div class="right">
					<!-- 数据监控 -->
					<data-monitoring referencePage="RCRWQY"></data-monitoring>
				</div>
			</div>

			<div class="bottom-row">
				<!-- VMC 运行状态 -->
				<vmc-host-run-state></vmc-host-run-state>
			</div>
		</section>
	</div>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex'
	import RcrwqyAction from '@/components/interactiveExperience/RcrwqyAction.vue'
	import GzfcAction from '@/components/interactiveExperience/GzfcAction.vue'
	import DataMonitoring from '@/components/DataMonitoring.vue'
	import VmcHostRunState from '@/components/vmcHostState/index.vue'

	export default {
		name: 'index',

		components: {
			VmcHostRunState,
			DataMonitoring,
			RcrwqyAction
		},

		data() {
			return {
				backUrl: require('@/assets/images/interactiveExperience/back.png'),
				titleIcon: require('@/assets/images/title/title-icon.png'),
				titleImg: require('@/assets/images/title/rongcuorenwuqianyi.png'),
			}
		},

		computed: {
			...mapGetters([
				'INTERACTION_PARENT_MODULE_NAME'
			])
		},

		methods: {
			...mapMutations([
				'set_cur_vmc_id',
				'set_cur_host_id',
				'set_host_activated',
				'set_interaction_parent_module_name'
			]),

			handleBack() {
				this.set_cur_vmc_id(0)
				this.set_cur_host_id(0)
				this.set_host_activated(0)
				this.$router.go(-1)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rcrwqy-wrapper {
		display: flex;
		flex-flow: column;
		height: 100%;

		.main-container {
			flex: 1;
			height: 100%;
			padding: 15px;
			display: flex;
			flex-flow: column;

			.top-row {
				flex: 0.5;
				@include flex-space-around;
				margin-bottom: 15px;

				.left {
					flex: 0.5;
					height: 100%;
					margin-right: 30px;
					
					/deep/ .rcrwqy-action-wrapper{
						.title {
							height: 0;
							flex: 0.2;
						}
					}

					/deep/.interactive-experience-wrapper {
						background: url('@/assets/images/interactiveExperience/banner1.png') no-repeat;
						background-size: 100% 100%;

						.action-section {
							article {
								img {
									width: 100px;
									height: 100px;
								}
							}
						}
					}
				}

				.right {
					flex: 1;
					height: 100%;
					
					/deep/ .line-img{
						padding: 5px 20px;
						justify-content: center;
						img{
							width: 85%;
						}
					}

					/deep/ .data-monitoring-wrapper {
						background: url('@/assets/images/interactiveExperience/banner2.png') no-repeat;
						background-size: 100% 100%;

						.title {
							flex: 0.3;
							height: 0;
						}

						.data-show-section {
							width: 80%;
							margin: auto;
							padding: 0;

							.right-container {
								flex: 0.5;
							}
						}
					}
				}
			}

			.bottom-row {
				flex: 1;
			}
		}
	}
</style>
