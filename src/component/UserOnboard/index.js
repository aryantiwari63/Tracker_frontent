/* eslint-disable */
import React, { useState, useEffect } from "react";
import { _POST } from "../../services/axios.method";
// import { format } from "date-fns";

// import {
//   reportState,
//   reportCategory,
//   stateSetter,
//   platformConstant,
//   listHeader,
//   // DummyValues,
//   platformWise,
//   providedFilters,
//   DummyValues,
// } from "./report_constant";
// import { defaultDateRange } from "../../utils/helpers";

// import CategoryCard from "./CategoryCard";
// import RecordGrid from "./RecordGrid.js";
// import ComponentHeader from "./ComponentHeader";
// import FilterDrawer from "./OffscreenPages/FilterDrawer.js";
// import DatePickerModal from "./OffscreenPages/DatePickerModal.js";

import { cancelRequest } from "../../utils/helpers";
// import RecordList from "./RecordList.js";
import "../CustomReport/custommain.css";
import "../CustomReport/customreport.css";
import Toast from "../common-components/toast";
import { setToastMessageHandler } from "../../redux/action-creator/commonAction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import ConfirmationModal from "./OffscreenPages/ConfirmationModal";
// import SchedulePopup from "../Amazon/CustomReportSetting/SchedulePopup";
// import { useLocation } from "react-router-dom";

// import { useLocation } from "react-router-dom";
// import ActionType from "../../redux/types";
import FilterComponent from "./FilterComponent";
import UserList from "./UserList.js";
import UserForm from "./OffscreenPages/UserForm";
import "./style.css";
import ConfirmationModal from "../CustomReport/OffscreenPages/ConfirmationModal.js";

// const debounce = (func, delay) => {
//   let timeoutId;
//   return (...args) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => {
//       func(...args);
//     }, delay);
//   };
// };

export const listHeader = [
  {
    id: 1,
    title: "Status",
    value: "status",
    sorting: false,
    showCol: true,
  },
  {
    id: 2,
    title: "Username",
    value: "username",
    sorting: false,
    showCol: true,
  },
  {
    id: 3,
    title: "Email",
    value: "email",
    sorting: false,
    showCol: true,
  },
  {
    id: 4,
    title: "Platform",
    value: "platform_details",
    sorting: false,
    showCol: true,
  },
  {
    id: 5,
    title: "Role",
    value: "role",
    sorting: false,
    showCol: true,
  },
  {
    id: 6,
    title: "Verified",
    value: "is_verified",
    sorting: false,
    showCol: true,
  },
  {
    id: 7,
    title: "Created By",
    value: "created_by",
    sorting: true,
    showCol: true,
    multiValue: ["created_by", "created_at"],
    simpleDate: true,
  },
  {
    id: 8,
    title: "Updated By",
    value: "updated_by",
    sorting: true,
    showCol: true,
    multiValue: ["updated_by", "updated_at"],
    simpleDate: true,
  },
  {
    id: 9,
    title: "Details",
    value: "details",
    sorting: true,
    showCol: true,
    simpleDate: false,
  },
];

const messages = {
  // emails:
  //   "Your unsaved changes will be lost. Are you sure you want to proceed?",
  delete: "Are you sure you want to delete this user?",
  // copy: "Are you sure you want to duplicate this user?",
  status: "Are you sure you want to update the status for this user?",
};

const UserOnboard = () => {
  //   const dateFilters = defaultDateRange();
  // const client_id = localStorage.getItem("client_id");
  // const client_name = localStorage.getItem("client_name");
  const user_info = useSelector((state) => state.AuthReducer);
   console.log("user_info>>>>>>>>>>>>>", user_info);
  const history = useHistory();
  const [filters, setFilters] = useState({
    search: "",
    quickFilters: {
      created_on: [],
      last_edit: [],
      created_by: [],
      scheduled_at: [],
    },
    color: "#0081F7",
  });
  const [dataLimit, setDataLimit] = React.useState(0);
  //   const [platformFilters, setPlatformFilters] = useState(providedFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    // mobile: "",
    // countryCode: "+91",
    role: "manager",
    platform_details: [],
    isEditing: false,
  });
  // const [isEditing, setIsEditing] = useState(false);
  // const fullUrl = `${window.location.origin}`;
  // console.log("location>>>>>>>>>>>>>>>", fullUrl);
  // const currentPath = location.pathname;
  const useNewDispatch = useDispatch();
  const [userList, setUserList] = useState([]);
  // const [platformAccount, setPlatformAccount] = useState([]);

  const [loading, setLoading] = useState(false);
  // const [openFilterDrawer, setFilterDrawer] = useState(false);
  const [isConfirmationOpen, setConfirmation] = useState({
    type: undefined,
    option: undefined,
    user_id: undefined,
  });

  const [sortBy, setSortBy] = React.useState({
    key: "spend",
    order: -1,
  });

  const getUsers = async () => {
    try {
      setLoading("list");
      const ourRequest = await cancelRequest();
      const res = await _POST(
        `/commonscreen/users`,
        { filters },
        {
          cancelToken: ourRequest.token,
        }
      );
      if (res?.data?.status?.code === 200) {
        setUserList(res?.data?.data.result);
      }
      if (res?.status === 403) {
        history.push("/unauthorized");
      }
      // console.log("res>>>>>>>>>>>", res.status);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  // const getPlatformsAccounts = async () => {
  //   try {
  //     const ourRequest = await cancelRequest();
  //     const res = await _POST(
  //       `/commonscreen/platformaccounts`,
  //       {},
  //       {
  //         cancelToken: ourRequest.token,
  //       }
  //     );
  //     if (res?.data?.status?.code === 200) return res?.data?.data.result;
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // useEffect(() => {
  //   getUsers();
  // }, []);

  useEffect(() => {
    getUsers();
    // return () => {};
  }, [filters]);

  const openModal = async (values, type) => {
    let owner_platform = user_info.platforms;
    // console.log("owner_platform>>>>>>>>>>>", owner_platform);
    let userData = {};
    if (values) {
      values["isEditing"] = values.id;
      userData = { ...values, owner_platform };
      // console.log("userDAta>>>>>>>>>>", userData);
    } else {
      userData = {
        username: "",
        email: "",
        role: "manager",
        platform_details: owner_platform,
        isEditing: false,
      };
    }
    setFormData(userData);
    setIsModalOpen(type);
    const element = document.getElementById("header-custom");
    if (element) {
      element.style.zIndex = "0";
    }
  };

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onCloseModal = () => {
    const element = document.getElementById("header-custom");
    if (element) {
      element.style.zIndex = "500";
    }
    setIsModalOpen(false);
  };

  const onSubmit = async (e) => {
    try {
      const { isEditing } = formData;
      const ourRequest = await cancelRequest();
      formData["isEditing"] = isEditing ? true : false;
      formData["user_id"] = isEditing;
      setLoading("modal");
      const res = await _POST(
        `/commonscreen/upsertuser`,
        { formData, path: `${window.location.origin}` },
        {
          cancelToken: ourRequest.token,
        }
      );
      if (res?.data?.status?.code === 200) {
        setUserList((prevUsers) => {
          const existingUserIndex = prevUsers.findIndex(
            (user) => user.id === res?.data?.data?.result[0]?.id
          );

          if (existingUserIndex !== -1) {
            prevUsers.splice(existingUserIndex, 1);
          }

          return [res?.data?.data.result[0], ...prevUsers];
        });

        useNewDispatch(setToastMessageHandler(res?.data?.data?.message, true));
      } else
        useNewDispatch(setToastMessageHandler("Something went wrong", false));
      setLoading(false);
      onCloseModal();
    } catch (e) {
      console.error(e);
    }
  };

  const triggerHandler = async (type, option, user_id) => {
    try {
      const ourRequest = await cancelRequest();

      setLoading({ type, user_id });
      const res = await _POST(
        `/commonscreen/usertriggers`,
        {
          type,
          value: option,
          user_id,
          path: `${window.location.origin}`,
        },
        {
          cancelToken: ourRequest.token,
        }
      );

      if (res?.data?.status?.code === 200) {
        if (type === "status")
          setUserList((prevUsers) => {
            const existingUserIndex = prevUsers.findIndex(
              (user) => user.id === res?.data?.data.result[0].id
            );

            if (existingUserIndex !== -1) {
              prevUsers.splice(existingUserIndex, 1);
            }

            return [res?.data?.data.result[0], ...prevUsers];
          });

        if (type === "delete")
          setUserList((prevUsers) =>
            prevUsers.filter((user) => user.id !== user_id)
          );

        useNewDispatch(setToastMessageHandler(res?.data?.data?.message, true));
      } else {
        useNewDispatch(setToastMessageHandler("Something went wrong", false));
      }
      setLoading(false);
    } catch (error) {
      console.error(error, "testError");
    }
  };

  //   const triggerDownload = async (reportdata) => {
  //     try {
  //       dispatch({
  //         type: ActionType.GENERATEDREPORTLIST,
  //         payload: [],
  //       });
  //       setReportId(reportdata?.report_id);
  //       let payload = {
  //         columsData: reportdata.columnsdata,
  //         platform: reportdata.platform,
  //         start_date: reportdata.start_date_filter,
  //         end_date: reportdata.end_date_filter,
  //         platform_id: reportdata.account,
  //         download: true,
  //         ...reportdata.filters,
  //       };

  //       let data = await useNewDispatch(generatecustomreport(payload));
  //       // let data = generatedreportlist;
  //       // console.log("data>>>>>>>>>>", data);
  //       if (data.length > 0) {
  //         const headers = reportdata.columnsdata?.map((data) => data.title);
  //         const rowsData = reportdata.columnsdata?.map((data) => data.value);
  //         if (data && data?.length && headers && headers?.length) {
  //           // Function to convert array of objects to CSV string
  //           const arrayToCSV = (arr) => {
  //             const header = headers.join(",");
  //             const rows = arr.map((row) =>
  //               rowsData
  //                 .map((fieldName) => {
  //                   const value = row[fieldName];
  //                   return value === null || value === undefined
  //                     ? ""
  //                     : JSON.stringify(value);
  //                 })
  //                 .join(",")
  //             );

  //             return [header, ...rows].join("\n");
  //           };
  //           // Process data in chunks
  //           const CHUNK_SIZE = 1000; // Adjust based on your data size
  //           let csvContent = "";
  //           for (let i = 0; i < data.length; i += CHUNK_SIZE) {
  //             const chunk = data.slice(i, i + CHUNK_SIZE);
  //             csvContent += arrayToCSV(chunk) + "\n";
  //           }

  //           // Create a Blob from the CSV string
  //           const blob = new Blob(["\ufeff", csvContent], {
  //             type: "text/csv;charset=utf-8;",
  //           });

  //           // Define report name and type
  //           let report_name = reportdata.report_name;
  //           let report_type = reportdata.report_type;
  //           const currentDate = new Date();
  //           // Format date (example: YYYY-MM-DD)
  //           const formattedDate = `${currentDate.getFullYear()}-${(
  //             currentDate.getMonth() + 1
  //           )
  //             .toString()
  //             .padStart(2, "0")}-${currentDate
  //             .getDate()
  //             .toString()
  //             .padStart(2, "0")}`;

  //           // Generate a dynamic filename
  //           const filename = `${report_name}-${report_type}-${formattedDate}.csv`;

  //           // Generate a URL for the Blob
  //           const url = URL.createObjectURL(blob);

  //           // Create a link element
  //           const link = document.createElement("a");
  //           link.href = url;
  //           link.setAttribute("download", filename);

  //           // Append link to the body (required for Firefox)
  //           document.body.appendChild(link);
  //           console.log(link);
  //           // Programmatically click the link to trigger the download
  //           link.click();

  //           // Remove link from the document
  //           document.body.removeChild(link);
  //           useNewDispatch(
  //             setToastMessageHandler("Report downloaded Successfully", true)
  //           );
  //         }
  //       } else {
  //         useNewDispatch(
  //           setToastMessageHandler("No data found in report", false)
  //         );
  //       }
  //       setReportId(null);
  //     } catch (error) {
  //       setReportId(null);

  //       console.error(error, "testError");
  //     }
  //   };
  // console.log("filters>>>>>>>>>", filters);
  return (
    <>
      <Toast />
      {isModalOpen && (
        <UserForm
          onChange={handleChange}
          onClose={() => onCloseModal(false)}
          formData={formData}
          onSubmit={onSubmit}
          isModalOpen={isModalOpen}
          loading={loading}
          owner_info={user_info}
        // platformAccount={platformAccount}
        // setPlatformAccount={setPlatformAccount}
        />
      )}

      {isConfirmationOpen?.type && (
        <ConfirmationModal
          message={messages[isConfirmationOpen?.type]}
          color={"#0081F7"}
          isConfirmationOpen={isConfirmationOpen}
          onConfirm={(e) => {
            const element = document.getElementById("header-custom");
            if (element) {
              element.style.zIndex = "50";
            }

            const { type, option, user_id } = isConfirmationOpen;
            triggerHandler(type, option, user_id);
            setConfirmation(e);
          }}
          onCancel={(e) => setConfirmation(e)}
        />
      )}
      <div id="main-custom-container">
        {/* {openFilterDrawer && (
          <FilterDrawer;
            setFilterDrawer={() => setFilterDrawer(false)}
            platformFilters={platformFilters}
            setPlatformFilters={setPlatformFilters}
            filters={filters["quickFilters"]}
            calendar={filters["calendar"]}
            setQuickFilter={(value) =>
              dispatch({ type: "QUICK_FILTERS", value })
            }
            color={initialFilters?.color}
            platform={platform.slice(1)}
          />
        )} */}

        {/* {isConfirmationOpen?.type && (
          <ConfirmationModal
            message={messages[isConfirmationOpen?.type]}
            color={initialFilters?.color}
            isConfirmationOpen={isConfirmationOpen}
            onConfirm={(e) => {
              const element = document.getElementById("header-custom");
              if (element) {
                element.style.zIndex = "50";
              }
              if (isConfirmationOpen?.type === "emails") {
                setConfirmation(e);
                setScheduled(false);
              } else {
                const { type, option, report_id } = isConfirmationOpen;
                triggerHandler(type, option, report_id);
                setConfirmation(e);
              }
            }}
            onCancel={(e) => setConfirmation(e)}
          />
        )} */}
        {/* {filters?.calendar?.showCalendar && (
          <DatePickerModal
            setQuickFilter={(value) =>
              dispatch({ type: "QUICK_FILTERS", value })
            }
            calendar={filters["calendar"]}
            dateRange={dateRange}
            setDateRange={(item) => setDateRange(item?.selection)}
            color={initialFilters?.color}
            savedDates={savedDates}
            onCancel={() =>
              setDateRange({
                startDate: new Date(dateFilters["startDate"]),
                endDate: new Date(dateFilters["endDate"]),
                key: dateFilters["key"],
              })
            }
            component={"custom-report"}
            applyDate={applyDate}
          />
        )} */}
        <div
          className={` ${filters?.calendar?.showCalendar ? "z-0" : "z-40 sticky"
            } top-14 bg-bgclr`}
        >
          <div className="custom-card flex py-4 bg-white color-[#303030]">
            <b className="font-inter font-semibold text-[16px] leading-6">
              User Onboard
            </b>
          </div>

          <div className="custom-card flex py-3 bg-white z-[10]">
            <FilterComponent
              filters={filters}
              color={filters?.color}
              setFilterDrawer={(val) => setFilterDrawer(val)}
              setCategory={(value) => dispatch({ type: "CATEGORY", value })}
              setSearch={(value) => setFilters({ ...filters, search: value })}
              openModal={openModal}
            />
          </div>
        </div>
        <section>
          <div className={`bg-white p-3`}>
            <UserList key='test'
              listHeader={listHeader}
              sortBy={sortBy}
              setSortBy={(key, order) => sortData(key, order)}
              setDataLimit={setDataLimit}
              dataLimit={dataLimit}
              loadingState={loading}
              color={filters?.color}
              userList={userList}
              openModal={openModal}
              triggerHandler={triggerHandler}
              setConfirmation={(e) => {
                const element = document.getElementById("header-custom");
                if (element) {
                  element.style.zIndex = "50";
                }
                setConfirmation(e);
              }}
            // triggerHandler={(type, option, report_id) => {
            //   if (type === "download") {
            //     triggerDownload(report_id);
            //   } else if (type === "emails") {
            //     triggerHandler(type, option, report_id);
            //   } else {
            //     setConfirmation({ type, option, report_id });
            //   }
            // }}
            />
          </div>
        </section>

        {/* <tfoot>
          <div className="flex"></div>
        </tfoot> */}
      </div>
    </>
  );
};
export default UserOnboard;