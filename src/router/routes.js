const routes = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            // { path: '', component: () => import('pages/IndexPage.vue') },
            { path: '', component: () => import('pages/RentCalculator.vue') },
            { path: 'rent-calculator', component: () => import('pages/RentCalculator.vue') },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
]

export default routes
