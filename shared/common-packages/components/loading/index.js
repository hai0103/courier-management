import React from 'react';
import {IMAGES} from "constants/common";

const Loading = () => <>
  <section className="flexbox-container">
    <div className="col-12 d-flex align-items-center justify-content-center">
      <div className="col-md-6 col-10 p-0">
        <div className="card card-no-border px-1 py-1 m-0 shadow-none">
          <div className="card-body">
                  <span className="card-title text-center">
                      <img src={IMAGES.ANIMATE_LOGO} className="img-fluid mx-auto d-block" width="500" alt="logo" />
                  </span>
          </div>
          <div className="text-center">
            <h2 className="spacing spacing-lg">Loading...</h2>
          </div>
        </div>
      </div>
    </div>
  </section>
</>

export default Loading;
