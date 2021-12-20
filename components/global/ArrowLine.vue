<template>
  <div class="arrow-line-wrapper">
    <i class="element-icons icon-left-triangle left-triangle"></i>
    <i class="element-icons icon-left-triangle right-triangle"></i>
  </div>
</template>

<script>
  export default {
    name: 'arrowLine',

    data () {
      return {
      }
    }
  }
</script>

<style lang="scss" scoped>
  $mainColor: #37e9db;

  .arrow-line-wrapper{
    width: 100px;
    height: 3px;
    background: $mainColor;
    position: absolute;

    .element-icons{
      color: $mainColor;
      font-size: 15px;
      position: absolute;
    }

    .left-triangle{
      left: -10px;
      transform: translateY(-40%);
    }

    .right-triangle{
      right: -10px;
      transform: rotate(180deg) translateY(40%);
    }
  }
</style>
