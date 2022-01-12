<template>
	<div class="img-rotate-wrapper">
		<img class="active-img" :src="type === 'FQJGZMN_CHILD' ? activeRedImg : activeImg">
		<img class="icon" :src="initIcon" >
	</div>
</template>

<script>
	export default {
		name: 'RotateImg',
		
		props: {
			type: {
				type: String,
				default: ''
			},
			initIcon: {
				type: String,
				default: ''
			}
		},
		
		data() {
			return {
				activeImg: require('@/assets/images/interactiveExperience/activeImgs/rcrwqy/duandianguzhangmoni.png'),
				activeRedImg: require('@/assets/images/interactiveExperience/activeImgs/rcrwqy/duandianguzhangmoni_red.png'),
			}
		}
	}
</script>

<style lang="scss" scoped>
	.img-rotate-wrapper{
		position: relative;
		
		.active-img{
			width: 80px;
			height: 80px;
			-webkit-animation: imgRotate 2s linear infinite;
			animation: imgRotate 2s linear infinite;
		}
		
		@-webkit-keyframes imgRotate {
			0%{
				transform: rotate(0deg);
				-webkit-transform: rotate(0deg);
			}
			
		    100%{
				transform: rotate(360deg);
				-webkit-transform: rotate(360deg);
			}
		}
		
		.icon{
			width: 30px;
			height: 30px;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>
