import React, {useEffect, useRef, useState} from "react";
import useOnClickOutside from "hooks/useOnClickOutside";
import useKeyPress from "hooks/useKeyPress";
import SelectBox from "sharedComponents/selectBox";
import NumberFormat from 'react-number-format';
import InvalidFeedBack from "sharedComponents/formControl/invalidFeedback";
import DateTimeInput from "sharedComponents/dateTimeInput";
import {isNil} from "lodash"

const INPUT_TYPE = {
    TEXT: 'text',
    CURRENCY: 'currency',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    PERCENTAGE: 'percentage',
    DATE_TIME: 'dateTime',
}

// eslint-disable-next-line react/prop-types
export function SimpleInlineInput({defaultValue, handleSubmit, type, placeholder, filter, opt, ...rest}) {
    const [isInputActive, setIsInputActive] = useState(false)
    const isSelectBox = () => {
        return type === INPUT_TYPE.SELECT
    }
    if (isSelectBox()) {
        rest.optionLabel = rest.optionLabel || 'label'
        rest.optionValue = rest.optionValue || 'value'
    }
    const detectSelectBoxLabel = () => {
        if (!isSelectBox()) {
            return []
        }

        if (rest.defaultLabel) {
            return rest.defaultLabel
        }

        if (rest.options && rest.options.length) {
            const defaultItem = rest.options.find(item => {
                return item[rest.optionValue] === defaultValue
            })

            return defaultItem ? defaultItem[rest.optionLabel] : []
        }

        return []
    }
    const [inputValue, setInputValue] = useState(defaultValue)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [initValue, setInitValue] = useState(defaultValue)
    const [errorMessage, setErrorMessage] = useState(null)
    const wrapperRef = useRef(null)
    const enter = useKeyPress("Enter")
    const [selectBoxLabel, setSelectBoxLabel] = useState(() => {
        return detectSelectBoxLabel();
    })

    useOnClickOutside(wrapperRef, () => {
        if (isSelectBox()) {
            setIsInputActive(false)
        } else {
            if (isInputActive) {
                setIsInputActive(false)
                onDone()
            }
        }
    })

    useEffect(() => {
        setInputValue(defaultValue)
    }, [defaultValue])


    useEffect(() => {
        if (errorMessage) {
            setIsInputActive(true)
        }
    }, [errorMessage])

    const isChangedValue = () => {
        return initValue !== inputValue
    }

    const onDone = () => {
        if (isSubmitted) {
            return false
        }
        if (!isChangedValue()) {
            setIsInputActive(false)
        } else {
            handleSubmit && handleSubmit(inputValue, setErrorMessage)
            setInitValue(inputValue)
            setIsSubmitted(true)
            setErrorMessage(null)
        }
    }

    const generateInput = () => {
        switch (type) {
            case INPUT_TYPE.TEXT:
                return <div className={`position-relative has-icon-right ${errorMessage && 'is-invalid'}`}>
                    <input
                        defaultValue={inputValue}
                        {...rest}
                        onChange={(e) => {
                            setInputValue(e.target.value.trim())
                            setIsSubmitted(false)
                        }}
                        autoFocus
                        placeholder={placeholder}
                    />
                    <InvalidFeedBack message={errorMessage} />
                </div>
            case INPUT_TYPE.CURRENCY:
                return <NumberFormat
                    thousandSeparator={true}
                    defaultValue={inputValue}
                    {...rest}
                    autoFocus
                    onValueChange={(data) => {
                        setInputValue(data.floatValue)
                        setIsSubmitted(false)
                    }}
                />
            case INPUT_TYPE.PERCENTAGE:
                return <input
                    defaultValue={(inputValue * 100).toFixed(0)}
                    {...rest}
                    type="number"
                    onChange={(e) => {
                        const value = parseFloat(e.target.value)

                        if (0 <= value && value <= 100) {
                            setInputValue((value / 100))
                            setIsSubmitted(false)
                        } else {
                            setInputValue(1)
                        }
                    }}
                    autoFocus
                    placeholder={placeholder}
                />
            case INPUT_TYPE.TEXTAREA:
                return <textarea
                    defaultValue={inputValue}
                    {...rest}
                    onChange={(e) => {
                        setInputValue(e.target.value.trim())
                        setIsSubmitted(false)
                    }}
                    onFocus={(e) => {
                        e.target.selectionStart  = e.target.textLength
                        e.target.selectionEnd = e.target.textLength
                    }}
                    autoFocus
                    placeholder={placeholder}
                />
            case INPUT_TYPE.SELECT:
                return <SelectBox
                    value={inputValue}
                    {...rest}
                    onChange={(e, label) => {
                        if (rest.onChange) {
                            rest.onChange(e)
                        }
                        setSelectBoxLabel(label);
                        setInputValue(e)
                        setIsInputActive(false)
                        setIsSubmitted(false)
                    }}
                    autoFocus
                    placeholder={placeholder}
                    menuIsOpen
                    useDocument={false}
                />

            case INPUT_TYPE.DATE_TIME: {
                return <DateTimeInput
                    placeholder={rest.placeholder}
                    onChange={(e) => {
                        if (rest.onChange) {
                            rest.onChange(e)
                        }
                        setInputValue(e)
                        setIsSubmitted(false)
                    }}
                    autoFocus
                    {...opt}
                />
            }
            default:
                return <input
                    defaultValue={inputValue}
                    {...rest}
                    onChange={(e) => {
                        setInputValue(e.target.value.trim())
                        setIsSubmitted(false)
                    }}
                    autoFocus
                    placeholder={placeholder}
                />
        }
    }

    if (type === INPUT_TYPE.TEXT
        || type === INPUT_TYPE.CURRENCY
        || type === INPUT_TYPE.PERCENTAGE
    ) {
        useEffect(() => {
            if (isInputActive) {
                // if Enter is pressed, save the text and case the editor
                if (enter) {
                    setIsInputActive(false)
                    onDone()
                }
            }
        }, [enter])
    }

    if (isSelectBox()) {
        useEffect(() => {
            if (!isNil(inputValue)) {
                onDone()
            }
        }, [inputValue])
    }

    const detectValue = () => {
        if (isSelectBox()) {
            const noValue = '';
            if (rest.isMulti && Array.isArray(selectBoxLabel) && selectBoxLabel.length) {
                const template = <ul className={"list-group list-group-tags list-group-horizontal-sm"}>
                    {
                        selectBoxLabel.map((item, i) => {
                            return <li  className="list-group-item" key={i}>{item}</li>
                        })
                    }
                </ul>;
                return template || noValue
            } else {
                return selectBoxLabel || noValue
            }
        }

        return filter ? filter(inputValue) : inputValue;
    }

    const finalValue = detectValue();

    return (
        <div ref={wrapperRef}>
            {
                isInputActive ?
                    generateInput()
                    : <div
                        className={finalValue ?
                            `form-control-plaintext ${rest.disabled ? 'disabled' : ''} ${rest.inlineClassName || ''}`
                            : `form-control-plaintext ${rest.disabled ? 'disabled' : ''} form-control-placeholder ${rest.inlinePlaceholderClassName || ''}`}
                        onClick={() => {
                            if (rest.disabled) {
                                return false
                            }

                            if (!isInputActive) {
                                setIsInputActive(true)
                            }

                        }}>
                        { finalValue || (rest.disabled || placeholder)}
                    </div>
            }
        </div>
    )
}
