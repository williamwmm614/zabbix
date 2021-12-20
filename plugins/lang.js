// 插件中使用vue-i18n库
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: 'zh', // store.state.locale 通过 vuex 实现语言切换
    fallbackLocale: 'zh',
    messages: {
      'zh': require('~/locales/zh.json')
    }
  });
  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }

    return `/${app.i18n.locale}/${link}`
  }
}
