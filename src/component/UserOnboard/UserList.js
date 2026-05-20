import React, { useState, useRef, useEffect } from "react";
import LoaderSpinner from "../common-components/loader-spinner";
// import UserForm from "./OffscreenPages/UserForm";

// import DoubleClickLink from "./doubleClick/DoubleClickLink";
import { convertDate } from "../CustomReport/report_constant";
import ToggleButton from "./Common/ToggleButton";
// import { useHistory } from "react-router-dom";

const underlineStyle = {
  // textUnderlineOffset: "0.3em",
  textDecoration: "underline",
  // textDecorationThickness: "0.1em",
};

const styleScheduledInfo = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const getColumnWidth = (index) => {
  switch (index) {
    case 0:
      return "100px";
    case 1:
      return "200px";
    case 2:
      return "300px";
    case 3:
      return "250px";
    default:
      return "120px";
  }
};

function UserList({
  userList,
  listHeader,
  sortBy,
  setSortBy,
  setDataLimit,
  dataLimit,
  // customReportData,
  loadingState,
  color,
  openModal,
  triggerHandler,
  setConfirmation,
  // edit_path,
}) {
  // console.log("loadingState>>>>>>>>>.", loadingState);
  // const history = useHistory();
  const containerRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredDetails, setIsHoveredDetails] = useState(false);
  const [height, setHeight] = useState(100);

  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;
    if (bottom) {
      setDataLimit(dataLimit + 50);
    }
  };

  // const handleClickOutside = (event) => {
  //   if (!event.target.dataset.dropdown) setActionStatusDropdown(false);
  // };

  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  const handleMouseEnter = (user_id) => {
    setIsHovered(user_id);
  };

  const handleMouseLeave = () => {
    setIsHovered(undefined);
  };

  useEffect(() => {
    setHeight(containerRef.current?.getBoundingClientRect().top);
  }, [containerRef.current]);

  const valueRenderer = (
    value,
    header,
    multiValue,
    simpleDate,
    headerIndex
  ) => {
    // console.log("value>>>>>>>>>", value);
    if (header === "platform_details") {
      return (
        <td
          className={`p-2 text-[14px] font-normal text-wrap`}
          key={headerIndex}
        >
          <div
            className="max-w-[90%] whitespace-nowrap overflow-ellipsis overflow-hidden"
            title={
              value[header] !== null && value[header].length > 0
                ? value[header]
                    .filter((val) => val.selected)
                    .map((val) => `${val.platform_title}`)
                : "-"
            }
          >
            {value[header] && value[header].some((val) => val.selected)
              ? value[header]
                  .filter((val) => val.selected)
                  .map((val, index, array) => (
                    <span key={`${val.user_id}_${val.platform_id}`}>
                      {val.platform_title}
                      {index < array.length - 1 ? ", " : ""}
                    </span>
                  ))
              : "-"}
          </div>
        </td>
      );
    } else if (multiValue) {
      if (simpleDate)
        return (
          <td className={`p-2 text-[14px] font-normal `} key={headerIndex}>
            {multiValue.map((innerHeader, index) => (
              <div
                className={`${index === 1 ? "text-gray-500" : ""}`}
                key={index}
              >
                {innerHeader === "created_at" || innerHeader === "updated_at"
                  ? convertDate(value[innerHeader].split(" ")[0])
                  : value[innerHeader]}
              </div>
            ))}
          </td>
        );
    } else if (header === "username") {
      return (
        <td
          className={`p-2 text-[14px] font-normal fixed-col`}
          // style={{ width: 170, maxWidth: "170px !important" }}
          key={headerIndex}
          onMouseEnter={() => handleMouseEnter(value.id)}
          onMouseLeave={() => handleMouseLeave()}
          // onClick={() => openModal(value, "full")}
        >
          <div
            className={`text-[${color}]  max-w-[90%] `}
            style={
              isHovered === value?.id
                ? // ? { ...underlineStyle, ...styleScheduledInfo }
                  { ...styleScheduledInfo }
                : { ...styleScheduledInfo }
            }
            title={value[header]}
          >
            {value[header]}
          </div>
          {isHovered === value?.id && (
            <div className="flex mt-2 items-center text-gray-500 text-[12px]">
              <div
                className="flex text-[#000000] mr-2 cursor-pointer"
                onClick={() => openModal(value, "full")}
              >
                <img
                  className="w-3 h-4"
                  src={`/assets/images/edit.svg`}
                  alt="edit"
                />
                &nbsp;&nbsp;Edit
              </div>

              <div
                className="flex text-[#000000] mx-2 cursor-pointer"
                onClick={
                  () =>
                    setConfirmation({
                      type: "delete",
                      option: null,
                      user_id: value?.id,
                    })
                  // triggerHandler("delete", null, value?.id)
                }
              >
                <img
                  className="w-3 h-4"
                  src={`/assets/images/deleteCustom.svg`}
                  alt="delete"
                />
                &nbsp;&nbsp;Remove
              </div>
            </div>
          )}
        </td>
      );
    } else if (header === "status") {
      return (
        <td
          className={`py-2 fixed-col`}
          key={headerIndex}
          title={value[header] ? "Active" : "Inactive"}
        >
          <ToggleButton
            status={value[header]}
            is_verified={value.is_verified}
            // triggerHandler={() =>
            //   triggerHandler("status", value[header], value?.id)
            // }
            triggerHandler={() =>
              setConfirmation({
                type: "status",
                option: value[header],
                user_id: value?.id,
              })
            }
          />
        </td>
      );
    } else if (header === "details") {
      return (
        <td
          className={`p-2  `}
          key={headerIndex}
          onMouseEnter={() => setIsHoveredDetails(value.id)}
          onMouseLeave={() => setIsHoveredDetails()}
          onClick={() => openModal(value, "platform")}
          style={
            isHoveredDetails === value?.id
              ? {
                  ...underlineStyle,
                  ...styleScheduledInfo,
                  color: "#0081F7FF",
                }
              : { ...styleScheduledInfo }
          }
        >
          <div style={{ display: "flex", cursor: "pointer", fontSize: 14 }}>
            Details
            <img
              className="w-3 h-4 ml-[5px] cursor-pointer "
              src={`${
                isHoveredDetails === value?.id
                  ? "/assets/images/detailactivearrow.svg"
                  : "/assets/images/detailarrow.svg"
              }`}
              alt="details"
            />
          </div>
        </td>
      );
    } else if (header === "is_verified") {
      return (
        <td
          className={`p-2 text-[14px] font-normal `}
          key={headerIndex}
          style={{ color: "#0081F7FF" }}
        >
          {value["is_verified"] ? (
            <div style={{ marginLeft: 14 }}>
              <i
                className="fas fa-check-circle text-blue-500 text-xl"
                title={"Verified"}
              ></i>
            </div>
          ) : (
            <div
              style={{
                cursor:
                  loadingState?.type !== "sendemail" &&
                  loadingState?.user_id !== value?.id
                    ? "pointer"
                    : "not-allowed",
              }}
              title="Resend Email"
              onClick={() => {
                if (loadingState !== "sendemail")
                  triggerHandler("sendemail", value[header], value?.id);
              }}
            >
              {loadingState?.type === "sendemail" &&
              loadingState?.user_id === value?.id
                ? "Sending... "
                : "Resend "}
              <i className="far fa-envelope"></i>
            </div>
          )}
        </td>
      );
    } else if (header === "role") {
      return (
        <td
          className={`p-2 text-[14px] font-normal `}
          key={headerIndex}
          title={
            value[header]
              ? value[header].charAt(0).toUpperCase() + value[header].slice(1)
              : "-"
          }
        >
          {value[header]
            ? value[header].charAt(0).toUpperCase() + value[header].slice(1)
            : "-"}
        </td>
      );
    } else if (header === "email") {
      return (
        <td
          className={`p-2 text-[14px] font-normal `}
          key={headerIndex}
          style={styleScheduledInfo}
          title={value[header]}
        >
          {value[header]}
        </td>
      );
    } else {
      return (
        <td className={`p-2 text-[14px] font-normal `} key={headerIndex}>
          {value[header]}
        </td>
      );
    }
    // } else return <td>-</td>;
  };

  return (
    <>
      <div
        className="custom-table "
        onScroll={handleScroll}
        style={{
          // height: "calc(100vh - " + height + "px)",
          height: "calc(100vh - " + height + "px)",
          maxHeight: "calc(100vh - " + height + "px)",
          overflow: "auto",
          width: "100%",
        }}
        ref={containerRef}
      >
        <table className="w-full user-list-table" id="list-view-selection">
          <thead className="sticky top-0 left-0 z-[15] bg-[#F3F4F6]">
            <tr className="">
              {listHeader?.map((item, i) => {
                if (item.showCol) {
                  const isStickyColumn = i < 2; // Fix only the first two columns
                  return (
                    <th

                      className={`${
                        isStickyColumn ? "fixed-col bg-[#F3F4F6]" : ""
                      } ${i === listHeader.length - 1 ? "pr-2" : ""}`}
                      key={`${i} - ${item.report_id}`}
                      style={{ width: getColumnWidth(i) }} // Set width for columns
                    >
                      <div className={"tableHead text-[14px] py-5 p-[20px] "}>
                        <p className="text-[14px] font-medium">{item.title}</p>
                        {userList && userList.length > 0 && item.show && (
                          <div className={"sortArrow cursor-pointer"}>
                            <div>
                              <div
                                onClick={() => setSortBy(item?.value, 1)}
                                style={{
                                  color:
                                    sortBy.key === item.value &&
                                    sortBy.order === 1
                                      ? "black"
                                      : "grey",
                                  marginBottom: 2,
                                }}
                              >
                                ▲
                              </div>
                            </div>
                            <div>
                              <div
                                className="downArrow"
                                onClick={() => setSortBy(item?.value, -1)}
                                style={{
                                  color:
                                    sortBy.key === item.value &&
                                    sortBy.order === -1
                                      ? "black"
                                      : "grey",
                                }}
                              >
                                ▼
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </th>
                  );
                }
                return null;
              })}
            </tr>
          </thead>
          <tbody>
            {userList &&
              userList.length > 0 &&
              userList?.map((item, index) => (
                <tr
                  className="custom-tablecontent h-[64px] max-h-[64px]"
                  key={index}
                >
                  {listHeader.map(
                    (header, headerIndex) =>
                      header.showCol && (
                        <>
                          {valueRenderer(
                            item,
                            header.value,
                            header.multiValue,
                            header.simpleDate,
                            headerIndex
                          )}
                        </>
                      )
                  )}
                </tr>
              ))}
            {loadingState !== "list" && userList && userList.length === 0 ? (
              // <td
              //   className="p-2"
              //   colSpan={10}
              //   rowSpan={2}
              //   style={{
              //     display: "flex",
              //     // alignItems: "center",
              //     // verticalAlign: "middle",
              //   }}
              // >
              // <div className="loaderStyle row sticky font-semibold">
              <tr>
                <div className=" font-semibold p-2 !border-b-0 absolute  left-1/2 transform -translate-x-1/2 ">
                  No Data Found
                </div>
              </tr>
            ) : // </td>
            null}
            {loadingState === "list" && (
              <tr>
                <td
                  className="p-2"
                  colSpan={16}
                  rowSpan={3}
                  style={{ alignItems: "center", verticalAlign: "middle" }}
                >
                  <div className="loaderStyle p-2 row sticky">
                    <LoaderSpinner />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserList;