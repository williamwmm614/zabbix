<template>
	<section class="pdu-list-wrapper">
		<div class="task" v-for="item in taskList" :key="item.name">
			<div class="area-name">{{ item.name }}</div>
			<div class="list">
				<div
					class="item"
					v-for="task in item.tasks"
					:key="task.name"
					:class="bindClass(task.state)">
					{{ task.name }}
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	export default {
		name: 'Task',

		props: {
			taskList: {
				type: Array,
				default: () => []
			}
		},

		data() {
			return {}
		},

		mounted() {},

		methods: {
			bindClass(state) {
				if (state === 0) return 'item-green' // 就绪
				if (state === 1) return 'item-green' // 运行
				if (state === 2) return 'item-blue' // 睡眠
				if (state === 3) return 'item-yellow' // 阻塞
				if (state === 255) return 'item-yellow' // 未创建
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pdu-list-wrapper {
		flex: 1;
		margin-top: 5px;
		display: flex;
		align-items: center;
		justify-content: flex-start;

		.task {
			width: 20%;
			height: 100%;
			background: url(@/assets/images/task/banner.png) no-repeat;
			background-size: 100% 100%;
			display: flex;
			flex-flow: column;

			&:not(:last-child) {
				margin-right: 15px;
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
					color: #C9DBF5;
					font-size: 15px;
					font-weight: bolder;
					@include flex-level-center;

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
