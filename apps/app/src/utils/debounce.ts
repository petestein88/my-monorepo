export function debounce(func: (...args: any[]) => void, delay: number) {
    let timeoutId: number
    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            func(...args)
        }, delay)
    }
}
