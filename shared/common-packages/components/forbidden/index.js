import React from 'react';
import {IMAGES} from "constants/common";
import Authentication from "services/authentication";
import {trans} from "utils/helpers";

const Forbidden = () =>
    <section className="row flexbox-container">
        <div className="col-12 d-flex align-items-center justify-content-center">
            <div className="col-xl-4 col-lg-5 col-md-7 col-10 box-shadow-2 p-0">
                <div className="card border-grey border-lighten-3 m-0">
                    <div className="card-header pb-0 border-0">
                        <div className="card-title text-center">
                            <img src={IMAGES.LOGO} width='60%' alt="branding logo"/>
                        </div>
                        <h4 className="d-none card-subtitle line-on-side text-muted text-center m-2 pt-1">
                            <span>{trans('forbidden.systemRole')}</span>
                        </h4>
                    </div>
                    <div className="card-content">
                        <div className="card-body pt-1 text-center">
                            <h4>{trans('forbidden.notAllowed')}</h4>
                        </div>
                        <div className="card-footer pt-0 border-0 text-center">
                            <button type="button"
                                    className="btn btn-primary btn-block"
                                    onClick={() => {
                                        Authentication.logout()
                                    }}
                            >
                                {trans('common.button.logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

export default Forbidden;
