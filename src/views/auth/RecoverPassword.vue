<template>
    <ContentWrapper :title="$t('title.recover-password')">
        <AuthWrapper>
            <UnauthorizedWrapper>
                <div class="expand" />

                <Loading :loading="loading" :request-failed="requestFailed" @reset-error="resetError">
                    <div v-if="!emailChallenge">
                        <div class="flex flex_vert_r">
                            <input
                                id="login"
                                type="text"
                                v-model="start.login"
                                :class="{ invalid_input: start.invalidLogin || unknownLogin }"
                                v-on:keyup.enter="request"
                            />
                            <div class="spacer_tiny" />
                            <label for="login"> {{ $t('label.login') }} </label>
                        </div>
                        <div v-if="unknownLogin" class="invalid_input_description">
                            {{ $t('error.wrong.login') }}
                        </div>

                        <div class="spacer_medium" />

                        <div class="flex flex_vert center">
                            <div class="recaptcha" :class="{ invalid_input: start.invalidRecaptcha }">
                                <VueRecaptcha
                                    :sitekey="recaptchaSitekey"
                                    :loadRecaptchaScript="true"
                                    recaptchaHost="www.recaptcha.net"
                                    @verify="onCaptchaVerified"
                                    @expired="onCaptchaExpired"
                                    ref="recaptcha"
                                />
                            </div>
                        </div>

                        <div class="spacer_medium" />

                        <button @click="request" :class="{ gray_button: !verifyStartInput() }">
                            {{ $t('button.send-request') }}
                        </button>
                    </div>

                    <div v-else-if="!actionToken">
                        <EmailChallenge
                            :challenge="emailChallenge"
                            @completed="challengeComplete"
                            @expired="challengeExpired"
                        />
                    </div>

                    <div v-else-if="!success">
                        <NewPassword @submit="finish" />
                    </div>
                </Loading>
                <div class="expand" />
            </UnauthorizedWrapper>
        </AuthWrapper>

        <div class="text_center">
            {{ $t('link.website') }}
            <a class="link" :href="urls.website">{{ urls.website }}</a>
        </div>

        <div class="spacer_small" />

        <div class="text_center">
            {{ $t('question.no-account') }}
            <router-link class="link" to="/create-account">{{ $t('link.create-account') }}</router-link>
        </div>

        <div class="spacer_small" />

        <div class="text_center">
            {{ $t('question.login') }}
            <router-link class="link" to="/login">{{ $t('link.login') }}</router-link>
        </div>

        <div class="spacer_small" />

        <div class="text_center">
            {{ $t('question.support.general') }}
            <a class="link" :href="urls.support">{{ $t('link.support') }}</a>
        </div>
    </ContentWrapper>
</template>

<script>
import { urls } from '@/config'
import ContentWrapper from '@/components/ContentWrapper.vue'
import UnauthorizedWrapper from '@/components/UnauthorizedWrapper.vue'
import AuthWrapper from '@/components/AuthWrapper.vue'
import recaptcha from '@/hcs/recaptcha'
import { passwordRecoverFinish, passwordRecoverStart } from '@/api/password'
import NewPassword from '@/components/NewPassword.vue'
import EmailChallenge from '@/components/EmailChallenge.vue'
import loading from '@/mixins/loading'

export default {
    components: {
        EmailChallenge,
        NewPassword,
        AuthWrapper,
        UnauthorizedWrapper,
        ContentWrapper,
    },
    mixins: [recaptcha, loading],
    data() {
        return {
            emailChallenge: '',
            actionToken: '',
            success: false,
            start: {
                login: '',
                invalidLogin: false,
                prevLogin: '',
                invalidRecaptcha: false,
            },
        }
    },
    methods: {
        request() {
            const { start } = this
            start.invalidLogin = true
            start.invalidRecaptcha = true
            if (this.verifyStartInput()) {
                const { login } = start
                const { recaptcha } = this
                this.resetRecaptcha()

                this.setLoading(this.$t('action.recover-password.requesting'))

                passwordRecoverStart(login, recaptcha)
                    .then(res => {
                        this.setLoading(false)
                        if (res['email-challenge']) {
                            this.start.login = ''
                            this.emailChallenge = res['email-challenge']
                        }
                        if (res['unknown-user']) {
                            this.start.prevLogin = login
                        }
                        if (res['wrong-captcha']) {
                            this.start.invalidRecaptcha = true
                        }
                    })
                    .catch(() => {
                        this.requestFailed = true
                    })
            }
        },
        challengeComplete(actionToken) {
            this.actionToken = actionToken
        },
        challengeExpired() {
            this.emailChallenge = ''
        },
        finish(password) {
            this.setLoading(this.$t('action.recover-password.finishing'))
            passwordRecoverFinish(this.actionToken, password)
                .then(res => {
                    this.setLoading(false)
                    if (res.account) {
                        this.$store.commit('auth/finished', res.account)
                    }
                    if (res['outdated-token']) {
                        this.emailChallenge = ''
                    }
                })
                .catch(() => {
                    this.requestFailed = true
                })
        },
        verifyStartInput() {
            let valid = true
            const { start } = this

            if (start.login.length && !this.unknownLogin) {
                start.invalidLogin = false
                start.prevLogin = ''
            } else {
                valid = false
            }

            if (this.recaptcha) {
                this.start.invalidRecaptcha = false
            } else {
                valid = false
            }
            return valid
        },
    },
    computed: {
        urls: () => urls,
        unknownLogin() {
            return this.start.prevLogin && this.start.prevLogin === this.start.login
        },
    },
    created() {
        this.$store.commit('ready')
    },
    beforeUpdate() {
        if (!this.emailChallenge) this.verifyStartInput()
    },
}
</script>
