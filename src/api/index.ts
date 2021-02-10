import ky from 'ky'

export const api = ky.create({
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

export enum Status {
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    TOO_MANY_REQUESTS = 429,
}
