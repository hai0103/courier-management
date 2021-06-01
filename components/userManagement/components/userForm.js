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

function UserForm(props) {
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
    router.push(props.isDealer ? ROUTES.DEALER : ROUTES.EMPLOYEE);
  }
  //
  // useEffect(() => {
  //     props.companies.forEach(item => {
  //         if (!item.status) {
  //             item.isDisabled = true
  //         }
  //     })
  // }, [])

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
    addToast(t('common.message.createSuccess'), {appearance: 'success'});
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

  const blockUserComponent = () => {
    return <>
      {
        detail?.status !== "2" &&
        (detail?.status ? <li className="border-separate">
            <button title="Khoá" className="avatar btn-avatar"
                    onClick={() => {
                      setSelectedItem(detail);
                      setShowModalConfirm(true)
                    }}
                    type="button"

            >
              <i className="fal fa-lock"/>
            </button>
          </li> :
          <li className="border-separate">
            <button title="Mở khoá" className="avatar btn-avatar"
                    onClick={() => {
                      setSelectedItem(detail);
                      setShowModalConfirm(true)
                    }}
                    type="button"
            >
              <i className="fal fa-unlock"/>
            </button>
          </li>)
      }
    </>
  }

  return (
    <div className="animated slideInRight">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-no-border mb-0 shadow-none max-height">
            <div className={'card-header card-header-main bg-light-primary' + (!isEdit ? '' : ' card-header-main-o')}>
              <h3 className="content-header-title mb-0">
                {
                  !isEdit ? (props.isDealer ? 'Tạo khách hàng - người gửi' : 'Tạo nhân viên') : <>
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
                      {
                        detail.status === "2" && <li className="border-separate">
                          <button className="avatar btn-avatar"
                                  title={t('usersManagement.actionResendActive.title')}
                                  onClick={() => resendActiveUser(detail.id)}
                                  type='button'
                          >
                            <i className="fal fa-sync-alt"/>
                          </button>
                        </li>
                      }
                      {
                        blockUserComponent()
                      }
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
                      <button onClick={() => onClose()}
                              className="btn btn-outline-primary mr-50">
                        {t('common.button.cancel')}
                      </button>
                      <button onClick={handleSubmit(save)}
                              className="btn btn-primary"
                      >
                        {!isEdit ? t('common.button.create') : t('common.button.save')}
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
                    <div className="card card-section">
                      <div className="card-header">
                        <div
                          className="form-section d-flex align-items-center justify-content-between">
                          <h5 className="mb-0">Thông tin chung</h5>
                        </div>
                      </div>
                      <div className="card-body px-0">
                        <div className="form-row">
                          {/*            /!* Tên đăng nhập *!/*/}
                          {/*            <div className="col-xl-3 col-lg-4 col-md-6 col-6">*/}
                          {/*                <fieldset className="form-group form-group-sm">*/}
                          {/*                    <label>*/}
                          {/*                        {t('createUser.loginName')} <sup*/}
                          {/*                        className="text-danger">*</sup>*/}
                          {/*                    </label>*/}
                          {/*                    <article>*/}
                          {/*                        <div className="position-relative has-icon-right">*/}
                          {/*                            {*/}
                          {/*                                isEdit ? <InlineInput*/}
                          {/*                                        className={loginNameControl().classNames}*/}
                          {/*                                        defaultValue={detail?.userName}*/}
                          {/*                                        disabled={true}*/}
                          {/*                                    /> :*/}
                          {/*                                    <input id="inputLoginName"*/}
                          {/*                                           className={loginNameControl().classNames}*/}
                          {/*                                           placeholder={t('createUser.loginNamePlaceHolder')}*/}
                          {/*                                           name="userName"*/}
                          {/*                                           ref={register(loginNameControl().rules)}*/}
                          {/*                                           readOnly={readOnly || isEdit}*/}
                          {/*                                           defaultValue={detail?.userName}*/}
                          {/*                                    />*/}
                          {/*                            }*/}
                          {/*                            <InvalidFeedBack*/}
                          {/*                                message={loginNameControl().errorMessage}/>*/}
                          {/*                        </div>*/}
                          {/*                    </article>*/}
                          {/*                </fieldset>*/}
                          {/*            </div>*/}
                          {/* Họ và tên */}
                          <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm required">
                              <label>
                                {t('createUser.fullName')}
                              </label>
                              <article>
                                <div className="position-relative has-icon-right">
                                  {isEdit ?
                                    <InlineInput id="inputName"
                                                 className={requiredTextControl('full_name').classNames}
                                                 type="text"
                                                 defaultValue={detail?.full_name}
                                                 placeholder={t('createUser.fullNamePlaceHolder')}
                                                 name="full_name"
                                                 register={register(requiredTextControl('full_name').rules)}
                                                 handleSubmit={handleSubmit(save)}
                                    />
                                    :
                                    <input id="inputName"
                                           className={requiredTextControl('full_name').classNames}
                                           placeholder={t('createUser.fullNamePlaceHolder')}
                                           name="full_name"
                                           ref={register(requiredTextControl('full_name').rules)}
                                    />}
                                  <InvalidFeedBack
                                    message={requiredTextControl('full_name').errorMessage}/>
                                </div>
                              </article>
                            </fieldset>
                          </div>
                          {/* CMND */}
                          <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm required">
                              <label>
                                Số CMND/CCCD
                              </label>
                              <article>
                                <div className="position-relative has-icon-right">
                                  {isEdit ?
                                    <InlineInput className={requiredTextControl('identity_code').classNames}
                                                 type="number"
                                                 defaultValue={detail?.identity_code}
                                                 placeholder={t('createUser.fullNamePlaceHolder')}
                                                 name="full_name"
                                                 register={register(requiredTextControl('identity_code').rules)}
                                                 handleSubmit={handleSubmit(save)}
                                    />
                                    :
                                    <input type="number"
                                           className={requiredTextControl('identity_code').classNames}
                                           placeholder="Nhập số CMND/CCCD"
                                           name="identity_code"
                                           ref={register(requiredTextControl('identity_code').rules)}
                                    />}
                                  <InvalidFeedBack
                                    message={requiredTextControl('identity_code').errorMessage}/>
                                </div>
                              </article>
                            </fieldset>
                          </div>
                          {/* Điện thoại */}
                          <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm required">
                              <label>
                                {t('createUser.phone')}
                              </label>
                              <article>
                                <div className="position-relative has-icon-right">
                                  {(readOnly && isEdit) ?
                                    <InlineInput defaultValue={detail?.phone}
                                                 className={phoneControl().classNames}
                                                 placeholder={t('createUser.phonePlaceHolder')}
                                                 name="phone"
                                                 register={register(phoneControl().rules)}
                                                 handleSubmit={handleSubmit(save)}
                                    />
                                    :
                                    <input type="number"
                                           className={phoneControl().classNames}
                                           placeholder={t('createUser.phonePlaceHolder')}
                                           name="phone"
                                           ref={register(phoneControl().rules)}
                                    />}
                                  <InvalidFeedBack
                                    message={phoneControl().errorMessage}/>
                                </div>
                              </article>
                            </fieldset>
                          </div>
                          {/* Email */}
                          <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm">
                              <label>
                                {t('createUser.email')}
                              </label>
                              <article>
                                <div className="position-relative has-icon-right">
                                  {
                                    (isEdit) ?
                                      <InlineInput defaultValue={detail?.email}
                                                   className={emailControl().classNames}
                                                   placeholder={t('createUser.emailPlaceHolder')}
                                                   name="email"
                                                   register={register(emailControl().rules)}
                                                   handleSubmit={handleSubmit(save)}
                                                   inlineClassName="text-lowercase"
                                      /> :
                                      <input type="email" id="email"
                                             className={emailControl().classNames}
                                             placeholder={t('createUser.emailPlaceHolder')}
                                             name="email"
                                             ref={register(emailControl().rules)}
                                      />
                                  }
                                  <InvalidFeedBack
                                    message={emailControl().errorMessage}/>
                                </div>
                              </article>
                            </fieldset>
                          </div>
                          {/*<div className="col-xl-3 col-lg-4 col-md-6 col-6">*/}
                          {/*  <fieldset className="form-group form-group-sm">*/}
                          {/*    <label>*/}
                          {/*      {t('agencyManagement.actionEdit.gender')}*/}
                          {/*    </label>*/}
                          {/*    <article>*/}
                          {/*      <div*/}
                          {/*        className={`position-relative has-icon-right`}>*/}
                          {/*        {*/}
                          {/*          isEdit ? <InlineInput*/}
                          {/*              defaultValue={props.detail?.gender}*/}
                          {/*              type="select"*/}
                          {/*              options={GlobalData.gender()}*/}
                          {/*              optionValue="value"*/}
                          {/*              optionLabel="label"*/}
                          {/*              handleSubmit={handleSubmit(save)}*/}
                          {/*              register={register({name: 'gender', value: props.detail?.gender})}*/}
                          {/*              onChange={(e) => setValue('gender', e)}*/}
                          {/*            /> :*/}
                          {/*            <Controller*/}
                          {/*              render={(ctrl) => (*/}
                          {/*                <SelectBox*/}
                          {/*                  placeholder={t('agencyManagement.actionEdit.placeholderGender')}*/}
                          {/*                  options={GlobalData.gender()}*/}
                          {/*                  onChange={ctrl.onChange}*/}
                          {/*                  value={ctrl.value}*/}
                          {/*                />*/}
                          {/*              )}*/}
                          {/*              name="gender"*/}
                          {/*              control={control}*/}
                          {/*              defaultValue={null}*/}
                          {/*            />*/}
                          {/*        }*/}
                          {/*      </div>*/}
                          {/*    </article>*/}
                          {/*  </fieldset>*/}
                          {/*</div>*/}
                          <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm">
                              <label>
                                {t('agencyManagement.actionEdit.dateOfBirth')}
                              </label>
                              <article>
                                <div className="position-relative has-icon-right">
                                  {
                                    isEdit ? <InlineInput
                                        className="form-control"
                                        defaultValue={detail?.birth_date ? moment(detail?.birth_date).toDate() : null}
                                        type="dateTime"
                                        name="birth_date"
                                        register={register()}
                                        handleSubmit={handleSubmit(save)}
                                        filter={filters.date}
                                        placeholder={t('agencyManagement.actionEdit.placeholderDateOfBirth')}
                                        opt={{
                                          showMonthDropdown: true,
                                          showYearDropdown: true,
                                          useDateFormat: true
                                        }}
                                      /> :
                                      <Controller
                                        render={(ctrl) => (
                                          <DateTimeInput
                                            placeholder={t('agencyManagement.actionEdit.placeholderDateOfBirth')}
                                            onChange={ctrl.onChange}
                                            selected={ctrl.value}
                                            useDateFormat
                                            showYearDropdown
                                            showMonthDropdown
                                            isDefaultEmpty
                                          />
                                        )}
                                        name="birth_date"
                                        control={control}
                                        defaultValue={null}
                                      />
                                  }
                                </div>
                              </article>
                            </fieldset>
                          </div>

                          {!props.isDealer && <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm">
                              <label>
                                Bưu cục
                              </label>
                              <article>
                                <div
                                  className={`position-relative has-icon-right`}>
                                  {
                                    isEdit ? <InlineInput
                                        defaultValue={props.detail?.post_office_id}
                                        type="select"
                                        options={props.postOffices}
                                        optionValue="id"
                                        optionLabel="name"
                                        placeholder="Chọn bưu cục"
                                        handleSubmit={handleSubmit(save)}
                                        register={register({name: 'post_office_id', value: detail?.post_office_id})}
                                        onChange={(e) => setValue('post_office_id', e)}
                                      /> :
                                      <Controller
                                        render={(ctrl) => (
                                          <SelectBox
                                            placeholder="Chọn bưu cục"
                                            options={props.postOffices}
                                            onChange={ctrl.onChange}
                                            value={ctrl.value}
                                            optionValue="id"
                                            optionLabel="name"
                                            getOptionLabel={(option) => `${option.name} - ${option.code}`}
                                          />
                                        )}
                                        name="post_office_id"
                                        control={control}
                                        defaultValue={null}
                                      />
                                  }
                                </div>
                              </article>
                            </fieldset>
                          </div>}

                          {/* MST */}
                          {props.isDealer && <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm">
                              <label>
                                Mã số thuế
                              </label>
                              <article>
                                <div className="position-relative has-icon-right">
                                  {isEdit ?
                                    <InlineInput
                                      className={`form-control ${FormControl.getValidation('tax_code', errors).className}`}
                                      type="number"
                                      defaultValue={detail?.tax_code}
                                      name="tax_code"
                                      register={register({
                                        minLength: FormRules.minLength(10)
                                      })}
                                      handleSubmit={handleSubmit(save)}
                                    />
                                    :
                                    <input
                                      type="number"
                                      className={`form-control ${FormControl.getValidation('tax_code', errors).className}`}
                                      placeholder="Nhập số Mã số thuế"
                                      name="tax_code"
                                      ref={register({
                                        minLength: FormRules.minLength(10)
                                      })}
                                    />}
                                  <InvalidFeedBack
                                    message={FormControl.getValidation('tax_code', errors).errorMessage}/>
                                </div>
                              </article>
                            </fieldset>
                          </div>}

                          {/*Quyền hệ thống*/}
                          {(isEdit && !props.isDealer) ?
                            <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                              <fieldset className="form-group form-group-sm">
                                <label>
                                  Vai trò
                                </label>
                                <article>
                                  <div className="position-relative has-icon-right">
                                    <InlineInput
                                      type="select"
                                      options={props.roles}
                                      optionLabel="name"
                                      optionValue="id"
                                      name="user_type_id"
                                      register={register()}
                                      handleSubmit={handleSubmit(save)}
                                      defaultValue={detail?.user_type_id}
                                      defaultLabel={detail?.user_type}
                                      placeholder={t('createUser.titlePermissionPlaceHolder')}
                                    >
                                    </InlineInput>
                                  </div>
                                </article>
                              </fieldset>
                            </div> :
                            null
                          }
                        </div>
                      </div>
                    </div>


                    {props.isDealer && <div className="card card-section card-list">
                      <div className="card-header">
                        <div className="form-section d-flex align-items-center">
                          <h5 className="mb-0">{t('companyManagement.bankAccounts')}</h5>
                        </div>
                      </div>
                      <div className="card-body px-0 pt-1">
                        <div className="form-row pt-0">
                          {/* Ngân hàng */}
                          <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset
                              className="form-group form-group-sm">
                              <label>{t('companyManagement.actionCreate.bank')}</label>
                              <article>
                                <div
                                  className='position-relative has-icon-right'>
                                  {isEdit ?
                                    <SimpleInlineInput
                                      defaultValue={detail?.bank_id}
                                      placeholder={t('companyManagement.actionCreate.bankPlaceholder')}
                                      type="select"
                                      options={listBank}
                                      optionLabel="nameVN"
                                      optionValue="id"
                                      name="bank_id"
                                      register={register()}
                                      getOptionLabel={(option) => `${option.nameVN} (${option.name})`}
                                      handleSubmit={handleSubmit(save)}
                                    >
                                    </SimpleInlineInput>
                                    :
                                    <Controller
                                      render={(ctrl) => (
                                        <SelectBox
                                          options={listBank}
                                          optionLabel="nameVN"
                                          optionValue="id"
                                          placeholder={t('companyManagement.actionCreate.bankPlaceholder')}
                                          onChange={ctrl.onChange}
                                          getOptionLabel={(option) => `${option.nameVN} (${option.name})`}
                                        >
                                        </SelectBox>
                                      )}
                                      name="bank_id"
                                      control={control}
                                      defaultValue=""
                                    />
                                  }
                                </div>
                              </article>
                            </fieldset>
                          </div>
                          {/* Số tài khoản */}
                          <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset
                              className="form-group form-group-sm">
                              <label>{t('companyManagement.actionCreate.accountNumber')}</label>
                              <article>
                                <div
                                  className='position-relative has-icon-right'>
                                  {isEdit ?
                                    <SimpleInlineInput
                                      className="form-control"
                                      defaultValue={detail.bank_account_number}
                                      type="text"
                                      name="bank_account_number"
                                      register={register()}
                                      handleSubmit={handleSubmit(save)}
                                      placeholder={t('companyManagement.actionCreate.accountNumberPlaceholder')}
                                    >
                                    </SimpleInlineInput>
                                    :
                                    <input type="text"
                                           className="form-control"
                                           placeholder={t('companyManagement.actionCreate.accountNumberPlaceholder')}
                                           name="bank_account_number"
                                           ref={register}
                                    />}
                                </div>
                              </article>
                            </fieldset>
                          </div>
                          {/* Tên tài khoản */}
                          <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset
                              className="form-group form-group-sm">
                              <label>{t('companyManagement.actionCreate.accountName')}</label>
                              <article>
                                <div
                                  className='position-relative has-icon-right'>
                                  {
                                    isEdit ?
                                      <SimpleInlineInput
                                        className="form-control"
                                        defaultValue={detail?.bank_account_name}
                                        type="text"
                                        name="bank_account_name"
                                        register={register()}
                                        handleSubmit={handleSubmit(save)}
                                        placeholder={t('companyManagement.actionCreate.accountNamePlaceholder')}
                                      >
                                      </SimpleInlineInput>
                                      :
                                      <input type="text"
                                             className="form-control"
                                             placeholder={t('companyManagement.actionCreate.accountNamePlaceholder')}
                                             name="bank_account_name"
                                             ref={register}
                                      />}
                                </div>
                              </article>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>}

                    {<div className="card card-section">
                      <div className="card-header">
                        <div
                          className="form-section d-flex align-items-center">
                          <h5
                            className={`mb-0 ${isEdit && ''}`}>{props.isDealer ? "Thông tin địa chỉ thường chú - xuất hóa đơn" : "Thông tin địa chỉ"}</h5>

                        </div>
                      </div>
                      <div className="card-body px-0">
                        <div className="form-row">
                          <AddressInfo
                            detail={detail}
                            provinces={props.provinces}
                            isEdit={isEdit}
                            isRequired={false}
                          />
                          <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                            <fieldset className="form-group form-group-sm">
                              <label>
                                {t('agencyManagement.actionEdit.address')}
                              </label>
                              <article>
                                <div className="position-relative has-icon-right">
                                  {
                                    isEdit ? <InlineInput
                                        type="textarea"
                                        className="form-control"
                                        defaultValue={detail?.address}
                                        placeholder={t('agencyManagement.actionEdit.placeholderAddress')}
                                        name="address"
                                        register={register()}
                                        handleSubmit={handleSubmit(save)}
                                      /> :
                                      <textarea className="form-control"
                                                placeholder={t('agencyManagement.actionEdit.placeholderAddress')}
                                                name="address"
                                                ref={register()}
                                      />
                                  }
                                </div>
                              </article>
                            </fieldset>
                          </div>
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
                    </div>}


                    <ChangeAddressModal
                      isRequired={false}
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

UserForm.propTypes = {
  id: PropTypes.string,
  readOnly: PropTypes.bool,
  postOffices: PropTypes.array,
  roles: PropTypes.array,
  provinces: PropTypes.array,
  detail: PropTypes.object,
  isDealer: PropTypes.bool
};

UserForm.defaultProps = {
  readOnly: false,
  postOffices: [],
  roles: [],
  provinces: [],
  isDealer: false
};

export default UserForm;
