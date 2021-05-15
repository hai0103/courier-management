import PropTypes from "prop-types";
import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import Filters from "utils/filters";

function Rating(props) {
    const {t} = useTranslation('common');
    const [listRating, setListRating] = useState(props.listRating)

    useEffect(() => {
        setListRating(props.listRating);
    }, [props.listRating])

    return (
        <>
            <div className="form-row pb-0">
                <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                    <fieldset className="form-group form-group-sm">
                        <label>
                            {t('reinsuranceManagement.create.label.agencyRate')}
                        </label>
                    </fieldset>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                    <fieldset className="form-group form-group-sm">
                        <label>
                            {t('reinsuranceManagement.create.label.affectDate')}
                        </label>
                    </fieldset>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                    <fieldset className="form-group form-group-sm">
                        <label>
                            {t('reinsuranceManagement.create.label.endDate')}
                        </label>
                    </fieldset>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                    <fieldset className="form-group form-group-sm">
                        <label>
                            {t('reinsuranceManagement.create.label.creditRating')}
                        </label>
                    </fieldset>
                </div>
            </div>
            {
                listRating.length === 0 ?
                    <div>Không có thông tin</div>
                    :
                    listRating.map((item, index) => {
                        return (
                            <div key={index} className="form-row pb-0 pt-0">
                                <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                    <fieldset className="form-group form-group-sm">
                                        <article>
                                            <div className={`position-relative has-icon-right pl-1`}>
                                                {item.companyName}
                                            </div>
                                        </article>
                                    </fieldset>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                    <fieldset className="form-group form-group-sm">
                                        <article>
                                            <div className="position-relative has-icon-right pl-1">
                                                {Filters.date(item.startAffectedDate)}
                                            </div>
                                        </article>
                                    </fieldset>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                    <fieldset className="form-group form-group-sm">
                                        <article>
                                            <div className="position-relative has-icon-right pl-1">
                                                {Filters.date(item.endAffectedDate) || "-"}
                                            </div>
                                        </article>
                                    </fieldset>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 col-6">
                                    <fieldset className="form-group form-group-sm">
                                        <article>
                                            <div className="position-relative has-icon-right pl-1">
                                                {item.rating}
                                            </div>
                                        </article>
                                    </fieldset>
                                </div>
                            </div>
                        )
                    })
            }
        </>
    )
}

Rating.propTypes = {
    listRating: PropTypes.array
};

Rating.defaultProps = {};

export default Rating