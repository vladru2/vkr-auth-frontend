import { recaptchaSiteKey } from '@/config'

import VueRecaptcha from 'vue-recaptcha'
import Vue from 'vue'

export default Vue.extend({
    components: {
        VueRecaptcha,
    },
    data() {
        return {
            recaptcha: '',
        }
    },
    methods: {
        onCaptchaVerified(recaptchaToken: string) {
            this.recaptcha = recaptchaToken
        },
        onCaptchaExpired() {
            this.recaptcha = ''
        },
        resetRecaptcha() {
            const recaptcha: VueRecaptcha = this.$refs['recaptcha'] as VueRecaptcha
            if (recaptcha) {
                this.onCaptchaExpired()
                recaptcha.reset()
            }
        },
    },
    computed: {
        recaptchaSitekey: () => recaptchaSiteKey,
    },
})
