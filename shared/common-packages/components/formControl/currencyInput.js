import {isEmpty} from 'lodash';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {trans} from 'utils/helpers';
import {useTranslation} from "react-i18next";

// const CurrencyInput = ({defaultValue, value, onChange: onChangeCallback, ...props}) => {
const CurrencyInput = (props) => {
    const {t} = useTranslation('common');

    useEffect(() => {

    }, [])


    return (
        <input {...props} />
    );
};

CurrencyInput.propTypes = {
    errMess: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    onChange: PropTypes.func,
    error: PropTypes.bool,
    isLoading: PropTypes.bool,
    suffix: PropTypes.string,
    maxLength: PropTypes.number,
    name: PropTypes.string
};

CurrencyInput.defaultProps = {
    placeholder: trans('common.select'),
    error: false,
    errMess: '',
    isLoading: false,
    hasDefaultOption: false,
    suffix: '',
};

export default React.memo(CurrencyInput);
