<template>
    <div class="flex flex_vert expand">
        <div v-if="!$store.state.auth.ready" class="flex flex_vert pad expand">
            <div class="expand" />

            <div v-if="$store.state.auth.apiUnavailable" class="flex flex_vert">
                <Error>
                    <div class="subtitle">
                        {{ $t('auth.service-unavailable') }}
                    </div>
                </Error>
            </div>

            <div v-else class="title text_center">
                {{ $t('auth.verifying') }}
            </div>

            <div class="expand" />
        </div>

        <div v-else class="flex flex_vert pad expand">
            <slot />
        </div>
    </div>
</template>

<script>
import Error from '@/components/Error'
import { authModule } from '@/store/modules/auth'

export default {
    name: 'AuthWrapper',
    components: { Error },
    beforeCreate() {
        const store = this.$store
        if (!store.state.auth) {
            store.registerModule('auth', authModule)
            store.dispatch('auth/verify')
            this.$store.commit('ready')
        }
    },
}
</script>

<style scoped></style>
