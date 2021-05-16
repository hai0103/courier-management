import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { groupBy, isEmpty, isNull, isUndefined } from 'lodash'

function DropdownInput({ 
    allowEmpty = false, 
    dataSourcePromiseFactory,
    dependentValue,
    keyField = 'value', 
    textField = 'text', 
    groupByField,
    isInvalid = false,
    id, 
    placeholder,
    value: initialValue,
    onChange: onValueChange,
    ...props 
}, forwardRef) {
    const [common] = useTranslation('common')
    const [value, setValue] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        setValue('')
        onValueChange('')
        setDataSource([]) 
    }, [dependentValue])

    useEffect(() => {
        setValue(initialValue)
        onValueChange(initialValue)
    }, [initialValue])

    const onChange = useCallback(e => {
        setValue(e.target.value)
        onValueChange(e.target.value)
    }, [onValueChange])

    useEffect(() => {
        let isCancelled = false

        async function load() {
            setLoading(true)
            try {
                const dataSource = await dataSourcePromiseFactory()
                if (allowEmpty) {
                    dataSource.splice(0, 0, {
                        [keyField]: '',
                        [textField]: placeholder
                    })
                }
                if (!isCancelled) {
                    setDataSource(dataSource)
                }
            } 
            catch (error) {
                console.error(error)
            }
            finally {
                setLoading(false)
            }
        }

        load()

        return () => { isCancelled = true }
    }, [allowEmpty, dataSourcePromiseFactory])

    useEffect(() => {
        if (isUndefined(value) || isNull(value) || isEmpty(value)) {
            if (!isEmpty(dataSource) && !allowEmpty) {
                setValue(dataSource[0][keyField])
                onValueChange(dataSource[0][keyField])
            }
        }
    }, [allowEmpty, value, dataSource])

    if (isLoading) {
        return (
            <div className="position-relative has-icon-right">
                <input type="text" className="form-control" placeholder={common('common.message.loading')} readOnly />
                <div className="form-control-position">
                    <i className="fa fa-spin fa-refresh text-primary"></i>
                </div>
            </div>
        )
    } else {
        return (
            <select ref={forwardRef} id={id} 
                className={'form-control' + (isInvalid && ' is-invalid' || '')} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                {...props}
            >
                {isUndefined(groupByField) && (dataSource || []).map(({ [keyField]: value, [textField]: name }) => (
                    <option key={value} value={value}>{name}</option>
                ))}
                {!isUndefined(groupByField) && renderGroupedItems(dataSource, keyField, textField, groupByField)}
            </select>
        )
    }
}

function renderGroupedItems(dataSource, keyField, textField, groupByField) {
    const groupedDataSource = groupBy(dataSource || [], item => item[groupByField])
    return Object.keys(groupedDataSource).map(group => (
        <optgroup key={group} label={group}>
            {(groupedDataSource[group] || []).map(({ [keyField]: value, [textField]: name }) => (
                <option key={value} value={value}>{name}</option>
            ))}
        </optgroup>
    ))
}

export default forwardRef(DropdownInput)