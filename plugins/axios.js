/* eslint-disable no-debugger */
import Vue from 'vue'
import Axios from 'axios'
import { Message } from 'element-ui'
import _storage from '../utils/storage'

Vue.prototype.$axios = Axios

export default ({ redirect }) => {
  Axios.interceptors.request.use(
    async config => {
      /**
       * process.env.NODE_ENV: 判断开发模式
       * @type {string}
       */
      let reqUrls = {
        development: 'http://172.16.0.162:8080', // http://58.210.169.168:8086 http://172.16.0.162:8080
        test: 'http://172.16.0.162:8080',
        production: 'http://192.168.1.15:8080'
      };
      config.baseURL = reqUrls[process.env.environment];

      // const token = _storage.getUserToken();
      // if (token) {
      //   config.headers.Authorization = token
      // }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  Axios.interceptors.response.use(
    response => {
      return response
    },
    async error => {
      if (error.response) {
        window.$nuxt.$message.closeAll()
        switch (error.response.status) {
          case 401:
            _storage.removeUserToken()
            Message({
              message: '账号过期/被踢，请重新登录',
              type: 'warning'
            })
            redirect('/login')
            break
          case 400:
            let message = ''
            if (error.response.config.responseType === "blob") {
              error.response.data = await _storage.fileToJson(error.response.data);
            }
            if (
              error.response.data.fieldErrors !== undefined &&
              error.response.data.fieldErrors !== null
            ) {
              message = error.response.data.fieldErrors[0].message
            } else {
              message = error.response.data.message
            }
            Message({
              message: message,
              type: 'error'
            })
            break
          case 500:
            Message({
              message: '网络繁忙',
              type: 'warning'
            })
            break
          default:
            Message({
              message: '网络异常',
              type: 'error'
            })
            break
        }
      }
      return Promise.reject(error)
    }
  )
}
