import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// NProgress 基本配置
NProgress.inc(0.2);
NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500
});

// 暴露并配置路由加载时显示进度条
export default ({app}) => {
  app.router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
  })

  app.router.afterEach(() => {
    NProgress.done()
  })
}
