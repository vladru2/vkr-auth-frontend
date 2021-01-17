import { Account, index, fakeVerifyAccount, fakeApi, fakeDelay, fakeLoginAccount } from './index'

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
    return index.put('account', { json: request }).json()
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
    return index.post('account', { json: request }).json()
}

export type VerifyResponse = {
    account?: Account
    unauthorized?: boolean
}

export async function verify(): Promise<VerifyResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ account: fakeVerifyAccount }), fakeDelay))
    }
    return index.get('account').json()
}

export type LogoutResponse = {
    success?: boolean
    unauthorized?: boolean
}

export async function logout(): Promise<LogoutResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), fakeDelay))
    }
    return index.post('logout').json()
}

export type ResetResponse = {
    success?: boolean
    unauthorized?: boolean
}

export async function reset(): Promise<ResetResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), fakeDelay))
    }
    return index.post('reset').json()
}
