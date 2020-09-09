// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$axios = Axios
/* eslint-disable no-new */
Vue.prototype.HOST = '/relationship'
// Vue.prototype.WSHOST = 'ws://www.donguju.com/'
Vue.prototype.WSHOST = 'ws://localhost:80/'

// Vue.prototype.HOST = '/api'
// Axios.defaults.baseURL = '/api'

import VueCookies from 'vue-cookies'
Vue.use(VueCookies);

import VueSession from 'vue-session'
Vue.use(VueSession)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


/**
 * 全局变量 和 设置 、配置等。。。
 */

import axios from 'axios' // 引入axios

import Storage from './js/storage.js' // storage工具类，简单的封装



// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'



/* 请求拦截器 */

axios.interceptors.request.use(function (config) { // 每次请求时会从localStorage中获取token

  let token = Storage.localGet('token')

  if (token) {

    token = 'bearer' + ' ' + token.replace(/'|"/g, '') // 把token加入到默认请求参数中

    config.headers.common['accessToken'] = token

  }

  return config

}, function (error) {

  return Promise.reject(error)

})

/* 响应拦截器 */

axios.interceptors.response.use(function (response) { // ①10010 token过期（30天） ②10011 token无效

  if (response.data.code === 10010 || response.data.code === 10011) {

    Storage.localRemove('token') // 删除已经失效或过期的token（不删除也可以，因为登录后覆盖）

    router.replace({

      path: '/login' // 到登录页重新获取token

    })

  } else if (response.data.token) { // 判断token是否存在，如果存在说明需要更新token

    Storage.localSet('token', response.data.token) // 覆盖原来的token(默认一天刷新一次)

  }

  return response

}, function (error) {

  return Promise.reject(error)

})
