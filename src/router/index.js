import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/games',
    name: 'Games',
    component: () => import('../views/Games.vue'),
    props: true
  },
  {
    path: '/games-redirect',
    name: 'GamesRedirect',
    component: () => import('../views/GamesRedirect.vue'),
    props: true
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import('../views/Registration.vue'),
    props: true
  },
  {
    path: '/gm',
    name: 'GM/Index',
    component: () => import('../views/gm/Index.vue'),
    props: true
  },
  {
    path: '/trainer',
    name: 'Trainer/Index',
    component: () => import('../views/trainer/Index.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
