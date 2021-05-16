import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from "react-i18next";

const Pagination = props => {
    const {t} = useTranslation('common');
    const [pageIndex, setPageIndex] = useState(props.pageIndex);
    const [pageSize, setPageSize] = useState(props.pageSize);
    const [pageCount, setPageCount] = useState(0);
    const [canPreviousPage, setCanPreviousPage] = useState(false);
    const [canNextPage, setCanNextPage] = useState(false);

    const buildParams = () => {
        return {
            pageSize,
            pageNumber: pageIndex
        };
    }

    useEffect(() => {
        async function getRemoteData() {
            const {totalItem} = await props.getData(buildParams());
            console.log(totalItem);
            const totalPage = Math.ceil(totalItem / pageSize);
            setPageCount(totalPage);
            setCanNextPage(pageIndex + 1 < totalPage)
            setCanPreviousPage(pageIndex > 0)
        }

        getRemoteData().catch(e => console.log(e));

    }, [pageIndex, pageSize, props.renderKey]);

    const previousPage = () => {
        setPageIndex(pageIndex - 1)
    }

    const nextPage = () => {
        setPageIndex(pageIndex + 1)
    }

    const gotoPage = (page) => {
        setPageIndex(page)
    }

    return (
        pageCount > 1 && <ul className="pagination py-1 justify-content-center order-3">
            <li className="paginate_button page-item mr-1"><select
                onChange={(e) => {
                    setPageSize(e.target.value)
                    gotoPage(0)
                }}
                defaultValue={pageSize}
                className="custom-select custom-select-sm form-control form-control-sm">
                {
                    [10, 25, 50, 100].map((item, index) => {
                        return <option key={index}>
                            {item}
                        </option>
                    })
                }
            </select></li>
            <li title={t('pagination.firstPage')} className={`paginate_button page-item previous ${!canPreviousPage ? 'disabled' : ''}`}>
                <a onClick={() => gotoPage(0)} className="page-link"><i className="feather icon-skip-back"/></a>
            </li>
            <li title={t('pagination.previous')} className={`paginate_button page-item previous ${!canPreviousPage ? 'disabled' : ''}`}>
                <a onClick={() => previousPage()} className="page-link"><i className="feather icon-chevron-left"/></a></li>
            <li className="paginate_button page-item active"><a className="page-link">{pageIndex + 1} / {pageCount}</a>
            </li>
            <li title={t('pagination.next')} className={`paginate_button page-item next ${!canNextPage ? 'disabled' : ''}`}>
                <a onClick={() => nextPage()} className="page-link"><i className="feather icon-chevron-right"/></a>
            </li>
            <li title={t('pagination.lastPage')} className={`paginate_button page-item next ${!canNextPage ? 'disabled' : ''}`}>
                <a onClick={() => gotoPage(pageCount - 1)} className="page-link"><i className="feather icon-skip-forward"/></a></li>
        </ul>
    )
}

Pagination.propTypes = {
    pageSize: PropTypes.number,
    pageIndex: PropTypes.number,
    getData: PropTypes.func,
    renderKey: PropTypes.number
};

Pagination.defaultProps = {
    pageSize: 10,
    pageIndex: 0,
    data: [],
    renderKey: 1
};

export default Pagination;
