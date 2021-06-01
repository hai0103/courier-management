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
        Header: 'Mã bưu cục',
        accessor: 'code',
        sortable: true,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({row = {}}) =>
          <Link href={`${ROUTES.POST_OFFICE}/${row.original.id}?readOnly`}><a
            title={row.original.code}>{row.original.code}</a></Link>
      },
      {
        Header: 'Tên bưu cục',
        accessor: 'name',
        sortable: true,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({row = {}}) =>
          <Link href={`${ROUTES.POST_OFFICE}/${row.original.id}?readOnly`}><a
            title={row.original.name}>{row.original.name}</a></Link>
      },
      {
        Header: 'Số điện thoại',
        accessor: 'phone',
        sortable: false,
        className: 'td-4 text-truncate',
        headerClassName: 'td-4 text-truncate',
      },
      {
        Header: t('usersManagement.header.lastUpdate'),
        accessor: 'update_at',
        sortable: true,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({value}) => filters.dateTime(value)
      },
      {
        Header: "  ",
        className: 'action-col',
        headerClassName: 'action-col',
        Cell: ({row}) => actionButton(row)
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
        const response = await PostOfficeApi.getList(payload);
        console.log(response)
        if (Response.isSuccessCode(response?.data)) {
          const {content, totalElements} = Response.getData(response).data || [];
          return {
            data: content, totalItem: totalElements
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
                         <Link href={ROUTES.NEW_POSITION}>
                           <button className="btn btn-primary btn-md"
                             // disabled={!allows(SYSTEM_PERMISSIONS.CREATE_USER)}
                           >
                             {t('usersManagement.userDetail.addNew')}
                           </button>
                         </Link>
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
}
DealerAddressManagement.defaultProps = {
  provinces: [],
};

export default DealerAddressManagement;
