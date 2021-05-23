import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import ExcelHelpers from "utils/ExcelHelpers";
import {isEmpty, isNil} from "lodash"
import Spinner from "sharedComponents/spinner";

function Exporter(props) {
  const pageSize = useRef(100)
  const [loading, setLoading] = useState()

  const buildParams = (pageIndex) => {
    return {
      pageSize: pageSize.current,
      pageNumber: pageIndex,
      ...props.searchCriteria,
      ...props.filterCriteria
    };
  };

  const getDataWithPagination = async () => {
    let finalData = []
    setLoading(true)
    async function getRemoteData(pageIndex = 0) {
      const {data, totalItem} = await props.setRemoteData(buildParams(pageIndex));
      finalData = [...finalData, ...data]

      if (finalData.length < totalItem) {
        await getRemoteData(pageIndex + 1)
      }
    }

    await getRemoteData()
    setLoading(false)

    return finalData
  }

  const handleExport = async () => {
    const paginationData = await getDataWithPagination()
    const columns = props.columns.filter(item => item?.Header?.trim() !== '')
    const headers = columns.map(item => item?.Header)
    const optionFilter = 'exportFilter'

    if (!isEmpty(paginationData)) {
      const finalData = paginationData.map(item => {
        const result = []
        columns.forEach(column => {
          const accessor = column?.accessor

          if (!isNil(item[accessor]) && column[optionFilter] && column[optionFilter] instanceof Function) {
            item[accessor] = column.exportFilter(item[accessor])
          }

          result.push(item[accessor] || null)
        })

        return result
      });

      finalData.unshift(headers)

      ExcelHelpers.saveAsExcelFromList(finalData, (ws, item) => {
        ws.addRow(item)
        ws.getRow(1).font = {bold: true}
      }).catch(e => console.log(e))
    }
  }
  return (
    <button type="button" className={props.className} title={props.title} onClick={ async () => {
      await handleExport()
    }}>
      {
        loading ? <Spinner loading={loading} /> : props.children
      }
    </button>
  )
}

Exporter.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  data: PropTypes.array,
  columns: PropTypes.array,
  setRemoteData: PropTypes.func,
  searchCriteria: PropTypes.object,
  filterCriteria: PropTypes.object
};

Exporter.defaultProps = {
  data: [],
  columns: [],
  searchCriteria: {},
  filterCriteria: {},
};

export default Exporter;
