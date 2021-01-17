<template>
    <div id="app" class="flex flex_vert" :style="downscale">
        <div class="glow" />
        <div class="flex flex_vert expand app">
            <div class="header flex flex_hor">
                <img class="logo" src="@/assets/logo.svg" alt="logo" />
            </div>
            <div class="flex flex_hor page">
                <div class="flex flex_vert root panel container downscale" ref="container">
                    <div v-show="loading" class="flex flex_vert center expand">
                        <div class="title">{{ $t('title.loading') }}</div>
                    </div>
                    <div v-if="devMessage" v-show="!loading" class="dev_message top">
                        {{ devMessage }}
                    </div>
                    <router-view v-show="!loading" class="flex flex_vert expand" />

                    <div v-if="devMessage" v-show="!loading" class="dev_message bot">
                        {{ devMessage }}
                    </div>
                </div>
            </div>
            <div class="footer flex flex_hor">
                <div class="flex flex_vert">
                    <div class="footer_1">Horizon Cube Studio</div>
                    <div class="footer_2">2014-2020</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            scale: 1,
            devMessage: process.env.VUE_APP_DEV_MESSAGE,
        }
    },
    computed: {
        ...mapState(['loading']),
        downscale() {
            return {
                '--downscale': this.scale,
            }
        },
    },
    mounted: function() {
        window.addEventListener('resize', this.handleResize)
        this.handleResize()
    },
    beforeDestroy: function() {
        window.removeEventListener('resize', this.handleResize)
    },
    methods: {
        handleResize() {
            const width = window.innerWidth / this.$refs['container'].clientWidth
            //const height = Math.max(window.innerHeight, 350) / this.$refs['container'].clientHeight
            const scale = Math.min(width, 1)
            this.scale = Math.min(scale, 1)
        },
    },
}
</script>

<style>
@font-face {
    font-family: 'Lato';
    src: url('./assets/font/Lato-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'Lato';
    src: url('./assets/font/Lato-Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
}

* {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

body {
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    margin: 0;
    padding: 0;
    font-family: inherit;
}

#app {
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(180deg, rgba(4, 60, 98, 0.25) 0%, rgba(4, 60, 98, 0) 100%), url(./assets/bg.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.app {
    padding: calc(var(--downscale) * 25px);
    overflow: hidden;
}

.flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}

.flex_vert {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
}

.flex_hor {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    width: 100%;
}

.header {
    transform-origin: 0 0;
}

.page {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.root {
    position: relative;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.footer {
    font-size: calc(var(--downscale) * 100%);
    transform-origin: 0 100%;
    color: #f1f3f4;
    -webkit-box-align: end;
    -ms-flex-align: end;
    align-items: flex-end;
}

.logo {
    width: calc(var(--downscale) * 64px);
    height: calc(var(--downscale) * 64px);
    display: inline-block;
}

.panel {
    background: #f1f3f4;
}

.container {
    border-radius: 5px;
    padding: 40px 5px;
    min-width: 350px;
    min-height: 350px;
    object-fit: scale-down;
}

.text_center {
    text-align: center;
}

.link {
    color: #0988dd;
    text-decoration: none;
    font-weight: bold;
    cursor: pointer;
    display: inline;
}

.link:hover {
    text-decoration: underline;
}

.link:active {
    text-decoration: underline dotted;
}

.center {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
}

.expand {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
}

.downscale {
    transform: scale(var(--downscale));
}

@media screen and (min-width: 450px) {
    .container {
        padding: 40px;
    }
}

.spacer_tiny {
    width: 5px;
    height: 5px;
}

.spacer_small {
    width: 10px;
    height: 10px;
}

.spacer_medium {
    width: 20px;
    height: 20px;
}

.spacer_large {
    width: 40px;
    height: 40px;
}

.subtitle {
    font-size: 18px;
    font-weight: normal;
}

.title {
    font-weight: bold;
    font-size: 24px;
}

* {
    outline: none;
}
</style>

<style scoped>
.footer_1 {
    font-weight: bold;
}

.footer_2 {
    font-weight: normal;
}

.glow {
    position: fixed;
    top: 0;
    right: 0;
    width: 40%;
    height: 100%;
    min-width: 350px;
    min-height: 600px;
    background: radial-gradient(53.94% 79.84% at 100% 0%, rgba(57, 171, 247, 0.3) 0%, rgba(57, 171, 247, 0) 100%);
}

.dev_message {
    position: absolute;
    width: 100%;
    left: 0;
    border-radius: 5px;
    padding-top: 2px;
    padding-bottom: 1px;
    background: red;
    color: white;
    font-size: 18px;
    font-weight: normal;
    text-align: center;
    animation-name: dev_message_bg;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    display: none;
}

.dev_message.top {
    display: block;
    top: 0;
    border-radius: 5px 5px 0 0;
}

.dev_message.bot {
    display: block;
    bottom: 0;
    border-radius: 0 0 5px 5px;
}

@keyframes dev_message_bg {
    0% {
        background: #f44336;
    }
    50% {
        background: #ff7961;
    }
    100% {
        background: #f44336;
    }
}
</style>
