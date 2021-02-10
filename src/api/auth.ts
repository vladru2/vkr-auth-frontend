import { Account, api, fakeVerifyAccount, fakeApi, fakeDelay, fakeLoginAccount, Status } from './index'

export type CreateAccountRequest = {
    email: string
    name: string
    password: string
    recaptcha: string
}

export type CreateAccountResponse = {
    account?: Account
    'invalid-input'?: boolean
    'wrong-captcha'?: boolean
    'dup-email'?: boolean
    'dup-name'?: boolean
}

export async function createAccount(request: CreateAccountRequest): Promise<CreateAccountResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ account: fakeLoginAccount }), fakeDelay))
    }
    return api.put('account', { json: request }).json()
}

export type LoginRequest = {
    login: string
    password: string
    recaptcha?: string
}

export type LoginResponse = {
    account?: Account
    'wrong-captcha'?: boolean
    'account-locked'?: boolean
    'unknown-user'?: boolean
    'wrong-password'?: boolean
    'wrong-mfa'?: boolean
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ account: fakeLoginAccount }), fakeDelay))
    }
    const res = await api.post('account', { json: request })
    if (res.status === Status.TOO_MANY_REQUESTS) {
        return { 'wrong-captcha': true }
    } else if (res.status === Status.FORBIDDEN) {
        return { 'account-locked': true }
    }
    return res.json()
}

export type VerifyResponse = {
    account?: Account
    unauthorized?: boolean
}

export async function verify(): Promise<VerifyResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ account: fakeVerifyAccount }), fakeDelay))
    }
    const res = await api.get('account')
    if (res.status === Status.UNAUTHORIZED) {
        return { unauthorized: true }
    }
    return res.json()
}

export async function logout(): Promise<boolean> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve(true), fakeDelay))
    }
    const res = await api.post('logout')
    if (res.status === Status.UNAUTHORIZED) {
        return true
    }
    if (res.status !== Status.NO_CONTENT) {
        throw new Error(res.statusText)
    }
    return true
}

export async function reset(): Promise<boolean> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve(true), fakeDelay))
    }
    const res = await api.post('reset')
    if (res.status === Status.UNAUTHORIZED) {
        return false
    }
    if (res.status !== Status.NO_CONTENT) {
        throw new Error(res.statusText)
    }
    return true
}
