<template>
	<div class="svg-line-right-wrapper">
		<div v-if="showPoint" class="point"></div>
		<svg xmlns="http://www.w3.org/2000/svg" width="220" height="200">
			<polygon
				points="195 10, 200 5, 205 10"
				style="fill:#64A5FF; stroke:#64A5FF;stroke-width:1" />
			<polygon
				points="5 80, 0 85, 5 90"
				style="fill:#64A5FF; stroke:#64A5FF;stroke-width:1" />
			<path
				d="M200 10, V10 85, H5"
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
	.svg-line-right-wrapper {
		.point {
			position: absolute;
			width: 10px;
			height: 10px;
			border-radius: 50%;
			background-color: #3ed6ff;
			offset-path: path('M200 15, V15 85, H5');
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
