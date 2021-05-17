import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import Modal from "sharedComponents/modal";
import SelectBox from "sharedComponents/selectBox";
import {Response} from "utils/common";
import {AddressApi} from "services/address";

function ChangeAddressModal(props) {
    const {t} = useTranslation('common');
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [province_id, setProvinceId] = useState(props.detail?.province_id)
    const [district_id, setDistrictId] = useState(props.detail?.district_id)
    const [wards_id, setWardId] = useState(props.detail?.wards_id)

    const getDistricts = async (e) => {
        const response = await AddressApi.getDistrictsById(e)
        return Response.getAPIData(response)
    }
    const getWards = async (e) => {
        const response = await AddressApi.getWardsById(e)
        return Response.getAPIData(response)
    }

    useEffect(() => {
        if (props.detail.province_id) {
            getDistricts(props.detail.province_id).then(response => {
                setDistricts(response)
            })
        }

        if (props.detail.district_id) {
            getWards(props.detail.district_id).then(response => {
                setWards(response)
            })
        }
    }, [props.detail])

    return (
        <div>
            <Modal
                isOpen={props.show}
                modalName="modal-user-roles"
                onClose={() => {
                    props.onClose()
                }}
                size="sm"
                title={props.title}
                centered
            >
                <Modal.Body>
                    {
                        <form>
                            {/* Tỉnh/Thành phố */}
                            <fieldset className="form-group form-group-sm position-relative">
                                <label>
                                    {t('agencyManagement.actionEdit.titleProvince')}{props.isRequired && <sup className="text-danger">*</sup>}
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
                                            isClearable={!props.isRequired}
                                        >
                                        </SelectBox>
                                    </div>
                                </article>
                            </fieldset>
                            {/* Quận/Huyện */}
                            <fieldset className="form-group form-group-sm position-relative">
                                <label>
                                    {t('agencyManagement.actionEdit.titleDistrict')}{props.isRequired && <sup className="text-danger">*</sup>}
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
                                            isClearable={!props.isRequired}
                                        >
                                        </SelectBox>
                                    </div>
                                </article>
                            </fieldset>
                            {/* Phường/Xã */}
                            <fieldset className="form-group form-group-sm position-relative">
                                <label>
                                    {t('agencyManagement.actionEdit.titleWard')}{props.isRequired && <sup className="text-danger">*</sup>}
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
                                            isClearable={!props.isRequired}
                                        >
                                        </SelectBox>
                                    </div>
                                </article>
                            </fieldset>
                        </form>
                    }
                </Modal.Body>

                <Modal.Footer>
                    <button type="button" className="btn btn-outline-primary mr-25"
                            onClick={async () => {
                                props.onClose()
                                setProvinceId(props.detail?.province_id)
                                setDistrictId(props.detail?.district_id)
                                setWardId(props.detail?.wards_id)
                                setDistricts(await getDistricts(props.detail?.province_id))
                                setWards(await getWards(props.detail?.district_id))
                            }}>
                        <span
                            className="d-none d-sm-block">{t('common.button.cancel')}</span>
                    </button>
                    <button
                        disabled={props.isRequired && (district_id === null || wards_id === null)}
                        type="button" className="btn btn-primary btn-min-width"
                        onClick={()=>props.onSave({province_id,district_id,wards_id})}
                    >
                        <span
                            className="d-none d-sm-block">
                            {t('common.button.save')}
                        </span>
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

ChangeAddressModal.propTypes = {
    detail: PropTypes.object,
    provinces: PropTypes.array,
    show: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    onSave: PropTypes.func,
    isRequired: PropTypes.bool
};

ChangeAddressModal.defaultProps = {
    show: false,
    detail: {},
    isRequired: true
};

export default ChangeAddressModal
