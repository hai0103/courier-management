import {ROUTES, SYSTEM_PERMISSIONS} from "constants/common";
import Link from "next/link";
import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useToasts} from "react-toast-notifications";
import {UserApi} from "services/user";
import {Response} from "utils/common";
import ContentWrapper from "layouts/contentWrapper";
import Badge from "sharedComponents/blocks/badge";
import DataTable from "sharedComponents/dataTable";
import More from "sharedComponents/more";
import filters from "utils/filters";
import {useDataTable} from "providers/dataTable";
import {OrderApi} from "services/order";
import {GlobalData} from "services/globalData";
import {getUserProfile} from "utils/localStorage";
import moment from "moment";
import {confirmation} from "utils/helpers";

function OrderList(props) {
  const {t} = useTranslation('common');
  const [statusFilter, setStatusFilter] = useState(0);
  const [dataCount, setDataCount] = useState({});
  // const [count, setCount] = useState(0);
  const {addToast} = useToasts();
  const {refresh: refreshTable} = useDataTable();
  const [loggedUser, setLoggedUser] = useState({});

  const statusMapping = (status) => {
    const mapping = {
      1: {
        label: 'Chờ lấy',
        bg: 'success',
      },
      2: {
        label: 'Đang vận chuyển',
        bg: 'warning',
      },
      3: {
        label: "Đang giao",
        bg: 'primary',
      },
      4: {
        label: "Giao thành công",
        bg: 'success',
      },
      5: {
        label: "Chờ xử lý",
        bg: 'warning',
      },
      6: {
        label: "Đang chuyển hoàn",
        bg: 'warning',
      },
      7: {
        label: "Đã duyệt hoàn",
        bg: 'warning',
      },
      8: {
        label: "Phát lại",
        bg: 'primary',
      },
      9: {
        label: "Đã trả",
        bg: 'success',
      },
      10: {
        label: "Tạo mới",
        bg: 'primary',
      },
      11: {
        label: "Đã lấy",
        bg: 'primary',
      },
      12: {
        label: "Đã hủy",
        bg: 'danger',
      },
    }

    return mapping[status] || [];
  };

  useEffect(() => {
    setLoggedUser(getUserProfile() || {});
    countOrder().catch(e => console.log(e));
  }, [])

  const actionButton = (row) => {
    return (
      <More>
        <Link href={`/users/${row.original.id}?readOnly`}>
          <button className="dropdown-item edit">
            <i className="fal fa-pen"/>{t('usersManagement.actionBlock.edit')}
          </button>
        </Link>
        {
          (loggedUser?.user_type_code === "DEALER" && row.original.status_id === 10) &&
          <button className="dropdown-item"
                  onClick={() => {
                    confirmation({
                      content: "Xác nhận duyệt đơn này tới bưu cục",
                      title: "Duyệt đơn",
                      onConfirm: async ({onClose}) => {
                        await updateStatus(row.original.id, 5)
                          .then(() => {
                            onClose()
                            setTimeout(() => {
                              reloadTable()
                            }, 300)
                          })
                          .catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}))
                      }
                    })
                  }}
          >
            <i className="fal fa-lock"/>
            Duyệt đơn
          </button>
        }
        {
          (row.original.status_id === 10 || row.original.status_id === 5) &&
          <button className="dropdown-item"
                  onClick={() => {
                    confirmation({
                      content: "Xác nhận hủy đơn hàng này",
                      title: "Hủy đơn",
                      onConfirm: async ({onClose}) => {
                        await updateStatus(row.original.id, 12)
                          .then(() => {
                            onClose()
                            setTimeout(() => {
                              reloadTable()
                            }, 300)
                          })
                          .catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}))
                      }
                    })
                  }}
          >
            <i className="fal fa-unlock"/>
            Hủy đơn
          </button>
        }
        {
          ((loggedUser?.user_type_code === "SUPER_ADMIN" || loggedUser?.user_type_code === "EMPLOYEE") && (row.original.status_id === 5)) &&
          <button className="dropdown-item"
                  onClick={() => {
                    confirmation({
                      content: "Xác nhận bưu cục nhận đơn hàng này",
                      title: "Bưu cục nhận đơn",
                      onConfirm: async ({onClose}) => {
                        await updateStatus(row.original.id, 1)
                          .then(() => {
                            onClose()
                            setTimeout(() => {
                              reloadTable()
                            }, 300)
                          })
                          .catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}))
                      }
                    })
                  }}
          >
            <i className="fal fa-unlock"/>
            Bưu cục nhận đơn
          </button>
        }

        {
          ((loggedUser?.user_type_code === "SUPER_ADMIN" || loggedUser?.user_type_code === "EMPLOYEE") && (row.original.status_id === 1)) &&
          <button className="dropdown-item"
                  onClick={() => {
                    confirmation({
                      content: "Xác nhận đã lấy đơn hàng này",
                      title: "Đã lấy đơn",
                      onConfirm: async ({onClose}) => {
                        await updateStatus(row.original.id, 11)
                          .then(() => {
                            onClose()
                            setTimeout(() => {
                              reloadTable()
                            }, 300)
                          })
                          .catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}))
                      }
                    })
                  }}
          >
            <i className="fal fa-unlock"/>
            Lấy đơn
          </button>
        }
        {
          ((loggedUser?.user_type_code === "SUPER_ADMIN" || loggedUser?.user_type_code === "EMPLOYEE") && (row.original.status_id === 11)) &&
          <button className="dropdown-item"
                  onClick={() => {
                    confirmation({
                      content: "Xác nhận chuyển đơn hàng đi",
                      title: "Xác nhận chuyển đơn",
                      onConfirm: async ({onClose}) => {
                        await updateStatus(row.original.id, 2)
                          .then(() => {
                            onClose()
                            setTimeout(() => {
                              reloadTable()
                            }, 300)
                          })
                          .catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}))
                      }
                    })
                  }}
          >
            <i className="fal fa-unlock"/>
            Chuyển đơn
          </button>
        }
        {
          ((loggedUser?.user_type_code === "SHIPPER" || loggedUser?.user_type_code === "EMPLOYEE") && (row.original.status_id === 2)) &&
          <button className="dropdown-item"
                  onClick={() => {
                    confirmation({
                      content: "Shipper xác nhận nhận và giao đơn hàng này",
                      title: "Nhận giao đơn",
                      onConfirm: async ({onClose}) => {
                        await updateStatus(row.original.id, 3)
                          .then(() => {
                            onClose()
                            setTimeout(() => {
                              reloadTable()
                            }, 300)
                          })
                          .catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}))
                      }
                    })
                  }}
          >
            <i className="fal fa-unlock"/>
            Nhận giao đơn
          </button>
        }
        {
          ((loggedUser?.user_type_code === "SHIPPER" || loggedUser?.user_type_code === "EMPLOYEE") && (row.original.status_id === 3)) &&
          <button className="dropdown-item"
                  onClick={() => {
                    confirmation({
                      content: "Shipper xác nhận đã giao thành công đơn hàng này",
                      title: "Xác nhận giao hàng thành công",
                      onConfirm: async ({onClose}) => {
                        await updateStatus(row.original.id, 4)
                          .then(() => {
                            onClose()
                            setTimeout(() => {
                              reloadTable()
                            }, 300)
                          })
                          .catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}))
                      }
                    })
                  }}
          >
            <i className="fal fa-unlock"/>
            Đã giao đơn
          </button>
        }
        {
          row.original.status === "2" && <button className="dropdown-item"
                                                 onClick={() => resendActiveUser(row.original.id)}
          >
            <i className="fal fa-sync-alt"/>
            {t('usersManagement.actionResendActive.title')}
          </button>
        }
      </More>
    )
  };

  const resendActiveUser = async (id) => {
    UserApi.resendEmailActiveUser(id).then((response) => {
      if (Response.isSuccess(response)) {
        addToast(t('common.message.resendActiveSuccess'), {appearance: 'success'})
      } else {
        addToast(Response.getAPIError(response), {appearance: 'error'});
      }
    }).catch(error => {
      addToast(Response.getErrorMessage(error), {appearance: 'error'})
    });
  }

  const updateStatus = async (orderId, status) => {
    const payload = {
      orderId: orderId,
      statusId: status,
      userId: loggedUser?.id
    }
    OrderApi.updateStatus(payload).then((response) => {
      if (Response.isSuccess(response)) {
        addToast('Cập nhật trạng thái thành công', {appearance: 'success'})
      } else {
        addToast(Response.getAPIError(response), {appearance: 'error'});
      }
    }).catch(error => {
      addToast(Response.getErrorMessage(error), {appearance: 'error'})
    });
  };

  useEffect(() => {
    refreshTable();
  }, [statusFilter])

  const dataTable = () => {
    const titleSearch = 'vận đơn';
    const columns = [
      {
        Header: "  ",
        className: 'action-col',
        headerClassName: 'action-col',
        Cell: ({row}) => actionButton(row)
      },
      {
        Header: 'Mã đơn hàng',
        accessor: 'code',
        sortable: true,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({row = {}}) =>
          <Link href={`${ROUTES.ORDER}/${row.original.id}?readOnly`}><a
            title={row.original.code}>{row.original.code}</a></Link>
      },
      {
        Header: 'Người gửi',
        accessor: 'sender_name',
        sortable: false,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({row = {}}) => <span
          title={`${row.original.sender_address || '_'} - ${row.original.sender_wards_name || '_'} - ${row.original.sender_district_name || '_'} - ${row.original.sender_province_name || '_'}`}>
                    <div className="font-weight-bold">{row.original.sender_name || ''}</div>
                    <div>{row.original.sender_phone || ''}</div>
                </span>
      },
      // {
      //   Header: 'Gửi từ',
      //   accessor: 'sender_province_name',
      //   sortable: false,
      //   className: 'td-10 text-truncate',
      //   headerClassName: 'td-10 text-truncate',
      //   Cell: ({row = {}}) => <span
      //     title={`${row.original.sender_address || '_'} - ${row.original.sender_wards_name || '_'} - ${row.original.sender_district_name || '_'} - ${row.original.sender_province_name || '_'}`}>
      //         {`${row.original.sender_address || '_'} - ${row.original.sender_wards_name || '_'} - ${row.original.sender_district_name || '_'} - ${row.original.sender_province_name || '_'}`}
      //     </span>
      // },
      {
        Header: 'Người nhận',
        accessor: 'receiver_name',
        sortable: false,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({row = {}}) => <span
          title={`${row.original.receiver_address || '_'} - ${row.original.receiver_wards_name || '_'} - ${row.original.receiver_district_name || '_'} - ${row.original.receiver_province_name || '_'}`}>
                    <div className="font-weight-bold">{row.original.receiver_name || ''}</div>
                    <div>{row.original.receiver_phone || ''}</div>
                </span>
      },
      // {
      //   Header: 'Gửi đến',
      //   accessor: 'receiver_province_name',
      //   sortable: false,
      //   className: 'td-10 text-truncate',
      //   headerClassName: 'td-10 text-truncate',
      //   Cell: ({row = {}}) => <span
      //     title={`${row.original.receiver_address || '_'} - ${row.original.receiver_wards_name || '_'} - ${row.original.receiver_district_name || '_'} - ${row.original.receiver_province_name || '_'}`}>
      //         {`${row.original.receiver_address || '_'} - ${row.original.receiver_wards_name || '_'} - ${row.original.receiver_district_name || '_'} - ${row.original.receiver_province_name || '_'}`}
      //     </span>
      // },
      // {
      //     Header: 'Vị trí',
      //     accessor: 'province',
      //     sortable: false,
      //     className: 'td-10 text-truncate',
      //     headerClassName: 'td-10 text-truncate',
      //     Cell: ({row = {}}) => <span title={`${row.original.address || '_'} - ${row.original.ward || '_'} - ${row.original.district || '_'} - ${row.original.province || '_'}`}>
      //         {`${row.original.address || '_'} - ${row.original.ward || '_'} - ${row.original.district || '_'} - ${row.original.province || '_'}`}
      //     </span>
      // },
      // {
      //   Header: "Lấy đơn lúc",
      //   accessor: 'create_at',
      //   sortable: false,
      //   className: 'td-6 text-truncate',
      //   headerClassName: 'td-6 text-truncate',
      //   Cell: ({value}) => filters.dateTime(value)
      // },
      {
        Header: 'Hàng hóa',
        accessor: 'packages',
        sortable: false,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({row = {}}) => <span>
                    <div className="font-weight-bold">{row.original?.order_packages?.length > 0 ? row.original?.order_packages[0]?.package?.name || '' : ''}</div>
                    <div>SL: {row.original?.order_packages?.length > 0 ? row.original?.order_packages[0]?.quantity || '' : ''}</div>
                </span>
      },
      {
        Header: "Thu hộ",
        accessor: 'collection_money',
        sortable: false,
        className: 'td-4 text-truncate',
        headerClassName: 'td-4 text-truncate',
        Cell: ({value = 0}) => <span className="teal">{`${filters.currency(value)}đ`}</span>
      },
      {
        Header: "Cước phí",
        accessor: 'ship_money',
        sortable: false,
        className: 'td-4 text-truncate',
        headerClassName: 'td-4 text-truncate',
        Cell: ({value = 0}) => <span className="teal">{`${filters.currency(value)}đ`}</span>
      },
      {
        Header: "Thời gian tạo",
        accessor: 'create_at',
        sortable: true,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({value}) => filters.dateTime(value)
      },
      {
        Header: "Cập nhật gần đây",
        accessor: 'updated_at',
        sortable: true,
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        Cell: ({value}) => filters.dateTime(value)
      },
      {
        Header: t('usersManagement.header.status'),
        accessor: 'status_id',
        className: 'td-6 text-truncate',
        headerClassName: 'td-6 text-truncate',
        sortable: false,
        Cell: ({value = ''}) => <Badge {...statusMapping(value)} />
      },
    ];

    const setRemoteData = async (params) => {
      const _loggedUser = getUserProfile();

      let payload = {
        ...params,
        status: statusFilter || null,
        userId: _loggedUser?.id || 0,
        isStaff: props.isStaff
      }
      if (params.sort) {
        payload.keySort = params.sort[0]?.key || '',
          payload.asc = params.sort[0]?.asc || null
      }

      try {
        const response = await OrderApi.getList(payload);
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
        create_at: 'DESC'
      },
      default: {
        create_at: 'DESC'
      }
    };

    return {columns, setRemoteData, defaultSort, titleSearch};
  };

  const reloadTable = () => {
    countOrder().catch(e => console.log(e));
    refreshTable();
  }

  const countOrder = async () => {
    const _loggedUser = getUserProfile();
    const payload = {
      userId: _loggedUser?.id || 0,
      isStaff: props.isStaff
    }

    try {
      const response = await OrderApi.getCountOrder(payload);
      if (Response.isSuccessCode(response?.data)) {
        const data = Response.getData(response).data || {};
        if (data) {
          let _dataCount = [];
          Object.keys(data).map((key, index) => {
            _dataCount[index] = data[key];
          })
          setDataCount(_dataCount);
        }

      } else {
        console.log(response);
      }

    } catch (error) {
      addToast(Response.getErrorMessage(error), {appearance: 'error'})
      console.log(error);
    }
  }

  return (
    <>
      <ContentWrapper>
        {
          <DataTable {...dataTable()} hasFilter filters={[
            {
              label: "Từ ngày",
              type: "datetime",
              className: "td-7 text-truncate",
              headerClassName: "td-7 text-truncate",
              filterBy: "startDate",
              useDateFormat: true,
            },
            {
              label: "Đến ngày",
              type: "datetime",
              className: "td-7 text-truncate",
              headerClassName: "td-7 text-truncate",
              filterBy: "endDate",
              useDateFormat: true,
            },
          ]}
                     leftControl={
                       () => (
                         <ul className="list-inline d-flex align-items-center">
                           <li className="">
                             <div className="list-group flex-row" id="list-tab"
                                  role="tablist">
                               {
                                 GlobalData.processStatus().map((item, index) => (
                                   <button
                                     key={index}
                                     type="button"
                                     style={{
                                       minWidth: 90,
                                       minHeight: 40,
                                       marginRight: 2,
                                     }}
                                     className={`btn btn-sm text-center border p-0 list-group-item list-group-item-action
                        ${item.value === statusFilter && 'btn-teal'}`}
                                     id={`list-dateFilter-${index}`} data-toggle="list"
                                     role="tab"
                                     onClick={() => {
                                       if (statusFilter !== item.value) setStatusFilter(item.value);
                                       else setStatusFilter(null);
                                     }}
                                   >
                                     {item.label} <span
                                     style={{color: item.value === statusFilter ? '' : 'red'}}>{`(${dataCount[index] || 0})`}</span>
                                   </button>
                                 ))
                               }
                             </div>
                           </li>
                         </ul>
                       )
                     }
          />
        }
        {/*<StatusSwitcher*/}
        {/*    show={showModalConfirm}*/}
        {/*    onClose={() => {*/}
        {/*        setShowModalConfirm(false);*/}
        {/*    }}*/}
        {/*    onConfirm={statusHandler}*/}
        {/*    reasonLabel={t('usersManagement.actionBlock.reason')}*/}
        {/*    targetLabel={t('usersManagement.title')}*/}
        {/*    blockLabel={t('usersManagement.actionBlock.lock')}*/}
        {/*    unBlockLabel={t('usersManagement.actionBlock.unlock')}*/}
        {/*    entity={selectedItemId}*/}
        {/*/>*/}
      </ContentWrapper>
    </>
  );
}

OrderList.propTypes = {
  provinces: PropTypes.array,
  processStatus: PropTypes.number,
  userId: PropTypes.number,
  isStaff: PropTypes.bool
};

OrderList.defaultProps = {
  provinces: [],
  isStaff: true
};

export default OrderList;
