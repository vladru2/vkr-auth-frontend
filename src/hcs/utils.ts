export function setAll<T>(object: { [key: string]: T }, value: T) {
    for (const key of Object.keys(object)) {
        object[key] = value
    }
}
