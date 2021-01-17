import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Error from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '*',
        name: 'Error',
        component: Error,
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Login.vue'),
    },
    {
        path: '/create-account',
        name: 'CreateAccount',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/CreateAccount.vue'),
    },
    {
        path: '/recover-password',
        name: 'Login',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/RecoverPassword.vue'),
    },
    {
        path: '/account/settings',
        name: 'AccountSettings',
        component: () => import(/* webpackChunkName: "account" */ '@/views/account/AccountSettings.vue'),
    },
    {
        path: '/account/verify-email',
        name: 'VerifyEmail',
        component: () => import(/* webpackChunkName: "account" */ '@/views/account/VerifyEmail.vue'),
    },
    {
        path: '/account/change-email',
        name: 'ChangeEmail',
        component: () => import(/* webpackChunkName: "account" */ '@/views/account/ChangeEmail.vue'),
    },
    {
        path: '/account/change-password',
        name: 'ChangePassword',
        component: () => import(/* webpackChunkName: "account" */ '@/views/account/ChangePassword.vue'),
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router
