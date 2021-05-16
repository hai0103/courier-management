import {getByString, isEmpty} from "utils/objectHelpers";
import {isNil} from "lodash";

export default class FormControl {
    static controlClassName = 'form-control';

    static getValidation(control, errors) {
        const isError = errors[control] && errors[control] !== undefined;
        const isValid = !isError;
        const className = (isError ? 'is-invalid' : '');
        const errorType = errors[control]?.type;
        const errorMessage = errors[control]?.message;

        return {
            isError, isValid, className, errorType, errorMessage
        }
    }

    static getOtherValidation(control, errors) {
        if (!isEmpty(errors)) {
            const isError = getByString(errors, control) && getByString(errors, control) !== undefined;
            const isValid = !isError;
            const className = (isError ? 'is-invalid' : '');
            const errorType = getByString(errors, control)?.type;
            const errorMessage = getByString(errors, control)?.message;

            return {
                isError, isValid, className, errorType, errorMessage
            }
        }
    }

    static getControlClassNames(classNames = []) {
        return this.controlClassName + ' ' + classNames.join(' ');
    }

    static registerForm(fields, register) {
        for (const field of fields) {
            register(field)
        }
    }

    static setValues(fields, data, setValue) {
        for (const field of fields) {
            if (!isNil(data[field])) {
                setValue(field, data[field])
            }
        }
    }

    static registerRulesForm(fields, register, rules) {
        for (const field of fields) {
            register(field, rules)
        }
    }
}