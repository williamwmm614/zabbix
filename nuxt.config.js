global.HTMLElement = typeof window === 'undefined' ? Object : window.HTMLElement;

module.exports = {
  telemetry: false,
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',

  server: {
    host: 'localhost', // 192.100.202.156
    port: '3000'
  },

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: '开放式综合电子演示验证系统地面软件',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css',
    'normalize.css/normalize.css',
    'element-ui/lib/theme-chalk/index.css',
    { src: '~assets/css/index.scss', lang: 'scss' }
  ],

  styleResources: {
    scss: [
      '@/assets/css/mixins.scss' // 全局 scss mixins
    ]
  },

  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '@/plugins/vue-inject',
    '@/plugins/element-ui',
    '@/plugins/echarts',
    // '@/plugins/antv-g6',
    '@/plugins/axios',
    '@/plugins/lang',
    // '@/plugins/components',
    {src: '@/plugins/dataView', ssr: false},
    {src: '@/plugins/nprogress', ssr: false},
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*false
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    // '@nuxtjs/axios',
    '@nuxtjs/style-resources' // 添加对应的CSS加载模块
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: false
  },

  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    transpile: [/^element-ui/],
    vendor: ['vue-i18n']
  },

  env: {
    environment: process.env.environment
  },
  router: {
  },
}
