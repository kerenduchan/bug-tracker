export function getBaseUrl() {
    return process.env.NODE_ENV !== 'development'
        ? '/api/'
        : '//localhost:3000/api/'
}
