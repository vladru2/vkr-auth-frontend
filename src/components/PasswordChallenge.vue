<template>
    <Loading :loading="loading" :request-failed="requestFailed" @reset-error="resetError">
        <div>
            <div class="flex flex_vert_r">
                <input
                    id=""
                    type="password"
                    v-model="password"
                    :class="{ invalid_input: invalidPassword || wrongPassword }"
                    v-on:keyup.enter="proceed"
                />
                <div class="spacer_tiny" />
                <label for=""> {{ $t('label.password') }} </label>
            </div>
            <div v-if="wrongPassword" class="invalid_input_description">
                {{ $t('error.wrong.') }}
            </div>
        </div>

        <div class="spacer_medium" />

        <button @click="proceed" :class="{ gray_button: !verifyInput() }">
            {{ $t('button.continue') }}
        </button>
    </Loading>
</template>

<script>
import { completePasswordChallenge } from '@/api/challenge'
import loading from '@/mixins/loading'

export default {
    name: 'PasswordChallenge',
    mixins: [loading],
    data() {
        return {
            password: '',
            invalidPassword: false,
            prevPassword: '',
        }
    },
    props: {
        challenge: String,
    },
    methods: {
        proceed() {
            this.invalidPassword = true
            if (this.verifyInput()) {
                const { password } = this

                this.setLoading(this.$t('action.verifying-password'))

                completePasswordChallenge(this.challenge, password)
                    .then(res => {
                        if (res['action-token']) {
                            this.$emit('completed', res['action-token'])
                        }
                        if (res['outdated-challenge']) {
                            this.$emit('expired')
                        }
                        if (res['unauthorized']) {
                            this.$store.commit('auth/finished', null)
                        }
                        if (res['wrong-password']) {
                            this.setLoading(false)
                            this.prevPassword = password
                        }
                    })
                    .catch(() => {
                        this.requestFailed = true
                    })
            }
        },
        verifyInput() {
            let valid = true

            if (this.password.length && !this.wrongPassword) {
                this.invalidPassword = false
                this.prevPassword = ''
            } else {
                valid = false
            }

            return valid
        },
    },
    computed: {
        wrongPassword() {
            return this.prevPassword && this.prevPassword === this.password
        },
    },
}
</script>

<style scoped></style>
