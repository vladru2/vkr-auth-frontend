<template>
    <Loading :loading="loading" :request-failed="requestFailed" @reset-error="resetError">
        <div class="text_center">
            <div class="subtitle">
                {{ $t('action.email-sent') }}
            </div>

            <div class="spacer_small" />

            <div class="details">
                {{ $t('action.email-code-input') }}
            </div>
        </div>

        <div class="spacer_medium" />

        <div>
            <div class="flex flex_vert_r">
                <input
                    id="email-code"
                    type="text"
                    v-model="emailCode"
                    :class="{ invalid_input: invalidEmailCode || wrongEmailCode }"
                    v-on:keyup.enter="proceed"
                />
                <div class="spacer_tiny" />
                <label for="email-code"> {{ $t('label.email-code') }} </label>
            </div>
            <div v-if="wrongEmailCode" class="invalid_input_description">
                {{ $t('error.wrong.email-code') }}
            </div>
        </div>

        <div class="spacer_medium" />

        <button @click="proceed" :class="{ gray_button: !verifyInput() }">
            {{ $t('button.continue') }}
        </button>
    </Loading>
</template>

<script>
import { completeEmailChallenge } from '@/api/challenge'
import loading from '@/mixins/loading'

export default {
    name: 'EmailChallenge',
    mixins: [loading],
    data() {
        return {
            emailCode: '',
            invalidEmailCode: false,
            prevEmailCode: '',
            timeout: 0,
        }
    },
    props: {
        challenge: String,
    },
    methods: {
        proceed() {
            this.invalidEmailCode = true
            if (this.verifyInput()) {
                const { emailCode } = this

                this.setLoading(this.$t('action.verifying-code'))

                completeEmailChallenge(this.challenge, emailCode)
                    .then(res => {
                        if (res['action-token']) {
                            this.completed(res['action-token'])
                        }
                        if (res['outdated-challenge']) {
                            this.expired()
                        }
                        if (res['unauthorized']) {
                            this.$store.commit('auth/finished', null)
                        }
                        if (res['wrong-code']) {
                            this.setLoading(false)
                            this.prevEmailCode = emailCode
                        }
                    })
                    .catch(() => {
                        this.requestFailed = true
                    })
            }
        },
        completed(actionToken) {
            this.$emit('completed', actionToken)
        },
        expired() {
            this.$emit('expired')
        },
        verifyInput() {
            let valid = true

            if (this.emailCode.length && !this.wrongEmailCode) {
                this.invalidEmailCode = false
                this.prevEmailCode = ''
            } else {
                valid = false
            }

            return valid
        },
    },
    computed: {
        wrongEmailCode() {
            return this.prevEmailCode && this.prevEmailCode === this.emailCode
        },
    },
    created() {
        this.timeout = setTimeout(() => {
            this.timeout = 0
            this.expired()
        }, 10 * 60 * 1000)
    },
    destroyed() {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    },
}
</script>

<style scoped></style>
