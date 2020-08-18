import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import FriendList from '@/components/FriendList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/friendList',
      name: 'FriendList',
      component: FriendList
    }
  ]
})
