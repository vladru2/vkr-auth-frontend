import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export interface RootState {
    loading: boolean
}

export default new Vuex.Store({
    state: {
        loading: true,
    },
    mutations: {
        ready: state => (state.loading = false),
    },
    actions: {},
    modules: {},
    strict: process.env.NODE_ENV !== 'production',
})
