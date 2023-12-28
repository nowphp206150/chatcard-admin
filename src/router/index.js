import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: {
                path: '/login'
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../components/Login.vue')
        },
        {
            path: '/header',
            name: 'header',
            component: () => import('../components/Header.vue'),
            children: [
                {
                    path: 'user',
                    name: 'user',
                    component: () => import('../components/User.vue')
                },
                {
                    path: 'key',
                    name: 'key',
                    component: () => import('../components/Key.vue')
                }
            ]
        }
    ]
})

export default router