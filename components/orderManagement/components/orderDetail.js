import SelectBox from "sharedComponents/selectBox";
import {ROUTES, SYSTEM_PERMISSIONS} from "constants/common";
import _, {isEmpty} from "lodash";
import {useRouter} from 'next/router';
import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {FormProvider, useForm, Controller} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useToasts} from 'react-toast-notifications';
import {UserApi} from "services/user";
import {FormControl, Response, Utility} from "utils/common";
import FormRules from "utils/formRules";
import moment from "moment";
import {InlineInput} from "sharedComponents/formControl";
import {SimpleInlineInput} from "sharedComponents/formControl/simpleInlineInput";
import DateTimeInput from "sharedComponents/dateTimeInput";
import HistoryPanel from "sharedComponents/historyPanel";
import SocketHelpers from "utils/socketHelpers";
import {useSocket} from "providers/socket";
import {confirmation} from "utils/helpers";
import Badge from "sharedComponents/blocks/badge";
import {useGate} from "providers/accessControl";
import StatusSwitcher from "../../statusSwitcher";
import filters from "utils/filters";
import InvalidFeedBack from "sharedComponents/formControl/invalidFeedback";
import More from "sharedComponents/more";
import {getUserProfile, storeUserProfile} from "utils/localStorage";
import {GlobalData} from "services/globalData";
import * as Banks from 'fixtures/banks.json';
import AddressInfo from "../../addressInfo";
import ChangeAddressModal from "../../addressInfo/modalChangeAddress";

function OrderDetail(props) {
  const {register, errors, handleSubmit, setError, formState, setValue, control, watch} = useForm();
  const {addToast} = useToasts();
  const {t} = useTranslation('common');
  const router = useRouter();
  const [isEdit] = useState(() => {
    return !(_.isEmpty(props.id));
  });
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const [detail, setDetail] = useState(props.detail || {});
  const [systemRoleId, setSystemRoleId] = useState(detail?.systemRoleId);
  const [showHistory, setShowHistory] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const {socketClient} = useSocket();
  const [allows] = useGate()
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const allowsToUpdate = allows(SYSTEM_PERMISSIONS.UPDATE_USER)
  const listBank = Banks.default;

  const onClose = () => {
    router.push(props.isDealer ? ROUTES.CRM_ORDER : ROUTES.ORDER);
  }
  //
  // useEffect(() => {
  //     props.companies.forEach(item => {
  //         if (!item.status) {
  //             item.isDisabled = true
  //         }
  //     })
  // }, [])

  console.log("propsDetail>>>>>", props)

  useEffect(() => {
    if (detail && detail.id) {
      const loggedUser = getUserProfile();
      if (loggedUser && loggedUser.id === detail.id) {
        storeUserProfile(detail);
      }
    }
  }, [detail])

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


  const save = async (data) => {
    const payload = {
      ...data,
      name: data.full_name,
      user_type_id: props.isDealer ? 2 : 3
    }
    const payloadEdit = {
      ...detail,
      ...data
    }

    console.log(data, payload, payloadEdit)
    try {
      await onSubmitUpdate(Utility.trimObjValues(payloadEdit))
    } catch (error) {
      addToast(Response.getErrorMessage(error), {appearance: 'error'});
    }
  }


  const onSubmitUpdate = async (data) => {
    const response = await UserApi.update(props.id, data);
    if (Response.isSuccessAPI(response)) {
      addToast(t('common.message.editSuccess'), {appearance: 'success'});
      setTimeout(() => {
        reGetDetail();
      }, 500)
      setReadOnly(true)
    } else {
      addToast(Response.getAPIError(response), {appearance: 'error'});
    }
  };

  const updateDetail = (responseData) => {
    if (responseData) {
      const mergedData = {
        ...detail,
        ...responseData
      }

      setDetail(mergedData);
    }
  }


  const reGetDetail = async () => {
    const response = await UserApi.findById(props.id);
    if (Response.isSuccessAPI(response)) {
      const responseData = Response.getAPIData(response);
      updateDetail(responseData);
    } else {
      addToast(Response.getAPIError(response), {appearance: 'error'});
    }
  }

  const requiredTextControl = (field) => {
    const validation = FormControl.getValidation(field, errors);
    const classNames = FormControl.getControlClassNames([
      'form-control',
      validation.className
    ]);
    const rules = {
      required: FormRules.required(),
    };

    return {
      classNames,
      rules,
      ...validation
    }
  };

  const phoneControl = () => {
    const validation = FormControl.getValidation('phone', errors);
    const classNames = FormControl.getControlClassNames([
      'form-control',
      validation.className
    ]);
    const rules = {
      required: FormRules.required(),
      minLength: FormRules.minLength(10),
    };

    return {
      classNames,
      rules,
      ...validation
    }
  }

  const emailControl = () => {
    const validation = FormControl.getValidation('email', errors);
    const classNames = FormControl.getControlClassNames([
      'form-control',
      validation.className
    ]);
    const rules = {
      // required: FormRules.required(),
      pattern: FormRules.isEmail()
    };
    return {
      classNames,
      rules,
      ...validation
    }
  };


  return (
    <div className="animated slideInRight">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-no-border mb-0 shadow-none max-height">
            <div className={'card-header card-header-main bg-light-primary' + (!isEdit ? '' : ' card-header-main-o')}>
              <h3 className="content-header-title mb-0">
                Thông tin đơn hàng
              </h3>
              {/*{*/}
              {/*  !isEdit ? '' : <>*/}
              {/*    <Badge {...statusMapping(detail?.status)} />*/}
              {/*  </>*/}
              {/*}*/}
              <div className="heading-elements">
                {
                  (isEdit) ?
                    <ul className="list-inline">

                    </ul>
                    :
                    <>
                      <button onClick={() => onClose()}
                              className="btn btn-outline-primary mr-50">
                        {t('common.button.cancel')}
                      </button>
                      {/*<button onClick={handleSubmit(save)}*/}
                      {/*        className="btn btn-primary"*/}
                      {/*>*/}
                      {/*  {!isEdit ? t('common.button.create') : t('common.button.save')}*/}
                      {/*</button>*/}
                    </>
                }
              </div>
            </div>
            <div className="slide-content">
              <div className="card-content card-scroll bg-grey">
                <FormProvider formState={formState} errors={errors} watch={watch} control={control}>
                  <form onSubmit={handleSubmit(save)}>
                    <div className="row">
                      <div className="col-4">
                        <div className="card-section box-shadow-1 bg-white">
                          <div className="card-body px-1">
                            <div className="form-row m-0">
                              <div className="col-6">
                                Mã đơn hàng - vận đơn:
                              </div>
                              <div className="col-6 red text-right font-weight-bold">
                                {detail?.code || ""}
                              </div>
                              <div className="col-6 mt-50">
                                Thời gian tạo:
                              </div>
                              <div className="col-6 mt-50 text-right">
                                {detail?.create_at ? filters.dateTime(detail?.create_at) : ""}
                              </div>
                              <div className="col-6 mt-50">
                                Trạng thái:
                              </div>
                              <div className="col-2">
                                {" "}
                              </div>
                              <div className="col-4 mt-50">
                                <Badge {...statusMapping(detail?.status_id)} />
                              </div>
                              {/*Gui*/}
                              <div className="nav col-12 my-1" style={{height: 4}}>
                                <div className="dropdown-divider m-0 w-100"></div>
                              </div>
                              <div className="col-12 red font-weight-bold">
                                Người gửi
                              </div>
                              <div className="col-12 mt-50 font-weight-bold">
                                {detail?.sender_name || ''} - {detail?.sender_phone || ''}
                              </div>
                              <div className="col-12 mt-50">
                                {`${detail?.sender_address || '_'} - ${detail?.sender_wards_name || '_'} - ${detail?.sender_district_name || '_'} - ${detail?.sender_province_name || '_'}`}
                              </div>
                              {/*Nhan*/}
                              <div className="nav col-12 my-1" style={{height: 4}}>
                                <div className="dropdown-divider m-0 w-100"></div>
                              </div>
                              <div className="col-12 red font-weight-bold">
                                Người nhận
                              </div>
                              <div className="col-12 mt-50 font-weight-bold">
                                {detail?.receiver_name || ''} - {detail?.receiver_phone || ''}
                              </div>
                              <div className="col-12 mt-50">
                                {`${detail?.receiver_address || '_'} - ${detail?.receiver_wards_name || '_'} - ${detail?.receiver_district_name || '_'} - ${detail?.receiver_province_name || '_'}`}
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="card-section box-shadow-1 bg-white">
                          <div className="card-body px-0">
                            <div className="form-row m-0">
                              123


                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="card-section box-shadow-1 bg-white">
                          <div className="card-body px-0">
                            <div className="form-row m-0">
                              456


                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

OrderDetail.propTypes = {
  id: PropTypes.string,
  readOnly: PropTypes.bool,
  postOffices: PropTypes.array,
  provinces: PropTypes.array,
  detail: PropTypes.object,
  isDealer: PropTypes.bool
};

OrderDetail.defaultProps = {
  readOnly: false,
  postOffices: [],
  provinces: [],
  isDealer: false
};

export default OrderDetail;
