export const domain: string = process.env.VUE_APP_DOMAIN || 'hcs.land'

export const website = process.env.VUE_APP_WEBSITE || `https://${domain}/`

export const recaptchaSiteKey = process.env.VUE_APP_RECAPTCHA_SITEKEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

export const urls = {
    website,
    support: process.env.VUE_APP_SUPPORT || `https://support.${domain}/`,
    accountSecurity: process.env.VUE_APP_ACCOUNT_SECURITY || `https://support.${domain}/account-security`,
}
