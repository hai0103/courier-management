import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import Modal from "sharedComponents/modal";
import SelectBox from "sharedComponents/selectBox";
import {DepartmentApi} from "services/department";
import {Response, Utility} from "utils/common";
import {isEmpty, includes} from "lodash"
import {useToasts} from "react-toast-notifications";
import {AddressApi} from "services/address";
import {getUserProfile} from "utils/localStorage";
import {UserApi} from "services/user";

function FormAddressModal(props) {
  const {t} = useTranslation('common');
  const [detail, setDetail] = useState(props.detail);
  const [isEdit, setIsEdit] = useState(props.detail !== null || false)
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [province_id, setProvinceId] = useState(props.detail?.province_id || null)
  const [district_id, setDistrictId] = useState(props.detail?.district_id || null)
  const [wards_id, setWardId] = useState(props.detail?.wards_id || null)
  const [address, setAddress] = useState(props.detail?.address || "")
  const [name, setName] = useState(props.detail?.name || "")
  const [phone, setPhone] = useState(props.detail?.phone || "")
  const {addToast} = useToasts();


  useEffect(() => {
    if(!props.detail) {
      setIsEdit(false)
      setProvinceId(null)
      setDistrictId(null)
      setWardId(null)
      setAddress("")
      setName("")
      setPhone("")
    } else {
      setIsEdit(true)
      setProvinceId(props.detail?.province_id)
      setDistrictId(props.detail?.district_id)
      setWardId(props.detail?.wards_id)
      setAddress(props.detail?.address)
      setName(props.detail?.name)
      setPhone(props.detail?.phone)
    }
  }, [])

  const getDistricts = async (e) => {
    const response = await AddressApi.getDistrictsById(e)
    return Response.getAPIData(response)
  }
  const getWards = async (e) => {
    const response = await AddressApi.getWardsById(e)
    return Response.getAPIData(response)
  }

  useEffect(() => {
    if (props.detail?.province_id) {
      getDistricts(props.detail.province_id).then(response => {
        setDistricts(response)
        setDistrictId(props.detail?.district_id)
      })
    }

    if (props.detail?.district_id) {
      getWards(props.detail.district_id).then(response => {
        setWards(response);
        setWardId(props.detail?.wards_id)
      })
    }

    if(!props.detail) {
      setIsEdit(false)
      setProvinceId(null)
      setDistrictId(null)
      setWardId(null)
      setAddress("")
      setName("")
      setPhone("")
    } else {
      setIsEdit(true)
      setProvinceId(props.detail?.province_id)
      setDistrictId(props.detail?.district_id)
      setWardId(props.detail?.wards_id)
      setAddress(props.detail?.address)
      setName(props.detail?.name)
      setPhone(props.detail?.phone)
    }

  }, [props.detail])

  const onUpdate = async (e) => {
    e.preventDefault();
    const _loggedUser = getUserProfile();
      const payload = isEdit ? {
        ...props.detail,
        province_id,
        district_id,
        wards_id,
        name,
        phone,
        address
      } : {
        province_id,
        district_id,
        wards_id,
        name,
        phone,
        address,
        is_default: false,
        user_id: _loggedUser?.id
      }
    console.log("payload>>>>>", payload)
    try {
      isEdit ? await onSubmitUpdate(Utility.trimObjValues(payload)) : await onSubmitCreate(Utility.trimObjValues(payload));
    } catch (error) {
      addToast(Response.getErrorMessage(error), {appearance: 'error'});
    }
  }


  const onSubmitCreate = async (data) => {
    const payload = {
      ...data,
    };
    const response = props.isReceiver
      ? await UserApi.createReceiver(payload)
      : await UserApi.createAddress(payload);
    addToast(t('common.message.createSuccess'), {appearance: 'success'});
    if (Response.isSuccessAPI(response)) {
      props.onClose();
    } else {
      addToast(Response.getAPIError(response), {appearance: 'error'});
    }
  }

  const onSubmitUpdate = async (data) => {
    const response = props.isReceiver
      ? await UserApi.updateUserReceiver(props.detail.id, data)
      : await UserApi.updateUserAddress(props.detail.id, data);
    if (Response.isSuccessAPI(response)) {
      addToast(t('common.message.editSuccess'), {appearance: 'success'});
      props.onClose();
    } else {
      addToast(Response.getAPIError(response), {appearance: 'error'});
    }
  };

  return (
    <div>
      <Modal
        isOpen={props.show}
        modalName="modal-user-roles"
        onClose={() => {
          props.onClose()
        }}
        title={isEdit ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ'}
        centered
      >
        <Modal.Body>
          {
            <form>
              {/* Họ tên */}
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  Họ tên{<sup className="text-danger">*</sup>}
                </label>
                <article>
                  <div className={ 'position-relative has-icon-right'}>
                    <input
                      placeholder="Nhập họ tên"
                      className="form-control"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      value={name}
                    />
                  </div>
                </article>
              </fieldset>
              {/* sdt */}
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  SĐT{<sup className="text-danger">*</sup>}
                </label>
                <article>
                  <div className={ 'position-relative has-icon-right'}>
                    <input
                      placeholder="Nhập SĐT"
                      className="form-control"
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                      value={phone}
                    />
                  </div>
                </article>
              </fieldset>
              {/* Tỉnh/Thành phố */}
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  {t('agencyManagement.actionEdit.titleProvince')}{<sup className="text-danger">*</sup>}
                </label>
                <article>
                  <div className={ 'position-relative has-icon-right' }>
                    <SelectBox
                      instanceId="province-select-box"
                      options={props.provinces}
                      optionLabel="name"
                      optionValue="id"
                      isPortal={true}
                      onChange={async (e) => {
                        setProvinceId(e);
                        setDistrictId(null);
                        setWardId(null);
                        setDistricts(await getDistricts(e));
                        setWards([])
                      }}
                      value={province_id}
                    >
                    </SelectBox>
                  </div>
                </article>
              </fieldset>
              {/* Quận/Huyện */}
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  {t('agencyManagement.actionEdit.titleDistrict')}{<sup className="text-danger">*</sup>}
                </label>
                <article className="zindex-3">
                  <div className={'position-relative has-icon-right' }>
                    <SelectBox
                      instanceId="district-select-box"
                      options={districts}
                      optionLabel="name"
                      optionValue="id"
                      isPortal={true}
                      onChange={async (e) => {
                        setDistrictId(e)
                        setWardId(null)
                        setWards(await getWards(e))
                      }}
                      value={district_id}
                    >
                    </SelectBox>
                  </div>
                </article>
              </fieldset>
              {/* Phường/Xã */}
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  {t('agencyManagement.actionEdit.titleWard')}{<sup className="text-danger">*</sup>}
                </label>
                <article>
                  <div className={ 'position-relative has-icon-right'}>
                    <SelectBox
                      instanceId="ward-select-box"
                      options={wards}
                      optionLabel="name"
                      optionValue="id"
                      isPortal={true}
                      onChange={(e) => {
                        setWardId(e)
                      }}
                      value={wards_id}
                    >
                    </SelectBox>
                  </div>
                </article>
              </fieldset>
              {/* Địa chỉ */}
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  Địa chỉ{<sup className="text-danger">*</sup>}
                </label>
                <article>
                  <div className={ 'position-relative has-icon-right'}>
                    <textarea
                      placeholder="Nhập địa chỉ"
                      className="form-control"
                      rows={2}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                      value={address}
                    />
                  </div>
                </article>
              </fieldset>
            </form>
          }
        </Modal.Body>

        <Modal.Footer>
          <button type="button" className="btn btn-outline-primary mr-25"
                  onClick={() => {
                    props.onClose()
                  }}>
                        <span
                          className="d-none d-sm-block">{t('common.button.cancel')}</span>
          </button>
          <button
            // disabled={isEdit && !isDirty}
                  type="button"
                  className="btn btn-primary"
                  onClick={onUpdate}>
                        <span
                          className="d-none d-sm-block">
                            {isEdit ? t('common.button.save') : t('common.button.add')}
                        </span>
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

FormAddressModal.propTypes = {
  detail: PropTypes.object,
  provinces: PropTypes.array,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  userId: PropTypes.number,
  isReceiver: PropTypes.bool
};

FormAddressModal.defaultProps = {
  show: false,
  detail: {},
  provinces: [],
  isReceiver: false
};

export default FormAddressModal
