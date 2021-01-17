<template>
    <div class="flex flex_vert expand">
        <div v-if="$store.state.auth.account" class="flex flex_vert expand">
            <div class="expand" />

            <img v-if="redirect" src="@/assets/logo.svg" alt="redirecting" height="200px" />

            <div v-else class="text_center">
                <div class="title">
                    {{ $t('auth.successful') }}
                </div>

                <div class="spacer_large" />

                <a class="subtitle link" :href="website">
                    {{ $t('link.website') }}
                </a>

                <div class="spacer_medium" />

                <router-link class="subtitle link" to="/account/settings">
                    {{ $t('link.account-settings') }}
                </router-link>
            </div>

            <div class="expand" />
        </div>

        <div v-else class="flex flex_vert expand">
            <slot />
        </div>
    </div>
</template>

<script>
import secureRedirect from '@/mixins/secure-redirect'
import { website } from '@/config'

export default {
    name: 'UnauthorizedWrapper',
    mixins: [secureRedirect],
    methods: {
        ensureNotLoggedIn() {
            if (this.$store.state.auth.account) {
                if (this.redirect) {
                    if (this.redirect.host === window.location.host) {
                        this.$router.push({ path: this.redirect.pathname, replace: true })
                    } else {
                        window.location.href = this.redirect
                    }
                }
            }
        },
    },
    computed: {
        website() {
            return website
        },
    },
    beforeMount() {
        this.ensureNotLoggedIn()
    },
    beforeUpdate() {
        this.ensureNotLoggedIn()
    },
}
</script>
