import React, {useEffect, useState} from "react";
import {DataTableProvider, useDataTable} from "providers/dataTable";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";
import More from "sharedComponents/more";
import {Response} from "utils/common";
import ContentWrapper from "layouts/contentWrapper";
import DataTable from "sharedComponents/dataTable";
import filters from "utils/filters";
import {getUserProfile} from "utils/localStorage";
import {OrderApi} from "services/order";
import {InlineInput} from "sharedComponents/formControl";
import {SimpleInlineInput} from "sharedComponents/formControl/simpleInlineInput";
import {UserApi} from "services/user";

function ConfigFormula(props) {
  const {t} = useTranslation('common');
  const {addToast} = useToasts();
  const {refresh: refreshTable} = useDataTable();
  const [loggedUser, setLoggedUser] = useState({});

  useEffect(() => {
    setLoggedUser(getUserProfile() || {});
  }, [])

  const actionButton = (row) => {
    return (
      <More>
        {
          <button className="dropdown-item"
                  onClick={() => {
                  }}
          >
            <i className="fal fa-pencil"/>
            Chỉnh sửa
          </button>
        }
      </More>
    )
  };

  const renderType = (type = '') => {
    switch (type) {
      case 'STANDARD': return <span className="primary">Tiêu chuẩn</span>;
      case "FAST": return <span className="red">Hỏa tốc</span>;
      case "ROAD": return <span className="primary">Đường bộ</span>;
      case "AIRLINE": return <span className="red">Đường bay</span>;
      default: return '';
    }
  }

  const handleSubmit = async (item, value, formula) => {
    console.log(item, value, formula)
    const payload = {
      id: item.id,
      body: {
        ...item,
        value: value ? value : item.value,
        formula: formula ? formula : item.formula,
      }
    }

    const response = await OrderApi.updateConfigFormula(payload);
    if (Response.isSuccessAPI(response)) {
      addToast(t('common.message.editSuccess'), {appearance: 'success'});
      // setTimeout(() => {
        refreshTable();
      // }, 500)
    } else {
      addToast(Response.getAPIError(response), {appearance: 'error'});
    }
  }

  const dataTable = () => {
    const columns = [
      {
        Header: "  ",
        className: 'action-col',
        headerClassName: 'action-col',
        Cell: ({row}) => actionButton(row)
      },
      {
        Header: 'Mã',
        accessor: 'code',
        sortable: false,
        className: 'td-4 text-truncate',
        headerClassName: 'td-4 text-truncate',
      },
      {
        Header: 'Tên mức',
        accessor: 'name',
        sortable: false,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({value = ""}) => <span className="font-weight-bold">{value}</span>
      },
      {
        Header: 'Mức phí',
        accessor: 'value',
        sortable: false,
        className: 'td-5 text-truncate',
        headerClassName: 'td-5 text-truncate',
        // Cell: ({row = {}}) => <span className="teal">{filters.currency(row.original.value)} đ</span>
        Cell: ({row = {}}) => <SimpleInlineInput
          className="form-control"
          type="currency"
          defaultValue={`${filters.currency(row.original.value)} đ`}
          handleSubmit={(e) => {
            handleSubmit(row.original, e, null)
          }}
        />
      },
      {
        Header: 'Phí thêm',
        accessor: 'formula',
        sortable: false,
        className: 'td-7 text-truncate',
        headerClassName: 'td-7 text-truncate',
        Cell: ({row = {}}) => `${filters.currency(row.original.formula)} đ ${row.original.formula != 0 ? (row.original.code !== 'SUPER_CHEAP' ? '(trên mỗi 0.5kg tiếp theo)' : '(trực tiếp vào cước)') : ''}`
      },
      {
        Header: 'Loại',
        accessor: 'type',
        sortable: false,
        className: 'td-4 text-truncate',
        headerClassName: 'td-4 text-truncate',
        Cell: ({row = {}}) => renderType(row.original.type)
      },
    ];

    const setRemoteData = async (params) => {

      let payload = {
        ...params,
      }
      if (params.sort) {
        payload.keySort = params.sort[0]?.key || '',
          payload.asc = params.sort[0]?.asc || null

      }

      try {
        const response = await OrderApi.getConfigFormula();
        console.log(response)
        if (Response.isSuccessCode(response?.data)) {
          const data = Response.getData(response).data || [];
          return {
            data: data, totalItem: 0
          }
        } else {
          console.log(response);
        }

      } catch (error) {
        addToast(Response.getErrorMessage(error), {appearance: 'error'})
        console.log(error);
      }
    };

    const defaultSort = {
      init: {
        code: 'ASC'
      },
      default: {
        code: 'ASC'
      }
    };

    return {columns, setRemoteData, defaultSort};
  };

  return (
      <ContentWrapper>
        {
          <DataTable {...dataTable()}
                     hasSearch={false}
                     leftControl={
                       () => (
                         <h3 className="content-header-title mb-0">Thiết lập mức cước phí</h3>
                       )
                     }

          />
        }
      </ContentWrapper>
  );
}

ConfigFormula.propTypes = {
  provinces: PropTypes.array,
}
ConfigFormula.defaultProps = {
  provinces: [],
};

export default ConfigFormula;
