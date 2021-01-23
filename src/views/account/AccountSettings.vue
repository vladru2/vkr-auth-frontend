<template>
    <ContentWrapper :title="$t('title.account-settings')">
        <AuthWrapper>
            <AccountWrapper>
                <Loading
                    v-if="account"
                    inner-class="expand"
                    :loading="loading"
                    :request-failed="requestFailed"
                    @reset-error="resetError"
                >
                    <div v-if="resetDone" class="flex flex_vert expand text_center">
                        <div class="expand" />

                        <div class="subtitle">
                            {{ $t('account.reset.success') }}
                        </div>

                        <div class="spacer_medium" />

                        <div class="normal_text">
                            {{ $t('account.reset.details') }}
                        </div>

                        <div class="spacer_medium" />

                        <button @click="resetOK" ref="errorOk">
                            {{ $t('button.ok') }}
                        </button>

                        <div class="expand" />
                    </div>

                    <div v-else class="flex flex_vert expand">
                        <div class="flex flex_vert center">
                            <AccountSetting
                                :name="$t('account.multifactor-auth.title')"
                                :text="$t('account.multifactor-auth.text')"
                                :button-text="$t('link.multifactor-auth')"
                                button-route="/account/multifactor-auth"
                                square-class="as_mfa_bg"
                                :iconify-icon="icons.twoFactorAuthentication"
                                button-class="gray_button"
                            />

                            <div class="spacer_medium" />

                            <AccountSetting
                                v-if="account.verified"
                                :name="$t('account.change-email.title')"
                                :text="$t('account.change-email.text')"
                                :button-text="$t('link.change-email')"
                                button-route="/account/change-email"
                                square-class="as_email_bg"
                                :iconify-icon="icons.mailLine"
                                button-class="account_button"
                            />

                            <AccountSetting
                                v-else
                                :name="$t('account.verify-email.title')"
                                :text="$t('account.verify-email.text')"
                                :button-text="$t('link.verify-email')"
                                button-route="/account/verify-email"
                                square-class="as_email_bg"
                                :iconify-icon="icons.mailLine"
                                button-class="account_button"
                            />

                            <div class="spacer_medium" />

                            <AccountSetting
                                :name="$t('account.change-password.title')"
                                :text="$t('account.change-password.text')"
                                :button-text="$t('link.change-password')"
                                button-route="/account/change-password"
                                square-class="as_change_pass_bg"
                                :iconify-icon="icons.lockPasswordLine"
                                button-class="account_button"
                            />
                        </div>

                        <div class="flex flex_vert center expand">
                            <div class="normal_text">
                                {{ $t('question.forgot-to-logout') }}
                            </div>

                            <div class="normal_text">
                                {{ $t('question.accident-autologin-enable') }}
                            </div>

                            <div class="spacer_tiny" />

                            <div class="link" tabindex="0" @click="reset">
                                {{ $t('button.reset') }}
                            </div>
                        </div>

                        <button class="logout_button" @click="logout">
                            {{ $t('button.logout') }}
                        </button>
                    </div>
                </Loading>
            </AccountWrapper>
        </AuthWrapper>
    </ContentWrapper>
</template>

<script>
import { urls } from '@/config'
import { logout, reset } from '@/api/auth'

import AccountSetting from '@/components/AccountSetting.vue'

import twoFactorAuthentication from '@iconify/icons-mdi/two-factor-authentication'
import mailLine from '@iconify/icons-ri/mail-line'
import lockPasswordLine from '@iconify/icons-ri/lock-password-line'
import ContentWrapper from '@/components/ContentWrapper.vue'
import AuthWrapper from '@/components/AuthWrapper.vue'
import loading from '@/mixins/loading'
import AccountWrapper from '@/components/AccountWrapper'
import account from '@/mixins/account'

export default {
    components: {
        AccountWrapper,
        AuthWrapper,
        ContentWrapper,
        AccountSetting,
    },
    mixins: [loading, account],
    data() {
        return {
            resetDone: false,
            icons: {
                twoFactorAuthentication,
                mailLine,
                lockPasswordLine,
            },
        }
    },
    methods: {
        resetOK() {
            this.resetDone = false
        },
        reset() {
            this.setLoading(this.$t('action.resetting'))
            const delay = new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400))
            reset()
                .then(res => {
                    if (res.success) {
                        this.resetDone = true
                        delay.then(() => this.setLoading(false))
                        return
                    }
                    this.setLoading(false)
                    if (res.unauthorized) {
                        this.$store.commit('auth/finished', null)
                    }
                })
                .catch(() => {
                    this.requestFailed = true
                })
        },
        logout() {
            this.setLoading(this.$t('action.logging-out'))
            logout()
                .then(res => {
                    this.setLoading(false)
                    if (res['success'] || res['unauthorized']) {
                        this.$store.commit('auth/finished', null)
                        this.$router.push('/login')
                    }
                })
                .catch(() => {
                    this.requestFailed = true
                })
        },
    },
    computed: {
        urls: () => urls,
    },
}
</script>
