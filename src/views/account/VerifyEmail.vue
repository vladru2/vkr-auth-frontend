<template>
    <ContentWrapper :title="$t('title.verify-email')">
        <AuthWrapper>
            <AccountWrapper>
                <AccountSetting
                    v-if="account"
                    class="expand"
                    :name="$t('account.verify-email.title')"
                    :text="$t('account.verify-email.text')"
                    :button-text="$t('button.back')"
                    button-route="/account/settings"
                    square-class="as_email_bg"
                    :iconify-icon="icons.mailLine"
                    button-class="account_button"
                >
                    <div class="expand" />

                    <Loading :loading="loading" :request-failed="requestFailed" @reset-error="resetError">
                        <div v-if="success" class="flex flex_vert text_center">
                            <div class="subtitle">
                                {{ $t('action.verify-email.success') }}
                            </div>

                            <div class="spacer_small" />

                            <div class="normal_text">
                                {{ $t('action.verify-email.details') }}
                            </div>

                            <div class="spacer_small" />

                            <router-link class="link" to="/account/settings">
                                {{ $t('link.account-settings') }}
                            </router-link>
                        </div>

                        <div v-else-if="emailChallenge">
                            <EmailChallenge :challenge="emailChallenge" @completed="finish" @expired="restart" />
                        </div>

                        <div v-else class="flex flex_vert center">
                            <div class="subtitle">
                                {{ $t('action.verify-email.start') }}
                            </div>

                            <div class="spacer_small" />

                            <div class="normal_text">
                                {{ $t('question.change-email') }}
                            </div>
                            <router-link class="link" to="/account/change-email">
                                {{ $t('link.change-email') }}
                            </router-link>

                            <div class="spacer_medium" />

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
import { emailVerifyFinish, emailVerifyStart } from '@/api/email'
import account from '@/mixins/account'
import Loading from '@/components/Loading'
import loading from '@/mixins/loading'

export default {
    components: {
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
            emailChallenge: '',
            invalidRecaptcha: false,
            icons: {
                mailLine,
            },
        }
    },
    methods: {
        request() {
            this.invalidRecaptcha = true
            const { recaptcha } = this
            if (recaptcha) {
                this.invalidRecaptcha = false
                this.resetRecaptcha()

                this.setLoading(this.$t('action.verify-email.requesting'))

                emailVerifyStart(recaptcha)
                    .then(res => {
                        this.setLoading(false)
                        if (res['email-challenge']) {
                            this.emailChallenge = res['email-challenge']
                        }
                        if (res['unauthorized']) {
                            this.$store.commit('auth/finished', null)
                        }
                        if (res['wrong-captcha']) {
                            this.invalidRecaptcha = true
                        }
                    })
                    .catch(() => {
                        this.requestFailed = true
                    })
            }
        },
        finish(actionToken) {
            this.setLoading(this.$t('action.verify-email.finishing'))
            emailVerifyFinish(actionToken)
                .then(res => {
                    this.setLoading(false)
                    if (res.success) {
                        this.success = true
                        const { account } = this
                        account.verified = true
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
        },
        restart() {
            this.emailChallenge = ''
        },
        stateCheck() {
            if (!this.success && this.account && this.account.verified) {
                this.success = true
                this.$router.push('/account/settings')
            }
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
