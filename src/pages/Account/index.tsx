import React, { useEffect, useState } from "react";
import { accountTableData } from "utils/data";
import { useMoralis } from 'react-moralis'
import "./Account.scss";
import { ethers } from "ethers";
import ARE from "../../config/contract/abi/ARE.json";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const Accountpage = () => {
  const [activeTime, setActiveTime] = useState<string>();
  const [balanceUsd, setBalanceUsd] = useState<string>("0");
  const [balanceARE, setBalanceARE] = useState<string>("0");
  const [connectStat, setConnectStat] = useState<boolean>(false);
  const [initalTime, setInitalTime] = useState<string>();
  const [lastRebaseTime, setLastRebaseTime] = useState<string>();

  const {REACT_APP_DEPLOYED_CONTRACT, REACT_APP_TREASURY_WALLET, REACT_APP_RPC_DOGICHAIN} = process.env;


const {
  account
} = useMoralis()

useEffect(() => { 
  getData();
  timmerFun();
  walletConnect();
}, [account, accountTableData, initalTime])

const walletConnect = () => {
  if(!account && !connectStat){
    toast.error("Please Connect you wallet!");
    setConnectStat(true);
  }
}

var formatter = new Intl.NumberFormat('en-US', {});

const getData = async () => {
  const provider: any = new ethers.providers.Web3Provider(
    // REACT_APP_RPC_DOGICHAIN as any
    window.ethereum as any
  )

  const contract = new ethers.Contract(
      REACT_APP_DEPLOYED_CONTRACT as string,
      ARE,
      provider
  )
  let initTime = await contract?._initRebaseStartTime();
  let lastTime = await contract?._lastRebasedTime();
  let priceUsd = await axios.get("https://api.dexscreener.com/latest/dex/pairs/arbitrum/0xF7931f53ecf735e3Fb8f4FDe0d04f6a5ADF7308A")
  // let AREbl = await contract?.balanceOf(REACT_APP_TREASURY_WALLET as string)
  // alert(account)
  if(!priceUsd.data.pair){
    priceUsd.data.pair.priceUsd = "0"
  }
  let AREbl = "0";
  if(account){
    AREbl = await contract?.balanceOf(account as string)    
  } else {
    AREbl = "0";
  }

  setInitalTime((parseInt(initTime)*1000).toString());
  setLastRebaseTime((parseInt(lastTime)*1000).toString());
  
  accountTableData[0].value = "$"+priceUsd.data.pair.priceUsd;
  accountTableData[1].value = ((parseFloat(AREbl)/100000)*0.02355).toFixed(2).toString()+" ARE";
  accountTableData[2].value = "$"+(parseFloat(priceUsd.data.pair.priceUsd)*((parseFloat(AREbl)/100000)*0.02355)).toFixed(2).toString();
  accountTableData[4].value = "$"+(parseFloat(priceUsd.data.pair.priceUsd)*((parseFloat(AREbl)/100000)*2.28)).toFixed(2).toString();
  accountTableData[5].value = (((parseFloat(priceUsd.data.pair.priceUsd)*(parseFloat(AREbl)/100000))*11.96)/100).toFixed(2).toString()+"%";
  accountTableData[6].value = "$"+(parseFloat(priceUsd.data.pair.priceUsd)*((parseFloat(AREbl)/100000)*11.96)).toFixed(2).toString();
  
  
  let AREblUsd = parseFloat(priceUsd.data.pair.priceUsd)*(parseFloat(AREbl)/100000)
  setBalanceARE((parseFloat(AREbl)/100000).toFixed(2).toString());
  setBalanceUsd(AREblUsd.toFixed(2).toString());
  // let weth = await provider?.getBalance(REACT_APP_TREASURY_WALLET as string)
  // let ts = await contract?._totalSupply();
}


  const timmerFun = () => {
    let h = 0;
    let m = 15;
    let s = 0;

    if(new Date().getTime() > parseInt(initalTime)) {
      let remainingTime = new Date(parseInt(lastRebaseTime) + (15 * 60 * 1000)).getTime() - new Date().getTime()
      // setPresentTime((parseInt(lastRebaseTime) - new Date().getTime()).toString());
      let rtime = new Date(remainingTime)
      m = rtime.getMinutes();
      s = rtime.getSeconds();


    setInterval(() => {
      s--;
      if (s < 0) {
        s = 59;
        m--;
        if (m < 0) {
          m = 59;
          h--;
          if (h < 0) {
            location.reload();
          }
        }
      }
      const time =
        ("0" + h).slice(-2) +
        ":" +
        ("0" + m).slice(-2) +
        ":" +
        ("0" + s).slice(-2);
      setActiveTime(time);
    }, 1000);
    }  else {
      h = m = s = 0;
      // alert('dhuke nai!')
    }
  };

  return (
    <section className="accountpage-sec">
      <div className="row top">
      <ToastContainer />
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column left align-items-center pb-3">
          <div className="card parallel-border-lr ">
            <p className="title-body1">Your Balance</p>
            <h4 className="title-h4">${balanceUsd}</h4>
            <p className="title-body1">{formatter.format(parseFloat(balanceARE)) || 0}  ARE</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column middle align-items-center pb-3">
          <div className="card parallel-border-lr ">
            <p className="title-body1">APY</p>
            <h4 className="title-h4">383,025.8%</h4>
            <p className="title-body1">Daily ROI 2.28%</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column right align-items-center pb-3">
          <div className="card parallel-border-lr ">
            <p className="title-body1">Next Rebase:</p>
            <h4 className="title-h4">{activeTime}</h4>
            <p className="title-body1  loading-dot">Rebasing</p>
          </div>
        </div>
      </div>
      <div className="row bottom mt-4 pb-4">
        <div className="col-md-12 align-items-center">
        <div className="card card-table">
          {accountTableData.map((item, index) => {
            return (
              <div
                className="single-row w-100 d-flex justify-content-between"
                key={index}
              >
                <p className="title-body1">{item.title}</p>
                <h5 className="title-h5">{item.value}</h5>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
};

export default Accountpage;
