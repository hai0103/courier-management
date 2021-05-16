import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Modal from "sharedComponents/modal";
import PropTypes from "prop-types";
import DateTimeInput from "sharedComponents/dateTimeInput";
import moment from "moment";
import {trans} from "utils/helpers";
import Alert from "sharedComponents/alert";
import Spinner from "sharedComponents/spinner";

function StatusSwitcher(props) {
    const {t} = useTranslation('common');
    const [date, setDate] = useState(new Date())
    const [showOption, setShowOption] = useState(null)
    const [isCheck, setIsCheck] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reason, setReason] = useState(props.entity?.reason || '');

    const validate = () => {
        let isValid = true;
        if (!reason || reason.length === 0) {
            isValid = false
        }

        return isValid
    }

    const isActiveStatus = () => {
        return props.entity?.status == props.activeStatus
    }

    useEffect(() => {
        if(props.onHandleWarning){
            setIsCheck(false)
        }

        if (props.entity?.affectedBlockDate) {
            setDate(new Date(props.entity.affectedBlockDate))
        } else {
            setDate(new Date())
        }

        if (props.entity?.reason) {
            setReason(props.entity?.reason)
        } else {
            setReason(null)
        }

        if (props.entity.id) {
            if (props.onHandleWarning) {
                async function handleWarning() {
                    setLoading(true)
                    const response = await props.onHandleWarning(props.entity)
                    setLoading(false)
                    setShowOption(response)
                }

                handleWarning().catch(e => console.log(e));
            }
        }

    }, [props.entity])

    return (
        isActiveStatus() ? <Modal
                isOpen={props.show}
                modalName="modal-status-switcher"
                onClose={() => {
                    props.onClose()
                }}
                title={`${props.blockLabel} ${props.targetLabel}`}
                centered
            >
                <Modal.Body>
                    {
                        props.onHandleWarning && showOption && <>
                            {
                                loading ? <Spinner loading={loading}/> :
                                    <div className="form-check form-check-inline">
                                        <input
                                            id="check-in-modal"
                                            className="form-check-input"
                                            type="checkbox"
                                            value={isCheck}
                                            onChange={(event) => {
                                                setIsCheck(event.target.checked)
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor="check-in-modal">
                                            {`${props.blockLabel} các ${props.targetLabel} cấp dưới trực thuộc`}
                                        </label>
                                    </div>
                            }
                        </>
                    }

                    <form>
                        <div className="form-group form-group-sm">
                            <label>Ngày hiệu lực</label>
                            <article>
                                <DateTimeInput
                                    selected={date}
                                    onChange={date => {
                                        setDate(date)
                                    }}
                                    minDate={new Date()}
                                    showTimeSelect
                                    isFilterPassedTime
                                    isPortal
                                />
                            </article>
                        </div>
                        <div className="form-group form-group-sm">
                            <label>
                                {
                                    props.reasonLabel
                                }
                            </label>
                            <div className="position-relative has-icon-right">
                        <textarea className='form-control'
                                  rows="3"
                                  placeholder={t('modal.blockCompany.placeHolder')}
                                  onChange={(e) => {
                                      setReason(e.target.value);
                                  }}
                                  defaultValue={reason}
                        />
                                <div className="form-control-position">
                                    <i className="far fa-exclamation-triangle"/>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-outline-primary mr-50"
                            onClick={() => {
                                props.onClose()
                            }}>
                        <span className="d-none d-sm-block">{t('common.button.cancel')}</span>
                    </button>
                    <button type="button" className="btn btn-primary"
                            disabled={!validate()}
                            onClick={() => {
                                if (validate()) {
                                    props.onConfirm({
                                        affectedDate: moment(date).format(),
                                        reason,
                                        status: props.inActiveStatus,
                                        affectForChild: isCheck,
                                        blockImmediately: moment(date).isBefore(moment())
                                    }, props.entity)
                                }
                            }}>
                        <span
                            className="d-none d-sm-block">
                            {props.blockLabel}
                        </span>
                    </button>
                </Modal.Footer>
            </Modal> :
            <Modal
                isOpen={props.show}
                modalName="modal-status-switcher-confirmation"
                onClose={() => {
                    props.onClose()
                }}
                title={`${props.unBlockLabel} ${props.targetLabel}`}
                centered
            >
                <Modal.Body>
                    {
                        props.onHandleWarning && showOption && <>
                            {
                                loading ? <Spinner loading={loading}/> :
                                    <div className="form-check form-check-inline">
                                        <input
                                            id="check-in-modal"
                                            className="form-check-input"
                                            type="checkbox"
                                            onChange={(event) => {
                                                setIsCheck(event.target.checked)
                                            }}
                                            value={isCheck}
                                        />
                                        <label className="form-check-label" htmlFor="check-in-modal">
                                            {`${props.unBlockLabel} các ${props.targetLabel} cấp dưới trực thuộc`}
                                        </label>
                                    </div>
                            }
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-outline-primary mr-50"
                            onClick={() => {
                                props.onClose()
                            }}>
                        <span className="d-none d-sm-block">{t('common.button.cancel')}</span>
                    </button>
                    <button type="button" className="btn btn-primary"
                            onClick={() => {
                                props.onConfirm({
                                    status: props.activeStatus,
                                    affectForChild: isCheck
                                }, props.entity)
                            }}>
                        <span
                            className="d-none d-sm-block">
                            {
                                props.unBlockLabel
                            }
                        </span>
                    </button>
                </Modal.Footer>
            </Modal>
    );
}

StatusSwitcher.propTypes = {
    show: PropTypes.bool,
    activeStatus: PropTypes.number,
    inActiveStatus: PropTypes.number,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    targetLabel: PropTypes.string,
    reasonLabel: PropTypes.string,
    entity: PropTypes.object,
    blockLabel: PropTypes.string,
    unBlockLabel: PropTypes.string,
    onHandleWarning: PropTypes.func
};

StatusSwitcher.defaultProps = {
    show: false,
    activeStatus: 1,
    inActiveStatus: 0,
    entity: {},
    reasonLabel: trans('common.reason'),
    blockLabel: trans('common.block'),
    unBlockLabel: trans('common.unBlock'),
    targetLabel: ''
};

export default StatusSwitcher
