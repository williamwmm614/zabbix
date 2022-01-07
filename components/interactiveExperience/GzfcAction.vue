<template>
	<div class="gzfc-action-wrapper">
		<section class="title">
			<div class="container">
				<img :src="titleIcon">
				<span>交互体验区</span>
			</div>
		</section>

		<!-- 故障分层 -->
		<section v-if="INTERACTION_PARENT_MODULE_NAME !== 'GZFC_CHILD'" class="action-section">
			<article @click="handleModuleClick(1, 'GZFC_CHILD')">
				<RotateImg v-if="activatedModuleIndex === 1" :initIcon="gzfcImgs.initIcon_thread"></RotateImg>
				<div v-else class="img-wrap">
					<img :src="gzfcImgs.xcjImg">
				</div>
				<div class="name" :class="activatedModuleIndex === 1 ? 'name-active' : ''"><span>线程级故障模拟</span></div>
			</article>
			<article @click="handleModuleClick(2)">
				<RotateImg v-if="activatedModuleIndex === 2" :initIcon="gzfcImgs.initIcon_fenquji"></RotateImg>
				<div v-else class="img-wrap">
					<img :src="gzfcImgs.fqjImg">
				</div>
				<div class="name" :class="activatedModuleIndex === 2 ? 'name-active' : ''"><span>分区级故障模拟</span></div>
			</article>
			<article @click="handleModuleClick(3)">
				<RotateImg v-if="activatedModuleIndex === 3" :initIcon="gzfcImgs.initIcon_computer"></RotateImg>
				<div v-else class="img-wrap">
					<img :src="gzfcImgs.computerImg">
				</div>
				<div class="name" :class="activatedModuleIndex === 3 ? 'name-active' : ''"><span>计算机故障模拟</span></div>
			</article>
		</section>

		<!-- 故障分层下级模块 -->
		<section v-else class="action-section">
			<article @click="handleModuleClick(4)">
				<!-- <img :src="gzfcImgs.yxcsImg"> -->
				<RotateImg v-if="activatedModuleIndex === 4" :initIcon="gzfcImgs.initIcon_yunxingchaoshi"></RotateImg>
				<div v-else class="img-wrap">
					<img :src="gzfcImgs.yxcsImg">
				</div>
				<div class="name" :class="activatedModuleIndex === 4 ? 'name-active' : ''"><span>运行超时</span></div>
			</article>
			<article @click="handleModuleClick(5)">
				<!-- <img :src="gzfcImgs.fdjscwImg"> -->
				<RotateImg v-if="activatedModuleIndex === 5" :initIcon="gzfcImgs.initIcon_fudianjisuancuowu"></RotateImg>
				<div v-else class="img-wrap">
					<img :src="gzfcImgs.fdjscwImg">
				</div>
				<div class="name" :class="activatedModuleIndex === 5 ? 'name-active' : ''"><span>浮点计算错误</span></div>
			</article>
			<article @click="handleModuleClick(6)">
				<!-- <img :src="gzfcImgs.fwffdzImg"> -->
				<RotateImg v-if="activatedModuleIndex === 6" :initIcon="gzfcImgs.initIcon_fangwenfeifadizhi"></RotateImg>
				<div v-else class="img-wrap">
					<img :src="gzfcImgs.fwffdzImg">
				</div>
				<div class="name" :class="activatedModuleIndex === 6 ? 'name-active' : ''"><span>访问非法地址</span></div>
			</article>
			<article @click="handleModuleClick(7)">
				<!-- <img :src="gzfcImgs.sjycImg"> -->
				<RotateImg v-if="activatedModuleIndex === 7" :initIcon="gzfcImgs.initIcon_shujuyichu"></RotateImg>
				<div v-else class="img-wrap">
					<img :src="gzfcImgs.sjycImg">
				</div>
				<div class="name" :class="activatedModuleIndex === 7 ? 'name-active' : ''"><span>数据溢出</span></div>
			</article>
		</section>
	</div>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex'
	
	export default {
		data() {
			return {
				titleIcon: require('@/assets/images/title/title-icon.png'),
				activatedModuleIndex: 0,
				// 故障分层图片
				gzfcImgs: {
					xcjImg: require('@/assets/images/interactiveExperience/gzfc/thread-default.png'),
					fqjImg: require('@/assets/images/interactiveExperience/gzfc/fenquji.png'),
					computerImg: require('@/assets/images/interactiveExperience/gzfc/computer.png'),
					fdjscwImg: require('@/assets/images/interactiveExperience/gzfc/fudianjisuancuowu.png'),
					fwffdzImg: require('@/assets/images/interactiveExperience/gzfc/fangwenfeifadizhi.png'),
					sjycImg: require('@/assets/images/interactiveExperience/gzfc/shujuyichu.png'),
					yxcsImg: require('@/assets/images/interactiveExperience/gzfc/run-timeout-default.png'),
					initIcon_thread: require('@/assets/images/interactiveExperience/activeImgs/gzfc/thread.png'),
					initIcon_fenquji: require('@/assets/images/interactiveExperience/activeImgs/gzfc/fenquji.png'),
					initIcon_computer: require('@/assets/images/interactiveExperience/activeImgs/gzfc/computer.png'),
					initIcon_fangwenfeifadizhi: require('@/assets/images/interactiveExperience/activeImgs/gzfc/child/fangwenfeifadizhi.png'),
					initIcon_fudianjisuancuowu: require('@/assets/images/interactiveExperience/activeImgs/gzfc/child/fudianjisuancuowu.png'),
					initIcon_shujuyichu: require('@/assets/images/interactiveExperience/activeImgs/gzfc/child/shujuyichu.png'),
					initIcon_yunxingchaoshi: require('@/assets/images/interactiveExperience/activeImgs/gzfc/child/yunxingchaoshi.png'),
				},
			}
		},

		computed: {
			...mapGetters(['INTERACTION_PARENT_MODULE_NAME'])
		},

		methods: {
			...mapMutations(['set_interaction_parent_module_name']),

			// 交互体验区模块点击事件
			async handleModuleClick(index, type) {
				const _this = this
				this.activatedModuleIndex = index
				
				// 故障分层下级不需要跳转页面
				// if (type === 'GZFC_CHILD') {
				// 	this.set_interaction_parent_module_name(type)
				// 	await this.$axios.get(this.$apis.xcjGzmn)
				// 	return
				// }
				if (index === 1) await this.$axios.get(`/api/udp/vmcs/${16}/hostInstruct?host=RTU-1`) 
				if (index === 2) await this.$axios.get(`/api/udp/vmcs/${17}/partitionInstruct?host=RTU-1&partition=2`)
				if (index === 3) await this.$axios.get(`/api/udp/vmcs/${18}/taskInstruct?host=RTU-1&partition=2&task=3`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.gzfc-action-wrapper {
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
				flex: 1;
				// height: 100%;
				flex-flow: column;
				@include flex-space-around;
				cursor: pointer;

				img {
					width: 80px;
					height: 80px;
				}

				.name {
					width: 100%;
					height: 30px;
					margin-top: 20px;
					background: url('@/assets/images/interaction/normal.png') no-repeat;
					background-size: 100% 100%;
					@include flex-level-center;
			
					span {
						font-size: 16px;
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
		}
	}
</style>
