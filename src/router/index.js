import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import View from '../views/View.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/view',
      name: 'View',
      component: View,
      meta: {
        title: 'View'
      }
    },
  ]
})

const DEFAULT_TITLE = 'TITLE';

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE
})

export default router
