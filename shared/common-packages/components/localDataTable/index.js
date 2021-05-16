import PropTypes from "prop-types";
import {useDataTable} from "providers/dataTable";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {usePagination, useRowSelect, useTable,useGlobalFilter} from "react-table";
import Filter from "./filter";
import LocalSearchBox from "./localSearchBox";
import {isEmpty} from "lodash"
import {isSameKeys} from "utils/objectHelpers";

function LocalDataTable(props) {

    const defaultCriteria = {
        pageSize: props.itemPerPage || 10,
        pageNumber: props.currentPage
    };
    const columns = props.columns;
    const [data, setData] = useState(props.data || []);
    const [controlledPageCount, setControlledPageCount] = useState(0);
    const [totalItem, setTotalItem] = useState(0);
    const {t} = useTranslation('common');
    const [searchCriteria, setSearchCriteria] = useState({});
    const [sortCriteria, setSortCriteria] = useState(props.defaultSort.init || {});
    const [filterCriteria, setFilterCriteria] = useState({});
    const [showFilter, setShowFilter] = useState(false);
    const [rerenderFilter, setRerenderFilter] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [isDirtyKeyword, setIsDirtyKeyword] = useState(false);
    const [selectedRows, setSelectedRows] = useState({});
    const {refreshKey, refresh: refreshTable} = useDataTable();
    // const useGlobalFilter = props.useGlobalFilter ||  (() => []);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        rows,
        canPreviousPage,
        canNextPage,
        state,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize, selectedRowIds},
        allColumns,
        setGlobalFilter,
        // setAllFilters
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex: 0},
            manualPagination: !props.isLocal,
            pageCount: controlledPageCount,
        },
        useGlobalFilter,
        // useFilters,
        usePagination,
        useRowSelect,
        hooks => {
            props.hasCheckbox && hooks.visibleColumns.push(columns => [
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({getToggleAllRowsSelectedProps}) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({row}) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ])
        }
    );
    let changeSelected = false;
    for (const key of Object.keys(selectedRowIds)) {
        if (!selectedRows.hasOwnProperty(key) || (selectedRows[key] !== selectedRowIds[key])) {
            changeSelected = true;
            break;
        }
    }
    if (!changeSelected) {
        for (const key of Object.keys(selectedRows)) {
            if (!selectedRowIds.hasOwnProperty(key) || (selectedRowIds[key] !== selectedRows[key])) {
                changeSelected = true;
                break;
            }
        }
    }
    if (changeSelected) {
        setSelectedRows(selectedRowIds);
        if (props.hasOwnProperty("onRowSelected")) {
            setTimeout(()=>{
                props.onRowSelected(selectedRowIds);
            });

        }
    }
    const IndeterminateCheckbox = React.forwardRef(
        ({indeterminate, ...rest}, ref) => {
            const defaultRef = React.useRef()
            const resolvedRef = ref || defaultRef

            React.useEffect(() => {
                resolvedRef.current.indeterminate = indeterminate
            }, [resolvedRef, indeterminate])

            return (
                <div className="d-flex justify-content-center">
                    <input type="checkbox" ref={resolvedRef} {...rest} />
                </div>
            )
        }
    )

    const resetPaging = () => {
        gotoPage(0);
    }

    const resetSorting = () => {
        setSortCriteria({});
    }

    const isRemotePaging = () => {
        return !props.isLocal;
    }

    const buildParams = () => {
        const sortParams = parseSortParams(sortCriteria);
        const params = {
            pageSize,
            pageNumber: pageIndex,
            ...searchCriteria,
            ...filterCriteria
        };

        if (sortParams.length) {
            params['sort'] = sortParams;
        }

        return params;
    };

    const renderStyle = (column) => {
        const styles = {};

        if (column.cellWidth) {
            styles.width = column.cellWidth + 'px'
        }

        return styles;
    };

    const handleSearch = (e) => {
        if (e) {
            e.preventDefault()
        }

        const handleSearchCallback = props.handleSearch;
        const keyword = searchKeyword || '';
        if (handleSearchCallback) {
            // const searchCriteriaCallBack = handleSearchCallback(formData);
            // setSearchCriteria({...criteria.Criteria, ...searchCriteriaCallBack})
        } else {
            if (searchCriteria !== undefined) {
                const mergedSearchCriteria = {...searchCriteria, keyword};
                setSearchCriteria(mergedSearchCriteria);
            }
        }

        resetPaging();
        resetSorting();
    };

    // const detectSortType = (e) => {
    //     const sortingChanges = {
    //         sorting: null,
    //         sortingAsc: 'ASC',
    //         sortingDesc: 'DESC',
    //     };
    //     return sortingChanges[e.target.className];
    // }

    const handleSort = (e, column) => {
        const handleChangeClass = (e) => {
            const sortingChanges = {
                sorting: 'sortingAsc',
                sortingAsc: 'sortingDesc',
                sortingDesc: 'sorting',
            };
            e.target.className = sortingChanges[e.target.className];
        };

        const buildSortCriteria = (e, column) => {
            let sortParams = {};
            const sortingChanges = {
                sorting: null,
                sortingAsc: 'ASC',
                sortingDesc: 'DESC',
            };
            const sortType = sortingChanges[e.target.className];
            const field = column.sortKey || column.id;

            if (sortType) {
                sortParams[field] = sortType;
            } else {
                if (sortParams[field]) {
                    delete sortParams[field];
                }
            }

            if (props.defaultSort?.default && !isEmpty(sortParams)) {
                if (isSameKeys(props.defaultSort?.default, sortParams)) {
                    sortParams = {
                        ...props.defaultSort.default,
                        ...sortParams,
                    }
                } else {
                    sortParams = {
                        ...sortParams,
                        ...props.defaultSort.default,
                    }
                }
            }

            if (isEmpty(sortParams) && props.defaultSort.init) {
                sortParams = props.defaultSort.init || {}
            }

            setSortCriteria(sortParams);
        };

        handleChangeClass(e);
        buildSortCriteria(e, column);
    };

    const sortClassName = (column) => {
        const field = column.sortKey || column.id;
        const mappingClasses = {
            ASC: 'sortingAsc',
            DESC: 'sortingDesc'
        }

        return sortCriteria[field] ? mappingClasses[sortCriteria[field]] : 'sorting'
    }

    const parseSortParams = () => {
        const sortParams = [];
        let finalSort = sortCriteria;
        for (const key of Object.keys(finalSort)) {
            const params = {
                key,
                asc: finalSort[key] === 'ASC'
            };
            sortParams.push(params);
        }

        return sortParams;
    };

    const headerTRStyle = {
        position: 'relative'
    };

    useEffect(() => {
        async function getRemoteData() {
            const {data, totalItem} = await props.setRemoteData(buildParams());
            setData(data);
            setTotalItem(totalItem)
            setControlledPageCount(Math.ceil(totalItem / pageSize));
        }

        if (isRemotePaging() && props.setRemoteData) {

            getRemoteData().catch(e => console.log(e));
        } else {
            setTotalItem(data.length)
        }
    }, [pageIndex, pageSize, searchCriteria, sortCriteria, refreshKey, filterCriteria]);

    useEffect(() => {
        if (isDirtyKeyword && !searchKeyword) {
            handleSearch()
        }
    }, [searchKeyword]);

    useEffect(() => {
        if (props.isLocal) {
            setData(props.data);
        }
    }, [props.data]);

    const closeFilter = () => {
        setShowFilter(false)
    };

    const reload = (e) => {
        e.preventDefault();
        refreshTable();
    };

    const makeLocalFilterParams = (filterData) => {
        const filtersObjectArray = [];
        for (const [key, value] of Object.entries(filterData)) {
            filtersObjectArray.push({
                id: key, value
            });
        }

        return filtersObjectArray;
    };

    const handleFilter = (filterData, isClear = false) => {
        if (props.isLocal) {
            // setAllFilters(makeLocalFilterParams(filterData));
        } else {
            const params = {...filterCriteria, ...filterData};
            setFilterCriteria(isClear ? {} : params);
        }
    };

    return (
        <div id="" className="">
            <Filter key={rerenderFilter}
                    show={showFilter}
                    close={closeFilter}
                    filters={props.filters}
                    handleFilter={handleFilter}
                    rerender={(e) => {
                        setRerenderFilter(rerenderFilter + 1);
                    }}
            />
            <div className="card card-no-border shadow-none pt-25">
                <div className="card-header card-header-main">
                    <div className="heading-elements" >
                        <ul className="list-inline mb-0">
                            <li>
                                {
                                    props.isLocal ? <LocalSearchBox
                                            globalFilter={state.globalFilter}
                                            setGlobalFilter={setGlobalFilter}
                                        /> :
                                        <form onSubmit={handleSearch}>
                                            <div className="position-relative has-icon-left">
                                                <input name="keyword"
                                                       type="search"
                                                       className="form-control form-control-sm"
                                                       onChange={(e) => {
                                                           setIsDirtyKeyword(true)
                                                           setSearchKeyword(e.target.value)
                                                       }}
                                                       placeholder={t('pagination.searchPlaceholder') + " " + props.titleSearch}/>
                                                <div className="form-control-position">
                                                    <i onClick={handleSearch}
                                                       className="fal fa-search text-size-base la-rotate-270"/>
                                                </div>
                                            </div>
                                        </form>

                                }
                            </li>
                            <li className="ml-50">{props.leftControl && props.leftControl()}</li>
                            {
                                props.hasFilter && <li className="pl-1 filter-i">
                                    <a title={t('pagination.filters')} className="avatar btn-avatar" onClick={() => {
                                        setShowFilter(true)
                                    }}>
                                        <i className="fal fa-filter"/>
                                    </a>
                                </li>
                            }
                            <li className="d-none">
                                <a title={t('pagination.settings')} className="dropdown rounded-circle border"
                                   data-toggle="dropdown">
                                    <i className="feather icon-settings"/>
                                </a>
                                <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right  mt-1">
                                    <form className="scrollable-menu">
                                        {allColumns.map(column => (
                                            <label key={column.id} className="dropdown-item">
                                                <input className="input-chk"
                                                       type="checkbox" {...column.getToggleHiddenProps()} />{' '}
                                                {column.id}
                                            </label>
                                        ))}
                                    </form>
                                </div>
                            </li>
                            {/* <li>
                                        <a title={t('pagination.reload')} className="rounded-circle border" onClick={(e) => reload(e)}>
                                            <i className="feather icon-rotate-cw"/>
                                        </a>
                                    </li> */}
                        </ul>
                    </div>
                </div>
                <div className="card-content collapse p-0 show">
                    <div className="card-body card-dashboard p-0">
                        <div className="table-responsives">
                            <table {...getTableProps()}
                                   className="table has-sorting table-borderless table-hover">
                                <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th className={column.headerClassName}
                                                style={headerTRStyle} {...column.getHeaderProps()} >
                                                <div className="d-inline-flex position-relative"
                                                     style={renderStyle(column)}>
                                                    {column.render('Header')}
                                                    {column.sortable &&
                                                    <span onClick={(e) => handleSort(e, column)}
                                                          className={`${sortClassName(column)}`}/>}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                                </thead>
                                <tbody {...getTableBodyProps()} className="mnh-100">
                                {page.map(row => {
                                    prepareRow(row)
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => {
                                                return (
                                                    <td className={cell.column.className}
                                                        {...cell.getCellProps()}
                                                    >
                                                        {cell.render('Cell')}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                                {
                                    page.length ? null : <tr>
                                        <td colSpan="10"
                                            className="pl-2 text-left mw-100">{t('common.noData')}</td>
                                    </tr>
                                }

                                </tbody>
                            </table>
                        </div>
                        {
                            pageCount > 1 && <div className="data-table-footer px-2">
                                <div className="float-left pb-2">
                                    <b>{(pageIndex * pageSize) + 1} - {canNextPage ? (pageIndex + 1) * pageSize : totalItem}</b>&nbsp;
                                    <span>{t('pagination.of')}</span>&nbsp;
                                    <b>{props.isLocal ? rows.length : totalItem}&nbsp;</b>{t('pagination.items')}
                                </div>
                                <div className="float-right">
                                    <ul className="pagination">
                                        <li className="paginate_button page-item mr-1">
                                            <select onChange={e => {
                                                setPageSize(Number(e.target.value))
                                            }}
                                                    className="custom-select custom-select-sm form-control form-control-sm">
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                        </li>
                                        <li title={t('pagination.firstPage')}
                                            className={"paginate_button page-item previous" + (!canPreviousPage ? " disabled" : "")}>
                                            <a onClick={() => {
                                                gotoPage(0)
                                            }} className="page-link">
                                                <i className="feather icon-skip-back"/>
                                            </a>
                                        </li>
                                        <li title={t('pagination.previous')}
                                            className={"paginate_button page-item previous" + (!canPreviousPage ? " disabled" : "")}>
                                            <a onClick={() => {
                                                previousPage()
                                            }} className="page-link"><i className="feather icon-chevron-left"/></a>
                                        </li>
                                        <li className="paginate_button page-item active">
                                            <a className="page-link">{`${pageIndex + 1} / ${pageCount}`}</a>
                                        </li>
                                        <li title={t('pagination.next')}
                                            className={"paginate_button page-item next" + (!canNextPage ? " disabled" : "")}>
                                            <a onClick={() => {
                                                nextPage()
                                            }} className="page-link">
                                                <i className="feather icon-chevron-right"/>
                                            </a>
                                        </li>
                                        <li title={t('pagination.lastPage')}
                                            className={"paginate_button page-item next" + (!canNextPage ? " disabled" : "")}>
                                            <a onClick={() => {
                                                gotoPage(pageCount - 1)
                                            }} className="page-link">
                                                <i className="feather icon-skip-forward"/>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

LocalDataTable.propTypes = {
    title: PropTypes.string,
    titleSearch: PropTypes.string,
    itemPerPage: PropTypes.number,
    currentPage: PropTypes.number,
    data: PropTypes.array,
    columns: PropTypes.array,
    isLocal: PropTypes.bool,
    params: PropTypes.object,
    setRemoteData: PropTypes.func,
    handleSearch: PropTypes.func,
    leftControl: PropTypes.func,
    hasFilter: PropTypes.bool,
    filters: PropTypes.array,
    hasCheckbox: PropTypes.bool,
    defaultSort: PropTypes.object
};

LocalDataTable.defaultProps = {
    title: 'Unnamed Table',
    itemPerPage: 10,
    currentPage: 0,
    data: [],
    columns: [],
    isLocal: false,
    params: {},
    hasFilter: false,
    hasCheckbox: false,
    defaultSort: {}
};

export default LocalDataTable;
