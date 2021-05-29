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
import {RadioGroup, Radio} from "react-icheck";
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
import ICheckbox from "sharedComponents/iCheckbox";
import {useAddressInfoContext} from "providers/addressInfoProvider";
import AddressHelpers from "../../../helpers/addressHelpers";

function OrderForm(props) {
  const {register, errors, handleSubmit, setError, formState, setValue, control, watch, reset, clearErrors} = useForm();
  const {districts, setDistricts, wards, setWards} = useAddressInfoContext()
  const {addToast} = useToasts();
  const [loggedUser, setLoggedUser] = useState({});
  const {t} = useTranslation('common');
  const router = useRouter();
  const [isEdit] = useState(() => {
    return !(_.isEmpty(props.id));
  });
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const [detail, setDetail] = useState(props.detail || {});
  const [showHistory, setShowHistory] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const {socketClient} = useSocket();
  const [allows] = useGate()
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [userAddress, setUserAddress] = useState([]);
  const [userReceiver, setUserReceiver] = useState([]);
  const [userPackage, setUserPackage] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [receiver, setReceiver] = useState({});

  const onClose = () => {
    router.push(props.isDealer ? ROUTES.DEALER : ROUTES.EMPLOYEE);
  }

  useEffect(() => {
    setLoggedUser(getUserProfile() || {})

    async function getAddress() {
      const userAddressResponse = await UserApi.getListUserAddress(loggedUser?.id);
      const _userAddress = Response.getAPIData(userAddressResponse) || [];
      setUserAddress(_userAddress)
      if (!isEmpty(_userAddress)) {
        setValue('sender', _userAddress?.find(i => i.is_default)?.id || null)
      }
    }

    async function getReceiver() {
      const userReceiverResponse = await UserApi.getListUserReceiver(loggedUser?.id);
      const _userReceiver = Response.getAPIData(userReceiverResponse) || [];
      setUserReceiver(_userReceiver)
    }

    async function getPackage() {
      const userPackageResponse = await UserApi.getListUserPackage(loggedUser?.id);
      const _userPackage = Response.getAPIData(userPackageResponse) || [];
      setUserPackage(_userPackage)
    }

    if (loggedUser.id) {
      getAddress();
      getReceiver();
      getPackage();
    }
  }, [loggedUser.id])

  useEffect(() => {
    async function fillAddress() {
      if (receiver.province_id) {
        const data1 = await AddressHelpers.getDistricts(receiver.province_id)
        setDistricts(data1 || [])
        setValue('receiver_district', receiver.district_id)
      }
      if (receiver.district_id) {
        const data2 = await AddressHelpers.getWards(receiver.district_id)
        setWards(data2 || [])
        setValue('receiver_wards', receiver.wards_id)
      }
    }

    fillAddress()
  }, [receiver])

  const statusMapping = (status) => {
    const mapping = {
      1: {
        label: t('status.active'),
        bg: 'success',
      },
      2: {
        label: t('status.waitActive'),
        bg: 'warning',
      },
      0: {
        label: t('status.block'),
        bg: 'danger',
      }
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

    console.log(payload)
    try {
      isEdit ? await onSubmitUpdate(Utility.trimObjValues(payloadEdit)) : await onSubmitCreate(Utility.trimObjValues(payload));
    } catch (error) {
      addToast(Response.getErrorMessage(error), {appearance: 'error'});
    }
  }

  const onSubmitCreate = async (data) => {
    const payload = {
      ...data,
    };
    const response = await UserApi.create(payload);
    if (Response.isSuccessAPI(response)) {
      onClose();
    } else {
      addToast(Response.getAPIError(response), {appearance: 'error'});
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

  const requiredSelectBoxControl = (field) => {
    const validation = FormControl.getValidation(field, errors);
    const classNames = validation.className
    const rules = {
      required: FormRules.required(),
    };

    return {
      classNames,
      rules,
      ...validation
    }
  };

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

  const statusHandler = async (payload, entity) => {
    try {
      const response = await UserApi.updateStatus(entity?.id, payload);
      if (Response.isSuccessAPI(response)) {
        const message = entity?.status ? t('common.message.requestBlockSuccess') : t('common.message.unblockSuccess')
        addToast(message, {appearance: 'success'})
        setShowModalConfirm(false)
        SocketHelpers.fastSubscribe(`/topic/user-updated-status/${entity?.id}`, () => {
          updateDetail({status: payload.status})
        }, socketClient);
      } else {
        addToast(Response.getAPIError(response), {appearance: 'error'});
      }
    } catch (error) {
      addToast(Response.getErrorMessage(error), {appearance: 'error'});
    }
  };

  const historyOptions = () => {
    const getData = async (params) => {
      try {
        const response = await UserApi.getHistory(detail?.id, params);
        if (Response.isSuccessAPI(response)) {
          return response;
        } else {
          addToast(t('common.message.getHistoryErr'), {appearance: 'error'});
        }
      } catch (error) {
        addToast(Response.getErrorMessage(error), {appearance: 'error'});
      }
    };

    return {
      getData,
      setShowHistory,
      target: t('usersManagement.target'),
      customTranslation: {
        blocked: t('history.userBlocked'),
        unblocked: t('history.userUnblocked'),
      }
    }
  }


  return (
    <div className="animated slideInRight">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-no-border mb-0 shadow-none max-height">
            <div className={'card-header card-header-main bg-light-primary' + (!isEdit ? '' : ' card-header-main-o')}>
              <h3 className="content-header-title mb-0">
                {
                  !isEdit ? 'Tạo đơn hàng' : <>
                    {detail?.full_name}
                  </>
                }
              </h3>
              {
                !isEdit ? '' : <>
                  <Badge {...statusMapping(detail?.status)} />
                </>
              }
              <div className="heading-elements">
                {
                  (isEdit) ?
                    <ul className="list-inline">
                      <li className="pl-1">
                        <label onClick={() => setShowHistory(true)} id="menu-toggle-sm"
                               className="opacity-normal">
                          <a title={t('history.editingHistoryTitle')}
                             className={'avatar btn-avatar' + (showHistory ? ' active' : '')}>
                            <i className="fal fa-history"/>
                          </a>
                        </label>
                      </li>
                    </ul>
                    :
                    <>
                      <button onClick={() => {
                        setReceiver({});
                        reset()
                      }}
                              className="btn btn-outline-warning mr-50">
                        Xóa dữ liệu
                      </button>
                      <button onClick={handleSubmit(save)}
                              className="btn btn-outline-primary mr-50"
                      >
                        {!isEdit ? 'Lưu nháp' : t('common.button.save')}
                      </button>
                      <button onClick={handleSubmit(save)}
                              className="btn btn-primary"
                      >
                        {!isEdit ? t('common.button.createNew') : t('common.button.save')}
                      </button>
                    </>
                }
              </div>
            </div>
            {
              isEdit &&
              <div className={'slide-menu slide-menu-sm border-left' + (showHistory ? ' open' : '')}>
                {showHistory && <HistoryPanel {...historyOptions()} />}
              </div>
            }
            <div className="slide-content">
              <div className="card-content card-scroll">
                <FormProvider formState={formState} errors={errors} watch={watch} control={control}>
                  <form onSubmit={handleSubmit(save)}>
                    <div className="row">
                      <div className="col-12">
                        <div className="card card-section">
                          <div className="card-body p-0">
                            <div className="form-row py-1">
                              <ul className="list-inline d-flex align-items-center">
                                <li className="pr-2">
                                  <label className="font-medium-1">
                                    Tổng cước phí giao:
                                  </label>{" "}
                                  <span style={{color: "green"}}>
                                    0
                                  </span>
                                </li>
                                <li className="px-2">
                                  <label className="font-medium-1">
                                    Tồng phí thu hộ:
                                  </label>{" "}
                                  <span style={{color: "blue"}}>
                                    0
                                  </span>
                                </li>
                                <li className="px-2">
                                  <label className="font-medium-1">
                                    Tiền trả người gửi:
                                  </label>{" "}
                                  <span style={{color: "darkorange"}}>
                                    0
                                  </span>
                                </li>
                                <li className="px-2">
                                  <label className="font-medium-1">
                                    Thời gian dự kiến:
                                  </label>{" "}
                                  <span style={{color: "brown"}}>
                                    0
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        {/*Người gửi*/}
                        <div className="card card-section">
                          <div className="card-header">
                            <div
                              className="form-section d-flex align-items-center justify-content-between">
                              <h5 className="mb-0">Người gửi</h5>
                            </div>
                          </div>
                          <div className="card-body px-0">
                            <div className="form-row">
                              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                                <fieldset className="form-group form-group-sm required">
                                  <label>
                                    Địa chỉ lấy hàng
                                  </label>
                                  <article>
                                    <div
                                      className={`position-relative has-icon-right ${requiredSelectBoxControl('sender').classNames}`}>
                                      <Controller
                                        render={(ctrl) => (
                                          <SelectBox
                                            placeholder="Chọn địa chỉ người gửi"
                                            onChange={(e) => {
                                              ctrl.onChange(e)
                                            }}
                                            value={ctrl.value}
                                            options={userAddress}
                                            optionValue="id"
                                            getOptionLabel={option => `${option.name} - ${option.address}, ${option.ward}, ${option.district}, ${option.province} - ${option.phone}`}
                                            error={requiredSelectBoxControl('sender').isError}
                                            errMess={requiredSelectBoxControl('sender').errorMessage}
                                          />
                                        )}
                                        name="sender"
                                        control={control}
                                        defaultValue={null}
                                        rules={requiredSelectBoxControl('sender')}
                                      />
                                      <InvalidFeedBack
                                        message={requiredSelectBoxControl('sender').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                              <div className="col-3 d-flex">
                                {/*Gấp*/}
                                <fieldset className="form-group form-group-sm d-flex">
                                  <article style={{alignSelf: "flex-end"}}>
                                    <Controller
                                      render={(ctrl) => (
                                        <ICheckbox
                                          checked={ctrl.value}
                                          onChange={(e) => {
                                            ctrl.onChange(!e.target.checked);
                                          }}
                                        />
                                      )}
                                      name="is_send_post_office"
                                      control={control}
                                      defaultValue={false}
                                    />
                                    <span className="ml-1">
                                      Gửi tại bưu cục
                                    </span>
                                  </article>
                                </fieldset>
                              </div>
                              {watch('is_send_post_office') === true &&
                              <div className="col-xl-9 col-lg-9 col-md-9 col-9">
                                <fieldset className="form-group form-group-sm required">
                                  <label>
                                    Bưu cục
                                  </label>
                                  <article>
                                    <div
                                      className={`position-relative has-icon-right ${requiredSelectBoxControl('post_office_send_id').classNames}`}>
                                      <Controller
                                        render={(ctrl) => (
                                          <SelectBox
                                            placeholder="Chọn bưu cục gửi"
                                            onChange={(e) => {
                                              ctrl.onChange(e)
                                            }}
                                            value={ctrl.value}
                                            options={props.postOffices}
                                            optionValue="id"
                                            getOptionLabel={option => `${option.name} - ${option.address}, ${option.ward}, ${option.district}, ${option.province} - ${option.phone}`}
                                            error={requiredSelectBoxControl('post_office_send_id').isError}
                                            errMess={requiredSelectBoxControl('post_office_send_id').errorMessage}
                                          />
                                        )}
                                        name="post_office_send_id"
                                        control={control}
                                        defaultValue={null}
                                        rules={requiredSelectBoxControl('post_office_send_id')}
                                      />
                                      <InvalidFeedBack
                                        message={requiredSelectBoxControl('post_office_send_id').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>}

                            </div>
                          </div>
                        </div>
                        {/*Người nhận*/}
                        <div className="card card-section">
                          <div className="card-header">
                            <div
                              className="form-section d-flex align-items-center">
                              <h5
                                className='mb-0'>Người nhận</h5>
                            </div>
                          </div>
                          <div className="card-body px-0">
                            <div className="row">
                              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                                <fieldset className="form-group form-group-sm">
                                  <label>
                                    Chọn để tự động điền người nhận quen
                                  </label>
                                  <article>
                                    <div className="position-relative has-icon-right">
                                      <Controller
                                        render={(ctrl) => (
                                          <SelectBox
                                            placeholder="Chọn người nhận quen"
                                            onChange={(val) => {
                                              ctrl.onChange(val)
                                              const receiver = userReceiver.find(i => i.id === val);
                                              if (receiver) {
                                                setValue('receiver_phone', receiver.phone)
                                                clearErrors('receiver_phone')
                                                setValue('receiver_name', receiver.name)
                                                clearErrors('receiver_name')
                                                setValue('receiver_address', receiver.address)
                                                clearErrors('receiver_address')
                                                setValue('receiver_province', receiver.province_id)
                                                clearErrors('receiver_province')
                                                setValue('receiver_district', receiver.district_id)
                                                clearErrors('receiver_district')
                                                setValue('receiver_wards', receiver.wards_id)
                                                clearErrors('receiver_wards')
                                                setReceiver(receiver);
                                              }
                                            }}
                                            value={ctrl.value}
                                            options={userReceiver}
                                            optionValue="id"
                                            getOptionLabel={option => `${option.name} - ${option.address}, ${option.ward}, ${option.district}, ${option.province} - ${option.phone}`}
                                          />
                                        )}
                                        name="receiver"
                                        control={control}
                                        defaultValue={null}
                                      />
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                              <div className="col-12">
                                <fieldset className="form-group form-group-sm required">
                                  <label>
                                    Số điện thoại
                                  </label>
                                  <article>
                                    <div className="position-relative has-icon-right">
                                      <input className={requiredTextControl('receiver_phone').classNames}
                                             placeholder='Số điện thoại'
                                             name="receiver_phone"
                                             type="number"
                                             ref={register(requiredTextControl('receiver_phone').rules)}
                                      />
                                      <InvalidFeedBack
                                        message={requiredTextControl('receiver_phone').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                              <div className="col-12">
                                <fieldset className="form-group form-group-sm required">
                                  <label>
                                    Tên người nhận
                                  </label>
                                  <article>
                                    <div className="position-relative has-icon-right">
                                      <input className={requiredTextControl('receiver_name').classNames}
                                             placeholder='Tên người nhận'
                                             name="receiver_name"
                                             ref={register(requiredTextControl('receiver_name').rules)}
                                      />
                                      <InvalidFeedBack
                                        message={requiredTextControl('receiver_name').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="col-4">
                                <fieldset
                                  className={`form-group form-group-sm required`}>
                                  <label>
                                    Tỉnh/Thành phố
                                  </label>
                                  <article>
                                    <div
                                      className={`position-relative has-icon-right ${FormControl.getValidation('receiver_province', errors).className}`}>
                                      <Controller
                                        render={(ctrl) => (
                                          <SelectBox
                                            placeholder="Chọn Tỉnh/Thành phố"
                                            onChange={async (e) => {
                                              ctrl.onChange(e)
                                              const data = await AddressHelpers.getDistricts(e)
                                              setDistricts(data || [])
                                            }}
                                            value={ctrl.value}
                                            options={props.provinces}
                                            optionValue="id"
                                            optionLabel="name"
                                            errMess={FormControl.getValidation('receiver_province', errors).errorMessage}
                                            error={FormControl.getValidation('receiver_province', errors).isError}
                                          />
                                        )}
                                        name="receiver_province"
                                        control={control}
                                        defaultValue={null}
                                        rules={{
                                          required: FormRules.required()
                                        }}
                                      />
                                      <InvalidFeedBack
                                        message={requiredSelectBoxControl('receiver_province').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                              <div className="col-4">
                                <fieldset
                                  className={`form-group form-group-sm required`}>
                                  <label>
                                    Quận/Huyện
                                  </label>
                                  <article>
                                    <div
                                      className={`position-relative has-icon-right ${requiredSelectBoxControl('receiver_district').classNames}`}>
                                      <Controller
                                        render={(ctrl) => (
                                          <SelectBox
                                            placeholder={"Chọn Quận/Huyện"}
                                            onChange={async (e) => {
                                              ctrl.onChange(e)
                                              setWards(await AddressHelpers.getWards(e))
                                            }}
                                            options={districts}
                                            optionValue="id"
                                            optionLabel="name"
                                            value={ctrl.value}
                                            errMess={requiredSelectBoxControl('receiver_district').errorMessage}
                                            error={requiredSelectBoxControl('receiver_district').isError}
                                          />
                                        )}
                                        name="receiver_district"
                                        key={"receiver_district"}
                                        control={control}
                                        defaultValue={null}
                                        rules={requiredSelectBoxControl('receiver_district').rules}
                                      />
                                      <InvalidFeedBack
                                        message={requiredSelectBoxControl('receiver_district').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                              <div className="col-4">
                                <fieldset
                                  className={`form-group form-group-sm required`}>
                                  <label>
                                    Phường/Xã
                                  </label>
                                  <article>
                                    <div
                                      className={`position-relative has-icon-right ${requiredSelectBoxControl('receiver_wards').classNames}`}>
                                      <Controller
                                        render={(ctrl) => (
                                          <SelectBox
                                            placeholder="Chọn Phường/Xã"
                                            // defaultLabel={}
                                            onChange={ctrl.onChange}
                                            value={ctrl.value}
                                            options={wards}
                                            optionValue="id"
                                            optionLabel="name"
                                            errMess={requiredSelectBoxControl('receiver_wards').errorMessage}
                                            error={requiredSelectBoxControl('receiver_wards').isError}
                                          />
                                        )}
                                        name="receiver_wards"
                                        control={control}
                                        defaultValue={null}
                                        key={"receiver_wards"}
                                        rules={requiredSelectBoxControl('receiver_wards').rules}
                                      />
                                      <InvalidFeedBack
                                        message={requiredSelectBoxControl('receiver_wards').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                                <fieldset className="form-group form-group-sm required">
                                  <label>
                                    {t('agencyManagement.actionEdit.address')}
                                  </label>
                                  <article>
                                    <div className="position-relative has-icon-right">
                                        <textarea className={requiredTextControl('receiver_address').classNames}
                                                  placeholder={t('agencyManagement.actionEdit.placeholderAddress')}
                                                  name="receiver_address"
                                                  rows={1}
                                                  ref={register(requiredTextControl('receiver_address').rules)}
                                        />
                                      <InvalidFeedBack
                                        message={requiredTextControl('receiver_address').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>

                              <div className="col-4 d-flex">
                                {/*Nhận tại bưu cục*/}
                                <fieldset className="form-group form-group-sm d-flex">
                                  <article style={{alignSelf: "flex-end"}}>
                                    <Controller
                                      render={(ctrl) => (
                                        <ICheckbox
                                          checked={ctrl.value}
                                          onChange={(e) => {
                                            ctrl.onChange(!e.target.checked);
                                          }}
                                        />
                                      )}
                                      name="is_receive_post_office"
                                      control={control}
                                      defaultValue={false}
                                    />
                                    <span className="ml-1">
                                      Nhận tại bưu cục (tiết kiệm)
                                    </span>
                                  </article>
                                </fieldset>
                              </div>
                              {watch('is_receive_post_office') === true &&
                              <div className="col-8">
                                <fieldset className="form-group form-group-sm required">
                                  <label>
                                    Bưu cục
                                  </label>
                                  <article>
                                    <div
                                      className={`position-relative has-icon-right ${requiredSelectBoxControl('post_office_send_id').classNames}`}>
                                      <Controller
                                        render={(ctrl) => (
                                          <SelectBox
                                            placeholder="Chọn bưu cục nhận"
                                            onChange={(e) => {
                                              ctrl.onChange(e)
                                            }}
                                            value={ctrl.value}
                                            options={props.postOffices}
                                            optionValue="id"
                                            getOptionLabel={option => `${option.name} - ${option.address}, ${option.ward}, ${option.district}, ${option.province} - ${option.phone}`}
                                            error={requiredSelectBoxControl('post_office_receiver_id').isError}
                                            errMess={requiredSelectBoxControl('post_office_receiver_id').errorMessage}
                                          />
                                        )}
                                        name="post_office_receiver_id"
                                        control={control}
                                        defaultValue={null}
                                        rules={requiredSelectBoxControl('post_office_receiver_id')}
                                      />
                                      <InvalidFeedBack
                                        message={requiredSelectBoxControl('post_office_receiver_id').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>}
                            </div>
                            <div className="pt-50">
                              {
                                isEdit && <a onClick={() => {
                                  setShowModalAdd(true)
                                }}
                                             type="button" className={`has-addon`}
                                             title={t('agencyManagement.actionEdit.editAddress')}>
                                  <i className="fal fa-pen"/><span>{t('agencyManagement.actionEdit.editAddress')}</span>
                                </a>
                              }
                            </div>


                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        {/*GÓi hàng*/}
                        <div className="card card-section">
                          <div className="card-header">
                            <div
                              className="form-section d-flex align-items-center justify-content-between">
                              <h5 className="mb-0">Gói hàng</h5>
                            </div>
                          </div>
                          <div className="card-body px-0">
                            <div className="form-row">
                              <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                                <fieldset className="form-group form-group-sm">
                                  <label>
                                    Chọn gói hàng đã lưu
                                  </label>
                                  <article>
                                    <div className="position-relative has-icon-right">
                                      <Controller
                                        render={(ctrl) => (
                                          <SelectBox
                                            placeholder="Chọn gói hàng đã lưu"
                                            onChange={(val) => {
                                              ctrl.onChange(val)
                                              const _package = userPackage.find(i => i.id === val);
                                              if (receiver) {
                                                setValue('package_name', _package.name)
                                                clearErrors('package_name')
                                                setValue('package_weight', _package.weight)
                                                clearErrors('package_weight')
                                                setValue('package_price', _package.price)
                                                clearErrors('package_price')
                                                setValue('collection_money', _package.price)
                                                clearErrors('collection_money')
                                                setValue('package_quantity', 1)
                                                clearErrors('package_quantity')
                                              }
                                            }}
                                            value={ctrl.value}
                                            options={userPackage}
                                            optionValue="id"
                                            getOptionLabel={option => `${option.name} - ${option.price}, ${option.weight}`}
                                          />
                                        )}
                                        name="receiver"
                                        control={control}
                                        defaultValue={null}
                                      />
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                              {/* Tên hàng */}
                              <div className="col-12">
                                <fieldset className="form-group form-group-sm required">
                                  <label>
                                    Tên hàng
                                  </label>
                                  <article>
                                    <div className="position-relative has-icon-right">
                                      <input className={requiredTextControl('package_name').classNames}
                                             placeholder='Tên hàng'
                                             name="package_name"
                                             ref={register(requiredTextControl('package_name').rules)}
                                      />
                                      <InvalidFeedBack
                                        message={requiredTextControl('package_name').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                              <div className="col-3">
                                <fieldset className="form-group form-group-sm required">
                                  <label>
                                    Số lượng
                                  </label>
                                  <article>
                                    <div className="position-relative has-icon-right">
                                      <input className={requiredTextControl('package_quantity').classNames}
                                             placeholder='Số lượng'
                                             name="package_quantity"
                                             type="number"
                                             onChange={(e) => {
                                               setValue('collection_money', watch('package_price') * e.target.value)
                                             }}
                                             ref={register(requiredTextControl('package_quantity').rules)}
                                      />
                                      <InvalidFeedBack
                                        message={requiredTextControl('package_quantity').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                              <div className="col-4">
                                <fieldset className="form-group form-group-sm required">
                                  <label>
                                    Trọng lượng (gram)
                                  </label>
                                  <article>
                                    <div className="position-relative has-icon-right">
                                      <input className={requiredTextControl('package_weight').classNames}
                                             placeholder='Trọng lượng (gram)'
                                             name="package_weight"
                                             ref={register(requiredTextControl('package_weight').rules)}
                                      />
                                      <InvalidFeedBack
                                        message={requiredTextControl('package_weight').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                              <div className="col-5">
                                <fieldset className="form-group form-group-sm required">
                                  <label>
                                    Giá trị gói (Vnd)
                                  </label>
                                  <article>
                                    <div className="position-relative has-icon-right">
                                      <input className={requiredTextControl('package_price').classNames}
                                             placeholder='Giá trị (Vnd)'
                                             name="package_price"
                                             ref={register(requiredTextControl('package_price').rules)}
                                      />
                                      <InvalidFeedBack
                                        message={requiredTextControl('package_price').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="card card-section">
                          <div className="card-header">
                            <div
                              className="form-section d-flex align-items-center">
                              <h5
                                className='mb-0'>Tùy chọn</h5>
                            </div>
                          </div>
                          <div className="card-body px-0">
                            <div className="form-row">
                              <div className="col-4">
                                <fieldset className="form-group form-group-sm required">
                                  <label>
                                    Thu hộ (Vnd)
                                  </label>
                                  <article>
                                    <div className="position-relative has-icon-right">
                                      <input className={requiredTextControl('collection_money').classNames}
                                             placeholder='Thu hộ (Vnd)'
                                             name="collection_money"
                                             type="number"
                                             ref={register(requiredTextControl('collection_money').rules)}
                                      />
                                      <InvalidFeedBack
                                        message={requiredTextControl('collection_money').errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>

                              <div className="col-4">
                                <fieldset className="form-group form-group-sm">
                                  <label>
                                    Hình thức vận chuyển
                                  </label>
                                  <article>
                                    <div className="position-relative d-block py-1 has-icon-right">
                                      <Controller
                                        render={(ctrl) => (
                                          <RadioGroup
                                            onChange={ctrl.onChange}
                                            value={ctrl.value}
                                            className="d-flex"
                                            name="type"
                                          >
                                            <Radio
                                              cursor="pointer"
                                              labelClassName="d-flex"
                                              value={1}
                                              radioClass="iradio_square-blue"
                                              label='Đường bộ'
                                            />
                                            <Radio
                                              cursor="pointer"
                                              labelClassName="d-flex"
                                              value={2}
                                              radioClass="iradio_square-blue"
                                              label="Đường bay"
                                            />
                                          </RadioGroup>
                                        )}
                                        name="type"
                                        control={control}
                                        defaultValue={1}
                                      />
                                    </div>
                                  </article>
                                </fieldset>
                              </div>

                              <div className="col-4">
                                <fieldset className="form-group form-group-sm">
                                  <label>
                                    Trả cước phí
                                  </label>
                                  <article>
                                    <div className="position-relative d-block py-1 has-icon-right">
                                      <Controller
                                        render={(ctrl) => (
                                          <RadioGroup
                                            onChange={ctrl.onChange}
                                            value={ctrl.value}
                                            className="d-flex"
                                            name="is_sender_pay_charge"
                                          >
                                            <Radio
                                              cursor="pointer"
                                              labelClassName="d-flex"
                                              value={true}
                                              radioClass="iradio_square-blue"
                                              label='Người gửi'
                                            />
                                            <Radio
                                              cursor="pointer"
                                              labelClassName="d-flex"
                                              value={false}
                                              radioClass="iradio_square-blue"
                                              label="Người nhận"
                                            />
                                          </RadioGroup>
                                        )}
                                        name="is_sender_pay_charge"
                                        control={control}
                                        defaultValue={true}
                                      />
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                    <ChangeAddressModal
                      isRequired={true}
                      title={t('agencyManagement.actionEdit.editAddress')}
                      show={showModalAdd}
                      onClose={() => {
                        setShowModalAdd(false);
                      }}
                      detail={props.detail}
                      provinces={props.provinces}
                      onSave={(obj = {}) => {
                        save({
                          ...detail,
                          province_id: obj.province_id,
                          district_id: obj.district_id,
                          wards_id: obj.wards_id,
                        });
                        setShowModalAdd(false);
                      }}
                    />
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>
      </div>

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
      {/*    entity={selectedItem}*/}
      {/*/>*/}

    </div>
  )
}

OrderForm.propTypes = {
  id: PropTypes.string,
  readOnly: PropTypes.bool,
  postOffices: PropTypes.array,
  roles: PropTypes.array,
  provinces: PropTypes.array,
  detail: PropTypes.object,
  isDealer: PropTypes.bool
};

OrderForm.defaultProps = {
  readOnly: false,
  postOffices: [],
  roles: [],
  provinces: [],
  isDealer: false
};

export default OrderForm;
