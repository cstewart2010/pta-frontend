import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index.vue'),
    props: true
  },
  {
    path: '/games',
    name: 'Games',
    component: () => import('../views/Games.vue'),
    props: true
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    props: true
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
  },
  {
    path: '/journal',
    name: 'Journal',
    component: () => import('../views/Journal.vue'),
    props: true
  },
  {
    path: '/trade',
    name: 'TradeCenter',
    component: () => import('../views/TradeCenter.vue'),
    props: true
  },
  {
    path: '/encounter',
    name: 'Encounter',
    component: () => import('../views/Encounter.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
