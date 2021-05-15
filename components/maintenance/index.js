import React from "react";
import ContentWrapper from "layouts/contentWrapper";
import {IMAGES} from "constants/common";

function Maintenance() {
  return (
    <ContentWrapper>
      <section className="flexbox-container">
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="col-md-6 col-10 p-0">
            <div className="card card-no-border px-1 py-1 m-0 shadow-none">
              <div className="card-body">
                  <span className="card-title text-center">
                      {/*<img src={IMAGES.SHORT_LOGO} className="img-fluid mx-auto d-block pt-2" width="250" alt="logo" />*/}
                  </span>
              </div>
              <div className="card-body text-center">
                <h3>This page is under maintenance</h3>
                <p>We're sorry for the inconvenience.
                  <br /> Please check back later.</p>
                <div className="mt-2"><i className="fa fa-cog spinner font-large-2"/></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ContentWrapper>
  );
}

export default React.memo(Maintenance);
