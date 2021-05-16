import { trans } from "./helpers";

class FormRules {
    static duplicatedData(customMessage = null) {
        return customMessage || trans('duplicatedData')
    }
    static required(customMessage = null) {
        return customMessage || trans('inputRequired')
    }
    static minLength(length, customMessage = null) {
        return {
            value: length,
            message: customMessage || trans('minLengthError', { length })
        }
    }
    static maxLength(length, customMessage = null) {
        return {
            value: length,
            message: customMessage || trans('maxLengthError', { length })
        }
    }
    static minValue(min, customMessage = null) {
        return {
            value: min,
            message: customMessage || trans('minValueError', { min })
        }
    }
    static maxValue(max, customMessage = null) {
        return {
            value: max,
            message: customMessage || trans('maxValueError', { max })
        }
    }
    static isEmail(customMessage = null) {
        return {
            value: /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/,
            message: customMessage || trans('invalidEmail')
        }
    }
    static isNumber(customMessage = null) {
        return {
            value: /^[0-9]+$/i,
            message: customMessage || trans('Invalid Number')
        }
    }
    static isName(customMessage = null) {
        return {
            value: /^[_a-zA-Z0-9 ]+$/i,
            message: customMessage || trans('invalidName')
        }
    }
    static isCode(customMessage = null) {
        return {
            value: /^[A-Z]{2}$/, // 2 chữ cái in hoa
            message: customMessage || trans('Invalid Code')
        }
    }
    static isloginName(customMessage = null) {
        return {
            value: /^[_a-zA-Z0-9]+$/i,
            message: customMessage || trans('Invalid name')
        }
    }
    static isIdentifier(customMessage = null) {
        return {
            value: /^[_a-zA-Z0-9]+$/i,
            message: customMessage || trans('Invalid Identifier')
        }
    }
    static isIdentityNumber(customMessage = null) {
        return {
            value: /^[0-9]{9,}$/i,
            message: customMessage || trans('Invalid Identifier')
        }
    }
    
}

export default FormRules;