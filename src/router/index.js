import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'

const routes = [
  {
    path: '/pta',
    name: 'Index',
    component: Index
  },
  {
    path: '/pta/games',
    name: 'Games',
    component: () => import('../views/Games.vue'),
    props: true
  },
  {
    path: '/pta/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/pta/registration',
    name: 'Registration',
    component: () => import('../views/Registration.vue'),
    props: true
  },
  {
    path: '/pta/gm',
    name: 'GM/Index',
    component: () => import('../views/gm/Index.vue'),
    props: true
  },
  {
    path: '/pta/trainer',
    name: 'Trainer/Index',
    component: () => import('../views/trainer/Index.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
