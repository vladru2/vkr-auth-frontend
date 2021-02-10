import { api, fakeApi, fakeChallenge, fakeDelay, Status } from '@/api/index'

export type EmailVerifyStartResponse = {
    'email-challenge'?: string
    unauthorized?: boolean
    'wrong-captcha'?: boolean
}

export async function emailVerifyStart(recaptcha: string): Promise<EmailVerifyStartResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ 'email-challenge': 'a' }), fakeDelay))
    }
    const res = await api.post('email/verify/start', {
        json: {
            recaptcha,
        },
    })
    if (res.status === Status.UNAUTHORIZED) {
        return { unauthorized: true }
    }
    if (res.status === Status.FORBIDDEN) {
        return { 'wrong-captcha': true }
    }
    return res.json()
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
    const res = await api.post('email/verify/finish', {
        json: {
            'action-token': actionToken,
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
    const res = await api.post('email/change/start', {
        json: {
            recaptcha,
        },
    })
    if (res.status === Status.UNAUTHORIZED) {
        return { unauthorized: true }
    }
    return res.json()
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
    const res = await api.post('email/change/finish', {
        json: {
            'action-token': actionToken,
            'new-email': newEmail,
        },
    })
    if (res.status === Status.UNAUTHORIZED) {
        return { unauthorized: true }
    } else if (res.status === Status.RESET_CONTENT) {
        return { 'outdated-token': true }
    }
    return res.json()
}
