export const toRaw = <T>(reactiveObj: T): T => {
    return JSON.parse(JSON.stringify(reactiveObj));
}