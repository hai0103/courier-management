import PropTypes from "prop-types";
import React, {useState, useEffect} from "react";
import DatePicker from 'react-datepicker';
import {useTranslation} from "react-i18next";
import useEventListener from "hooks/useEventListener";
import SelectBox from "sharedComponents/selectBox";
import {isEmpty} from "lodash";

function Filter(props) {
    const {t} = useTranslation('common');
    const [filterData, setFilterData] = useState({});
    const [date, setDate] = useState(new Date());

    useEventListener('click', (event) => {
        if (event.target.closest(".filter-content")
            || event.target.closest(".filter-i")
            || event.target.closest(".filter-select__menu"))
            return;
        props.close();
    });

    const handleSubmit = () => {
        props.handleFilter(filterData);
    };

    const clear = (e) => {
        e.preventDefault();
        if (isEmpty(filterData)) {
            return false;
        }

        setFilterData({});
        props.handleFilter({}, true);
        props.rerender();
    };

    const handleSetFilterData = (data) => {
        const finalData = {...filterData, ...data};
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
        return <div className="form-group">
            <label>{item.label}</label>
            <input type={item.inputType ? "text" : item.inputType}
                   value={item.value}
                   className={`form-control ${item.className ? item.className : ''}`}
                   placeholder={item.placeholder}
                   onChange={(e) => {
                       handleSetFilterData({
                           [item.filterBy]: e.target.value
                       })
                   }}/>
        </div>
    }

    const selectFilter = (item) => {
        let filterValue = null;
        return <div className="form-group">
            <label>{item.label}</label>
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
    };

    const dateTimeFilter = (item) => {
        return <div className="form-group">
            <label>{item.label}</label>
            <div>
                <DatePicker className="form-control"
                            selected={item.value || date}
                            onChange={date => {
                                setDate(date);
                            }}
                />
            </div>

        </div>
    }

    const dateRangeFilter = (item) => {
        return <div className="form-group">
            <div>
                <label>{t("filter.fromDate")}</label>
                <DatePicker selected={item.startDate}
                            className="form-control"
                            selectsStart
                            onChange={date => {
                                handleSetFilterData({
                                    startDate: date
                                })
                            }}
                />
            </div>
            <div className="form-group">
                <label>{t("filter.toDate")}</label>
                <DatePicker selected={item.date}
                            className="form-control"
                            selectsEnd
                            onChange={date => {
                                handleSetFilterData({
                                    toDate: date
                                })
                            }}
                />
            </div>

        </div>
    }

    const renderFilterType = () => {
        let filter = [];
        if (props.filters && props.filters.length > 0) {
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
                    default:
                        break;
                }
            });
        }
        return filter;
    }

    return (
        <div id="" className={`filter-wrapper ${props.show ? "show" : ""} `}>
            <div className="content-right">
                <div className={`app-content-overlay ${props.show ? "show" : ""}`}/>
            </div>
            <div className={`filter-content ${props.show ? "ps show shadow" : "shadow"}`}>
                <div className="card shadow-none">
                    <div
                        className="card-header card-header-main border-bottom d-flex justify-content-between align-items-center bg-light-primary">
                        <div className="task-header d-flex justify-content-start align-items-center">
                            <h3 className="content-header-title mb-0">{t('filter.title')}</h3>
                        </div>
                        <div className="btn-group">
                            {!isEmpty(filterData) && <a onClick={clear} className="avatar btn-avatar mr-50" title={t('filter.clear')}>
                                <i className="far fa-redo-alt"/>
                            </a>}
                            <a onClick={props.close} className="avatar btn-avatar">
                                <i className="fal fa-long-arrow-right"/>
                            </a>
                        </div>
                    </div>
                    <div className="card-body pb-0">{
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
