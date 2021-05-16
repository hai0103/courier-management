import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import DatePicker from 'react-datepicker';
import { useTranslation } from "react-i18next";
import useEventListener from "hooks/useEventListener";
import SelectBox from "sharedComponents/selectBox";
import { isEmpty } from "lodash";
import DateTimeInput from "sharedComponents/dateTimeInput";

function Filter(props) {
    const { t } = useTranslation('common');
    const [filterData, setFilterData] = useState({});
    const [date, setDate] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });

    useEventListener('click', (event) => {
        if (props.show) {
            if (event.target.closest(".filter-content")
                || event.target.closest(".filter-i")
                || event.target.closest(".filter-select__menu")
                || event.target.className.indexOf('react-datepicker') !== -1
            )
                return;
            props.close();
        }
    });

    const handleSubmit = () => {
        props.handleFilter(filterData);
    };

    const clear = (e) => {
        e.preventDefault();
        if (isEmpty(filterData)) {
            return false;
        }

        setDate(null)
        setFilterData({});
        props.handleFilter({}, true);
        props.rerender();
    };

    const handleSetFilterData = (data) => {
        const finalData = { ...filterData, ...data };
        setFilterData(finalData);
        props.handleFilter(finalData);
    }

    const removeFilterData = (key) => {
        delete filterData[key];
        setFilterData(filterData);
    }

    const setNullFilterData = (list) => {
        list.forEach(key => {
            if (filterData[key]) {
                filterData[key] = null;
            }
        });

        setFilterData(filterData);
    }

    const basicFilter = (item) => {
        return <div className="form-group form-group-sm">
            <label>{item.label}</label>
            <article>
                <div className="position-relative has-icon-right">
                    <input type={item.inputType ? "text" : item.inputType}
                        value={item.value}
                        className={`form-control form-control-sm ${item.className ? item.className : ''}`}
                        placeholder={item.placeholder}
                        onChange={(e) => {
                            handleSetFilterData({
                                [item.filterBy]: e.target.value
                            })
                        }} />
                </div>
            </article>
        </div>
    }

    const selectFilter = (item) => {
        let filterValue = null;
        return <div className="form-group form-group-sm">
            <label>{item.label}</label>
            <article>
                <div className="select-box-sm">
                    <div className="position-relative has-icon-right">
                        <SelectBox
                            key={filterValue}
                            instanceId={`filter-select-${item.filterBy}`}
                            {...item.selectBox}
                            classNamePrefix="filter-select"
                            onChange={(value) => {
                                if (item.selectBox.onChange) {
                                    item.selectBox.onChange(value);
                                }

                                const filterBy = item.filterBy;

                                if (value === null || value === '') {
                                    removeFilterData(filterBy);
                                }

                                if (item.children) {
                                    setNullFilterData(item.children);
                                }

                                handleSetFilterData({
                                    [filterBy]: value
                                });
                            }}
                        />
                    </div>
                </div>
            </article>
        </div>
    };

    const dateTimeFilter = (item) => {
        return <div className="form-group form-group-sm">
            <label>{item.label}</label>
            <article>
                <div className="select-box">
                    <DateTimeInput
                        selected={item.value || date}
                        className="form-control form-control-sm"
                        isDefaultEmpty
                        useDateFormat={item.useDateFormat || false}
                        shouldCloseOnSelect={false}
                        onChange={date => {
                            setDate(date)
                            handleSetFilterData({
                                [item.filterBy]: date
                            })
                        }}
                    />
                </div>
            </article>
        </div>
    }
    const checkBoxFilter = (item) => {
        return <div className="d-flex form-group form-group-sm">
            <article>
                <div className="select-box">
                 <input
                        className="mr-1"
                        type="checkbox"
                        onChange={(event) => {
                            handleSetFilterData({
                                [item.filterBy]: event.target.checked
                            })
                        }}
                    />
                </div>
            </article>
            <label className="px-0 font-weight-bold">{item.label}</label>
        </div>
    }

    const dateRangeFilter = (item) => {
        return <div>
            <div className="form-group form-group-sm">
                <label>{t("filter.fromDate")}</label>
                <article>
                    <div className="position-relative has-icon-right datepicker-full-width">
                        <DateTimeInput selected={item.startDate}
                            className="form-control form-control-sm"
                            selectsStart
                            isPortal
                            onChange={date => {
                                item.startDate = date
                                handleSetFilterData({
                                    startDate: date
                                })
                            }}
                        />
                    </div>
                </article>
            </div>
            <div className="form-group form-group-sm">
                <label>{t("filter.toDate")}</label>
                <article>
                    <div className="position-relative has-icon-right datepicker-full-width">
                        <DateTimeInput selected={item.date}
                            className="form-control form-control-sm"
                            selectsEnd
                            isPortal
                            onChange={date => {
                                item.date = date
                                handleSetFilterData({
                                    toDate: date
                                })
                            }}
                        />
                    </div>
                </article>
            </div>

        </div>
    }

    const dateRangeInOneFilter = (item) => {
        return <div className="form-group form-group-sm">
            <label>{item.label}</label>
            <article>
                <div className="position-relative has-icon-right datepicker-full-width">
                    <DatePicker
                        selected={dateRange.startDate}
                        value={!(dateRange?.startDate && dateRange?.endDate) ? '' : `${dateRange?.startDate?.toLocaleDateString('vi-VN') || ''} - ${dateRange?.endDate?.toLocaleDateString('vi-VN') || ''}`}
                        isPortal
                        className="form-control form-control-sm"
                        onChange={date => {
                            
                            let [start, end] = date;
                            
                            if (end !== null) {
                                end.setHours(23, 59, 59, 999);
                            }

                            setDateRange({
                                startDate: start,
                                endDate: end
                            })

                            if (start !== null && end !== null) {
                                handleSetFilterData({
                                    startDate: start,
                                    endDate: end
                                })
                            }
                            if (start === null && end === null) {
                                handleSetFilterData({
                                    startDate: null,
                                    endDate: null
                                })
                            }

                        }}
                        showYearDropdown
                        showMonthDropdown
                        shouldCloseOnSelect={false}
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        selectsRange
                        dropdownMode="scroll"
                        todayButton="Today"
                    />
                </div>
            </article>
        </div>
    }

    const renderFilterType = () => {
        if (props.filters && props.filters.length > 0) {
            let filter = [];
            props.filters.forEach((item) => {
                switch (item.type) {
                    case 'input':
                    case 'text':
                    case 'number':
                        filter.push(basicFilter(item));
                        break;
                    case 'select':
                        filter.push(selectFilter(item));
                        break;
                    case 'datetime':
                        filter.push(dateTimeFilter(item));
                        break;
                    case 'dateRange':
                        filter.push(dateRangeFilter(item));
                        break;
                    case 'dateRangeInOne':
                        filter.push(dateRangeInOneFilter(item));
                        break;
                    case 'checkBox':
                        filter.push(checkBoxFilter(item));
                        break;
                    default:
                        break;
                }
            });

            return filter;
        }
    }

    return (
        <div id="" className={`filter-wrapper ${props.show ? "show" : ""} `}>
            <div className="content-right">
                <div className={`app-content-overlay ${props.show ? "show" : ""}`} />
            </div>
            <div className={`filter-content ${props.show ? "ps show shadow" : "shadow"}`}>
                <form>
                    <div className="card shadow-none">
                        <div className="card-header card-header-main border-bottom d-flex justify-content-between align-items-center bg-light-primary">
                            <div className="task-header d-flex justify-content-start align-items-center">
                                <h3 className="content-header-title mb-0"> {t('filter.title')}</h3>
                            </div>
                            <div className="btn-group">
                                {!isEmpty(filterData) && <a onClick={clear} className="avatar btn-avatar mr-50" title={t('filter.clear')}>
                                    <i className="far fa-redo-alt" />
                                </a>}
                                <a onClick={props.close} className="avatar btn-avatar">
                                    <i className="fal fa-long-arrow-right" />
                                </a>
                            </div>
                        </div>
                        <div className="card-body card-scroll">{
                            renderFilterType().map((f, i) => {
                                return <div key={i}>{f}</div>
                            })
                        }</div>
                        <div className="card-footer border-top-0">
                            <button onClick={handleSubmit} className="btn btn-primary btn-sm mr-1 d-none">
                                {t('common.button.filter')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

Filter.propTypes = {
    show: PropTypes.bool,
    filters: PropTypes.any,
    handleFilter: PropTypes.func,
    rerender: PropTypes.func,
    close: PropTypes.func,
};

Filter.defaultProps = {};

export default React.memo(Filter);
