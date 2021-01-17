import Vue from 'vue'

export default Vue.extend({
    computed: {
        account() {
            return this.$store.state.auth ? this.$store.state.auth.account : null
        },
    },
})
