import React from "react";
import {IMAGES, ROUTES} from "../constants/common";
import {AUTH_LOGIN_SERVICE_URI} from "globalConstants/serviceUri";

export default function LogoutPage(props) {
    return (
        <section className="row flexbox-container">
            <div className="col-12 d-flex align-items-center justify-content-center">
                <div className="col-xl-4 col-lg-5 col-md-7 col-10 box-shadow-2 p-0">
                    <div className="card border-grey border-lighten-3 m-0">
                        <div className="card-header pb-0 border-0">
                            <div className="card-title text-center">
                                <img src={IMAGES.LOGO} width={200}
                                     alt="branding logo"/>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="card-body pt-1 text-center">
                                <h3>Bạn vừa đăng xuất. Tạm biệt.</h3>
                            </div>
                            <div className="card-footer pt-0 border-0 text-center">
                                <a type="submit" href={'/login'} className="text-underline text-capitalize">Đăng nhập lại</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
