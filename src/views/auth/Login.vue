<template>
    <ContentWrapper :title="$t('title.login')">
        <AuthWrapper>
            <UnauthorizedWrapper>
                <Loading
                    inner-class="expand"
                    :loading="loading"
                    :request-failed="requestFailed"
                    @reset-error="resetError"
                >
                    <div class="expand" />

                    <div v-if="form.showLoginHelp" class="text_center login_fail">
                        {{ $t('help.unknown-login') }}
                        <div class="spacer_medium" />
                    </div>

                    <div v-if="form.showPasswordHelp" class="text_center login_fail">
                        {{ $t('help.wrong-password') }}
                        <router-link class="link" to="/password-reset">{{ $t('link.recover-password') }}</router-link>
                        <div class="spacer_medium" />
                    </div>

                    <div>
                        <div class="flex flex_vert_r">
                            <input
                                id="input_login"
                                type="text"
                                v-model="login"
                                :class="{ invalid_input: invalid.login || unknownLogin }"
                                v-on:keyup.enter="submit"
                            />
                            <div class="spacer_tiny" />
                            <label for="input_login"> {{ $t('label.login') }} </label>
                        </div>

                        <div v-show="unknownLogin" class="invalid_input_description">
                            {{ $t('error.wrong.login') }}
                        </div>
                    </div>

                    <div class="spacer_medium" />

                    <div>
                        <div class="flex flex_vert_r">
                            <input
                                id="input_pass"
                                type="password"
                                v-model="password"
                                :class="{ invalid_input: invalid.password || wrongPassword }"
                                v-on:keyup.enter="submit"
                            />
                            <div class="spacer_tiny" />
                            <label for="input_pass"> {{ $t('label.password') }} </label>
                        </div>

                        <div v-show="wrongPassword" class="invalid_input_description">
                            {{ $t('error.wrong.password') }}
                        </div>
                    </div>

                    <div class="spacer_medium" />

                    <div v-if="form.mfaRequired" class="flex flex_vert">
                        <div>
                            <div class="flex flex_vert_r">
                                <input
                                    id="input_mfa"
                                    type="text"
                                    v-model="mfa"
                                    :class="{ invalid_input: invalid.mfa }"
                                    v-on:keyup.enter="submit"
                                />
                                <div class="spacer_tiny" />
                                <label for="input_mfa"> {{ $t('label.mfa') }} </label>
                            </div>
                        </div>

                        <div class="spacer_medium" />
                    </div>
                    <div v-if="form.recaptchaRequired" class="flex flex_vert">
                        <div class="recaptcha flex flex_vert center">
                            <div class="recaptcha" :class="{ invalid_input: invalid.recaptcha }">
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
                    </div>

                    <button @click="submit" :class="{ gray_button: !validateInput() }">
                        {{ $t('button.login') }}
                    </button>

                    <div class="expand" />

                    <div class="text_center">
                        {{ $t('question.forgot-password') }}
                        <router-link class="link" to="/recover-password">
                            {{ $t('link.recover-password') }}
                        </router-link>
                    </div>

                    <div class="spacer_small" />

                    <div class="text_center">
                        {{ $t('question.no-account') }}
                        <div tabindex="0" class="link" @click="navigateToAccountCreation">
                            {{ $t('link.create-account') }}
                        </div>
                    </div>

                    <div class="spacer_small" />
                </Loading>
            </UnauthorizedWrapper>
        </AuthWrapper>

        <div class="text_center">
            {{ $t('question.support.login') }}
            <a class="link" href="https://social.hcs.land/support">
                {{ $t('link.support') }}
            </a>
        </div>
    </ContentWrapper>
</template>

<script>
import recaptcha from '@/hcs/recaptcha'
import { setAll } from '@/hcs/utils'
import AuthWrapper from '@/components/AuthWrapper.vue'
import ContentWrapper from '@/components/ContentWrapper.vue'
import UnauthorizedWrapper from '@/components/UnauthorizedWrapper.vue'
import secureRedirect from '@/mixins/secure-redirect'
import { login } from '@/api/auth'
import loading from '@/mixins/loading'

export default {
    components: { UnauthorizedWrapper, ContentWrapper, AuthWrapper },
    mixins: [recaptcha, secureRedirect, loading],
    data() {
        return {
            login: '',
            password: '',
            mfa: '',
            invalid: {
                login: false,
                password: false,
                mfa: false,
                recaptcha: false,
            },
            prev: {
                login: '',
                password: '',
                mfa: '',
            },
            form: {
                showLoginHelp: false,
                showPasswordHelp: false,
                mfaRequired: false,
                recaptchaRequired: false,
            },
        }
    },
    methods: {
        navigateToAccountCreation() {
            this.navigateLocal('/create-account')
        },
        submit: function(e) {
            e.preventDefault()
            setAll(this.invalid, true)
            if (this.validateInput()) {
                const { recaptchaRequired, mfaRequired } = this.form
                const { recaptcha } = this

                setAll(this.prev, null)
                setAll(this.form, false)
                this.resetRecaptcha()

                this.setLoading(this.$t('action.logging-in'))

                login({
                    login: this.login,
                    password: this.password,
                    recaptcha,
                })
                    .then(res => {
                        this.setLoading(false)
                        if (res.account) {
                            this.$store.commit('auth/finished', res.account)
                        }
                        if (res['wrong-captcha']) {
                            if (recaptchaRequired) {
                                this.invalid.recaptcha = true
                            }
                            this.form.recaptchaRequired = true
                        }
                        if (res['unknown-user']) {
                            this.invalid.login = true
                            this.prev.login = this.login
                            this.showLoginHelp = true
                        }
                        if (res['wrong-password']) {
                            this.invalid.password = true
                            this.prev.password = this.password
                            this.showPasswordHelp = true
                        }
                        if (res['wrong-mfa']) {
                            if (mfaRequired) {
                                this.invalid.mfa = true
                                this.prev.mfa = this.mfa
                            }
                            this.form.mfaRequired = true
                        }
                    })
                    .catch(() => {
                        this.requestFailed = true
                    })
            }
        },
        validateInput() {
            const { invalid, prev, form } = this
            let valid = !this.hasErrors

            if (this.login.length && !this.unknownLogin) {
                invalid.login = false
                prev.login = ''
            } else {
                valid = false
            }

            if (this.password.length && !this.wrongPassword) {
                invalid.password = false
                prev.password = ''
            } else {
                valid = false
            }

            if (!form.mfaRequired || this.mfa.length) {
                invalid.mfa = false
            } else {
                valid = false
            }

            if (!form.recaptchaRequired || this.recaptcha.length) {
                invalid.recaptcha = false
            } else {
                valid = false
            }

            return valid
        },
    },
    computed: {
        unknownLogin() {
            return this.prev.login && this.prev.login === this.login
        },
        wrongPassword() {
            return this.prev.password && this.prev.password === this.password
        },
    },
    beforeUpdate() {
        this.validateInput()
    },
}
</script>

<style scoped>
.login_fail {
    color: #ff5c5c;
}
</style>
