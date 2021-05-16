import { isArray } from 'lodash';

const typeError = 'Array type error.'

export function isEmpty(array) {
    if (!isArray(array)) {
        console.log(typeError);
    }

    return array.length <= 0
}