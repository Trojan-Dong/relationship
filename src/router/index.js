import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import FriendList from '@/components/FriendList'
import SendMessage from '@/components/SendMessage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/FriendList',
      name: 'FriendList',
      component: FriendList
    }, {
      path: '/SendMessage',
      name: 'SendMessage',
      component: SendMessage
    }
  ]
})
