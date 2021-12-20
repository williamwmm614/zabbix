<template>
	<div class="rcrwqy-action-wrapper">
		<section class="title">
			<div class="container">
				<img :src="titleIcon">
				<span>交互体验区</span>
			</div>
		</section>

		<!-- 容错任务迁移 -->
		<section class="action-section">
			<article @click="handleModuleClick(1)">
				<RotateImg v-if="activatedModuleIndex === 1" :initIcon="initIcon"></RotateImg>
				<div v-else class="img-wrap">
					<img :src="moduleImg">
				</div>
				
				<div class="name" :class="activatedModuleIndex === 1 ? 'name-active' : ''"><span>VMC1断电故障模拟</span></div>
			</article>
			<article @click="handleModuleClick(2)">
				<RotateImg v-if="activatedModuleIndex === 2" :initIcon="initIcon"></RotateImg>
				<div v-else class="img-wrap">
					<img :src="moduleImg">
				</div>
				<div class="name" :class="activatedModuleIndex === 2 ? 'name-active' : ''"><span>VMC2断电故障模拟</span></div>
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
		name: 'RcrwqyAction',
		
		data() {
			return {
				titleIcon: require('@/assets/images/title/title-icon.png'),
				moduleImg: require('@/assets/images/interactiveExperience/vmc-done.png'),
				initIcon: require('@/assets/images/interactiveExperience/activeImgs/rcrwqy/icon.png'),
				activeImg: require('@/assets/images/interactiveExperience/activeImgs/rcrwqy/duandianguzhangmoni.png'),
				activatedModuleIndex: 0
			}
		},

		methods: {
			handleModuleClick(index) {
				this.activatedModuleIndex = index
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rcrwqy-action-wrapper {
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
</style>
