import ky from 'ky'

export const index = ky.create({
    prefixUrl: '/api',
    credentials: 'include',
    throwHttpErrors: false,
})

export type Account = {
    name: string
    verified?: boolean
    'has-mfa'?: boolean
}

export const fakeApi = false

export const fakeVerifyAccount = undefined

export const fakeLoginAccount = {
    name: '_OFFLINE_ACCOUNT_',
    verified: false,
    'has-mfa': false,
}

export const fakeDelay = 80

export const fakeChallenge = fakeLoginAccount.verified ? 'email-challenge' : 'password-challenge'
