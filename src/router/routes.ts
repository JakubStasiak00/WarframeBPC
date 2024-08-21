import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/about',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AboutProject.vue') }],
  },
  {
    path: '/report-issues',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ReportIssues.vue') }],
  },
  {
    path: '/updates',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/FutureUpdates.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/NoAuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/UserLogin.vue') }],
  },
  {
    path: '/register',
    component: () => import('layouts/NoAuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/UserRegister.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
