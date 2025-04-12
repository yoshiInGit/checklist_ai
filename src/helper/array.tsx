export function removeAt<T>(arr: T[], idx: number): T[] {
    if (idx < 0 || idx >= arr.length) {
        throw new Error("Index out of bounds");
    }
    return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}

export function removeWhere<T>(array: T[], condition: (item: T) => boolean): T[] {
    return array.filter(item => !condition(item));
}