import Vue from 'vue'
import { domain } from '@/config'

export default Vue.extend({
    data() {
        return {
            redirect: null as URL | null,
        }
    },
    methods: {
        localNavigation(path: string): object {
            let query
            if (this.redirect) {
                query = { redirect: this.redirect.toString() }
            }
            return { path, query }
        },
    },
    created() {
        const ret = new URLSearchParams(window.location.search).get('redirect')
        if (ret) {
            const url = new URL(ret)
            if (url.protocol === window.location.protocol && (url.host === domain || url.host.endsWith('.' + domain))) {
                this.redirect = url
            }
        }
    },
})
