import { index, fakeApi, fakeDelay } from '@/api/index'

export type PasswordChallengeResponse = {
    'action-token'?: string
    unauthorized?: boolean
    'outdated-challenge'?: boolean
    'wrong-password'?: boolean
}

export async function completePasswordChallenge(
    challenge: string,
    password: string
): Promise<PasswordChallengeResponse> {
    if (fakeApi) {
        return new Promise(resolve => setTimeout(() => resolve({ 'action-token': 'a' }), fakeDelay))
    }
    return index
        .post('complete-challenge/password', {
            json: {
                challenge,
                password,
            },
        })
        .json()
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
    return index
        .post('complete-challenge/email', {
            json: { challenge, code },
        })
        .json()
}
