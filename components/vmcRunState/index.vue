<template>
	<div class="vmc-run-state-wrapper">
		<div class="img-wrapper">
			<img
				v-for="(host, index) in hostList"
				:key="host.host"
				:src="host.available === 1 ? vmcImgs.normal : host.available === 2 ? vmcImgs.stop : vmcImgs.warning">
		</div>
		
		<div class="title ele-before-after">VMC运行状态图</div>
	</div>
</template>

<script>
	export default {
		name: 'index',
		data() {
			return {
				vmcImgs: {
					normal: require('@/assets/images/interactiveExperience/rcgl/vmc-normal.png'),
					stop: require('@/assets/images/interactiveExperience/rcgl/vmc-stop.png'),
					warning: require('@/assets/images/interactiveExperience/rcgl/vmc-warning.png'),
				},
				hostList: []
			}
		},
		
		mounted() {
			this.initData()
		},
		
		methods: {
			initData() {
				const localHostData = this.$storage.getVmcPduData()
				if (localHostData === undefined) return
				const {vmcData} = localHostData
				const {vmc1, vmc2} = vmcData
				const vmc1HostList = [vmc1.hostA, vmc1.hostB, vmc1.hostC]
				const vmc2HostList = [vmc2.hostA, vmc2.hostB, vmc2.hostC]
				this.hostList = vmc1HostList.concat(vmc2HostList)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.ele-before-after {
		&::after,
		&::before {
			content: '';
			width: 30px;
			height: 1px;
			background-color: #DFEEF3;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	
	.vmc-run-state-wrapper{
		height: 100px;
		width: 100%;
		padding: 0 30px;
		background: url(../../assets/images/interactiveExperience/rcgl/banner.png) no-repeat;
		background-size: 100% 100%;
		position: relative;
		bottom: 20px;
		
		.img-wrapper{
			width: 100%;
			@include flex-space-around;
			position: relative;
			top: -35%;
			
			img{
				width: 100px;
			}
		}
		
		.title{
			color: #DFEEF3;
			font-size: 15px;
			text-align: center;
			position: absolute;
			left: 50%;
			bottom: 5px;
			transform: translateX(-50%);
			
			&::before {
				left: -50px;
			}
			
			&::after {
				right: -50px;
			}
		}
	}
</style>
