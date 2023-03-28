export interface Deferral<T = void, R = unknown> {
    resolve: (value: T | PromiseLike<T>) => void
    reject: (reason?: R) => void
    promise: Promise<T>
}

export default function defer<T = void, R = unknown>(): Deferral<T, R> {
    let resolve: (value: T | PromiseLike<T>) => void = () => {
        // This will get overwritten.
    }

    let reject: (reason?: R) => void = () => {
        // This will get overwritten.
    }

    const promise = new Promise<T>((...args) => void ([resolve, reject] = args))

    return {
        promise,
        resolve,
        reject,
    }
}
