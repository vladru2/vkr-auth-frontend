<template>
    <div class="flex flex_vert text_center">
        <div class="title">
            {{ title }}
        </div>
        <div class="spacer_medium" />
        <slot />
    </div>
</template>

<script>
import i18n from '@/i18n'

export default {
    name: 'Error',
    props: {
        title: {
            type: String,
            default: i18n.t('error.general'),
        },
    },
}
</script>

<style scoped>
.title {
    color: #ef5350;
}
</style>
