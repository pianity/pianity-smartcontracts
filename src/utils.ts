export function hasOwnProperty(object: any, property: string) {
    return Object.prototype.hasOwnProperty.call(object, property);
}

export function sleep(seconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

export function wrapErrorAsync<T extends unknown[], U, V extends Error>(
    action: (...args: T) => Promise<U>,
    args: T,
    error: V,
): Promise<U> {
    try {
        return action(...args);
    } catch {
        throw error;
    }
}

export function exhaustive(_: never): never {
    throw new Error("Check wasn't exhaustive");
}
