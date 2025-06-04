import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import guestRoutes from './guest';
import authenticatedRoutes from './authenticated';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...guestRoutes, ...authenticatedRoutes],
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.authUser) {
    return next({ name: 'login' });
  }

  if (to.name === 'login' && auth.authUser) {
    return next({ name: 'dashboard' });
  }

  return next();
});

export default router;
