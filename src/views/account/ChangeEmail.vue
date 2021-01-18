<template>
    <ContentWrapper :title="$t('title.change-email')">
        <AuthWrapper>
            <AccountWrapper>
                <AccountSetting
                    v-if="account"
                    class="expand"
                    :name="$t('account.change-email.title')"
                    :text="$t('account.change-email.text')"
                    :button-text="$t('button.back')"
                    button-route="/account/settings"
                    square-class="as_email_bg"
                    :iconify-icon="icons.mailLine"
                    button-class="account_button"
                >
                    <div class="expand" />

                    <Loading :loading="loading" :request-failed="requestFailed" @reset-error="resetError">
                        <div v-if="success" class="flex flex_vert text_center">
                            <div class="subtitle">{{ $t('action.change-email.success') }}</div>

                            <div class="spacer_small" />

                            <div class="normal_text">{{ $t('account.reset.success') }}</div>

                            <div class="spacer_small" />

                            <router-link class="link" to="/account/verify-email">
                                {{ $t('link.verify-email') }}
                            </router-link>

                            <div class="spacer_small" />

                            <router-link class="link" to="/account/settings">
                                {{ $t('link.account-settings') }}
                            </router-link>
                        </div>

                        <div v-else-if="actionToken">
                            <div class="flex flex_vert_r">
                                <input
                                    id="input_email"
                                    type="email"
                                    v-model="email.input"
                                    :class="{ invalid_input: email.invalid || dupEmail }"
                                    v-on:keyup.enter="finish"
                                />
                                <div class="spacer_tiny" />
                                <label for="input_email"> {{ $t('label.email') }} </label>
                            </div>
                            <div v-if="dupEmail" class="invalid_input_description">
                                {{ $t('error.duplicate.email') }}
                            </div>
                            <div v-else-if="email.invalid" class="invalid_input_description">
                                {{ $t('error.invalid.email') }}
                            </div>

                            <div class="spacer_medium" />

                            <button @click="finish" :class="{ gray_button: !validateEmail() }">
                                {{ $t('button.change-email') }}
                            </button>
                        </div>

                        <div v-else-if="emailChallenge">
                            <EmailChallenge
                                :challenge="emailChallenge"
                                @completed="challengeComplete"
                                @expired="restart"
                            />
                        </div>

                        <div v-else-if="passwordChallenge">
                            <PasswordChallenge
                                :challenge="passwordChallenge"
                                @completed="challengeComplete"
                                @expired="restart"
                            />
                        </div>

                        <div v-else-if="recaptchaRequired" class="flex flex_vert center">
                            <div class="recaptcha" :class="{ invalid_input: invalidRecaptcha }">
                                <VueRecaptcha
                                    :sitekey="recaptchaSitekey"
                                    :loadRecaptchaScript="true"
                                    recaptchaHost="www.recaptcha.net"
                                    @verify="onCaptchaVerified"
                                    @expired="onCaptchaExpired"
                                    ref="recaptcha"
                                />
                            </div>

                            <div class="spacer_medium" />

                            <button @click="request" :class="{ gray_button: !recaptcha }">
                                {{ $t('button.send-request') }}
                            </button>
                        </div>

                        <div v-else class="flex flex_vert center">
                            <div class="subtitle">
                                {{ $t('action.change-email.start') }}
                            </div>

                            <div class="spacer_small" />

                            <div class="normal_text">
                                {{ $t('action.change-email.warn-reset') }}
                            </div>

                            <div class="spacer_medium" />

                            <button @click="request">
                                {{ $t('button.change-email') }}
                            </button>
                        </div>
                    </Loading>

                    <div class="expand" />
                </AccountSetting>
            </AccountWrapper>
        </AuthWrapper>
    </ContentWrapper>
</template>

<script>
import AccountSetting from '@/components/AccountSetting'
import mailLine from '@iconify/icons-ri/mail-line'
import ContentWrapper from '@/components/ContentWrapper'
import AuthWrapper from '@/components/AuthWrapper'
import AccountWrapper from '@/components/AccountWrapper'
import EmailChallenge from '@/components/EmailChallenge'
import recaptcha from '@/hcs/recaptcha'
import { emailChangeFinish, emailChangeStart } from '@/api/email'
import account from '@/mixins/account'
import Loading from '@/components/Loading'
import loading from '@/mixins/loading'
import PasswordChallenge from '@/components/PasswordChallenge'
import { validateEmail } from '@/hcs/constraints'

export default {
    components: {
        PasswordChallenge,
        Loading,
        EmailChallenge,
        AccountWrapper,
        AuthWrapper,
        ContentWrapper,
        AccountSetting,
    },
    mixins: [account, loading, recaptcha],
    data() {
        return {
            success: false,
            actionToken: '',
            emailChallenge: '',
            passwordChallenge: '',
            recaptchaRequired: false,
            invalidRecaptcha: false,
            email: {
                input: '',
                invalid: false,
                prev: '',
            },
            icons: {
                mailLine,
            },
        }
    },
    methods: {
        request() {
            this.invalidRecaptcha = true
            const { recaptchaRequired, recaptcha } = this
            if (!recaptchaRequired || recaptcha) {
                this.invalidRecaptcha = false
                this.resetRecaptcha()

                this.setLoading(this.$t('action.change-email.requesting'))

                emailChangeStart(recaptcha)
                    .then(res => {
                        this.setLoading(false)
                        if (res['email-challenge']) {
                            this.emailChallenge = res['email-challenge']
                        }
                        if (res['password-challenge']) {
                            this.passwordChallenge = res['password-challenge']
                        }
                        if (res['unauthorized']) {
                            this.$store.commit('auth/finished', null)
                        }
                        if (res['wrong-captcha']) {
                            if (!this.recaptchaRequired) {
                                this.recaptchaRequired = true
                            } else {
                                this.invalidRecaptcha = true
                            }
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
        finish() {
            const { email } = this
            email.invalid = true
            if (this.validateEmail()) {
                this.setLoading(this.$t('action.change-email.finishing'))
                emailChangeFinish(this.actionToken, email.input)
                    .then(res => {
                        this.setLoading(false)
                        if (res.success) {
                            this.success = true
                            const { account } = this
                            account.verified = false
                            this.$store.commit('auth/finished', account)
                        }
                        if (res.unauthorized) {
                            this.$store.commit('auth/finished', null)
                        }
                        if (res['outdated-token']) {
                            this.restart()
                        }
                    })
                    .catch(() => {
                        this.requestFailed = true
                        this.restart()
                    })
            }
        },
        restart() {
            this.actionToken = ''
            this.emailChallenge = ''
            this.passwordChallenge = ''
        },
        stateCheck() {
            if (this.invalidRecaptcha && this.recaptcha) {
                this.invalidRecaptcha = false
            }
            this.validateEmail()
        },
        validateEmail() {
            const { email } = this
            let valid = true

            if (validateEmail(email.input) && !this.dupEmail) {
                email.invalid = false
                email.prev = ''
            } else {
                valid = false
            }

            return valid
        },
    },
    computed: {
        dupEmail() {
            const { email } = this
            return email.input && email.input === email.prev
        },
    },
    beforeMount() {
        this.stateCheck()
    },
    beforeUpdate() {
        this.stateCheck()
    },
}
</script>

<style></style>
