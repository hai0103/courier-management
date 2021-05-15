import React from "react";
import Head from "next/head";
import OutsideLayout from "layouts/outsideLayout";

export default function NotFound() {
    return (
        <React.Fragment>
            <Head>
                <title>404 - Not Found</title>
            </Head>
            <OutsideLayout>
                <section className="flexbox-container">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="col-md-4 col-10 p-0">
                            <div className="card-header bg-transparent border-0">
                                <h2 className="error-code text-center mb-2">404</h2>
                                <h3 className="text-uppercase text-center">Page Not Found</h3>
                            </div>
                            <div className="card-content">
                                <fieldset className="row py-2">
                                    <div className="input-group col-12">
                                        <input type="text"
                                            className="form-control form-control-xl input-xl border-grey border-lighten-1"
                                            placeholder="Search..." aria-describedby="button-addon2"/>
                                        <span className="input-group-append" id="button-addon2">
                                            <button className="btn btn-secondary border-grey border-lighten-1"
                                                    type="button"><i className="feather icon-search"></i></button>
                                        </span>
                                    </div>
                                </fieldset>
                                <div className="row py-2">
                                    <div className="col-12 col-sm-6 col-md-6 mb-1">

                                            <a href="/" className="btn btn-primary btn-block">
                                                <i className="feather icon-home"></i> Home
                                            </a>

                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 mb-1">
                                        <a href="search-website.html" className="btn btn-danger btn-block">
                                            <i className="feather icon-search"/> Search</a>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-transparent">
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <a href="#" className="btn btn-social-icon mr-1 mb-1 btn-outline-facebook">
                                            <span className="fa fa-facebook"/>
                                        </a>
                                        <a href="#" className="btn btn-social-icon mr-1 mb-1 btn-outline-twitter"><span
                                            className="fa fa-twitter"></span></a>
                                        <a href="#" className="btn btn-social-icon mr-1 mb-1 btn-outline-linkedin"><span
                                            className="fa fa-linkedin font-medium-4"></span></a>
                                        <a href="#" className="btn btn-social-icon mr-1 mb-1 btn-outline-github"><span
                                            className="fa fa-github font-medium-4"></span></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </OutsideLayout>
        </React.Fragment>
    );
}