import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout.vue';

export default [
  {
    path: '/',
    component: AuthenticatedLayout,
    name: 'authenticatedRoutes',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/auth/DashboardView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];
