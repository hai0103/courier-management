import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import Modal from "sharedComponents/modal";
import {Response, Utility} from "utils/common";
import {useToasts} from "react-toast-notifications";
import {getUserProfile} from "utils/localStorage";
import {UserApi} from "services/user";

function FormPackageModal(props) {
  const {t} = useTranslation('common');
  const [detail, setDetail] = useState(props.detail);
  const [code, setCode] = useState(props.isEdit ? props.detail?.code : "")
  const [name, setName] = useState(props.isEdit ? props.detail?.name : "")
  const [weight, setWeight] = useState(props.isEdit ? props.detail?.weight : "")
  const [height, setHeight] = useState(props.isEdit ? props.detail?.height : "")
  const [length, setLength] = useState(props.isEdit ? props.detail?.length : "")
  const [wide, setWide] = useState(props.isEdit ? props.detail?.wide : "")
  const [price, setPrice] = useState(props.isEdit ? props.detail?.price : "")
  const {addToast} = useToasts();

  useEffect(() => {
    if (!props.isEdit) {
      setCode("")
      setName("")
      setWeight("")
      setHeight("")
      setLength("")
      setWide("")
      setPrice("")
    } else {
      setCode(props.detail?.code)
      setName(props.detail?.name)
      setWeight(props.detail?.weight)
      setHeight(props.detail?.height)
      setLength(props.detail?.length)
      setWide(props.detail?.wide)
      setPrice(props.detail?.price)
    }
  }, [props.isEdit, props.detail])

  const onUpdate = async (e) => {
    e.preventDefault();
    const _loggedUser = getUserProfile();
    const payload = props.isEdit ? {
      ...props.detail,
      code,
      name,
      weight,
      price,
      height,
      length,
      wide,
    } : {
      code,
      name,
      weight,
      price,
      height,
      length,
      wide,
      user_id: _loggedUser?.id
    }
    console.log("payload>>>>>", payload)
    try {
      props.isEdit ? await onSubmitUpdate(Utility.trimObjValues(payload)) : await onSubmitCreate(Utility.trimObjValues(payload));
    } catch (error) {
      addToast(Response.getErrorMessage(error), {appearance: 'error'});
    }
  }


  const onSubmitCreate = async (data) => {
    const payload = {
      ...data,
    };
    const response = await UserApi.createPackage(payload);
    addToast(t('common.message.createSuccess'), {appearance: 'success'});
    if (Response.isSuccessAPI(response)) {
      props.onClose();
    } else {
      addToast(Response.getAPIError(response), {appearance: 'error'});
    }
  }

  const onSubmitUpdate = async (data) => {
    const response = await UserApi.updateUserPackage(props.detail.id, data);
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
        title={props.isEdit ? 'Chỉnh sửa gói hàng' : 'Thêm gói hàng bản thân'}
        centered
      >
        <Modal.Body>
          {
            <form>
              <div className="form-row">
                {/* mã */}
                <div className="col-12">
                  <fieldset className="form-group form-group-sm position-relative">
                    <label>
                      Mã gói
                    </label>
                    <article>
                      <div className={'position-relative has-icon-right'}>
                        <input
                          placeholder="Nhập mã gói"
                          className="form-control"
                          onChange={(e) => {
                            setCode(e.target.value);
                          }}
                          value={code}
                        />
                      </div>
                    </article>
                  </fieldset>
                </div>
                {/* Họ tên */}
                <div className="col-12">
                  <fieldset className="form-group form-group-sm position-relative">
                    <label>
                      Tên gói{<sup className="text-danger">*</sup>}
                    </label>
                    <article>
                      <div className={'position-relative has-icon-right'}>
                        <input
                          placeholder="Nhập tên gói"
                          className="form-control"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                          value={name}
                        />
                      </div>
                    </article>
                  </fieldset>
                </div>
                {/* kg */}
                <div className="col-12">
                  <fieldset className="form-group form-group-sm position-relative">
                    <label>
                      Trọng lượng{<sup className="text-danger">*</sup>}
                    </label>
                    <article>
                      <div className={'position-relative has-icon-right'}>
                        <input
                          placeholder="Nhập trọng lượng"
                          className="form-control"
                          onChange={(e) => {
                            setWeight(e.target.value);
                          }}
                          value={weight}
                        />
                      </div>
                    </article>
                  </fieldset>
                </div>
                {/*giá*/}
                <div className="col-12">
                  <fieldset className="form-group form-group-sm position-relative">
                    <label>
                      Giá{<sup className="text-danger">*</sup>}
                    </label>
                    <article>
                      <div className={'position-relative has-icon-right'}>
                        <input
                          placeholder="Nhập giá"
                          className="form-control"
                          onChange={(e) => {
                            setPrice(e.target.value);
                          }}
                          value={price}
                        />
                      </div>
                    </article>
                  </fieldset>
                </div>
                {/* Địa chỉ */}
                <div className="col-4">
                  <fieldset className="form-group form-group-sm position-relative">
                    <label>
                      Dài (cm)
                    </label>
                    <article>
                      <div className={'position-relative has-icon-right'}>
                        <input
                          placeholder="Chiều dài"
                          className="form-control"
                          onChange={(e) => {
                            setLength(e.target.value);
                          }}
                          value={length}
                        />
                      </div>
                    </article>
                  </fieldset>
                </div>
                {/* Địa chỉ */}
                <div className="col-4">
                  <fieldset className="form-group form-group-sm position-relative">
                    <label>
                      Rộng (cm)
                    </label>
                    <article>
                      <div className={'position-relative has-icon-right'}>
                        <input
                          placeholder="Chiều rộng"
                          className="form-control"
                          onChange={(e) => {
                            setWide(e.target.value);
                          }}
                          value={wide}
                        />
                      </div>
                    </article>
                  </fieldset>
                </div>
                {/* Địa chỉ */}
                <div className="col-4">
                  <fieldset className="form-group form-group-sm position-relative">
                    <label>
                      Cao (cm)
                    </label>
                    <article>
                      <div className={'position-relative has-icon-right'}>
                        <input
                          placeholder="Chiều"
                          className="form-control"
                          onChange={(e) => {
                            setHeight(e.target.value);
                          }}
                          value={height}
                        />
                      </div>
                    </article>
                  </fieldset>
                </div>
              </div>
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
            type="button"
            className="btn btn-primary"
            onClick={onUpdate}>
                        <span
                          className="d-none d-sm-block">
                            {props.isEdit ? t('common.button.save') : t('common.button.add')}
                        </span>
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

FormPackageModal.propTypes = {
  detail: PropTypes.object,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  isEdit: PropTypes.bool
};

FormPackageModal.defaultProps = {
  show: false,
  detail: {},
  isEdit: false
};

export default FormPackageModal
