import { api, fakeApi, fakeDelay, Status } from '@/api/index'

export type PasswordChallengeResponse = {
    'action-token'?: string
    unauthorized?: boolean
    'outdated-challenge'?: boolean
    'wrong-password'?: boolean
    'password-reset'?: boolean
}

export async function completePasswordChallenge(
    challenge: string,
    password: string
): Promise<PasswordChallengeResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ 'action-token': 'a' }), fakeDelay))
    }
    const res = await api.post('complete-challenge/password', {
        json: {
            challenge,
            password,
        },
    })
    if (res.status === Status.UNAUTHORIZED) {
        return { unauthorized: true }
    } else if (res.status === Status.RESET_CONTENT) {
        return { 'outdated-challenge': true }
    }
    return res.json()
}

export type EmailChallengeResponse = {
    'action-token'?: string
    unauthorized?: boolean
    'outdated-challenge'?: boolean
    'wrong-code'?: boolean
}

export async function completeEmailChallenge(challenge: string, code: string): Promise<EmailChallengeResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ 'action-token': 'a' }), fakeDelay))
    }
    const res = await api.post('complete-challenge/email', {
        json: { challenge, code },
    })
    if (res.status === Status.UNAUTHORIZED) {
        return { unauthorized: true }
    } else if (res.status === Status.RESET_CONTENT) {
        return { 'outdated-challenge': true }
    }
    return res.json()
}
