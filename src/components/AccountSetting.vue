<template>
    <div class="flex flex_vert account_setting">
        <div class="flex flex_hor">
            <div class="as_square flex center" :class="squareClass">
                <IconifyIcon :icon="iconifyIcon" :style="{ color: '#ffffff', fontSize: '24px' }" />
            </div>

            <div class="spacer_small" />

            <div class="flex flex_vert">
                <div class="as_name expand">{{ name }}</div>
                <div class="as_text expand">{{ text }}</div>
            </div>
        </div>
        <slot>
            <div class="spacer_small" />
        </slot>
        <router-link class="button" :class="buttonClass" :to="buttonRoute">
            {{ buttonText }}
        </router-link>
    </div>
</template>

<style>
.account_setting {
    width: 100%;
}

.as_square {
    width: 40px;
    height: 40px;
    border-radius: 10px;
}

.as_name {
    font-weight: bold;
}

.as_text {
    font-weight: normal;
    color: #666;
}
</style>

<script>
import IconifyIcon from '@iconify/vue'

const prop = {
    type: String,
    required: true,
}

export default {
    components: {
        IconifyIcon,
    },
    props: {
        name: prop,
        text: prop,
        buttonText: prop,
        buttonRoute: prop,
        squareClass: prop,
        iconifyIcon: Object,
        buttonClass: String,
    },
}
</script>
