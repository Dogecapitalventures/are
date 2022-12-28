import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import { ethers } from "ethers";
import POMFF from "../../config/contract/abi/ARE.json";
import { useMoralis } from 'react-moralis'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const Dashboard = () => {
  const [activeTime, setActiveTime] = useState<string>();
  const [, setTreasurayAsset] = useState<string>("0");
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const [crSupply, setCrSupply] = useState<string>("0");
  const [marketCap, setMarketCap] = useState<string>("0");
  const [safehouseVal, setsafehouseVal] = useState<string>("0");
  const [poolVal, setPoolVal] = useState<string>("0");
  const [connectStat, setConnectStat] = useState<boolean>(false);
  const [AREPrice, setAREPrice] = useState<string>();
  const [initalTime, setInitalTime] = useState<string>();
  const [lastRebaseTime, setLastRebaseTime] = useState<string>();
  const [presentTime, setPresentTime] = useState<string>();
  const {REACT_APP_DEPLOYED_CONTRACT, REACT_APP_TREASURY_WALLET, REACT_APP_POOL_VALUE, REACT_APP_ARE_INSURANCE, REACT_APP_SAFEHOUSE} = process.env;

  const {
    account
} = useMoralis()

  useEffect(() => {
    getData();
    walletConnect();
  }, [account]);

  const walletConnect = () => {
    if(!account && !connectStat){
      toast.error("Please Connect you wallet!");
      setConnectStat(true);
    }
  };
  
  var formatter = new Intl.NumberFormat('en-US', {
    // style: 'currency',
    // currency: 'USD',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  

// let presentTime:Number;

const getData = async () => {
  // alert(Number("1344444324214").toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,'))

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
  if(!priceUsd.data.pair){
    setAREPrice("0")
  }else {
    setAREPrice(priceUsd.data.pair.priceUsd)
  }
  let AREbl = await contract?.balanceOf(REACT_APP_TREASURY_WALLET as string)
  let weth = await provider?.getBalance(REACT_APP_TREASURY_WALLET as string)
  let poolVARE = await contract?.balanceOf(REACT_APP_POOL_VALUE as string)
  let poolweth = await provider?.getBalance(REACT_APP_POOL_VALUE as string)
  let insARE = await contract?.balanceOf(REACT_APP_ARE_INSURANCE as string)
  let insweth = await provider?.getBalance(REACT_APP_ARE_INSURANCE as string)
  let fireARE = await contract?.balanceOf(REACT_APP_SAFEHOUSE as string)

  let ts = await contract?.totalSupply();
  let initTime = await contract?._initRebaseStartTime();
  let lastTime = await contract?._lastRebasedTime();
  setInitalTime((parseInt(initTime)*1000).toString());
  setLastRebaseTime((parseInt(lastTime)*1000).toString());
  // setLastRebaseTime("1663357065328");
  setTotalSupply(ts.toString());
  let cts = parseInt(ts)-(parseInt(fireARE)/100000);
  // alert(cts)

  
  // alert(formatter.format(Math.round(cts))); /* $2,500.00 */
  // alert(cts)
  setCrSupply(cts.toString())
  setMarketCap(((Number((parseInt(crSupply))?.toString()))*parseFloat(priceUsd.data.pair.priceUsd)).toFixed(3).toString());
  setsafehouseVal((parseFloat(AREbl)/100000).toString());
  // setBalance(ts.toString());
  // bl = await provider.getBalance("0x24B2098605289fFB826115EA0F9f8fC1ab5b816F");
  // setBalance(bl.toString());
  let AREblU = parseFloat(priceUsd.data.pair.priceUsd)*(parseFloat(AREbl)/100000)
  let fireAREblU = parseFloat(priceUsd.data.pair.priceUsd)*(parseFloat(fireARE)/100000)
  setsafehouseVal(fireAREblU.toString());
  let wpom = parseFloat(priceUsd.data.pair.priceUsd)*((parseFloat(weth)/1000000000000000000) as any)
  setTreasurayAsset((AREblU+wpom).toString())
  let poolAREblU = parseFloat(priceUsd.data.pair.priceUsd)*(parseFloat(poolVARE)/100000)
  let poolwethe = parseFloat(priceUsd.data.pair.priceUsd)*((parseFloat(poolweth)/1000000000000000000) as any)
  setPoolVal((poolAREblU+poolwethe).toString())

}

useEffect(() => {
  timmerFun();
}, [initalTime]);
const timmerFun = () => {
  let h = 0;
  let m = 15;
  let s = 0;
  // alert(new Date().getTime() + ' initTime:'+ parseInt(initalTime))
  
  if(new Date().getTime() > parseInt(initalTime)) {
    let remainingTime = new Date(parseInt(lastRebaseTime) + (15 * 60 * 1000)).getTime() - new Date().getTime()
    setPresentTime((parseInt(lastRebaseTime) - new Date().getTime()).toString());
    let rtime = new Date(remainingTime)
    m = rtime.getMinutes();
    s = rtime.getSeconds();
    // alert('hello!')
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

  } else {
    h = m = s = 0;
    // alert('no deposit')
  }
  
  };
  return (
    <section className="dashboard-section">
      <div className="row top">
      <ToastContainer />
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column left align-items-center">

       <div className="card parallel-border-lr mx-2">
            <div className="card-title-regular">Total Supply</div>
            <div className="card-value">{325000/*formatter.format(parseInt( String(Number(totalSupply))))*/}</div>
          </div>
          <div className="card parallel-border-lr mx-2">
            <div className="card-title-regular">Circulating Supply</div>
            <div className="card-value">{325000/*formatter.format(parseInt( String(Number(crSupply))))*/}</div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 middle d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex align-items-center justify-content-center flex-column">
            <div className="btn--outline card parallel-border-lr">
              ARE PRICE
            <div className="card-value1">${AREPrice}</div>
            </div>
            <div className="card card-timmer mx-2">
              <div className="timer-sec d-flex">
                <div className="span">
                <span>{activeTime}</span>
                <span className="card-title-regular loading-dot mt-2">
                  Rebasing
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column left align-items-center">
          <div className="card parallel-border-lr mx-2">
            <div className="card-title-regular">MarketCap</div>
            <div className="card-value">${marketCap}</div>
          </div>
          <div className="card parallel-border-lr mx-2">
            <div className="card-title-regular">Pool Value</div>
            <div className="card-value">${parseInt(poolVal)}</div>
          </div>
        </div>
      </div>

      <div className="row bottom mt-2">
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column left align-items-center">
          {/* <div className="card parallel-border">
            <div className="card-title-regular"># Value of SAFEHOUSE</div>
            <div className="card-value">5,765,134.72 POMF</div>
          </div> */}
        </div>
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column middle align-items-center">
          <div className="card parallel-border">
            <div className="card-title-regular">$ Value of SAFEHOUSE</div>
            <div className="card-value">${parseInt(safehouseVal)}</div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 d-flex justify-content-end flex-column right align-items-center">
          {/* <div className="card parallel-border">
            <div className="card-title-regular">% SAFEHOUSE : Supply</div>
            <div className="card-value">24.90%</div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
