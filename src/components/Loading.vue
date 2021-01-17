<template>
    <div class="flex flex_vert" :class="innerClass">
        <div v-show="loading" class="flex flex_vert" :class="innerClass">
            <div class="expand" />

            <div v-if="!requestFailed" class="subtitle text_center">
                {{ loading }}
            </div>

            <div v-else class="flex flex_vert">
                <Error>
                    <div class="subtitle">
                        {{ $t('auth.service-unavailable') }}
                    </div>

                    <div class="spacer_small" />

                    <div class="details">
                        {{ loading }}
                    </div>

                    <div class="spacer_medium" />

                    <button class="red_button" @click="resetError">
                        {{ $t('button.ok') }}
                    </button>
                </Error>
            </div>

            <div class="expand" />
        </div>

        <div v-show="!loading" class="flex flex_vert" :class="innerClass">
            <slot />
        </div>
    </div>
</template>

<script>
import Error from '@/components/Error'

export default {
    name: 'Loading',
    components: { Error },
    props: {
        loading: String,
        requestFailed: Boolean,
        innerClass: String,
    },
    methods: {
        resetError() {
            this.$emit('reset-error')
        },
    },
}
</script>

<style scoped></style>
