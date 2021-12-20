<template>
	<div class="svg-line-left-wrapper">
		<div v-if="showPoint" class="point"></div>
		<svg xmlns="http://www.w3.org/2000/svg" width="220" height="200">
			<polygon
				points="5 10, 10 5, 15 10"
				style="fill:#64A5FF; stroke:#64A5FF;stroke-width:1" />
			<polygon
				points="210 80, 215 85, 210 90"
				style="fill:#64A5FF; stroke:#64A5FF;stroke-width:1" />
			<path
				d="M10 10, V10 85, H210"
				fill="none"
				stroke="#64A5FF"
				stroke-width="2"
				stroke-linejoin="round"
				stroke-linecap="round" />
		</svg>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showPoint: true
			}
		},
		
		mounted() {
			this.recursive()
		},
		
		methods: {
			recursive() {
				const _this = this
				setTimeout(() => {
					_this.showPoint = false
				}, 5000)
				
				setTimeout(() => {
					_this.showPoint = true
					_this.recursive()
				}, 11000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.svg-line-left-wrapper {
		.point {
			position: absolute;
			width: 10px;
			height: 10px;
			border-radius: 50%;
			background-color: #3ed6ff;
			offset-path: path('M10 15, V15 85, H210');
			animation: followpath 5s linear infinite;
			// animation-delay: 0.5s;
		}

		@keyframes followpath {
			100% {
				offset-distance: 100%;
			}
		}
	}
</style>
