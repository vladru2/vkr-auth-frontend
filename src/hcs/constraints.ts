const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/
const nameRegex = /^[a-zA-Z0-9_]{3,16}$/

export const validateEmail = (email: string) => {
    return Boolean(email.match(emailRegex))
}

export const validateName = (name: string) => {
    return Boolean(name.match(nameRegex))
}

export const validatePassword = (password: string) => {
    return password.length >= 6
}
