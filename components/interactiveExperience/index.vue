<template>
	<div class="interactive-experience-wrapper">
		<section class="title">
			<div class="container">
				<img :src="titleIcon">
				<span>交互体验区</span>
			</div>
		</section>

		<!-- 首页操作区域 -->
		<section class="action-section">
			<article @click="handleModuleClick('RCRWQY')">
				<RotateImg :initIcon="initIcon"></RotateImg>
				<div class="name"><span>容错任务迁移</span></div>
			</article>
			<article @click="handleModuleClick('GZFC')">
				<img :src="gzfcImg">
				<div class="name"><span>故障分层</span></div>
			</article>
			<article @click="handleModuleClick('RCGL')">
				<img :src="rcglImg">
				<div class="name"><span>容错管理</span></div>
			</article>
			<article @click="handleModuleClick('JZBJ')">
				<img :src="jzbjImg">
				<div class="name"><span>集中并机</span></div>
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
				initIcon: require('@/assets/images/interactiveExperience/activeImgs/rcrwqy/icon2.png'),
				gzfcImg: require('@/assets/images/interaction/guzhangfenceng.png'),
				jzbjImg: require('@/assets/images/interaction/jizhongbingji.png'),
				rcglImg: require('@/assets/images/interaction/rongcuoguanli.png'),
				rcrwqyImg: require('@/assets/images/interaction/rongcuorenwuqianyi.png'),
				pduImgUrl: require('@/assets/images/topology/pdu.png'),
			}
		},

		computed: {
			...mapGetters(['INTERACTION_PARENT_MODULE_NAME'])
		},

		methods: {
			...mapMutations([
				'set_cur_vmc_id',
				'set_cur_host_id',
				'set_host_activated',
				'set_interaction_parent_module_name'
			]),

			// 交互体验区模块点击事件
			handleModuleClick(type) {
				const _this = this
				this.set_cur_vmc_id(0)
				// this.set_cur_host_id(0)
				this.set_host_activated(0)
				// 点击交互区域将 hostId 和 vmcId清除，便于返回首页后各模块监听并请求数据
				let url = ''
				if (type === 'RCRWQY') url = '/rcrwqy'
				if (type === 'GZFC') url = '/gzfc'
				if (type === 'RCGL') url = '/rcgl'
				if (type === 'JZBJ') url = '/jzbj'
				this.$router.push(url)
				this.set_interaction_parent_module_name(type)
				// setTimeout(() => {
				// 	_this.set_interaction_parent_module_name(type)
				// }, 500)
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
				}

				&:first-child {
					.name {
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
