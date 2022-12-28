import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import POMFF from "../../config/contract/abi/ARE.json";
import axios from "axios";
import "./Calculator.scss";

const Accountpage = () => {
  const [AREAmount, setAREAmount] = useState<string>("");
  const [apy, setApy] = useState<string>("383025.8");
  const [purchase, setPurchase] = useState<string>("3.07");
  const [marketPrice, setMarketPrice] = useState<string>("3.07");
  const [days, setDays] = useState<string>("87");
  const [AREPrice, setAREPrice] = useState<string>("0");
  const [balanceUsd, setBalanceUsd] = useState<string>("0");
  const [initInv, setInitInv] = useState<string>("0");
  const [AREReward, setAREReward] = useState<string>("0");
  const [potReturn, setPotReturn] = useState<string>("0");

  const {REACT_APP_DEPLOYED_CONTRACT, REACT_APP_TREASURY_WALLET, REACT_APP_RPC_DOGICHAIN} = process.env;

  useEffect(() => {
    addCss();
    getData();
  }, []);

  // useEffect(() => {
  //    console.log("safuuAmount", safuuAmount, days);
  // }, [safuuAmount, days]);

  const getData = async () => {
    const provider: any = new ethers.providers.Web3Provider(
      // REACT_APP_RPC_DOGICHAIN as any
      window.ethereum as any
    )
  //   try {
  //     provider.send('eth_requestAccounts', []);
  //   } catch (error) {
  //     return error;
  //   }
  // //   // get the end user
  // const signer = provider.getSigner()
    const contract = new ethers.Contract(
        REACT_APP_DEPLOYED_CONTRACT as string,
        POMFF,
        provider
    )
  
    let priceUsd = await axios.get("https://api.dexscreener.com/latest/dex/pairs/arbitrum/0xF7931f53ecf735e3Fb8f4FDe0d04f6a5ADF7308A")
    let AREbl = await contract?.balanceOf(REACT_APP_TREASURY_WALLET as string)
    let AREblUsd = parseFloat(priceUsd.data.pair.priceUsd)*(parseFloat(AREbl)/100000)
    setAREPrice(priceUsd.data.pair.priceUsd)
    setBalanceUsd(AREblUsd.toString());
    let initInvVal = parseFloat(AREAmount)*parseFloat(priceUsd.data.pair.priceUsd);
    setInitInv(initInvVal.toString());
  }
  const onChangeData = () => {
    if(AREAmount){
    let initInvVal = parseFloat(AREAmount)*parseFloat(AREPrice);
    setInitInv(initInvVal.toString());
    let ARER = parseFloat(AREAmount)*Math.pow(1+0.023,parseInt(days))
    let potR = (Number(AREPrice) * Number(ARER)).toString()
    setAREReward(ARER.toString());
    setPotReturn(potR.toString());
    } else {
      setInitInv("0");
      setAREReward("0");
      setPotReturn("0");
    }
  };  
  useEffect(() => {
    onChangeData()
  }, [AREAmount,days]);

  const addCss = () => {
    const progress = document.querySelector(".progresss");

    progress.addEventListener("input", function () {
      const value = this.value;
      this.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${value}%, #fff ${value}%, white 100%)`;
    });
  };

  return (
    <section className="calculator-sec pb-4">
      <div className="row card-lr">
        <div className="col-md-12 col-md-12 d-flex flex-column align-items-center justify-content-center">
          <p className="header">Calculator</p>
          <p className="sub-header">Estimate your returns</p>
        </div>
        <div className="col-lg-4 col-md-12 mt-3 d-flex flex-column align-items-center justify-content-center">
          <div className="w-85 d-flex justify-content-center align-items-center flex-column">
            <p className="sub-card-title">Current ARE PRICE</p>
            <p className="sub-card-value">${AREPrice}</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 mt-3 d-flex flex-column align-items-center justify-content-center">
          <div className="w-85 d-flex justify-content-center align-items-center flex-column">
            <p className="sub-card-title">Current APY</p>
            <p className="sub-card-value">383,025.8%</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 mt-3 d-flex flex-column align-items-center justify-content-center">
          <div className="w-85 d-flex justify-content-center align-items-center flex-column">
            <p className="sub-card-title">Your ARE Balance</p>
            <p className="sub-card-value">${balanceUsd}</p>
          </div>
        </div>

        <div className="col-lg-6 col-md-12 mt-4 d-flex flex-column align-items-center justify-content-center">
          <div className="form-contorl">
            <label>ARE Amount</label>
            <input
              onChange={(e) => setAREAmount(e.target.value)}
              defaultValue={AREAmount}
              type="number"
              className="noscroll"
              min={0}
            />
            <div className="input-right">Max</div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 mt-4 d-flex flex-column align-items-center justify-content-center">
          <div className="form-contorl">
            <label>APY%</label>
            <input
              onChange={(e) => setApy(e.target.value)}
              defaultValue={apy}
              disabled
            />
            <div className="input-right">Current</div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 mt-4 d-flex flex-column align-items-center justify-content-center">
          <div className="form-contorl">
            <label>ARE PRICE at purchase ($)</label>
            <input
              onChange={(e) => setPurchase(e.target.value)}
              defaultValue={purchase}
              value={AREPrice}
              disabled
            />
            <div className="input-right">Current</div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 mt-4 d-flex flex-column align-items-center justify-content-center">
          <div className="form-contorl">
            <label>Future ARE market price ($)</label>
            <input
              onChange={(e) => setMarketPrice(e.target.value)}
              defaultValue={marketPrice}
              disabled
            />
            <div className="input-right">Current</div>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 mt-4 d-flex flex-column align-items-center justify-content-center">
          <div className="form-control-range">
            <div className="d-flex justify-content-between pe-5">
              <span className="total-days">{days} days</span>
              <span>First year: 0.02355% Pre EPOCH</span>
            </div>
            <input
              className="progresss"
              onChange={(e) => setDays(e.target.value)}
              type="range"
              min="0"
              max="365"
              value={days}
            />
          </div>
        </div>
        {/* <div className="col-lg-6 col-md-12 mt-4 d-flex flex-column align-items-center justify-content-center">
          <div className="form-control-range">
            <span>Second year: 0.02355% Pre EPOCH</span>
            <input
            value={days}
              className="progresss"
              onChange={(e) => setDays(e.target.value)}
              type="range"
              min="174"
              max="430"
            />
          </div>
        </div> */}

        <div className="col-md-12 mt-4 bottom-sec">
          <div className="d-flex justify-content-between">
            <p>Your initial investment</p>
            <p>${initInv}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>Current wealth</p>
            <p>${initInv}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>ARE rewards estimation</p>
            <p>{AREReward} ARE</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>Potential return</p>
            <p>${potReturn}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accountpage;
