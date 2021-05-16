import { isObject } from "lodash";

const typeError = 'Object type error.'

export function isEmpty(object) {
    if (!isObject(object)) {
        console.log(typeError);
    }
    return Object.values(object).length <= 0
}

export function getByString(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    const a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}
export function isSameKeys(a, b) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    return JSON.stringify(keysA) === JSON.stringify(keysB)
}