<template>
	<div class="svg-line-tree-wrapper">
		<div v-if="showPoint" class="point point1"></div>
		<div v-if="showPoint" class="point point2"></div>
		<div v-if="showPoint" class="point point3"></div>
		<div v-if="showPoint" class="point point4"></div>
		
		<svg xmlns="http://www.w3.org/2000/svg" width="630" height="120">
			<!-- 上箭头 -->
			<polygon
				points="305 10, 310 5, 315 10"
				style="fill:#64A5FF; stroke:#64A5FF;stroke-width:1" />
			
			<!-- 左箭头 -->
			<polygon
				points="0 110, 10 110, 5 115"
				style="fill:#64A5FF; stroke:#64A5FF;stroke-width:1" />
			
			<!-- 箭头二 -->
			<polygon
				points="205 110, 215 110, 210 115"
				style="fill:#64A5FF; stroke:#64A5FF;stroke-width:1" />
				
			<!-- 箭头三 -->
			<polygon				points="415 110, 425 110, 420 115"				style="fill:#64A5FF; stroke:#64A5FF;stroke-width:1" />
			
			<!-- 右箭头 -->
			<polygon
				points="620 110, 630 110, 625 115"
				style="fill:#64A5FF; stroke:#64A5FF;stroke-width:1" />
				
			<!-- M310 10, V50 上箭头线条路线 -->
			<!-- H5 625 长线条位置 -->
			<!-- V150 右箭头线条路线 -->
			<!-- M5 150, V50 左箭头线条路线 -->
			<!-- M210 150, V50 箭头二线条路线 -->
			<!-- M420 150, V50 箭头三线条路线 -->
			<path
				d="M310 10, V50, H5 625, V110, M5 110, V50, M210 110, V50, M420 110, V50"
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
				showPoint: false
			}
		},
		
		mounted() {
			this.recursive()
		},
		
		methods: {
			recursive() {
				const _this = this
				setTimeout(() => {
					_this.showPoint = true
				}, 6000)
				
				setTimeout(() => {
					_this.showPoint = false
					_this.recursive()
				}, 11000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.svg-line-tree-wrapper {
		.point {
			width: 10px;
			height: 10px;
			border-radius: 50%;
			background-color: #3ed6ff;
			position: absolute;
		}
		
		.point1 {
			offset-path: path('M310 10, V50, H5, V110');
			animation: followpath 5s linear infinite;
		}
		
		.point2 {
			offset-path: path('M310 10, V50, H210, V110');
			animation: followpath 5s linear infinite;
		}
		
		.point3 {
			offset-path: path('M310 10, V50, H420, V110');
			animation: followpath 5s linear infinite;
		}
		
		.point4 {
			offset-path: path('M310 10, V50, H625, V110');
			animation: followpath 5s linear infinite;
		}

		@keyframes followpath {
			100% {
				offset-distance: 100%;
			}
		}
	}
</style>
