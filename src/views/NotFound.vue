<template>
    <div class="flex flex_vert">
        <Error :title="$t('error.404.title')">
            <div class="subtitle">
                {{ $t('error.404.text') }}
            </div>
        </Error>

        <div class="expand" />

        <div class="text_center">
            {{ $t('link.website') }}
            <a class="link" :href="urls.website">{{ urls.website }}</a>

            <div class="spacer_small" />

            {{ $t('question.no-account') }}
            <router-link class="link" to="/create-account">{{ $t('link.create-account') }}</router-link>

            <div class="spacer_small" />

            {{ $t('question.account-exists') }}
            <router-link class="link" to="/login">{{ $t('link.login') }}</router-link>

            <div class="spacer_small" />

            {{ $t('question.support.general') }}
            <a class="link" :href="urls.support">{{ $t('link.support') }}</a>
        </div>
    </div>
</template>

<script>
import { urls } from '@/config'
import Error from '@/components/Error'

export default {
    components: { Error },
    computed: {
        urls: () => urls,
    },
    created() {
        this.$store.commit('ready', true)
    },
}
</script>
