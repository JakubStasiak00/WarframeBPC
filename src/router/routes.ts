import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
    ],
    name: 'main-layout-home',
  },
  {
    path: '/about',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'about',
        component: () => import('pages/AboutProject.vue'),
      },
    ],
    name: 'main-layout-about',
  },
  {
    path: '/report-issues',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'issues',
        component: () => import('pages/ReportIssues.vue'),
      },
    ],
    name: 'main-layout-issues',
  },
  {
    path: '/updates',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'updates',
        component: () => import('pages/FutureUpdates.vue'),
      },
    ],
    name: 'main-layout-updates',
  },
  {
    path: '/login',
    component: () => import('layouts/NoAuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/UserLogin.vue'),
      },
    ],
    name: 'public-layout-login',
  },
  {
    path: '/register',
    component: () => import('layouts/NoAuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'register',
        component: () => import('pages/UserRegister.vue'),
      },
    ],
    name: 'public-layout-registed',
  },
  {
    path: '/verify',
    component: () => import('layouts/NoAuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'verify',
        component: () => import('pages/VerifyAccount.vue'),
      },
    ],
    name: 'public-layout-verify',
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
