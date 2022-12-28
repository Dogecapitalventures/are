import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header/Header";
import "./Layout.scss";
import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ children }: any) => {
  const [sidebar, setSidebar] = useState<boolean>(false)
  const { pathname } = useLocation();

  const onClickMenu = () => {
    setSidebar(!sidebar)
  }

  return (
    <Fragment>
      <div className="d-flex flex-column" style={{ height: "100vh" }}>
        <Header sidebar={sidebar} setSidebar= {setSidebar}/>
        <div className={sidebar?'s-layout show-mobile-nav':'s-layout'}>
          <div className="page-content d-flex flex-row">
          <Sidebar setSidebar={setSidebar} />
          <div className="sidebaer-wrapper" onClick={()=>setSidebar(false)}></div>
          <div className="main-content">
            <div className="app-inner">{children}</div>
          </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Layout;
