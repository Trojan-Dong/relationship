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
