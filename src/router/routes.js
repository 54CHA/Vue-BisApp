const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AccountsPage.vue') },
      { path: 'Accounts', component: () => import('pages/AccountsPage.vue') },
      { path: 'OperationDays', component: () => import('pages/OperationDaysPage.vue') },
      { path: 'Operations', component: () => import('pages/OperationsPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
