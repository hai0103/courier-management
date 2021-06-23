import React, {useState, useEffect} from 'react';
import DatePicker, {registerLocale} from "react-datepicker";
import vi from "date-fns/locale/vi";
import PropTypes from "prop-types";
import {trans} from "utils/helpers";
import moment from "moment";
import {Utility} from "utils/common";

registerLocale('vi', vi)

const DateTimeInput = ({selected, onChange, isPortal, useDateFormat, ...props}) => {
    const [date, setDate] = useState(selected || (props.isDefaultEmpty ? null : new Date()) );

    useEffect(() => {
        if (selected) {
            console.log(selected)
            setDate(selected)
            console.log(date)
        }
    }, [selected])

    const filterPassedTime = (time) => {
        if (!props.isFilterPassedTime) {
            return true
        }

        const currentDate = new Date();
        const selectedDate = new Date(time);
        if (date.getDay() > currentDate.getDay()) {
            return true
        }

        return currentDate.getTime() < selectedDate.getTime();
    }

    const isPassedTime = (time) => {
        const selectedDate = new Date(time);
        return moment(selectedDate).isBefore(moment())
    }

    return <DatePicker
        locale="vi"
        dateFormat={
            `${useDateFormat ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"}`
        }
        popperPlacement="bottom-end"
        selected={date}
        onChange={(date) => {
            let finalDate = date
            if (props.minDate && isPassedTime(date)) {
                finalDate = props.minDate
            }

            onChange(finalDate || new Date())
            setDate(finalDate)
        }}
        timeIntervals={15}
        // timeCaption="Giờ"
        shouldCloseOnSelect
        placeholderText={props.placeholder || trans('common.selectDate')}
        className="form-control"
        filterTime={filterPassedTime}
        portalId={isPortal ? "picker-portal-id" : ""}yarn de
        {...props}
    />
}

DateTimeInput.propTypes = {
    showTimeSelect: PropTypes.bool,
    isFilterPassedTime: PropTypes.bool,
    isPortal: PropTypes.bool,
    useDateFormat: PropTypes.bool,
    selected: PropTypes.any,
    onChange: PropTypes.func,
    minDate: PropTypes.any,
    isDefaultEmpty: PropTypes.bool,
    placeholder: PropTypes.string
};

DateTimeInput.defaultProps = {
    showTimeSelect: false,
    isFilterPassedTime: false,
    useDateFormat: false,
    isDefaultEmpty: false
};

export default DateTimeInput;
