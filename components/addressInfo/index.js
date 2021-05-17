import React, {useEffect, useState} from "react";
import {FormControl} from "utils/common";
import PropTypes from "prop-types";
import SelectBox from "sharedComponents/selectBox";
import {Controller, useFormContext} from "react-hook-form";
import FormRules from "utils/formRules";
import {InlineInput} from "sharedComponents/formControl";
import {useAddressInfoContext} from "providers/addressInfoProvider";
import AddressHelpers from "helpers/addressHelpers";
import { useTranslation } from "react-i18next";

function AddressInfo(props) {
  const {t} = useTranslation('common');
  const {errors, control, watch} = useFormContext();
  const [provinces, setProvinces] = useState(props.provinces)
  const watchProvince = watch('province_id', null)
  const watchDistrict = watch('district_id', null)
  const {districts, setDistricts, wards, setWards} = useAddressInfoContext()

  useEffect(() => {
    setProvinces([...props.provinces])
  }, [props.detail.province_id])

  return (
    <>
      <div className="col-xl-3 col-lg-4 col-md-6 col-6">
        <fieldset
          className={`form-group form-group-sm ${props.isRequired && 'required'}`}>
          <label>
           Tỉnh/Thành phố
          </label>
          <article>
            <div
              className={`position-relative has-icon-right ${props.isRequired && FormControl.getValidation('province_id', errors).className}`}>
              {
                props.isEdit ? <InlineInput
                    type="select"
                    defaultValue={props.detail?.province_id}
                    options={provinces}
                    optionLabel="name"
                    optionValue="id"
                    disabled={true}
                  /> :
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
                        errMess={FormControl.getValidation('province_id', errors).errorMessage}
                        error={FormControl.getValidation('province_id', errors).isError}
                      />
                    )}
                    name="province_id"
                    control={control}
                    defaultValue={null}
                    rules={props.isRequired &&{
                      required: FormRules.required()
                    }}
                  />

              }
            </div>
          </article>
        </fieldset>
      </div>
      <div className="col-xl-3 col-lg-4 col-md-6 col-6">
        <fieldset
          className={`form-group form-group-sm ${props.isRequired && 'required'}`}>
          <label>
            Quận/Huyện
          </label>
          <article>
            <div
              className={`position-relative has-icon-right ${props.isRequired && FormControl.getValidation('district_id', errors).className}`}>
              {
                props.isEdit ? <InlineInput
                    defaultValue={props.detail?.district_id}
                    type="select"
                    options={districts}
                    optionLabel="name"
                    optionValue="id"
                    disabled={true}
                  /> :
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
                        errMess={FormControl.getValidation('district_id', errors).errorMessage}
                        error={FormControl.getValidation('district_id', errors).isError}
                      />
                    )}
                    name="district_id"
                    key={watchProvince}
                    control={control}
                    defaultValue={null}
                    rules={props.isRequired &&{
                      required: FormRules.required()
                    }}
                  />
              }
            </div>
          </article>
        </fieldset>
      </div>
      <div className="col-xl-3 col-lg-4 col-md-6 col-6">
        <fieldset
          className={`form-group form-group-sm ${props.isRequired && 'required'}`}>
          <label>
            Phường/Xã
          </label>
          <article>
            <div
              className={`position-relative has-icon-right ${props.isRequired && FormControl.getValidation('ward_id', errors).className}`}>
              {
                props.isEdit ? <InlineInput
                    defaultValue={props.detail?.ward_id}
                    type="select"
                    options={wards}
                    optionLabel="name"
                    optionValue="id"
                    disabled={true}
                  /> :
                  <Controller
                    render={(ctrl) => (
                      <SelectBox
                        placeholder="Chọn Phường/Xã"
                        onChange={ctrl.onChange}
                        value={ctrl.value}
                        options={wards}
                        optionValue="id"
                        optionLabel="name"
                        errMess={FormControl.getValidation('ward_id', errors).errorMessage}
                        error={FormControl.getValidation('ward_id', errors).isError}
                      />
                    )}
                    name="ward_id"
                    control={control}
                    defaultValue={null}
                    key={watchDistrict}
                    rules={props.isRequired &&{
                      required: FormRules.required()
                    }}
                  />
              }
            </div>
          </article>
        </fieldset>
      </div>
    </>
  )
}

AddressInfo.propTypes = {
  detail: PropTypes.object,
  provinces: PropTypes.array,
  isEdit: PropTypes.bool,
  isRequired: PropTypes.bool
};

AddressInfo.defaultProps = {
  isEdit: false,
  detail: {},
  isRequired: true
};

export default AddressInfo;
