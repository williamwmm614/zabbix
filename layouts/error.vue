<template>
  <div class="error-page">
    <div>
      <h1 class="error-code">{{ error.statusCode }}</h1>
      <div class="error-wrapper-message">
        <h2 class="error-message">{{ error.message }}</h2>
      </div>
      <p v-if="error.statusCode === 404"><nuxt-link class="error-link" to="/">回到首页</nuxt-link></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'nuxt-error',
  props: ['error'],
  head () {
    return {
      title: this.error.message || 'An error occurred'
    }
  }
}
</script>

<style scoped lang="scss">
.error-page {
  width: calc(100% - 260px);
  height: 100%;
  color: #000;
  background: #fff;
  font-family: "SF UI Text", "Helvetica Neue", "Lucida Grande";
  text-align: center;
  position: fixed;
  top: 0;
  left: 260px;
  @include flex-level-center;
}
.error-code {
  display: inline-block;
  font-size: 24px;
  font-weight: 500;
  vertical-align: top;
  border-right: 1px solid rgba(0, 0, 0, 0.298039);
  margin-right: 20px;
  padding: 10px 23px;
}
.error-wrapper-message {
  display: inline-block;
  text-align: left;
  line-height: 49px;
  height: 49px;
  vertical-align: middle;
}
.error-message {
  font-size: 14px;
  font-weight: normal;
  margin: 0;
  padding: 0;
}
.error-link {
  color: #00BCD4;
  font-weight: normal;
  text-decoration: none;
  font-size: 14px;
}
</style>
