<template>
	<div class="task-monitoring-wrapper">
		<div class="title">
			<div class="container">
				<img :src="titleIcon">
				<span>任务实时监控</span>
			</div>
		</div>

		<section class="task-section">
			<!-- 首页 VMC 及 PDU运行状态 -->
			<host-state v-show="HOST_ACTIVATED === 11"></host-state>
			
			<!-- 首页 VMC模块分区任务列表 -->
			<task-list v-show="HOST_ACTIVATED !== 11"></task-list>
		</section>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import TaskList from './home/TaskList.vue'
	import HostState from './global/HostState.vue'

	export default {
		name: 'TaskMonitoring',

		components: {
			TaskList,
			HostState
		},

		data() {
			return {
				titleIcon: require('@/assets/images/title/title-icon.png'),
				showComponent: false
			}
		},

		computed: {
			...mapGetters([
				'HOST_ACTIVATED',
			])
		},

		mounted() {},

		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.task-monitoring-wrapper {
		width: 100%;
		height: 100%;
		background: url('@/assets/images/banner/task-monitor-bg.png') no-repeat;
		background-size: 100% 100%;
		display: flex;
		flex-flow: column;

		.title {
			display: flex;
			align-items: center;
			height: 37px;

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

		.task-section {
			flex: 1;
		}
	}
</style>
