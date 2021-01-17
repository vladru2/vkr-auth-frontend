<template>
    <ContentWrapper :title="$t('title.create-account')">
        <AuthWrapper>
            <UnauthorizedWrapper>
                <Loading
                    inner-class="expand"
                    :loading="loading"
                    :request-failed="requestFailed"
                    @reset-error="resetError"
                >
                    <div class="expand" />

                    <div>
                        <div class="flex flex_vert_r">
                            <input
                                id="input_email"
                                type="email"
                                v-model="email"
                                :class="{ invalid_input: invalid.email || dupEmail }"
                                v-on:keyup.enter="submit"
                            />
                            <div class="spacer_tiny" />
                            <label for="input_email"> {{ $t('label.email') }} </label>
                        </div>
                        <div v-if="dupEmail" class="invalid_input_description">
                            {{ $t('error.duplicate.email') }}
                            <router-link class="link" to="/login">{{ $t('link.login') }}</router-link>
                        </div>
                        <div v-else-if="invalid.email" class="invalid_input_description">
                            {{ $t('error.invalid.email') }}
                        </div>
                    </div>

                    <div class="spacer_medium" />

                    <div>
                        <div class="flex flex_vert_r">
                            <input
                                id="input_name"
                                type="text"
                                v-model="name"
                                :class="{ invalid_input: invalid.name || dupName }"
                                v-on:keyup.enter="submit"
                            />
                            <div class="spacer_tiny" />
                            <label for="input_name"> {{ $t('label.name') }} </label>
                        </div>
                        <div v-if="dupName" class="invalid_input_description">
                            {{ $t('error.duplicate.name') }}
                        </div>
                        <div v-else-if="invalid.name" class="invalid_input_description">
                            {{ $t('error.invalid.name') }}
                        </div>
                    </div>

                    <div class="spacer_medium" />

                    <div>
                        <div class="flex flex_vert_r">
                            <input
                                id="input_pass"
                                type="password"
                                v-model="password"
                                :class="{ invalid_input: invalid.password }"
                                v-on:keyup.enter="submit"
                            />
                            <div class="spacer_tiny" />
                            <label for="input_pass"> {{ $t('label.password') }} </label>
                        </div>
                        <div v-if="invalid.password" class="invalid_input_description">
                            {{ $t('error.invalid.password') }}
                        </div>
                    </div>

                    <div class="spacer_medium" />

                    <div>
                        <div class="flex flex_vert_r">
                            <input
                                id="input_passRepeat"
                                type="password"
                                v-model="passRepeat"
                                :class="{ invalid_input: invalid.passRepeat }"
                                v-on:keyup.enter="submit"
                            />
                            <div class="spacer_tiny" />
                            <label for="input_passRepeat"> {{ $t('label.password-repeat') }} </label>
                        </div>
                        <div v-if="invalid.passRepeat" class="invalid_input_description">
                            {{ $t('error.invalid.password-repeat') }}
                        </div>
                    </div>

                    <div class="spacer_medium" />

                    <div>
                        <div class="flex flex_vert center">
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
                        <div v-if="invalid.recaptcha" class="invalid_input_description">
                            {{ $t('error.invalid.recaptcha') }}
                        </div>
                    </div>

                    <div class="spacer_medium" />

                    <button @click="submit" :class="{ gray_button: !validateInput() }">
                        {{ $t('button.submit') }}
                    </button>

                    <div class="expand" />

                    <div class="text_center">
                        {{ $t('question.login') }}
                        <div tabindex="0" class="link" @click="navigateToLogin">{{ $t('link.login') }}</div>
                    </div>

                    <div class="spacer_small" />
                </Loading>
            </UnauthorizedWrapper>
        </AuthWrapper>

        <div class="text_center">
            {{ $t('question.support.account-creation') }}
            <a class="link" href="https://social.hcs.land/support">{{ $t('link.support') }}</a>
        </div>
    </ContentWrapper>
</template>

<script>
import recaptcha from '@/hcs/recaptcha'
import { validateEmail, validateName, validatePassword } from '@/hcs/constraints'
import { setAll } from '@/hcs/utils'
import ContentWrapper from '@/components/ContentWrapper.vue'
import AuthWrapper from '@/components/AuthWrapper.vue'
import secureRedirect from '@/mixins/secure-redirect'
import UnauthorizedWrapper from '@/components/UnauthorizedWrapper.vue'
import { createAccount } from '@/api/auth'
import loading from '@/mixins/loading'

export default {
    components: { UnauthorizedWrapper, AuthWrapper, ContentWrapper },
    mixins: [recaptcha, secureRedirect, loading],
    data() {
        return {
            email: '',
            name: '',
            password: '',
            passRepeat: '',
            invalid: {
                email: false,
                name: false,
                password: false,
                passRepeat: false,
                recaptcha: false,
            },
            prev: {
                email: '',
                name: '',
            },
        }
    },
    methods: {
        submit(e) {
            e.preventDefault()
            setAll(this.invalid, true)
            if (this.validateInput()) {
                const { recaptcha } = this

                setAll(this.prev, null)
                this.resetRecaptcha()

                this.setLoading(this.$t('action.creating-account'))

                createAccount({
                    email: this.email,
                    name: this.name,
                    password: this.password,
                    recaptcha,
                })
                    .then(res => {
                        this.setLoading(false)
                        if (res.account) {
                            this.$store.commit('auth/finished', res.account)
                        }
                        if (res['wrong-captcha']) {
                            this.invalid.recaptcha = true
                        }
                        if (res['dup-email']) {
                            this.invalid.email = true
                            this.prev.email = this.email
                        }
                        if (res['dup-name']) {
                            this.invalid.name = true
                            this.prev.name = this.name
                        }
                    })
                    .catch(() => {
                        this.requestFailed = true
                    })
            }
        },
        validateInput() {
            const { invalid, prev } = this
            let valid = true

            if (validateEmail(this.email) && !this.dupEmail) {
                invalid.email = false
                prev.email = ''
            } else {
                valid = false
            }

            if (validateName(this.name) && !this.dupName) {
                invalid.name = false
                prev.name = ''
            } else {
                valid = false
            }

            let invalidPassword = true
            if (validatePassword(this.password)) {
                invalid.password = false
                invalidPassword = false
            } else {
                valid = false
            }

            if (!invalidPassword && this.password === this.passRepeat) {
                invalid.passRepeat = false
            } else {
                valid = false
            }

            if (this.recaptcha) {
                invalid.recaptcha = false
            } else {
                valid = false
            }
            return valid
        },
        navigateToLogin() {
            this.navigateLocal('login')
        },
    },
    computed: {
        dupEmail() {
            return this.prev.email && this.prev.email === this.email
        },
        dupName() {
            return this.prev.name && this.prev.name === this.name
        },
    },
    beforeUpdate() {
        if (this.email) this.invalid.email = true
        if (this.name) this.invalid.name = true
        if (this.password) this.invalid.password = true
        if (this.passRepeat) this.invalid.passRepeat = true
        this.validateInput()
    },
}
</script>
