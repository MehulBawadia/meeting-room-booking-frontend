import GuestLayout from '@/components/layouts/GuestLayout.vue';
import HomeView from '@/views/HomeView.vue';

export default [
  {
    path: '/',
    component: GuestLayout,
    name: 'guestRoutes',
    children: [
      {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: {
          requiresAuth: false,
        },
      },
    ],
  },
];
