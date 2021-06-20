import React, {useState} from "react";
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
import {getUserProfile} from "utils/localStorage";
import {UserApi} from "services/user";
import FormAddressModal from "./formAddressModal";

function DealerReceiverManagement(props) {
  const {t} = useTranslation('common');
  const {addToast} = useToasts();
  const {refresh: refreshTable} = useDataTable();
  const [selected, setSelected] = useState({});
  const [showFormModal, setShowFormModal] = useState(false);


  const actionButton = (row) => {
    return (
      <More>
        {
          <button className="dropdown-item"
                  onClick={() => {
                    setSelected(row.original || {});
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
    const titleSearch = 'người nhận';
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
        const response = await UserApi.getListUserReceiver(_loggedUser?.id);
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
               <h3 className="content-header-title mb-0">Danh sách người nhận quen</h3>
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
      <FormAddressModal
        isReceiver={true}
        show={showFormModal}
        detail={selected}
        provinces={props.provinces}
        userId={props.userId}
        onClose={() => {
          setShowFormModal(false);
          refreshTable();
        }}
      />


    </ContentWrapper>
  );
}

DealerReceiverManagement.propTypes = {
  provinces: PropTypes.array,
  userId: PropTypes.number
}
DealerReceiverManagement.defaultProps = {
  provinces: [],
};

export default DealerReceiverManagement;
