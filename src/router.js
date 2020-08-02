import Vue from 'vue'
import Router from 'vue-router'

import UserHome from '@/views/UserHome.vue'
import AdminHome from '@/views/AdminHome.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'userHome',
      component: UserHome
    },
    {
      path: '/admin',
      name: 'AdminHome',
      component: AdminHome
    }
  ]
})
