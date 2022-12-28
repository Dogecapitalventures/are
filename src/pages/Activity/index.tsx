import React, { useEffect, useState } from "react";
import "./Activity.scss";
// import happyImg from "../../assets/images/";
import { imageData } from "utils/imageSrc";

const Accountpage = () => {
  return (
    <section className="activity-sec">
      <div className="row top">
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column left mb-4">
          <div className="card-lr  ">
            <h2>How much you have invested so far?</h2>
            <div className="left">
              <img src={imageData.earn} alt="" />
            </div>
            <h1>Total Investment</h1>
            <div className="gradient-bg">
              <button>$0</button>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column middle mb-4">
          <div className="card-lr pt-5 ">
            <p>Risk Meter</p>
            <div className="risk-meter">
              <img className="meter-bg" src={imageData.meterBg} alt="" />
              <img className="meter" src={imageData.meter} alt="" />
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column left mb-4">
          <div className="card-lr  ">
            <h2>How much you have withdrawn so far?</h2>
            <div className="right">
              <img src={imageData.lose} alt="" />
            </div>
            <h1>Total Earned</h1>

            <div className="gradient-bg">
              <button>$0</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row bottom">
        <div className="card-lr">
          <div className="history-btn">
            <button>Recent Trading History</button>
          </div>
          <div className="history-table">
            <table className="table">
              <thead>
                <tr>                  
                <th scope="col">Transaction Hash</th>
                <th scope="col">Block Number</th>
                <th scope="col">Method</th>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
                <th scope="col">$ POMF</th>
                <th scope="col">$ BNB</th>
                </tr>
              </thead>
              <tbody>
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accountpage;
