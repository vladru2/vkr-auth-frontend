module.exports = {
    pluginOptions: {
        i18n: {
            locale: 'ru',
            fallbackLocale: 'ru',
            localeDir: 'locales',
            enableInSFC: true,
        },
    },
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://127.0.0.1:28981/auth',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/',
                },
                headers: { 'Hcs-Client-IP': '127.0.0.1' },
            },
        },
    },
}
