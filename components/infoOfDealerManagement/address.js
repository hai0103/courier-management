import React from "react";
import {DataTableProvider, useDataTable} from "providers/dataTable";
import PropTypes from "prop-types";
import ContentWrapper from "layouts/contentWrapper";
import DataTable from "sharedComponents/dataTable";
import {AddressApi} from "services/address";
import {Response} from "utils/common";
import Link from "next/link";
import {ROUTES, SYSTEM_PERMISSIONS} from "../../constants/common";
import filters from "utils/filters";
import Badge from "sharedComponents/blocks/badge";
import {PostOfficeApi} from "services/postOffice";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";
import More from "sharedComponents/more";
import {getUserProfile} from "utils/localStorage";
import {UserApi} from "services/user";

function DealerAddressManagement(props) {
  const {t} = useTranslation('common');
  const {addToast} = useToasts();
  const {refresh: refreshTable} = useDataTable();


  const actionButton = (row) => {
    return (
      <More>
        {
          <button className="dropdown-item"
                  onClick={() => {
                  }}
          >
            <i className="fal fa-lock"/>
            {t('usersManagement.actionBlock.lock')}
          </button>
        }
      </More>
    )
  };


  const dataTable = () => {
    const titleSearch = 'địa chỉ';
    const columns = [
      {
        Header: "  ",
        className: 'action-col',
        headerClassName: 'action-col',
        Cell: ({row}) => actionButton(row)
      },
      {
        Header: 'Họ và tên',
        accessor: 'name',
        sortable: false,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({value = ""}) => <span className="font-weight-bold">{value}</span>
      },
      {
        Header: 'Số điện thoại',
        accessor: 'phone',
        sortable: false,
        className: 'td-4 text-truncate',
        headerClassName: 'td-4 text-truncate',
      },
      {
        Header: 'Địa chỉ',
        accessor: 'address',
        sortable: false,
        className: 'td-10 text-truncate',
        headerClassName: 'td-10 text-truncate',
        Cell: ({row = {}}) => <span
          title={`${row.original.address || '_'} - ${row.original.ward || '_'} - ${row.original.district || '_'} - ${row.original.province || '_'}`}>
                    {`${row.original.address || ''} - ${row.original.ward || ''} - ${row.original.district || ''} - ${row.original.province || ''}`}
                </span>
      },
      {
        Header: 'Mặc định',
        accessor: 'is_default',
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({value = false}) => value ? <i className='fa fa-check primary'/> : ''
      },
    ];

    const setRemoteData = async (params) => {
      const _loggedUser = getUserProfile();

      let payload = {
        ...params,
      }
      if (params.sort) {
        payload.keySort = params.sort[0]?.key || '',
          payload.asc = params.sort[0]?.asc || null

      }

      try {
        const response = await UserApi.getListUserAddress(_loggedUser?.id);
        console.log(response)
        if (Response.isSuccessCode(response?.data)) {
          const data = Response.getData(response).data || [];
          return {
            data: data, totalItem: data.length
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

    return {columns, setRemoteData, defaultSort, titleSearch};
  };

  return (
    <DataTableProvider>
      <ContentWrapper>
        {
          <DataTable {...dataTable()}
             leftControl={
               () => (
                 <h3 className="content-header-title mb-0">Danh sách địa chỉ</h3>
               )
             }

             rightControl={
               () => (
                 <button className="btn btn-primary btn-md"
                 >
                   {t('usersManagement.userDetail.addNew')}
                 </button>
               )
             }
          />
        }
      </ContentWrapper>
    </DataTableProvider>

  );
}

DealerAddressManagement.propTypes = {
  provinces: PropTypes.array,
  userId: PropTypes.number
}
DealerAddressManagement.defaultProps = {
  provinces: [],
};

export default DealerAddressManagement;
