import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const isAuth = Boolean(sessionStorage.getItem('isAuth'));
    const isVerified = Boolean(sessionStorage.getItem('isVerified'));

    if (
      isAuth &&
      (String(to.name) === 'login' ||
        String(to.name) === 'register' ||
        String(to.name) === 'verify') &&
      isVerified
    ) {
      console.log('a');
      next({ name: 'home' });
    } else if (
      !isAuth &&
      !(String(to.name) === 'login' || String(to.name) === 'register')
    ) {
      console.log('b');
      next({ name: 'login' });
    } else if (isAuth && String(to.name) !== 'verify' && !isVerified) {
      next({ name: 'verify' });
    } else if (from.name !== to.name) {
      next();
    }
  });

  return Router;
});
