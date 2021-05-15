import React from "react";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import Modal from "sharedComponents/modal";
import SelectBox from "sharedComponents/selectBox";
import {FormControl} from "utils/common";
import {useForm, Controller} from "react-hook-form";
import FormRules from "utils/formRules";
import InvalidFeedBack from "sharedComponents/formControl/invalidFeedback";
import DateTimeInput from "sharedComponents/dateTimeInput";
import Filters from "utils/filters";

function EditRatingModal(props) {
    const {t} = useTranslation('common');
    const {handleSubmit, control, errors, register} = useForm()

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

    const save = async (data) => {
        props.onSave && props.onSave({
            ...data,
            companyId: data.ratingAgency,
            affectedDate: Filters.date(data.affectedDate)
        })
    }

    return (
        <>
            <Modal
                isOpen={props.show}
                modalName="modal-create-allocation"
                onClose={() => {
                    props.onClose()
                }}
                title={t("modal.editRating.title")}
                centered
            >
                <Modal.Body>
                    {
                        <form>
                            <fieldset className={`form-group form-group-sm position-relative required`}>
                                <label>
                                    {t('reinsuranceManagement.create.label.agencyRate')}
                                </label>
                                <article className="zindex-3">
                                    <div
                                        className={`position-relative has-icon-right ${FormControl.getValidation('ratingAgency', errors).className}`}>
                                        <Controller
                                            render={(ctrl) => (
                                                <SelectBox
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.agencyRate')}
                                                    options={props.listRatingAgencies}
                                                    optionLabel="name"
                                                    optionValue="code"
                                                    isPortal
                                                    onChange={ctrl.onChange}
                                                    value={ctrl.value}
                                                    errMess={FormControl.getValidation('ratingAgency', errors).errorMessage}
                                                    error={FormControl.getValidation('ratingAgency', errors).isError}
                                                />
                                            )}
                                            name="ratingAgency"
                                            control={control}
                                            defaultValue={null}
                                            rules={{
                                                required: FormRules.required()
                                            }}
                                        />
                                    </div>
                                </article>
                            </fieldset>

                            <fieldset className="form-group form-group-sm position-relative required">
                                <label>
                                    {t('reinsuranceManagement.create.label.creditRating')}
                                </label>
                                <article>
                                    <div
                                        className={`position-relative has-icon-right ${requiredTextControl('rating').isError ? 'is-invalid' : ''}`}>
                                        <input className={requiredTextControl('rating').classNames}
                                               placeholder={t('reinsuranceManagement.create.placeHolder.creditRating')}
                                               defaultValue={null}
                                               name="rating"
                                               ref={register(requiredTextControl('rating').rules)}
                                        />
                                        <InvalidFeedBack message={requiredTextControl('rating').errorMessage}/>
                                    </div>
                                </article>
                            </fieldset>

                            <fieldset className="form-group form-group-sm position-relative required">
                                <label>
                                    {t('reinsuranceManagement.create.label.affectDate')}
                                </label>
                                <article>
                                    <div
                                        className={`position-relative has-icon-right ${requiredTextControl('affectedDate').isError ? 'is-invalid' : ''}`}>
                                        <Controller
                                            render={(ctrl) => (
                                                <DateTimeInput
                                                    placeholder={t('reinsuranceManagement.create.placeHolder.affectDate')}
                                                    onChange={ctrl.onChange}
                                                    selected={ctrl.value}
                                                    useDateFormat
                                                    showMonthDropdown
                                                    isDefaultEmpty
                                                    isPortal
                                                />
                                            )}
                                            name="affectedDate"
                                            control={control}
                                            defaultValue={new Date()}
                                            rules={requiredTextControl('affectedDate').rules}
                                        />
                                        <InvalidFeedBack message={requiredTextControl('affectedDate').errorMessage}/>
                                    </div>
                                </article>
                            </fieldset>
                        </form>
                    }
                </Modal.Body>

                <Modal.Footer>
                    <button type="button" className="btn btn-outline-secondary mr-25"
                            onClick={() => {
                                props.onClose()
                            }}>
                        <span
                            className="d-none d-sm-block">{t('common.button.cancel')}</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary btn-min-width"
                        onClick={handleSubmit(save)}
                    >
                        <span
                            className="d-none d-sm-block">
                            {t('common.button.update')}
                        </span>
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

EditRatingModal.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
    listRatingAgencies: PropTypes.array,
    onSave: PropTypes.func,
};

EditRatingModal.defaultProps = {
    show: false,
    listRatingAgencies: [],
};

export default EditRatingModal
