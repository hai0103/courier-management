import React, {useEffect, useRef, useState} from "react";
import useOnClickOutside from "hooks/useOnClickOutside";
import useKeyPress from "hooks/useKeyPress";
import {Controller, useFormContext} from "react-hook-form";
import SelectBox from "sharedComponents/selectBox";
import DateTimeInput from "sharedComponents/dateTimeInput";
import {isNotNullAndUndefined} from "utils/helpers";
import {isEqual, isEmpty} from "lodash"

const INPUT_TYPE = {
    TEXT: 'text',
    NUMBER: 'number',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    ASYNC_SELECT: 'asyncSelect',
    DATE_TIME: 'dateTime',
    SELECT_V2: 'selectV2',
    PERCENTAGE: 'percentage',
}

// eslint-disable-next-line react/prop-types
export function InlineInput({register, defaultValue, handleSubmit, type, placeholder, filter, opt, ...rest}) {
    const isSelectBox = () => {
        return type === INPUT_TYPE.SELECT
          || type === INPUT_TYPE.SELECT_V2
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

        if (rest.options && rest.options.length && Array.isArray(defaultValue)) {
            const defaultItem = []
            const listValue = defaultValue

            rest.options.forEach((item) => {
                listValue.forEach(_item => {
                    if (item[rest.optionValue] == _item) {
                        defaultItem.push(item[rest.optionLabel])
                    }
                })
            })

            return defaultItem || []
        }

        if (rest.options && rest.options.length) {
            const defaultItem = rest.options.find(item => {
                return item[rest.optionValue] === defaultValue
            })

            return defaultItem ? defaultItem[rest.optionLabel] : []
        }

        return []
    }
    const [isInputActive, setIsInputActive] = useState(false)
    const [isValid, setIsValid] = useState(true)
    const [inputValue, setInputValue] = useState(defaultValue)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [selectBoxLabel, setSelectBoxLabel] = useState(() => {
        return detectSelectBoxLabel();
    })
    const wrapperRef = useRef(null)
    const enter = useKeyPress("Enter")
    const {formState, control} = useFormContext();

    useOnClickOutside(wrapperRef, () => {
        if (isSelectBox()) {
            rest.isMulti && onDone()
            setIsInputActive(false)
        } else {
            if (isInputActive && isValid) {
                onDone()
            }
        }
    })

    const isMultiSelectBox = () => {
        return isSelectBox() && rest.isMulti
    }

    useEffect(() => {
        setInputValue(defaultValue)
    }, [defaultValue])

    useEffect(() => {
        if (isSelectBox() && rest.options && rest.options.length) {
            setSelectBoxLabel(detectSelectBoxLabel())
        }
    }, [rest.options])

    const isInput = () => {
        return type === INPUT_TYPE.TEXT
          || type === INPUT_TYPE.NUMBER
          || type === INPUT_TYPE.DATE_TIME
          || type === INPUT_TYPE.PERCENTAGE
    }

    const isChangedValue = () => {
        if (isMultiSelectBox()) {
            return !isEqual(defaultValue, inputValue)
        }
        return defaultValue !== inputValue
    }

    const onDone = () => {

        if (isSubmitted) {
            setIsInputActive(false)
            return false
        }

        if (!isChangedValue()) {
            setIsInputActive(false)
        } else {
            handleSubmit()
            setIsSubmitted(true)
        }
    }

    useEffect(() => {
        const hasNoError = isEmpty(formState.errors);
        if (hasNoError) {
            setIsInputActive(false)
        } else {
            if (rest.name && formState.errors[rest.name]) {
                setIsInputActive(true)
            }
        }
    }, [formState.submitCount])

    useEffect(() => {
        if (formState.errors[rest.name]) {
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }, [formState])

    const isClear = (action) => {
        return action.action && action.action === 'clear'
    }

    const generateInput = () => {
        switch (type) {
            case INPUT_TYPE.TEXT:
            case INPUT_TYPE.NUMBER:
                return <input
                  defaultValue={inputValue}
                  ref={register}
                  type={type}
                  {...rest}
                  onChange={(e) => {
                      setInputValue(e.target.value.trim())
                      setIsSubmitted(false)
                  }}
                  autoFocus
                  placeholder={placeholder}
                />
            case INPUT_TYPE.PERCENTAGE:
                return <input
                  defaultValue={(inputValue * 100).toFixed(0)}
                  ref={register}
                  {...rest}
                  type="number"
                  onChange={(e) => {
                      const value = parseFloat(e.target.value || 0)

                      if (0 <= value && value <= 100) {
                          setInputValue((value / 100))
                      } else {
                          setInputValue(1)
                          e.target.value = 100
                      }
                      setIsSubmitted(false)
                  }}
                  autoFocus
                  placeholder={placeholder}
                />
            case INPUT_TYPE.TEXTAREA:
                return <textarea
                  defaultValue={inputValue}
                  ref={register}
                  {...rest}
                  onChange={(e) => {
                      setInputValue(e.target.value.trim())
                      setIsSubmitted(false)
                  }}
                  onFocus={(e) => {
                      e.target.selectionStart = e.target.textLength
                      e.target.selectionEnd = e.target.textLength
                  }}
                  autoFocus
                  placeholder={placeholder}
                />
            case INPUT_TYPE.SELECT:
                return <SelectBox
                  value={inputValue}
                  menuIsOpen
                  {...rest}
                  onChange={(e, label, action) => {
                      rest.onChange && rest.onChange(e, label)
                      setInputValue(e)
                      setSelectBoxLabel(label);
                      !rest.isMulti && setIsInputActive(false)
                      setIsSubmitted(false)
                  }}
                  autoFocus
                  placeholder={placeholder}
                  useDocument={false}
                />
            case INPUT_TYPE.SELECT_V2: {
                //dont use it,still in development mode
                const {loadOptions} = {...opt}
                return <Controller
                  render={(ctrl) => {
                      return <SelectBox
                        value={ctrl.value}
                        onChange={(e, label) => {
                            ctrl.onChange((q) => {
                                console.log(q);
                            })
                            setInputValue(e)
                            setSelectBoxLabel(label)
                            setIsInputActive(false)
                            setIsSubmitted(false)
                        }}
                        autoFocus

                        useDocument={false}
                        {...opt}
                        menuIsOpen
                        loadOptions={(e) => {
                            return loadOptions(e)
                        }}
                      />
                  }}
                  defaultValue={defaultValue}
                  control={control}
                  {...rest}
                />
            }

            case INPUT_TYPE.DATE_TIME: {
                return <Controller
                  render={(ctrl) => (
                    <DateTimeInput
                      placeholder={rest.placeholder}
                      onChange={(e) => {
                          setInputValue(e)
                          ctrl.onChange(e)
                          setIsSubmitted(false)
                      }}
                      selected={ctrl.value}
                      autoFocus
                      {...opt}
                    />
                  )}
                  defaultValue={defaultValue}
                  control={control}
                  {...rest}
                />
            }
            default:
                return <input
                  defaultValue={inputValue}
                  ref={register}
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

    if (isInput()) {
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
            if (inputValue !== undefined && !rest.isMulti) {
                onDone()
            }
        }, [inputValue, formState.submitCount])
    }

    const detectValue = () => {
        if (isSelectBox()) {
            const noValue = '';
            if (rest.isMulti && Array.isArray(selectBoxLabel) && selectBoxLabel.length) {
                const template = <ul className={"list-group list-group-tags list-group-horizontal-sm"}>
                    {
                        selectBoxLabel.map((item, i) => {
                            return <li className="list-group-item" key={i}>{item}</li>
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

    const isValueEmpty = (value) => {
        if (typeof value === 'number') {
            return !isNotNullAndUndefined(value)
        }
        return isEmpty(value)
    }

    const finalValue = detectValue();


    return (
      <div ref={wrapperRef} className={`${!isValid ? 'is-invalid' : ''}`}>
          {
              isInputActive ?
                generateInput()
                : <div
                  className={!isValueEmpty(finalValue) ?
                    `form-control text-truncate ${rest.disabled ? 'disabled' : ''} ${rest.error ? 'border-red' : ''}  ${rest.inlineClassName || ''}`
                    : `form-control text-truncate ${rest.disabled ? 'disabled' : ''} form-control-placeholder`}
                  onClick={() => {
                      if (rest.disabled) {
                          return false
                      }

                      if (!isInputActive) {
                          setIsInputActive(true)
                      }

                  }}>
                    {!isValueEmpty(finalValue) ? finalValue : (rest.disabled || placeholder)}
                </div>
          }
          <div className='text-danger font-small-2'>{rest.error && rest.errMess}</div>
      </div>
    )
}
