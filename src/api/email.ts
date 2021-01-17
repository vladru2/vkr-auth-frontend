import { index, fakeApi, fakeChallenge, fakeDelay } from '@/api/index'

export type EmailVerifyStartResponse = {
    'email-challenge'?: string
    unauthorized?: boolean
    'wrong-captcha'?: boolean
}

export async function emailVerifyStart(recaptcha: string): Promise<EmailVerifyStartResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ 'email-challenge': 'a' }), fakeDelay))
    }
    return index
        .post('email/verify/start', {
            json: {
                recaptcha,
            },
        })
        .json()
}

export type EmailVerifyFinishResponse = {
    success?: boolean
    unauthorized?: boolean
    'outdated-token'?: boolean
}

export async function emailVerifyFinish(actionToken: string): Promise<EmailVerifyFinishResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), fakeDelay))
    }
    return index
        .post('email/verify/finish', {
            json: {
                'action-token': actionToken,
            },
        })
        .json()
}

export type EmailChangeStartResponse = {
    'password-challenge'?: string
    'email-challenge'?: string
    unauthorized?: boolean
    'wrong-captcha'?: boolean
}

export async function emailChangeStart(recaptcha: string): Promise<EmailChangeStartResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ [fakeChallenge]: 'a' }), fakeDelay))
    }
    return index
        .post('email/change/start', {
            json: {
                recaptcha,
            },
        })
        .json()
}

export type EmailChangeFinishResponse = {
    success?: boolean
    'invalid-email'?: boolean
    unauthorized?: boolean
    'outdated-token'?: boolean
    'dup-email'?: boolean
}

export async function emailChangeFinish(actionToken: string, newEmail: string): Promise<EmailChangeFinishResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), fakeDelay))
    }
    return index
        .post('email/change/finish', {
            json: {
                'action-token': actionToken,
                'new-email': newEmail,
            },
        })
        .json()
}
