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
    path: '/new',
    name: 'NewGame',
    component: () => import('../views/NewGame.vue')
  },
  {
    path: '/join',
    name: 'JoinGame',
    component: () => import('../views/JoinGame.vue'),
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
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting.vue'),
    props: true
  },
  {
    path: '/missionControl',
    name: 'MissionControl',
    component: () => import('../views/MissionControl.vue'),
  },
  {
    path: '/documentation',
    name: 'Documentation',
    component: () => import('../views/Documentation.vue'),
  },
  {
    path: '/credits',
    name: 'Credits',
    component: () => import('../views/Credits.vue'),
  },
  {
    path: '/bug',
    name: 'BugReport',
    component: () => import('../views/BugReport.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
