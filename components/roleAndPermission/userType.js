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
import FormUserTypeModal from "./formUserTypeModal";
import {UserTypeApi} from "services/userType";
import {confirmation} from "utils/helpers";
import {UserApi} from "services/user";

function UserTypeManagement(props) {
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
          <button
            className="dropdown-item"
            onClick={() => {
              confirmation({
                content: "Xác nhận xóa loại người dùng này",
                title: "Cảnh báo",
                onConfirm: async ({onClose}) => {
                  await UserTypeApi.delete(row.original.id).then((response) => {
                    if (Response.isSuccess(response)) {
                      addToast("Đã xóa", {appearance: 'success'})
                      onClose()
                      setTimeout(() => {
                        refreshTable()
                      }, 500)
                    } else {
                      addToast(Response.getAPIError(response), {appearance: 'error'});
                    }
                  }).catch(error => {
                    addToast(Response.getErrorMessage(error), {appearance: 'error'})
                  });
                }
              })
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
        Header: 'Mã loại người dùng',
        accessor: 'code',
        sortable: false,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
      },
      {
        Header: 'Tên loại người dùng',
        accessor: 'name',
        sortable: false,
        className: 'td-10 text-truncate',
        headerClassName: 'td-10 text-truncate',
        Cell: ({value = ""}) => <span className="font-weight-bold">{value}</span>
      },
      {
        Header: 'Trực thuộc',
        accessor: 'is_staff',
        sortable: false,
        className: 'td-4 text-truncate',
        headerClassName: 'td-4 text-truncate',
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
        const response = await UserTypeApi.getAll(payload);
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
                       <h3 className="content-header-title mb-0">Danh sách loại người dùng</h3>
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

      <FormUserTypeModal
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

UserTypeManagement.propTypes = {
  provinces: PropTypes.array,
  userId: PropTypes.number
}
UserTypeManagement.defaultProps = {
  provinces: [],
};

export default UserTypeManagement;
