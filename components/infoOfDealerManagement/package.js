import React, {useEffect, useState} from "react";
import {DataTableProvider, useDataTable} from "providers/dataTable";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";
import More from "sharedComponents/more";
import Link from "next/link";
import {ROUTES} from "../../constants/common";
import {PostOfficeApi} from "services/postOffice";
import {Response} from "utils/common";
import ContentWrapper from "layouts/contentWrapper";
import DataTable from "sharedComponents/dataTable";
import filters from "utils/filters";
import {UserApi} from "services/user";
import {getUserProfile} from "utils/localStorage";
import FormPackageModal from "./formPackageModal";

function DealerPackageManagement(props) {
  const {t} = useTranslation('common');
  const {addToast} = useToasts();
  const {refresh: refreshTable} = useDataTable();
  const [loggedUser, setLoggedUser] = useState({});
  const [selected, setSelected] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  useEffect(() => {
    setLoggedUser(getUserProfile() || {});
  }, [])

  const actionButton = (row) => {
    return (
      <More>
        {
          <button className="dropdown-item"
                  onClick={() => {
                    setSelected(row.original);
                    setShowFormModal(true);
                  }}
          >
            <i className="fal fa-pencil"/>
            Sửa
          </button>
        }
        {
          <button className="dropdown-item"
                  onClick={() => {
                  }}
          >
            <i className="fal fa-trash"/>
            Xóa
          </button>
        }
      </More>
    )
  };


  const dataTable = () => {
    const titleSearch = 'gói hàng';
    const columns = [
      {
        Header: "  ",
        className: 'action-col',
        headerClassName: 'action-col',
        Cell: ({row}) => actionButton(row)
      },
      {
        Header: 'Mã hàng',
        accessor: 'code',
        sortable: false,
        className: 'td-4 text-truncate',
        headerClassName: 'td-4 text-truncate',
      },
      {
        Header: 'Tên hàng',
        accessor: 'name',
        sortable: false,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({value = ""}) => <span className="font-weight-bold">{value}</span>
      },
      {
        Header: 'Trọng lượng (gram)',
        accessor: 'weight',
        sortable: false,
        className: 'td-4 text-truncate',
        headerClassName: 'td-4 text-truncate',
        Cell: ({row = {}}) => `${filters.currency(row.original.weight)}`
      },
      {
        Header: 'Đơn giá',
        accessor: 'price',
        sortable: false,
        className: 'td-4 text-truncate',
        headerClassName: 'td-4 text-truncate',
        Cell: ({row = {}}) => `${filters.currency(row.original.price)} đ`
      },
      {
        Header: 'Kích thước',
        accessor: 'phone',
        sortable: false,
        className: 'td-8 text-truncate',
        headerClassName: 'td-8 text-truncate',
        Cell: ({row = {}}) => `Dài: ${row.original.length}; Rộng: ${row.original.wide}; Cao: ${row.original.height}`
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
        const response = await UserApi.getListUserPackage(_loggedUser?.id);
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
    <ContentWrapper>
      {
        <DataTable {...dataTable()}
                   leftControl={
                     () => (
                       <h3 className="content-header-title mb-0">Danh sách gói hàng</h3>
                     )
                   }

                   rightControl={
                     () => (
                       <button className="btn btn-primary btn-md"
                               onClick={() => {
                                 setSelected(null);
                                 setShowFormModal(true);
                               }}
                       >
                         {t('usersManagement.userDetail.addNew')}
                       </button>
                     )
                   }
        />
      }

      <FormPackageModal
        isEdit={selected !== null && selected !== {} && !!selected.id}
        show={showFormModal}
        detail={selected}
        onClose={() => {
          setShowFormModal(false);
          refreshTable();
        }}
      />
    </ContentWrapper>
  );
}

DealerPackageManagement.propTypes = {
  provinces: PropTypes.array,
  userId: PropTypes.number
}
DealerPackageManagement.defaultProps = {
  provinces: [],
};

export default DealerPackageManagement;
