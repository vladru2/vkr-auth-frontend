import Vue from 'vue'
import Loading from '@/components/Loading.vue'

export default Vue.extend({
    components: {
        Loading,
    },
    data() {
        return {
            loading: '',
            requestFailed: false,
        }
    },
    methods: {
        setLoading(loading: unknown) {
            if (!loading) {
                this.loading = ''
            } else {
                this.loading = String(loading)
            }
        },
        resetError() {
            this.requestFailed = false
            this.loading = ''
        },
    },
})
