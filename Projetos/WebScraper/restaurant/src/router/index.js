import Vue from 'vue'

import Router from 'vue-router'

import SearchRestaurantVue from '@/components/SearchRestaurantVue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SearchRestaurantVue',
      component: SearchRestaurantVue
    }
  ]
})
