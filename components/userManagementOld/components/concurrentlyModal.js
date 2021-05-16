import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import Modal from "sharedComponents/modal";
import SelectBox from "sharedComponents/selectBox";
import {DepartmentApi} from "services/department";
import {Response} from "utils/common";
import {includes, isEmpty} from "lodash"
import {useToasts} from "react-toast-notifications";
import moment from "moment";
import ISwitch from "sharedComponents/iSwitch";
import DateTimeInput from "sharedComponents/dateTimeInput";

function ConcurrentlyModal(props) {
  const {t} = useTranslation('common');
  const [detail, setDetail] = useState(props.detail);
  const [companyId, setCompanyId] = useState(props.detail?.companyId);
  const [departmentId, setDepartmentId] = useState(props.detail?.departmentId);
  const [functionId, setFunctionId] = useState(null);
  const [positionId, setPositionId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(moment(startDate).add(1, 'month').toDate());
  const [errCompany, setErrCompany] = useState(false);
  const [errDepartment, setErrDepartment] = useState(false);
  const [errFunction, setErrFunction] = useState(false);
  const [errPosition, setErrPosition] = useState(false);
  const [errRole, setErrRole] = useState(false);
  const [reason, setReason] = useState(null);
  const [reasonError, setReasonError] = useState(false);
  const [listDepartment, setListDepartment] = useState([]);
  const [listFunction, setListFunction] = useState(props.listFunction);
  const [isEdit, setIsEdit] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [renderKey, setRenderKey] = useState(1)
  const [isDirty, setIsDirty] = useState(false)
  const [isUnlimited, setIsUnlimited] = useState(false)
  const [roleConstraint, setRoleConstraint] = useState(props.roleConstraint)
  const {addToast} = useToasts();
  const roleList = props.listRoles;
  const initialData = {
    functionId: props.detail?.functionId || null,
    roleId: props.detail?.roleId || null,
    positionId: props.detail?.positionId || null
  }

  useEffect(() => {
    setListFunction(props.listFunction)
  }, [props.listFunction]);

  useEffect(() => {
    setRoleConstraint(props.roleConstraint)
  }, [props.roleConstraint]);

  useEffect(() => {
    getListFunction().then(() => {
      setIsLoaded(true)
      setRenderKey(renderKey + 1)
      listFunction.forEach(func => {
        const constraint = `${companyId}-${departmentId}-${func?.id}`
        if (includes(props.roleConstraint, constraint)) {
          func.isDisabled = true
        } else {
          func.isDisabled = !func.status
        }
      })
    }).catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}));

    return (
      setIsLoaded(false)
    )
  }, [companyId, departmentId]);

  useEffect(() => {
    getListDepartment().then(() => {
      setIsLoaded(true)
      setRenderKey(renderKey + 1)
    }).catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}));

    return (
      setIsLoaded(false)
    )
  }, [companyId]);

  useEffect(() => {
    const isDirtyEffect = functionId !== initialData.functionId
      || roleId !== initialData.roleId
      || positionId !== initialData.positionId

    setIsDirty(isDirtyEffect)
  }, [functionId, roleId, positionId]);

  useEffect(() => {
    setDetail(props.detail)
    setIsEdit(!isEmpty(props.detail))
    setCompanyId(props.detail?.companyId)
    setDepartmentId(props.detail?.departmentId)
    setFunctionId(props.detail?.functionId)
    setRoleId(props.detail?.roleId)
    setIsUnlimited(props.detail?.isNoLimited || false)
    setPositionId(props.detail?.positionId)
    setStartDate(props.detail.startAffectedDate ? moment(props.detail?.startAffectedDate).toDate() : startDate)
    setEndDate(props.detail.endAffectedDate ? moment(props.detail?.endAffectedDate).toDate() : endDate)
  }, [props.detail]);

  const getListDepartment = async () => {
    if (companyId) {
      const data = {
        pageSize: 100,
        pageNumber: 0,
        companyId: companyId,
      }

      const response = await DepartmentApi.getList(data);
      const list = Response.getAPIData(response).content;
      list.forEach(item => {
        if (!item.status) {
          item.isDisabled = true
        }
      })
      setListDepartment(companyId ? list : []);
    }
  }

  const getListFunction = async () => {
    if (departmentId) {
      const response = await DepartmentApi.getListFunctionById(departmentId)
      const list = Response.getAPIData(response)
      list.forEach(item => {
        if (!item.status) {
          item.isDisabled = true
        }
      });
      setListFunction(departmentId ? list : []);
    }
  }

  const onUpdate = (e) => {
    e.preventDefault();
    if (checkValue()) {
      const payload = {
        companyId,
        departmentId,
        functionId,
        roleId,
        positionId,
        isNoLimited: isUnlimited || false,
        startAffectedDate: moment(startDate).format(),
        endAffectedDate: moment(endDate).format(),
        note: reason
      }
      props.onSave(payload, detail?.id).catch(error => addToast(Response.getErrorMessage(error), {appearance: 'error'}));
    }
  }

  const checkValue = () => {
    let isValid = true;
    if (!departmentId) {
      setErrDepartment(true);
      isValid = false;
    }
    if (!functionId) {
      setErrFunction(true);
      isValid = false;
    }
    if (!roleId) {
      setErrRole(true);
      isValid = false;
    }
    if (!positionId) {
      setErrPosition(true);
      isValid = false;
    }
    if (!companyId) {
      setErrCompany(true);
      isValid = false;
    }

    return isValid;
  }

  return (
    <div>
      <Modal
        isOpen={props.show}
        modalName="modal-user-roles"
        onClose={() => {
          props.onClose()
        }}
        title={props.title}
        centered
      >
        <Modal.Body>
          {
            <form>
              {/* Đơn vị */}
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  {t('createUser.company')}<sup className="text-danger">*</sup>
                </label>
                <article>
                  <div
                    className={`${errCompany ? 'position-relative has-icon-right is-invalid' : 'position-relative has-icon-right'}`}>
                    <SelectBox
                      instanceId="company-select-box"
                      options={props.listCompany}
                      optionLabel="companyName"
                      optionValue="id"
                      onChange={(value) => {
                        setCompanyId(value);
                        setDepartmentId(null);
                        setErrCompany(false)
                      }}
                      value={companyId || null}
                      error={errCompany}
                      errMess={t('createUser.reqMess')}
                      isDisabled={detail.isAffected}
                    >
                    </SelectBox>
                  </div>
                </article>
              </fieldset>
              {/* Phòng ban */}
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  {t('createUser.department')}<sup className="text-danger">*</sup>
                </label>
                <article className="zindex-3">
                  <div
                    className={`${errDepartment ? 'position-relative has-icon-right is-invalid' : 'position-relative has-icon-right'}`}>
                    <SelectBox
                      key={renderKey}
                      instanceId="department-select-box"
                      options={listDepartment}
                      optionLabel="departmentName"
                      optionValue="id"
                      onChange={(value) => {
                        setDepartmentId(value);
                        setErrDepartment(false);
                      }}
                      value={departmentId || null}
                      error={errDepartment}
                      errMess={t('createUser.reqMess')}
                      isLoading={!isLoaded}
                      isDisabled={detail.isAffected}
                    >
                    </SelectBox>
                  </div>
                </article>
              </fieldset>
              {/* Chức năng */}
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  {t('createUser.position')}<sup className="text-danger">*</sup>
                </label>
                <article>
                  <div
                    className={`${errFunction ? 'position-relative has-icon-right is-invalid' : 'position-relative has-icon-right'}`}>
                    <SelectBox
                      instanceId="function-select-box"
                      options={listFunction}
                      optionLabel="functionName"
                      optionValue="id"
                      onChange={(value) => {
                        setFunctionId(value);
                        setErrFunction(false)
                      }}
                      value={functionId || null}
                      error={errFunction}
                      errMess={t('createUser.reqMess')}
                      isDisabled={detail.isAffected}
                    >
                    </SelectBox>
                  </div>
                </article>
              </fieldset>
              {/* Chức danh */}
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  {t('createUser.titleRole')}<sup className="text-danger">*</sup>
                </label>
                <article>
                  <div
                    className={`${errPosition ? 'position-relative has-icon-right is-invalid' : 'position-relative has-icon-right'}`}>
                    <SelectBox
                      instanceId="position-select-box"
                      options={props.listPositionRoles}
                      optionLabel="name"
                      optionValue="id"
                      onChange={(value) => {
                        setPositionId(value)
                        setErrPosition(false)
                      }}
                      value={positionId || null}
                      error={errPosition}
                      errMess={t('createUser.reqMess')}
                      isPortal
                      isDisabled={detail.isAffected}
                    >
                    </SelectBox>
                  </div>
                </article>
              </fieldset>
              {/* Vai trò */}
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  {t('createUser.role')}<sup className="text-danger">*</sup>
                </label>
                <article>
                  <div
                    className={`${errRole ? 'position-relative has-icon-right is-invalid' : 'position-relative has-icon-right'}`}>
                    <SelectBox
                      instanceId="role-select-box"
                      options={roleList}
                      optionLabel="name"
                      optionValue="id"
                      onChange={(value) => {
                        setRoleId(value)
                        setErrRole(false)
                      }}
                      value={roleId || null}
                      error={errRole}
                      errMess={t('createUser.reqMess')}
                      isDisabled={detail.isAffected}
                    >
                    </SelectBox>
                  </div>
                </article>
              </fieldset>
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  {t('createUser.efficiency')}
                </label>
                <div className="form-row">
                  <div className="col-5 d-flex">
                    <div className="d-flex pl-1 align-items-center react-switch">
                      <ISwitch checked={isUnlimited}
                               onChange={() => {
                                 setIsUnlimited(!isUnlimited);
                               }}
                               disabled={detail.isAffected}
                      />
                      <div className='pl-50'>Vô thời hạn</div>
                    </div>
                  </div>
                  <div className="col-7">
                    {
                      isUnlimited ||
                      <fieldset className="form-row">
                        <div className="col-6">
                          <DateTimeInput
                            selected={startDate}
                            onChange={date => {
                              setStartDate(date)
                              setEndDate(moment(date).add(1, 'months').toDate())
                            }}
                            minDate={new Date()}
                            placeholderText={'Chọn ngày bắt đầu'}
                            isPortal
                            useDateFormat
                            disabled={detail.isAffected}
                          />
                        </div>
                        <div className="col-6">
                          <DateTimeInput
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            minDate={moment(startDate).add(1, 'day').toDate()}
                            placeholderText={'Chọn ngày kết thúc'}
                            isPortal
                            useDateFormat
                            disabled={detail.isAffected}
                          />
                        </div>
                      </fieldset>

                    }
                  </div>
                </div>
              </fieldset>
              <fieldset className="form-group form-group-sm position-relative">
                <label>
                  {t('createUser.note')}
                </label>
                <textarea className={reasonError ? 'form-control is-invalid' : 'form-control'}
                          rows="4"
                          placeholder={t('createUser.InputNotePlaceHolder')}
                          onChange={(e) => {
                            setReason(e.target.value);
                            setReasonError(false);
                            setIsDirty(true)
                          }}
                          defaultValue={detail?.note}
                          disabled={detail.isAffected}
                />
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
          <button disabled={detail.isAffected} type="button" className="btn btn-primary btn-min-width"
                  onClick={onUpdate}>
                        <span
                          className="d-none d-sm-block">
                            {isEdit ? t('common.button.save') : t('common.button.assign')}
                        </span>
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

ConcurrentlyModal.propTypes = {
  detail: PropTypes.object,
  listCompany: PropTypes.array,
  listFunction: PropTypes.array,
  roleConstraint: PropTypes.array,
  listRoles: PropTypes.array,
  listPositionRoles: PropTypes.array,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onSave: PropTypes.func
};

ConcurrentlyModal.defaultProps = {
  show: false,
  detail: {},
  roleConstraint: [],
  listFunction: []
};

export default ConcurrentlyModal
