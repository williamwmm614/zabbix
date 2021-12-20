<template>
  <div class="default-layout-wrapper">
    <!-- <dv-full-screen-container>
      
    </dv-full-screen-container> -->
    
    <Loading v-if="showLoading" class="global-loading">加载中...</Loading>
    <transition v-else name="page">
      <Nuxt />
    </transition>
  </div>
</template>

<script>
  import Loading from '@/components/global/Loading.vue'
  export default {
    name: 'default',

    components: {
      Loading
    },

    data() {
      return {
        showLoading: true
      }
    },

    created() {
    },

    mounted() {
      this.showLoading = true
      setTimeout(() => {
        this.showLoading = false
      }, 1500)
    },
  };
</script>

<style scoped lang="scss">
  .default-layout-wrapper{
    width: 100%;
    height: 100%;
    background: url(../assets/images/banner/main-banner.png) no-repeat;
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
