import Vue from 'vue'
import Router from 'vue-router'
import Map from '@/components/map'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', component: Map
    }
  ]
})
