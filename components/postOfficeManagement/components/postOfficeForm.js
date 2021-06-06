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
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import { compose, withProps } from "recompose";
import {PostOfficeApi} from "services/postOffice";


const MyMapComponent = compose(
  withProps({
      /**
       * Note: create and replace your own key in the Google console.
       * https://console.developers.google.com/apis/dashboard
       * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
       */
      googleMapURL:
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
      {props.isMarkerShown && (
        <Marker position={{ lat: -34.397, lng: 150.644 }} />
      )}
  </GoogleMap>
));

function PostOfficeForm(props) {
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
        router.push(ROUTES.POST_OFFICE);
    }

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
            status: 1,
            latitude: "",
            longtitude: "",
        }
        const payloadEdit = {
            ...detail,
            ...data,
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
        const response = await PostOfficeApi.create(payload);
        addToast(t('common.message.createSuccess'), {appearance: 'success'});
        if (Response.isSuccessAPI(response)) {
            onClose();
        } else {
            addToast(Response.getAPIError(response), {appearance: 'error'});
        }
    }

    const onSubmitUpdate = async (data) => {
        const response = await PostOfficeApi.update(props.id, data);
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
        const response = await PostOfficeApi.findById(props.id);
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
                                  !isEdit ? 'Tạo bưu cục' : <>
                                      {detail?.name}
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
                                              <div className="form-row"> {/* Họ và tên */}
                                                  <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                                      <fieldset className="form-group form-group-sm required">
                                                          <label>
                                                              Mã bưu cục
                                                          </label>
                                                          <article>
                                                              <div className="position-relative has-icon-right">
                                                                  {isEdit ?
                                                                    <InlineInput className={requiredTextControl('code').classNames}
                                                                                 type="text"
                                                                                 defaultValue={detail?.code}
                                                                                 placeholder='Nhập mã bưu cục'
                                                                                 name="code"
                                                                                 register={register(requiredTextControl('code').rules)}
                                                                                 handleSubmit={handleSubmit(save)}
                                                                    />
                                                                    :
                                                                    <input className={requiredTextControl('code').classNames}
                                                                           placeholder='Nhập mã bưu cục'
                                                                           name="code"
                                                                           ref={register(requiredTextControl('code').rules)}
                                                                    />}
                                                                  <InvalidFeedBack
                                                                    message={requiredTextControl('code').errorMessage}/>
                                                              </div>
                                                          </article>
                                                      </fieldset>
                                                  </div>
                                                  {/* Tên */}
                                                  <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                                      <fieldset className="form-group form-group-sm required">
                                                          <label>
                                                              Tên bưu cục
                                                          </label>
                                                          <article>
                                                              <div className="position-relative has-icon-right">
                                                                  {isEdit ?
                                                                    <InlineInput className={requiredTextControl('name').classNames}
                                                                                 type="text"
                                                                                 defaultValue={detail?.name}
                                                                                 placeholder='Nhập tên bưu cục'
                                                                                 name="name"
                                                                                 register={register(requiredTextControl('name').rules)}
                                                                                 handleSubmit={handleSubmit(save)}
                                                                    />
                                                                    :
                                                                    <input className={requiredTextControl('name').classNames}
                                                                           placeholder='Nhập tên bưu cục'
                                                                           name="name"
                                                                           ref={register(requiredTextControl('name').rules)}
                                                                    />}
                                                                  <InvalidFeedBack
                                                                    message={requiredTextControl('name').errorMessage}/>
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

                                              </div>
                                          </div>
                                      </div>


                                      {<div className="card card-section">
                                          <div className="card-header">
                                              <div
                                                className="form-section d-flex align-items-center">
                                                  <h5
                                                    className={`mb-0 ${isEdit && ''}`}>Thông tin địa chỉ</h5>

                                              </div>
                                          </div>
                                          <div className="card-body px-0">
                                              <div className="form-row">
                                                  <AddressInfo
                                                    detail={detail}
                                                    provinces={props.provinces}
                                                    isEdit={isEdit}
                                                    isRequired={true}
                                                  />
                                                  <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                                      <fieldset className="form-group form-group-sm required">
                                                          <label>
                                                              {t('agencyManagement.actionEdit.address')}
                                                          </label>
                                                          <article>
                                                              <div className="position-relative has-icon-right">
                                                                  {
                                                                      isEdit ? <InlineInput
                                                                          type="textarea"
                                                                          className={requiredTextControl('address').classNames}
                                                                          defaultValue={detail?.address}
                                                                          placeholder={t('agencyManagement.actionEdit.placeholderAddress')}
                                                                          name="address"
                                                                          register={register(requiredTextControl('address').rules)}
                                                                          handleSubmit={handleSubmit(save)}
                                                                        /> :
                                                                        <textarea className={requiredTextControl('address').classNames}
                                                                                  placeholder={t('agencyManagement.actionEdit.placeholderAddress')}
                                                                                  name="address"
                                                                                  ref={register(requiredTextControl('address').rules)}
                                                                        />
                                                                  }
                                                                  <InvalidFeedBack
                                                                    message={requiredTextControl('address').errorMessage}/>
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

                                      <div className="card card-section">
                                          <div className="card-header">
                                              <div
                                                className="form-section d-flex align-items-center">
                                              </div>
                                          </div>
                                          <div className="card-body px-0">
                                              <div className="row">
                                                  {/*<div className="col-12">*/}
                                                  {/*    <LoadScript*/}
                                                  {/*      id="script-loader"*/}
                                                  {/*      googleMapsApiKey="AIzaSyBZHZ74APD0ihPjL6QrwH5N-5nXa1gsBtA"*/}
                                                  {/*    >*/}
                                                  {/*        <GoogleMap*/}
                                                  {/*          zoom={8}*/}
                                                  {/*          center={{ lat: -34.397, lng: 150.644 }}*/}
                                                  {/*        >*/}
                                                  {/*            <Marker position={{ lat: -34.397, lng: 150.644 }} />*/}
                                                  {/*        </GoogleMap>*/}
                                                  {/*    </LoadScript>*/}
                                                  {/*</div>*/}
                                                  {/*<div className="col-12">*/}
                                                  {/*    <MyMapComponent isMarkerShown/>*/}
                                                  {/*</div>*/}
                                              </div>
                                          </div>
                                      </div>

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

PostOfficeForm.propTypes = {
    id: PropTypes.string,
    readOnly: PropTypes.bool,
    provinces: PropTypes.array,
    detail: PropTypes.object,
};

PostOfficeForm.defaultProps = {
    readOnly: false,
    provinces: [],
};

export default PostOfficeForm;
