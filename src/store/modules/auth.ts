import { Module } from 'vuex'
import { RootState } from '@/store'
import { Account } from '@/api'
import { verify } from '@/api/auth'

export interface AuthState {
    ready: boolean
    apiUnavailable: boolean
    account: Account | null
}

export const authModule: Module<AuthState, RootState> = {
    namespaced: true,
    state: {
        ready: false,
        apiUnavailable: false,
        account: null,
    },
    mutations: {
        started: state => {
            state.ready = false
        },
        finished: (state, account) => {
            state.account = account
            state.ready = true
        },
        failed: state => {
            state.apiUnavailable = true
        },
    },
    actions: {
        verify({ commit }) {
            commit('started')
            verify()
                .then(res => {
                    commit('finished', res.account)
                })
                .catch(() => {
                    commit('failed')
                })
        },
    },
}
