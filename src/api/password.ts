import { index, fakeApi, fakeChallenge, fakeDelay } from '@/api/index'
import { Account } from './index'

export type PasswordChangeStartResponse = {
    'password-challenge'?: string
    'email-challenge'?: string
    unauthorized?: boolean
    'wrong-captcha'?: boolean
}

export async function passwordChangeStart(recaptcha?: string): Promise<PasswordChangeStartResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ [fakeChallenge]: 'a' })))
    }
    return index
        .post('password/change/start', {
            json: {
                recaptcha,
            },
        })
        .json()
}

export type PasswordChangeFinishResponse = {
    success?: boolean
    unauthorized?: boolean
    'invalid-password'?: boolean
    'outdated-token'?: boolean
}

export async function passwordChangeFinish(
    actionToken: string,
    newPassword: string
): Promise<PasswordChangeFinishResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), fakeDelay))
    }
    return index
        .post('password/change/finish', {
            json: {
                'action-token': actionToken,
                'new-password': newPassword,
            },
        })
        .json()
}

export type PasswordRecoverStartResponse = {
    'email-challenge'?: string
    'unknown-user'?: boolean
    'wrong-captcha'?: boolean
}

export async function passwordRecoverStart(login: string, recaptcha: string): Promise<PasswordRecoverStartResponse> {
    return index
        .post('password/recover/start', {
            json: {
                login,
                recaptcha,
            },
        })
        .json()
}

export type PasswordRecoverFinishResponse = {
    account?: Account
    'invalid-password'?: boolean
    'outdated-token'?: boolean
}

export async function passwordRecoverFinish(
    actionToken: string,
    newPassword: string
): Promise<PasswordRecoverFinishResponse> {
    return index
        .post('password/recover/finish', {
            json: {
                'action-token': actionToken,
                'new-password': newPassword,
            },
        })
        .json()
}
