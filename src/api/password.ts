import { api, fakeApi, fakeChallenge, fakeDelay, Status } from '@/api/index'
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
    const res = await api.post('password/change/start', {
        json: {
            recaptcha,
        },
    })
    if (res.status === Status.UNAUTHORIZED) {
        return { unauthorized: true }
    }
    return res.json()
}

export type PasswordChangeFinishResponse = {
    success?: boolean
    unauthorized?: boolean
    'outdated-token'?: boolean
}

export async function passwordChangeFinish(
    actionToken: string,
    newPassword: string
): Promise<PasswordChangeFinishResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), fakeDelay))
    }
    const res = await api.post('password/change/finish', {
        json: {
            'action-token': actionToken,
            'new-password': newPassword,
        },
    })
    if (res.status === Status.UNAUTHORIZED) {
        return { unauthorized: true }
    } else if (res.status === Status.RESET_CONTENT) {
        return { 'outdated-token': true }
    }
    if (res.status !== Status.NO_CONTENT) {
        throw new Error(res.statusText)
    }
    return { success: true }
}

export type PasswordRecoverStartResponse = {
    'email-challenge'?: string
    'unknown-user'?: boolean
    'wrong-captcha'?: boolean
}

export async function passwordRecoverStart(login: string, recaptcha: string): Promise<PasswordRecoverStartResponse> {
    const res = await api.post('password/recover/start', {
        json: {
            login,
            recaptcha,
        },
    })
    if (res.status === Status.UNAUTHORIZED) {
        return { 'unknown-user': true }
    } else if (res.status === Status.FORBIDDEN) {
        return { 'wrong-captcha': true }
    }
    return res.json()
}

export type PasswordRecoverFinishResponse = {
    account?: Account
    'outdated-token'?: boolean
}

export async function passwordRecoverFinish(
    actionToken: string,
    newPassword: string
): Promise<PasswordRecoverFinishResponse> {
    const res = await api.post('password/recover/finish', {
        json: {
            'action-token': actionToken,
            'new-password': newPassword,
        },
    })
    if (res.status === Status.RESET_CONTENT) {
        return { 'outdated-token': true }
    }
    return res.json()
}
