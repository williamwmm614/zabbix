<template>
  <div class="empty-page--wrapper">
    <Loading class="global-loading">加载中...</Loading>
  </div>
</template>

<script>
  import Loading from '@/components/global/Loading.vue'
  export default {
    name: 'empty',

    components: {
      Loading
    },

    data() {
      return {
        fromRoutePath: ''
      }
    },
    
    beforeRouteEnter(to, from, next) {
      console.log(from);
    },
  }
</script>

<style>
</style>
