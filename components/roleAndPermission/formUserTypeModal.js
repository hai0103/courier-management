import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import Modal from "sharedComponents/modal";
import {Response, Utility} from "utils/common";
import {useToasts} from "react-toast-notifications";
import {getUserProfile} from "utils/localStorage";
import {UserTypeApi} from "services/userType";

function FormUserTypeModal(props) {
  const {t} = useTranslation('common');
  const [detail, setDetail] = useState(props.detail);
  const [code, setCode] = useState(props.isEdit ? props.detail?.code : "")
  const [name, setName] = useState(props.isEdit ? props.detail?.name : "")
  const {addToast} = useToasts();

  useEffect(() => {
    if (!props.isEdit) {
      setCode("")
      setName("")
    } else {
      setCode(props.detail?.code)
      setName(props.detail?.name)
    }
  }, [props.isEdit, props.detail])

  const onUpdate = async (e) => {
    e.preventDefault();
    const _loggedUser = getUserProfile();
    const payload = props.isEdit ? {
      ...props.detail,
      code,
      name,
    } : {
      code,
      name,
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
    const response = await UserTypeApi.create(payload);
    addToast(t('common.message.createSuccess'), {appearance: 'success'});
    if (Response.isSuccessAPI(response)) {
      props.onClose();
    } else {
      addToast(Response.getAPIError(response), {appearance: 'error'});
    }
  }

  const onSubmitUpdate = async (data) => {
    const response = await UserTypeApi.update(props.detail.id, data);
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
        title={props.isEdit ? 'Chỉnh sửa loại người dùng' : 'Thêm loại người dùng'}
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
                      Mã loại{<sup className="text-danger">*</sup>}
                    </label>
                    <article>
                      <div className={'position-relative has-icon-right'}>
                        <input
                          placeholder="Nhập mã loại"
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
                      Tên loại{<sup className="text-danger">*</sup>}
                    </label>
                    <article>
                      <div className={'position-relative has-icon-right'}>
                        <input
                          placeholder="Nhập tên loại"
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

FormUserTypeModal.propTypes = {
  detail: PropTypes.object,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  isEdit: PropTypes.bool
};

FormUserTypeModal.defaultProps = {
  show: false,
  detail: {},
  isEdit: false
};

export default FormUserTypeModal
