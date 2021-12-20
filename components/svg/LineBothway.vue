<template>
	<div class="svg-line-bothway-wrapper">
		<div v-if="showPoint" class="point"></div>
		<svg xmlns="http://www.w3.org/2000/svg" width="30" height="80">
			<polygon
				points="10 5, 15 0, 20 5"
				style="fill:#64A5FF; stroke:#64A5FF;stroke-width:1" />
			<polygon
				points="10 50, 15 55, 20 50"
				style="fill:#64A5FF; stroke:#64A5FF;stroke-width:1" />
			<path
				d="M15 5, V10 50"
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
				showPoint: false,
				first: true
			}
		},
		
		mounted() {
			this.recursive()
		},
		
		methods: {
			recursive() {
				let time = this.first ? 5000 : 10000
				let time2 = this.first ? 6000 : 11000
				const _this = this
				setTimeout(() => {
					_this.showPoint = true
				}, time)
				
				setTimeout(() => {
					_this.showPoint = false
					_this.first = false
					_this.recursive()
				}, time2)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.svg-line-bothway-wrapper {
		.point {
			width: 10px;
			height: 10px;
			border-radius: 50%;
			background-color: #3ed6ff;
			position: absolute;
			offset-path: path('M15 5, V10 50');
			animation: followpath 1s linear infinite;
		}

		@keyframes followpath {
			100% {
				offset-distance: 100%;
			}
		}
	}
</style>
