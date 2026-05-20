import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { useLocation } from "react-router-dom";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { setPlatformType } from "../../../redux/action-creator/commonAction";
import { AuthContext } from "../../../context/authContext";
import { useContext } from "react";
import Popup from "../Popups/Popup";
import Profile from "../profile/Profile";
// import HeaderTable from "./HeaderTable";
import "../dialogBox.js/dialog.css";
import availableRoutes from "../../../routes/availableRoutes";
// import ActionType from "../../../redux/types";
import { loggedOut } from "../../../redux/action-creator/authCreator";
// import axios from "axios";
import {
  // IDENTITY_MODULE_BASE_URL,
  ONECOMMERCE_LOGIN_URL,
} from "../../../utils/url";
// import { _POST } from "../../../services/axios.method";
// import { LOGOUT_API_URL } from "../../../utils/constants";

import egenie from "../../CommonSidebar/icons/egenie.svg";
import { useClientPermission } from "../../../context/ClientPermissionContext";

const Header = () => {
  const { clientPermission } = useClientPermission();
  console.log('clientPermission',clientPermission)
  // const Header = ({ setExpand, platform }) => {
  // const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  let name;
  let header = availableRoutes?.filter(
    (item) => item.routePath === location.pathname
  );
  const user_info = useSelector((state) => state?.AuthReducer);
  const dispatch = useDispatch();

  // const history = useHistory();
  const headerDropdown = useRef(null);
  const notificationRef = useRef(null);
  const [, setHeaderPlatform] = useState("");
  // const [headerPlatform, setHeaderPlatform] = useState("");
  const [, setPlatforms] = useState([]);
  // const [platforms, setPlatforms] = useState([]);
  // const [headerPlatform, setHeaderPlatform] = useState(
  //   commonReducer.platFormType
  // );

  const [popup, setPopup] = useState(false);
  const [, setdialog] = useState(false);
  // const [dialog, setdialog] = useState(false);
  const [showOpenModal, setOpenModal] = useState(false);
  const authContext = useContext(AuthContext);
  const { onLogout } = authContext;
  // eslint-disable-next-line no-unused-vars
  // const [anchorEl, setAnchorEl] = React.useState(null);
  // eslint-disable-next-line no-unused-vars
  const [notificationCount, setNotificationCount] = useState(0);
  // const [clientName, setClientName] = useState(localStorage.getItem('client_name'));

  // const open = Boolean(anchorEl);
  // const id = open ? "simple-popover" : undefined;
  const logout = async () => {
    try {
      setPopup(false);
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("clientPermission");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("full_name");
      sessionStorage.removeItem("client_id");
      sessionStorage.removeItem("client_name");
      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem("client_projects");
      sessionStorage.removeItem("im_token");
      sessionStorage.removeItem("email");
      localStorage.clear();

      window.location.href = ONECOMMERCE_LOGIN_URL;
      // const handleLogout = async () => {
      //   setPopup(false);
      //   try {
      //     const user = JSON.parse(localStorage.getItem("user"));
      //     if (!user) {
      //       ToastHandler.error("User not found. Please login again.");
      //       return;
      //     }
    
      //     const { email, access_token } = user;
    
      //     // Verify token
      //     const logoutResponse = await axiosInstance.post(
      //       "/user/logout",
      //       {
      //         email,
      //         access_token,
      //       }
      //     );
    
      //     const checkCode = logoutResponse?.data?.code;
      //     localStorage.removeItem("user");
      //       Cookies.remove("accessToken");
      //       localStorage.removeItem("idtoken");
      //       localStorage.removeItem("clientId");
      //       Cookies.remove("refresh_token");
      //       localStorage.removeItem('clientPermission')
      //       setTimeout(() => {
      //         router.push("/logout");
      //       }, 2000);
    
      //     // if (checkCode === 400 || checkCode === 200) {
            
      //     // }else{
      //     //   ToastHandler.error("Authentication failed. Please login again.");
      //     //   return;
      //     // }
    
      //     // Logout request
      //     // const logoutResponse = await axiosInstance.post("/user/logout", {
      //     //   email,
      //     //   access_token: accessToken,
      //     // });
    
      //     // const { code, message } = logoutResponse?.data;
    
      //     // if (code === 200) {
      //       // Clear user data from localStorage
            
    
      //       // Ensure toast is called
      //       // const successMessage = message || "Logged out successfully!";
    
      //       // Multiple toast methods to ensure visibility
      //       // ToastHandler.success(successMessage);
    
      //       // Optional: Alternative toast method if primary fails
    
      //       // Delayed navigation
           
      //     // } else {
      //     //   const errorMessage = message || "Failed to log out. Please try again.";
    
      //     //   ToastHandler.error(errorMessage);
      //     // }
      //   } catch (error) {
      //     // Comprehensive error logging
    
      //     const errorMessage =
      //       error.response?.data?.message ||
      //       error.message ||
      //       "An unexpected error occurred during logout";
    
      //     ToastHandler.error(errorMessage);
      //   }
      // };

      
      // const verifyTokenUrl =
      //   IDENTITY_MODULE_BASE_URL + "user/verifyTokenbyemail";

      // const url = IDENTITY_MODULE_BASE_URL + "user/logout";

      // const im_token = localStorage.getItem("im_token");
      // const email = localStorage.getItem("email");
      // await _POST(LOGOUT_API_URL, {});
      // if (im_token && email) {
      //   const verfyRes = await axios.post(verifyTokenUrl, {
      //     email,
      //     refresh_token: im_token,
      //   });

      //   await axios.post(url, {
      //     email: email,
      //     access_token: verfyRes.data?.data?.access_token,
      //   });

      // }

      // // await _POST(LOGOUT_API_URL, {});

      // window.location.href = ONECOMMERCE_LOGIN_URL;

      // dispatch(loggedOut("Logged Out"));
      // onLogout();
    } catch (error) {
      window.location.href = ONECOMMERCE_LOGIN_URL;
      dispatch(loggedOut("Logged Out"));
      onLogout();
    }
  };

  // const handleClientChange = async (client) => {
  //   // setClientId(client);
  //   let getClient = (client)
  //   console.log('client---',getClient.clientId)
  //   localStorage.setItem('client_id', getClient.clientId);
  //   localStorage.setItem('client_name', getClient.clientName);
  //   setClientName(getClient.clientName)
  //   setPopup(false)
  //   window.location.reload()
  // };

  const getNotificationCount = async () => {
    let data = {};
    if (localStorage.getItem("notification-platform")) {
      data = {
        platform: localStorage.getItem("notification-platform"),
        status: "0",
      };
    } else {
      // eslint-disable-next-line no-unused-vars
      data = {
        platform: localStorage.getItem("platform_type"),
        status: "0",
      };
    }
    // const resp = await _POST(GET_NOTIFICATION_COUNT, data);
    // setNotificationCount(() => resp?.data?.data?.unreadNotifications);
  };

  React.useEffect(() => {
    name = localStorage.getItem("name");
    // let platforms = localStorage.getItem("platforms");
    // eslint-disable-next-line no-console
    // console.log('1234', platforms);
    // platforms = JSON.parse(platforms);
    // dispatch(setPlatformType(header[0].sidebar));
    // eslint-disable-next-line no-console
    const sortedPlatforms = _.sortBy(user_info?.platforms, 'platform_id');
    const platformValues = _.map(sortedPlatforms, 'platform_value');
    console.log("cheking platform value",platformValues);
    
    setPlatforms(platformValues);
    dispatch(setPlatformType(header[0].sidebar));
    setHeaderPlatform(header[0].sidebar);
    localStorage.setItem("platform_type", JSON.stringify(header[0].sidebar));
    // console.log("header ====>", header[0].sidebar);
    getNotificationCount();
    localStorage.removeItem("notification-platform");

    localStorage.removeItem("notification-platform");
    const intervalId = setInterval(getNotificationCount, 10000); // Fetch every 10 seconds
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleClickOutside = (event) => {
    // console.log("This triggred")
    if (
      headerDropdown.current &&
      !headerDropdown.current.contains(event.target)
    ) {
      setPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // handling click outside of notification dropdown
  const handleClickOutsideNotif = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      localStorage.removeItem("notification-platform");
      getNotificationCount();
      setdialog(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideNotif);
    return () => {
      document.removeEventListener("click", handleClickOutsideNotif);
    };
  }, []);

  
  const client_projects = JSON.parse(localStorage.getItem("client_projects") ?? "[]");

  const [active_client_project, setActiveClientProject] = useState({});
  const previous_active_client_project = useRef();
  useEffect(() => {
    const active_client=JSON.parse(localStorage.getItem("active_client_project") ?? "{}");
    previous_active_client_project.current=JSON.stringify(active_client);
    setActiveClientProject(active_client);
  }, []);
  const handle_active_client_project_change = (new_active_client_project) => {
    if(previous_active_client_project.current!=JSON.stringify(new_active_client_project)){
      previous_active_client_project.current=JSON.stringify(new_active_client_project);
      localStorage.setItem("active_client_project", JSON.stringify(new_active_client_project));
      setActiveClientProject(new_active_client_project);
      window.location.reload();
    }
    setPopup(false);
  }

  return (
    <>
      <div className="header" id="header-custom">

        <img src={egenie} width={30} height={30} />
        <div className="text-[22px] leading-[22px] text-[#333333]"> e-Genie Suite</div>
        {/*<button
          className="header__humburgerBtn"
          onClick={() => {
            setExpand();
          }}
        >
          <div>
            {platform === "/dashboard" && (
              <img
                src="/assets/images/hamburger-icon.svg"
                alt="hamburger"
                loading="eager"
              />
            )}
            {platform === "/flipkart" && (
              <img
                src="/assets/images/hamburger-icon.svg"
                alt="hamburger"
                loading="eager"
              />
            )}
            {platform === "/amazon" && (
              <img
                src="/assets/images/hamburgerAms.svg"
                alt="hamburger"
                loading="eager"
              />
            )}
            {platform === "/blinkit" && (
              <img
                src="/assets/images/humburgerblinkit.svg"
                alt="hamburger"
                loading="eager"
              />
            )}
            {platform === "/instamart" && (
              <img
                src="/assets/images/insta.svg"
                alt="hamburger"
                loading="eager"
              />
            )}
            {platform === "/zepto" && (
              <img
                src="/assets/images/hamburgerzepto.svg"
                alt="hamburger"
                loading="eager"
              />
            )}
          </div>
        </button>*/}
        {/* <div className="header__dropdownOuter">
          <div className="">
            <select
              className="header__dropdown"
              onChange={(e) => {
                let val = e.target.value;
                // console.log("VAL",val)
                // navigate(val);
                history.push(val);
                // setPlatform(val)
                setHeaderPlatform(val);

                dispatch(setPlatformType(val));
                localStorage.removeItem("default_compare_dates");
                // localStorage.removeItem("default_date");
                localStorage.setItem("platform_type", JSON.stringify(val));

                dispatch({
                  type: ActionType.NEGATIVEKEYWORDS,
                  payload: [],
                });
                // setPlatform(val)
              }}
              value={headerPlatform}
            >
              <option value={""} disabled>
                Select Platform
              </option>
              <option value={"/dashboard"}>Dashboard</option>
              {platforms?.map((item, key) => (
                <option key={key} value={`/${item}`}>
                  {item[0].toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div> */}
        <div className="col ">
          <div className=" header__rightMenu ">
            {/* <div ref={notificationRef} className="mt-1">
              <button
                className="header__rightMenu--image relative"
                style={{ "zIndex": 10 }} // Added 'relative' class to make positioning the badge easier
                onClick={() => {
                  setdialog(!dialog);
                }}
                aria-describedby={id}
                // eslint-disable-next-line react/no-unknown-property
                variant="contained"
              >
                <img src="/assets/images/bell.icon.svg" alt="" />
                {notificationCount > 0 && (
                  <span className="bell_icon_notification">
                    {notificationCount}
                  </span>
                )}
              </button>
              {dialog && (
                <ul className="user_options1">
                  <HeaderTable
                    getNotificationCount={getNotificationCount}
                    platforms={platforms}
                  />
                </ul>
              )}
            </div> */}

            <div className=" flex">

              <div ref={headerDropdown} className="relative">
                <div className="header__rightMenu--admin ">
                  <div className="row items-start">
                    <button
                      className="header__rightMenu--image"
                      onClick={() => {
                        setPopup(!popup);
                      }}
                    >
                      <div className="flex gap-1 items-center">
                        {/* <h2 className="headerText">
                        Brand Name
                        </h2> */}
                        {/* <img
                          className="rounded-sm w-[30px] h-[30px]"
                          src="/assets/images/nestleLogo.svg"
                          alt=""
                        />
                        <h2 className="headerText">
                        Nestle
                        </h2> */}
                        {/* <img
                          className="rounded-full w-[30px] h-[30px]"
                          src="/assets/images/colpalLogo.svg"
                          alt=""
                        />
                        <h2 className="headerText">
                        ColPal
                        </h2> */}
                        {active_client_project?.logo_url ?
                          <img
                            className="rounded-full w-[30px] h-[30px]"
                            src={active_client_project?.logo_url}
                            alt={active_client_project?.client_project_name}
                          />
                          : <></>}
                        <h2 className="capitalize text-[18px] font-semibold">{active_client_project?.client_project_name ?? ""}</h2>



                      </div>
                      <img src="/assets/images/dropdownArrow.svg" className="w-4 h-4" alt="" />
                    </button>
                  </div>
                </div>
                {popup && (
                  <ul className="user_options">
                    <li
                      className="user_options_content"
                    >
                      <button className="flex flex-row gap-1 bg-[#E0F0FF] w-full p-2.5 rounded items-center" onClick={() => {
                        setOpenModal(!showOpenModal);
                      }}>
                        <img src="/assets/images/userImg.jpg" className="w-8 h-8 rounded-full border border-[#0081F7]" alt="" />
                        <h2 className="capitalize">
                          {localStorage.getItem("name")
                            ? localStorage.getItem("name")
                            : null}</h2>
                      </button>
                    </li>

                    {client_projects && client_projects?.length ? client_projects?.map(
                      (project, project_index) => (

                        <li key={project_index} className="user_options_content" onClick={() => { handle_active_client_project_change(project) }}>
                          <div className="user_list_content">
                            {project?.logo_url ?
                              <img
                                className="rounded-full w-[30px] h-[30px]"
                                src={project?.logo_url}
                                alt={project?.client_project_name}
                              />
                              : <></>}
                            <h2 className="capitalize text-[18px]">{project?.client_project_name}</h2>

                          </div>
                        </li>
                      )
                    ) : <></>}



{/* {clientPermission && clientPermission.length > 0 ? (
                  clientPermission.map((client,index) => (
                    <li className="user_options_content" key={index} onClick={() => handleClientChange(client)}>
                      <div className="user_list_content">
                        <img
                          className="rounded-full w-[30px] h-[30px]"
                          src="/assets/images/colpalLogo.svg"
                          alt=""
                        /> 
                         <h2 className="capitalize">{client.clientName}</h2>
                        
                       
                      </div>
                    </li>
                    ))
                  ) : (
                    <p>No clients available</p>
                  )} */}
                  
                    {/* <li className="user_options_content">
                      <div className="user_list_content">
                        <img
                          className="rounded-full w-[30px] h-[30px]"
                          src="/assets/images/colpalLogo.svg"
                          alt=""
                        /> 
                         <h2 className="capitalize">ColPal</h2>
                        
                        </div>
                    </li> */}
                    {/* <li className="user_options_content">
                      <div className="user_list_content">
                        
                        <h2 className="capitalize">Nestle</h2>

                        <img
                          className="rounded-sm w-[30px] h-[30px]"
                          src="/assets/images/nestleLogo.svg"
                          alt=""
                        />
                        <h2 className="capitalize">Nestle</h2>
                      </div>
                    </li> */}
                    {/* <li className="user_options_content">
                      <div className="user_list_content">
                        <h2 className="capitalize text-[18px] font-semibold">
                          Brand Name
                        </h2>
                      </div>
                    </li> */}
                    {/* <li className="user_options_content">
                      <div className="user_list_content">
                        <img
                          className="rounded-full w-[30px] h-[30px]"
                          src="/assets/images/nestleLogo.svg"
                          alt=""
                        />
                        <h2 className="capitalize">Nestle</h2>
                      </div>
                    </li> */}
                    {showOpenModal && (
                      <Popup
                        title="Welcome"
                        setShowPopup={setOpenModal}
                        smallsize
                        cutomButton={[
                          {
                            handleClick: () => setOpenModal(!showOpenModal),
                            label: "OK",
                            style: "",
                          },
                        ]}
                      >
                        <Profile />
                      </Popup>
                    )}

                    <hr className="mt-2.5" />
                    <li className="signout_content" onClick={logout}>
                      <img src="/assets/images/logout.svg" className="w-4 h-4" alt="" />
                      Sign out
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
