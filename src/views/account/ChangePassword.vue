<template>
    <ContentWrapper :title="$t('title.change-password')">
        <AuthWrapper>
            <AccountWrapper>
                <AccountSetting
                    v-if="account"
                    class="expand"
                    :name="$t('account.change-password.title')"
                    :text="$t('account.change-password.text')"
                    :button-text="$t('button.back')"
                    button-route="/account/settings"
                    square-class="as_change_pass_bg"
                    :iconify-icon="icons.mailLine"
                    button-class="account_button"
                >
                    <div class="expand" />

                    <Loading :loading="loading" :request-failed="requestFailed" @reset-error="resetError">
                        <div v-if="success" class="flex flex_vert text_center">
                            <div class="subtitle">{{ $t('action.change-password.success') }}</div>

                            <div class="spacer_small" />

                            <div class="normal_text">{{ $t('account.reset.details') }}</div>

                            <div class="spacer_small" />

                            <router-link class="link" to="/account/settings">
                                {{ $t('link.account-settings') }}
                            </router-link>
                        </div>

                        <div v-else-if="actionToken">
                            <NewPassword @submit="finish" />
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
                                {{ $t('action.change-password.start') }}
                            </div>

                            <div class="spacer_small" />

                            <div class="normal_text">
                                {{ $t('action.change-password.warn-reset') }}
                            </div>

                            <div class="spacer_medium" />

                            <button @click="request">
                                {{ $t('button.change-password') }}
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
import { passwordChangeFinish, passwordChangeStart } from '@/api/password'
import account from '@/mixins/account'
import Loading from '@/components/Loading'
import loading from '@/mixins/loading'
import PasswordChallenge from '@/components/PasswordChallenge'
import NewPassword from '@/components/NewPassword'

export default {
    components: {
        NewPassword,
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

                this.setLoading(this.$t('action.change-password.requesting'))

                passwordChangeStart(recaptcha)
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
        finish(password) {
            this.setLoading(this.$t('action.change-password.finishing'))
            passwordChangeFinish(this.actionToken, password)
                .then(res => {
                    this.setLoading(false)
                    if (res.success) {
                        this.success = true
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
