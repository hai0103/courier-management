import {ROUTES} from "constants/common";
import Link from "next/link";
import PropTypes from "prop-types";
import React, {useState} from "react";
import {useToasts} from "react-toast-notifications";
import {OrderApi} from "services/order";
import {FormControl, Response} from "utils/common";
import ContentWrapper from "layouts/contentWrapper";
import Badge from "sharedComponents/blocks/badge";
import filters from "utils/filters";
import {FormProvider, useForm, Controller} from "react-hook-form";
import InvalidFeedBack from "sharedComponents/formControl/invalidFeedback";
import AddressInfo from "../addressInfo";
import {useAddressInfoContext} from "providers/addressInfoProvider";
import SelectBox from "sharedComponents/selectBox";
import AddressHelpers from "../../helpers/addressHelpers";
import FormRules from "utils/formRules";
import moment from "moment";
import HistoryPanel from "sharedComponents/historyPanel";

function EstimatePostage(props) {
  const {register, errors, setError, formState, setValue, handleSubmit, watch, control} = useForm();
  const {addToast} = useToasts();
  const [provinces1, setProvinces1] = useState(props.provinces);
  const watchProvince1 = watch('province_id1', null);
  const watchDistrict1 = watch('district_id1', null);
  const {districts1, setDistricts1, wards1, setWards1} = useAddressInfoContext();
  const [walkShip, setWalkShip] = useState(0);
  const [flightShip, setFlightShip] = useState(0);
  const [standardShip, setStandardShip] = useState(0);
  const [fastShip, setFastShip] = useState(0);

  const onSubmit = async (data) => {
    console.log(data)
    setStandardShip(0);
    setFastShip(0);
    setWalkShip(0);
    setFlightShip(0);
    if (data.province_id !== data.province_id1) {
      calculatePrice({...data, type: 1}, 1)
      calculatePrice({...data, type: 2}, 2)
    } else {
      calculatePrice({...data, service: 'STANDARD'}, 3)
      calculatePrice({...data, service: 'FAST'}, 4)
    }

  }

  const calculatePrice = async (data = {}, index) => {
    let payload = {
      senderProvince: data.province_id || 0,
      receiverProvince: data.province_id1 || 0,
      weight: data.weight || 0,
      type: data.type || 0,
      service: data.service || ''
    }
    const response = await OrderApi.calculatePrice(payload);
    if (Response.isSuccessCode(response?.data)) {
      console.log(Response.getData(response)?.data)
      const data = Response.getData(response)?.data || 0;
      switch (index) {
        case 1:
          setWalkShip(data)
          break;
        case 2:
          setFlightShip(data)
          break;
        case 3:
          setStandardShip(data)
          break;
        case 4:
          setFastShip(data)
          break;
        default:
          return 0
      }
    } else {
      addToast(Response.getAPIError(response), {appearance: 'error'});
    }
  }

  return (
    <div className="animated slideInRight">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-no-border mb-0 shadow-none max-height">
            <div className={'card-header card-header-main bg-light-primary'}>
              <h3 className="content-header-title mb-0">
                Tra cứu cước phí
              </h3>
              <div className="heading-elements">
              </div>
              <div className={'slide-menu slide-menu-sm border-left'}>
              </div>
            </div>
            <div className="slide-content">
              <div className="card-content card-scroll">
                <FormProvider formState={formState} register={register} watch={watch} control={control}
                              setValue={setValue}
                              setError={setError} errors={errors}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-12">
                        <div className="card card-section">
                          <div className="card-body px-0">
                            <div className="form-row pt-0">
                              <AddressInfo
                                provinces={props.provinces}
                                isEdit={false}
                                isRequired={true}
                              />
                            </div>
                            <div className="form-row pt-0">
                              <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                <fieldset
                                  className={`form-group form-group-sm required`}>
                                  <label>
                                    Tỉnh/Thành phố
                                  </label>
                                  <article>
                                    <div
                                      className={`position-relative has-icon-right ${FormControl.getValidation('province_id1', errors).className}`}>
                                      {
                                        <Controller
                                          render={(ctrl) => (
                                            <SelectBox
                                              placeholder="Chọn Tỉnh/Thành phố"
                                              onChange={async (e) => {
                                                ctrl.onChange(e)
                                                const data = await AddressHelpers.getDistricts(e)
                                                setDistricts1(data || [])
                                              }}
                                              value={ctrl.value}
                                              options={props.provinces}
                                              optionValue="id"
                                              optionLabel="name"
                                              errMess={FormControl.getValidation('province_id1', errors).errorMessage}
                                              error={FormControl.getValidation('province_id1', errors).isError}
                                            />
                                          )}
                                          name="province_id1"
                                          control={control}
                                          defaultValue={null}
                                          rules={{
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
                                  className={`form-group form-group-sm required`}>
                                  <label>
                                    Quận/Huyện
                                  </label>
                                  <article>
                                    <div
                                      className={`position-relative has-icon-right ${FormControl.getValidation('district_id1', errors).className}`}>
                                      {
                                        <Controller
                                          render={(ctrl) => (
                                            <SelectBox
                                              placeholder={"Chọn Quận/Huyện"}
                                              onChange={async (e) => {
                                                ctrl.onChange(e)
                                                setWards1(await AddressHelpers.getWards(e))
                                              }}
                                              options={districts1}
                                              optionValue="id"
                                              optionLabel="name"
                                              value={ctrl.value}
                                              errMess={FormControl.getValidation('district_id1', errors).errorMessage}
                                              error={FormControl.getValidation('district_id1', errors).isError}
                                            />
                                          )}
                                          name="district_id1"
                                          key={watchProvince1}
                                          control={control}
                                          defaultValue={null}
                                          rules={{
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
                                  className={`form-group form-group-sm required`}>
                                  <label>
                                    Phường/Xã
                                  </label>
                                  <article>
                                    <div
                                      className={`position-relative has-icon-right ${FormControl.getValidation('wards_id1', errors).className}`}>
                                      {
                                        <Controller
                                          render={(ctrl) => (
                                            <SelectBox
                                              placeholder="Chọn Phường/Xã"
                                              onChange={ctrl.onChange}
                                              value={ctrl.value}
                                              options={wards1}
                                              optionValue="id"
                                              optionLabel="name"
                                              errMess={FormControl.getValidation('wards_id1', errors).errorMessage}
                                              error={FormControl.getValidation('wards_id1', errors).isError}
                                            />
                                          )}
                                          name="wards_id1"
                                          control={control}
                                          defaultValue={null}
                                          key={watchDistrict1}
                                          rules={{
                                            required: FormRules.required()
                                          }}
                                        />
                                      }
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                            </div>
                            <div className="form-row pt-0">
                              <div className="col-xl-3 col-lg-3 col-md-3 col-3">
                                <fieldset className="form-group form-group-sm required">
                                  <label>
                                    Trọng lượng (gram)
                                  </label>
                                  <article>
                                    <div
                                      className={`position-relative has-icon-right ${FormControl.getValidation('weight', errors).className}`}>
                                      <input className='form-control'
                                             placeholder='Ví dụ: 300'
                                             name="weight"
                                             type="number"
                                             ref={register({
                                               required: FormRules.required()
                                             })}
                                      />
                                      <InvalidFeedBack
                                        message={FormControl.getValidation('weight', errors).errorMessage}/>
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                              <div className='col-12'>
                                <button type='submit' className='btn btn-outline-blue'>Tra cứu cước vận chuyển
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>

                  {(walkShip !== 0 || fastShip !== 0 || fastShip !== 0 || standardShip !== 0) &&
                  <div className="card card-section">
                    <div className="card-header">
                      <div
                        className="form-section d-flex align-items-center">
                        <h5
                          className='mb-0'>THÔNG TIN CƯỚC VẬN CHUYỂN</h5>
                      </div>
                    </div>
                    <div className="card-body px-0">
                      <div className="form-row">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                          <div className='row font-size-large pt-1 pb-0'>
                            {walkShip !== 0 &&
                            <div className="d-flex ml-2 col-9 card card-section box-shadow-3 border py-1">
                              Vận chuyển đường bộ: <span
                              className="font-weight-bold red">{filters.currency(walkShip || 0)}đ</span>
                            </div>}
                            {flightShip !== 0 &&
                            <div className="d-flex ml-2 col-9 card card-section box-shadow-3 border py-1">
                              Vận chuyển đường bay: <span
                              className="font-weight-bold red">{filters.currency(flightShip || 0)}đ</span>
                            </div>}
                            {standardShip !== 0 &&
                            <div className="d-flex ml-2 col-9 card card-section box-shadow-3 border py-1">
                              Vận chuyển tiêu chuẩn: <span
                              className="font-weight-bold red">{filters.currency(standardShip || 0)}đ</span>
                            </div>}
                            {fastShip !== 0 &&
                            <div className="d-flex ml-2 col-9 card card-section box-shadow-3 border py-1">
                              Vận chuyển hỏa tốc: <span
                              className="font-weight-bold red">{filters.currency(fastShip || 0)}đ</span>
                            </div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>}
                </FormProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

EstimatePostage.propTypes = {
  provinces: PropTypes.array
};

EstimatePostage.defaultProps = {
  provinces: []
};

export default EstimatePostage;
