<template>
    <div class="flex flex_vert expand">
        <div v-if="!account" class="flex flex_vert expand">
            <div class="expand" />

            <img src="@/assets/logo.svg" alt="redirecting" height="200px" />

            <div class="expand" />
        </div>

        <div v-else class="flex flex_vert expand">
            <div class="account_name">
                {{ account.name }}
            </div>

            <div class="spacer_small" />

            <div class="flex flex_vert center">
                <div class="normal_text">{{ $t('question.account-security') }}</div>
                <a class="link" :href="urls.accountSecurity">{{ $t('link.account-security') }}</a>
            </div>

            <div class="spacer_medium" />

            <slot />

            <div class="spacer_small" />

            <div class="text_center">
                {{ $t('question.support.general') }}
                <a class="link" :href="urls.support">{{ $t('link.support') }}</a>
            </div>
        </div>
    </div>
</template>

<script>
import { urls } from '@/config'
import account from '@/mixins/account'

export default {
    name: 'AccountWrapper',
    mixins: [account],
    methods: {
        ensureLoggedIn() {
            if (!this.account) {
                this.$router.push({ path: '/login', query: { redirect: location.href }, replace: true })
            }
        },
    },
    computed: {
        urls: () => urls,
    },
    beforeMount() {
        this.ensureLoggedIn()
    },
    beforeUpdate() {
        this.ensureLoggedIn()
    },
}
</script>

<style>
.account_name {
    /*
    position: absolute;
   */
    width: 100%;
    left: 0;
    top: -20px;
    text-align: center;
    font-weight: normal;
    font-size: 18px;
}

.account_footer {
    position: absolute;
    left: 0;
    bottom: 20px;
    width: 100%;
}

.normal_text {
    font-style: normal;
    font-weight: normal;
}

.account_button {
    background: #289eed;
}

.logout_button {
    background: #fe5145;
}

.as_mfa_bg {
    background: linear-gradient(73.38deg, #43a36b 25.03%, #8dc26f 100%);
}

.as_email_bg {
    background: linear-gradient(84.75deg, #d98e26 0%, #ebc247 100%);
}

.as_change_pass_bg {
    background: linear-gradient(84.75deg, #6a40bf 0%, #a786ea 100%);
}
</style>
