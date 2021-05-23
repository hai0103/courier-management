import PropTypes from "prop-types";
import {useDataTable} from "providers/dataTable";
import React, {useEffect, useState, useImperativeHandle, forwardRef} from "react";
import {useTranslation} from "react-i18next";
import {useExpanded, usePagination, useRowSelect, useTable} from "react-table";
import Filter from "./filter";
import {isEmpty} from "lodash"
import {isSameKeys} from "utils/objectHelpers";
import TableScrollbar from "sharedComponents/tableScrollbar";
import Exporter from "sharedComponents/dataTable/exporter";

const DataTable=forwardRef((props, ref)=> {
    const columns = props.columns;
    const handleExpanding = (() => {
        if (props.hasExpanding) {
            const id = 'expander'
            const expandingSetting = props.columns.find(item => {
                return item.id === id
            })

            if (!expandingSetting) {
                columns.unshift({
                    id,
                    headerClassName: 'check-col',
                    className: 'check-col',
                    Header: ({getToggleAllRowsExpandedProps, isAllRowsExpanded}) => (
                      <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? <i className="fal fa-minus"></i> : <i className="fal fa-plus"></i>}
          </span>
                    ),
                    Cell: ({row}) =>
                      row.canExpand ? (
                        <span {...row.getToggleRowExpandedProps({
                            style: {
                                paddingLeft: `${row.depth * 2}rem`,
                            },
                        })}>
                {row.isExpanded ? <i className="fal fa-minus"></i> : <i className="fal fa-plus"></i>}
              </span>
                      ) : null,
                })
            }
        }
    })
    handleExpanding()
    const [data, setData] = useState(props.data || []);
    const [controlledPageCount, setControlledPageCount] = useState(0);
    const [totalItem, setTotalItem] = useState(0);
    const {t} = useTranslation('common');
    const [searchCriteria, setSearchCriteria] = useState({});
    const [sortCriteria, setSortCriteria] = useState(props.defaultSort.init || {});
    const [filterCriteria, setFilterCriteria] = useState({});
    const [showFilter, setShowFilter] = useState(false);
    const [countFilter, setCountFilter] = useState(0);
    const [rerenderFilter, setRerenderFilter] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [isDirtyKeyword, setIsDirtyKeyword] = useState(false);
    const {refreshKey, refresh: refreshTable} = useDataTable();
    const [activeRow, setActiveRow] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);

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
        state: {pageIndex, pageSize},
        allColumns,
        selectedFlatRows,
        // setGlobalFilter,
        // setAllFilters
    } = useTable(
      {
          columns,
          data,
          initialState: {pageIndex: 0, pageSize: props.itemPerPage, selectedRowIds: props.selectedRows},
          manualPagination: !props.isLocal,
          pageCount: controlledPageCount,
          autoResetExpanded: false
      },
      // useGlobalFilter,
      // useFilters,
      useExpanded,
      usePagination,
      useRowSelect,
      hooks => {
          props.hasCheckbox && hooks.visibleColumns.push(columns => [
              {
                  id: 'selection',
                  headerClassName: 'td-2',
                  className: 'td-2',
                  // The header can use the table's getToggleAllRowsSelectedProps method
                  // to render a checkbox
                  Header: ({getToggleAllRowsSelectedProps}) => (
                    <div>
                        <IndeterminateCheckbox id="header" {...getToggleAllRowsSelectedProps()} />
                    </div>
                  ),
                  // The cell can use the individual row's getToggleRowSelectedProps method
                  // to the render a checkbox
                  Cell: ({row}) => {
                      if(props.disabledCheckbox && props.disabledCheckbox(row.original)) row.isSelected = false;

                      return (
                        <div>
                            {
                                props.disabledCheckbox && props.disabledCheckbox(row.original)
                                  ? <div onClick={(e) => e.stopPropagation()}
                                         className="d-inline-block custom-control custom-checkbox">
                                      <input type="checkbox" disabled
                                             className="custom-control-input" name="reCheck"
                                      />
                                      <label className="custom-control-label"></label>
                                  </div>
                                  : <IndeterminateCheckbox
                                    id={`${row.id}${props.name}`} {...row.getToggleRowSelectedProps()} />
                            }

                        </div>
                      )
                  },
              },
              ...columns,
          ])
      }
    );

    useEffect(() => {
        if (props.hasCheckbox && props.getSelectedFlatRows && data.length > 0) props.getSelectedFlatRows(data, selectedFlatRows)
    }, [selectedFlatRows.length])

    useImperativeHandle(ref, () => ({
        getSelectedFlatRows() {
            return selectedFlatRows;
        }
    }));

    const IndeterminateCheckbox = React.forwardRef(
      ({indeterminate, id,...rest}, ref) => {
          const defaultRef = React.useRef()
          const resolvedRef = ref || defaultRef

          React.useEffect(() => {
              resolvedRef.current.indeterminate = indeterminate;
          }, [resolvedRef, indeterminate])

          return (
            <div onClick={(e)=>e.stopPropagation()} className="d-inline-block custom-control custom-checkbox">
                <input type="checkbox"  className="custom-control-input" name="reCheck" id={`reCheck${id}`}
                       ref={resolvedRef} {...rest} />
                <label className="custom-control-label" htmlFor={`reCheck${id}`}></label>
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
            ...filterCriteria,
            ...props.params
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

    const handleSort = (e, column) => {
        const handleChangeClass = (e) => {
            const sortingChanges = {
                sorting: 'sortingAsc',
                sortingAsc: 'sortingDesc',
                sortingDesc: 'sortingAsc',
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

        if (props.defaultSort?.default && !isEmpty(finalSort)) {
            if (!isSameKeys(props.defaultSort?.default, finalSort)) {
                finalSort = {
                    ...finalSort,
                    ...props.defaultSort.default,
                }
            }
        }

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
            const {data, totalItem, hasPermission } = await props.setRemoteData(buildParams());
            setData(data);
            setTotalItem(totalItem)
            setControlledPageCount(Math.ceil(totalItem / pageSize));
            hasPermission === false
              ? setHasPermission(hasPermission)
              : setHasPermission(true);

        }

        if (isRemotePaging() && props.setRemoteData) {

            getRemoteData().catch(e => console.log(e));
        } else {
            setData(props.data)
            setTotalItem(data.length)
        }
    }, [pageIndex, pageSize, searchCriteria, sortCriteria, refreshKey, filterCriteria, props.params, props.data]);

    useEffect(() => {
        if (isDirtyKeyword && !searchKeyword) {
            handleSearch()
        }
    }, [searchKeyword]);

    const getHeaderLength = () => {
        let l = headerGroups.map((h)=>{
            return h?.headers?.length
        })
        return Math.max(l)
    }

    const closeFilter = () => {
        setShowFilter(false)
    };

    const handleFilter = (filterData, isClear = false) => {
        setCountFilter(Object.keys(filterData).filter(x => filterData[x] !== null).length)
        if (props.isLocal) {
            // setAllFilters(makeLocalFilterParams(filterData));
        } else {
            const params = {...filterCriteria, ...filterData};
            setFilterCriteria(isClear ? {} : params);
        }
        resetPaging()
    };

    const onClickRow = (row) => {
        props.onClickRow && props.onClickRow(row);
        if(props.hasActiveRow){
            setActiveRow(row.original[props.activeRowName])
        }
    }

    const checkClassActive = (row) => {
        return `${props.hasActiveRow && activeRow === row.original[props.activeRowName] ? "bg-primary text-white" : ""}`
    }

    return (
      <div id="" className="">
          {props.filters && <Filter key={rerenderFilter}
                                    show={showFilter}
                                    close={closeFilter}
                                    filters={props.filters}
                                    handleFilter={handleFilter}
                                    rerender={(e) => {
                                        setRerenderFilter(rerenderFilter + 1);
                                    }}
          />}
          <div className="row">
              <div className="col-12">
                  <div className="card card-no-border shadow-none">
                      {
                          props.hasHeader && <div className="card-header card-header-main border-0 overflow-visible">
                              {props.leftControl && props.leftControl()}

                              <div className="heading-elements">
                                  <ul className="list-inline d-flex align-items-center mb-0">
                                      {
                                          props.hasSearch && <li>
                                              <form onSubmit={handleSearch}>
                                                  <div className="position-relative has-icon-left">
                                                      <input name="keyword"
                                                             type="search"
                                                             className="form-control form-control-sm"
                                                             onChange={(e) => {
                                                                 setIsDirtyKeyword(true)
                                                                 setSearchKeyword(e.target.value)
                                                                 //    props.onSearch && props.onSearch()
                                                             }}
                                                             placeholder={t('pagination.searchPlaceholder') + " " + props.titleSearch}/>
                                                      <div className="form-control-position">
                                                          <i onClick={handleSearch}
                                                             className="far fa-search text-size-base la-rotate-270"/>
                                                      </div>
                                                  </div>
                                              </form>
                                          </li>
                                      }
                                      {
                                          props.hasFilter && <li className="pl-1 filter-i">
                                              <a title={t('pagination.filters')} className="avatar btn-avatar"
                                                 onClick={() => {
                                                     setShowFilter(true)
                                                 }}>
                                                  <i className="fal fa-filter"/>
                                                  {countFilter !== 0 ? <div
                                                    className="badge badge-pill badge-secondary">{countFilter}</div> : null}
                                              </a>
                                          </li>
                                      }
                                      <li className="d-none">
                                          <a title={t('pagination.settings')}
                                             className="dropdown rounded-circle border"
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
                                      <li className='ml-1'>
                                          {props.rightControl && props.rightControl()}
                                      </li>
                                      {
                                          props.hasExport && <li className='ml-1'>
                                              <Exporter
                                                title={`Tải về ${props.titleSearch}`}
                                                className="btn btn-outline-primary btn-md"
                                                columns={props.columns}
                                                setRemoteData={props.setRemoteData}
                                                filterCriteria={filterCriteria || {}}
                                                searchCriteria={searchCriteria || {}}
                                              >
                                                  {`Tải về ${props.titleSearch}`}
                                              </Exporter>
                                          </li>
                                      }
                                  </ul>
                              </div>
                          </div>
                      }
                      <div className="card-content collapse p-0 show">
                          <div className="card-body card-dashboard p-0 pr-1">
                              <div className="table-responsive">
                                  <TableScrollbar>
                                      <table {...getTableProps()}
                                             className={`table has-sorting table-borderless table-hover table-striped table-border-dash ${props.classes}`}>
                                          <thead>
                                          {headerGroups.map(headerGroup => (
                                            <tr {...headerGroup.getHeaderGroupProps()}>
                                                {headerGroup.headers.map((column, cIndex) => (
                                                  <th className={column.headerClassName} title={column.render('Header')}
                                                      key={cIndex}
                                                  >
                                                      {column.render('Header')}
                                                  </th>
                                                ))}
                                            </tr>
                                          ))}
                                          </thead>
                                          <tbody {...getTableBodyProps()}>
                                          {page.map((row, i) => {
                                              prepareRow(row)
                                              return (
                                                <tr
                                                  className={checkClassActive(row)}
                                                  key={i} onClick={() => onClickRow(row)}
                                                  {...row.getRowProps()}
                                                >
                                                    {row.cells.map((cell, index) => {
                                                        return (
                                                          <td key={index} className={cell.column.className}
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
                                                  <td colSpan={getHeaderLength()}
                                                      className="pl-2 text-left mw-100">
                                                      {hasPermission === null ? (
                                                        <div>
                                                            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                                            {t("common.message.loading")}
                                                        </div>
                                                      ) : hasPermission === true ? (
                                                        t("common.noData")
                                                      ) : (
                                                        <span className='text-danger'><i className="fal fa-ban pr-50"></i>
                                                            {t("common.noPermissionList")}.
                                </span>
                                                      )}
                                                  </td>
                                              </tr>
                                          }

                                          </tbody>
                                      </table>
                                      <table {...getTableProps()}
                                             className={`table has-sorting table-borderless table-hover table-striped table-border-dash ${props.classes}`}>
                                          <thead>
                                          {headerGroups.map(headerGroup => (
                                            <tr {...headerGroup.getHeaderGroupProps()}>
                                                {headerGroup.headers.map((column, cIndex) => (
                                                  <th className={column.headerClassName} title={column.render('Header')}
                                                      key={cIndex}
                                                      style={headerTRStyle} {...column.getHeaderProps()} >
                                                      {column.render('Header')}
                                                      <div className="d-inline-flex position-relative"
                                                           style={renderStyle(column)}>
                                                          {column.sortable &&
                                                          <span id={`default-sort-${cIndex}`}
                                                                onClick={(e) => handleSort(e, column)}
                                                                className={`${sortClassName(column)}`}/>}
                                                      </div>
                                                  </th>
                                                ))}
                                            </tr>
                                          ))}
                                          </thead>
                                      </table>
                                  </TableScrollbar>
                              </div>
                              {
                                  totalItem > 0 && <div className="data-table-footer px-2 mt-1">
                                      <div className="float-left pb-2">
                                          <b>{(pageIndex * pageSize) + 1} - {canNextPage ? (pageIndex + 1) * pageSize : totalItem}</b>&nbsp;
                                          <span>{t('pagination.of')}</span>&nbsp;
                                          <b>{props.isLocal ? rows.length : totalItem}&nbsp;</b>{t('pagination.items')}
                                      </div>
                                      <div className="float-right">
                                          <ul className="pagination">
                                              <li className="paginate_button page-item mr-1">
                                                  <select value={pageSize} onChange={e => {
                                                      setPageSize(Number(e.target.value))
                                                  }}
                                                          className="custom-select custom-select-sm form-control form-control-sm">
                                                      {
                                                          [5, 10, 25, 50, 100].map(item => {
                                                              return <option key={item} value={item}>{item}</option>
                                                          })
                                                      }
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
          </div>
      </div>
    );
})

DataTable.propTypes = {
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
    rightControl: PropTypes.func,
    hasFilter: PropTypes.bool,
    hasSearch: PropTypes.bool,
    filters: PropTypes.array,
    hasCheckbox: PropTypes.bool,
    hasHeader: PropTypes.bool,
    hasExpanding: PropTypes.bool,
    defaultSort: PropTypes.object,
    classes: PropTypes.string,
    getSelectedFlatRows: PropTypes.func,
    hasExport: PropTypes.bool,
    onClickRow: PropTypes.func,
    hasActiveRow: PropTypes.bool,
    activeRowName: PropTypes.string,
    name: PropTypes.string,
    selectedRows: PropTypes.object,
    disabledCheckbox: PropTypes.func
};

DataTable.defaultProps = {
    title: 'Unnamed Table',
    itemPerPage: 10,
    currentPage: 0,
    data: [],
    columns: [],
    isLocal: false,
    params: {},
    hasFilter: false,
    hasCheckbox: false,
    hasSearch: true,
    hasHeader: true,
    hasExpanding: false,
    defaultSort: {},
    classes: "",
    hasExport: false,
    onClickRow: () => null,
    hasActiveRow: false,
    activeRowName: "id",
    name: "table",
    selectedRows: {}
};

export default React.memo(DataTable);
