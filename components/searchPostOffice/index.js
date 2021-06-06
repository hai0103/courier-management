import PropTypes from "prop-types";
import React, {useState} from "react";
import {useToasts} from "react-toast-notifications";
import {FormControl, Response} from "utils/common";
import ContentWrapper from "layouts/contentWrapper";
import {FormProvider, useForm, Controller} from "react-hook-form";
import {useAddressInfoContext} from "providers/addressInfoProvider";
import SelectBox from "sharedComponents/selectBox";
import AddressHelpers from "../../helpers/addressHelpers";
import FormRules from "utils/formRules";
import {PostOfficeApi} from "services/postOffice";

function SearchPostOffice(props) {
  const {register, errors, setError, formState, setValue, handleSubmit, watch, control} = useForm();
  const {addToast} = useToasts();
  const watchProvince1 = watch('province_id1', null);
  const {districts1, setDistricts1} = useAddressInfoContext();
  const [lstData, setLstData] = useState([]);

  const onSubmit = async (data) => {
    let isValid = true
    if (Object.keys(errors).length > 0) {
      isValid = false

      addToast(
        <div
          className='justify-content-center align-content-center text-center'>
          Vui lòng đảm bảo nhập đúng các trường thông tin.
        </div>, {appearance: 'error'});
    }
    const payload = {
      pageSize: 500,
      pageNumber: 0,
      provinceId: data.province_id1,
      districtId: data.district_id1
    }
    console.log(payload)
    if (isValid) {
      try {
        const response = await PostOfficeApi.getList(payload);
        console.log(response)
        if (Response.isSuccessCode(response?.data)) {
          const {content} = Response.getData(response).data || [];
          setLstData(content);
        } else {
          console.log(response);
        }

      } catch (error) {
        addToast(Response.getErrorMessage(error), {appearance: 'error'})
        console.log(error);
      }
    }

  }

  return (
    <div className="animated slideInRight">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-no-border mb-0 shadow-none max-height">
            <div className={'card-header card-header-main bg-light-primary'}>
              <h3 className="content-header-title mb-0">
                Tra cứu bưu cục
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
                              <div className="col-xl-4 col-lg-4 col-md-6 col-6">
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
                              <div className="col-xl-4 col-lg-4 col-md-6 col-6">
                                <fieldset
                                  className={`form-group form-group-sm`}>
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
                                        />
                                      }
                                    </div>
                                  </article>
                                </fieldset>
                              </div>
                              <div className='col-3'>
                                <fieldset
                                  className={`form-group form-group-sm`}>
                                  <label>
                                    {" "}
                                  </label>
                                  <article>
                                    <button type='submit' className='btn btn-outline-blue'>Tra cứu bưu cục</button>
                                  </article>
                                </fieldset>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>

                  {(lstData.length > 0) &&
                  <div className="card card-section">
                    <div className="card-header">
                      <div
                        className="form-section d-flex align-items-center">
                        <h5
                          className='mb-0'>DANH SÁCH BƯU CỤC</h5>
                      </div>
                    </div>
                    <div className="card-body px-0">
                      <div className="form-row">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                          <div className='row font-size-large pt-1 pb-0'>
                            {lstData.map((item, index) => (
                              <div key={index}
                                   className="ml-2 col-5 card card-section box-shadow-3 border px-2 py-1 row">
                                <div className="mb-1">
                                  <i className="fa fa-map-marker-alt red font-size-large mr-2" style={{fontSize: 28}}/>
                                  {item.name} ({item.code})
                                </div>
                                <div style={{fontSize: 14}}>
                            <span
                              title={`${item.address || '_'} - ${item.ward || '_'} - ${item.district || '_'} - ${item.province || '_'}`}>
                                {`${item.address || '_'} - ${item.ward || '_'} - ${item.district || '_'} - ${item.province || '_'}`}
                            </span>
                                </div>
                                <div>
                                  {(item.latitude) && <a title="Xem trong bản đồ" style={{fontSize: 14}}
                                                         href={`https://www.google.com/maps/search/?api=1&query=${item.latitude}`}
                                                         target="_blank">Xem trong bản đồ</a>}
                                </div>
                              </div>
                            ))}
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

SearchPostOffice.propTypes = {
  provinces: PropTypes.array
};

SearchPostOffice.defaultProps = {
  provinces: []
};

export default SearchPostOffice;
