import { Fragment, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import nav_links from "./nav-links";
import { imageData } from "../../utils/imageSrc";
import "./Sidebar.scss";

const Sidebar = ({setSidebar}) => {

  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState<string>()

  useEffect(() => {
    setActiveRoute(location.pathname)
  },[location.pathname])

  return (
    <div className="sidebar-sec">
      <ul className="sidebar d-flex flex-column justify-content-center align-items-center">
        <div className="logo">
          <img src={imageData.logoImg} alt="logo" />
        </div>
        {nav_links.map((sideBarItem, index) => {
          return (
            <li key={index} className={activeRoute===sideBarItem.link?'w-100 gradient-bg':'w-100'}>
              <NavLink to={sideBarItem.link} onClick={()=>setSidebar(false)}>{sideBarItem.label}</NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
