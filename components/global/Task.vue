<template>
	<section class="list-container">
		<div class="task" v-for="(item, _index) in taskList" :key="item.name">
			<div class="area-name">{{ item.name }}</div>
			<div class="list">
				<div
					class="item"
					v-for="(task, index) in item.tasks"
					:key="task.name"
					:class="[bindClass(task.state), activeIndex === index + 1 && _index + 1 === areaIndex ? 'item-clicked' : '']"
					@click="handleItemClick(_index + 1, index + 1)">
					{{ task.name }}
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'Task',

		props: {
			taskList: {
				type: Array,
				default: () => []
			},
			
			action: {
				type: String,
				default: ''
			}
		},

		data() {
			return {
				activeIndex: 0,
				areaIndex: 0
			}
		},

		computed: {
			...mapGetters(['INTERACTION_PARENT_MODULE_NAME'])
		},

		methods: {
			bindClass(state) {
				if (state === 0) return 'item-green' // 就绪
				if (state === 1) return 'item-green' // 运行
				if (state === 2) return 'item-blue' // 睡眠
				if (state === 3) return 'item-yellow' // 阻塞
				if (state === 255) return 'item-yellow' // 未创建
			},
			
			// 任务点击事件
			handleItemClick(areaIndex, taskIndex) {
				if (this.INTERACTION_PARENT_MODULE_NAME === 'RCRWQY') return
				if (this.action === 'CLICK') {
					if (taskIndex === this.activeIndex && areaIndex === this.areaIndex) return
					this.areaIndex = areaIndex // 分区下标 从1开始
					this.activeIndex = taskIndex // 任务下标 从1开始
					this.$emit('emitTaskClick', {
						areaIndex,
						taskIndex
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-container {
		flex: 1;
		height: 100%;
		margin-top: 5px;
		@include flex-vertical-center;
		justify-content: flex-start;

		.task {
			// flex: 1;
			width: 20%;
			height: 100%;
			background: url(@/assets/images/task/banner.png) no-repeat;
			background-size: 100% 100%;
			display: flex;
			flex-flow: column;

			&:not(:last-child) {
				margin-right: 10px;
			}

			.area-name {
				height: 30px;
				color: #C9DBF5;
				font-size: 15px;
				font-weight: bolder;
				letter-spacing: 3px;
				@include flex-level-center;
			}

			.list {
				flex: 1;
				padding: 8px 0;

				.item {
					width: 85%;
					height: 15%;
					margin: auto;
					cursor: pointer;
					color: #C9DBF5;
					font-size: 15px;
					font-weight: bolder;
					@include flex-level-center;
					
					&-clicked{
						transform: scale(1.1);
					}

					&-blue {
						background: url(@/assets/images/task/blue.png) no-repeat;
						background-size: 100% 100%;
					}

					&-green {
						background: url(@/assets/images/task/green.png) no-repeat;
						background-size: 100% 100%;
					}

					&-yellow {
						background: url(@/assets/images/task/yellow.png) no-repeat;
						background-size: 100% 100%;
					}

					&:not(:last-child) {
						margin-bottom: 5px;
					}
				}
			}
		}
	}
</style>
