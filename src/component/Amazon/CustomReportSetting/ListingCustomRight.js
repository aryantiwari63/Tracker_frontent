import React, { useState } from "react";
import ToggleButton from "./toggle-button";

import NavButton from "./NavButton";
import { ALL_BUTTON_FLAGS, PERMISSIONS } from "../../../utils/constants";
import "../../CustomReport/custommain.css";
import { useSelector } from "react-redux";
import WhenPermitted from "../../common-components/WhenPermitted";

const ListingCustomRight = ({
  color,
  list,
  // length,
  addIcon,
  setCustomMetric,
  toggle,
  setToggle,
  generateReport,
  setHeader,
  header,
  setCustomEditValue,
  platform,
  // reportType,
  disabledData,
  setDisabledData,
  // setEnableButton,
  reportType,
  enableButton,
  accepetedParameter,
  triggerDownload,
}) => {
  // const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.CommonReducer);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = list.filter((item) =>
    item?.column_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckClick = (id, val, check, type) => {
    let data = header;
    let disabledHeader = [];
    if (disabledData?.length) {
      disabledHeader = [...disabledData];
    } else {
      disabledHeader = [...filteredData];
    }
    if (check) {
      let newData = {
        id: id,
        title: val.column_name,
        value: val.column_value,
        showSortButton: type !== "breakdown",
        showColumn: check,
        entity_name: val.entity_name,
        is_custom: val.is_custom || false,
        formula: val.formula || null,
        format: val.format || null,
        type: type,
        description: val.description || undefined,
        // hide_column: val.hide_column || false,
      };
      if (val.id === "hard_coded_periodic") {
        data.unshift(newData);
      } else if (val.id === "hard_coded_tag") {
        const periodic_group_included = data.some(
          (val) => val.id === "hard_coded_periodic"
        );
        if (periodic_group_included) {
          data.splice(1, 0, newData);
        } else {
          data.unshift(newData);
        }
      } else {
        data.push(newData);
      }
      // console.log("data>>>>>>>>>", data);
      if (type === "breakdown") {
        disabledHeader.forEach((item, i) => {
          if (
            (item.level === val.level ||
              val.disallowed_breakdowns.includes(item.column_value)) &&
            val.level !== 1 &&
            item.column_value !== val.column_value &&
            !item.allowed_breakdowns.includes(val.column_value)
          ) {
            disabledHeader[i].disabled = true;
            // let breakdownFinder = data.filter(
            //   (val) => val.type === "breakdown"
            // );
            // if (breakdownFinder.length === 1)
            //   dispatch(customreport({ platform, type: toggle, reportType }));
          }
          if (
            item.id === "hard_coded_periodic" &&
            val.id === "hard_coded_periodic" &&
            item.column_value !== val.column_value
          ) {
            disabledHeader[i].disabled = true;
          }
          // eslint-disable-next-line no-console
          // console.log("debugerrr disabledHeader", disabledHeader);
          if (platform === "amazon") {
            if (
              val.id === "hard_coded_tag" &&
              item.column_value == "portfolio_name"
            ) {
              disabledHeader[i].disabled = true;
            }
            if (
              item.id === "hard_coded_tag" &&
              val.column_value == "portfolio_name"
            ) {
              disabledHeader[i].disabled = true;
            }
          }
        });
      }
    } else {
      data = header?.filter((list) => list.value != val.column_value);
      if (type === "breakdown") {
        disabledHeader.forEach((item, i) => {
          if (
            (item.level === val.level ||
              val.disallowed_breakdowns.includes(item.column_value)) &&
            val.level !== 1 &&
            item.column_value !== val.column_value &&
            !item.allowed_breakdowns.includes(val.column_value)
          ) {
            disabledHeader[i].disabled = false;
          }
          if (
            item.id === "hard_coded_periodic" &&
            val.id === "hard_coded_periodic" &&
            item.column_value !== val.column_value
          ) {
            disabledHeader[i].disabled = false;
          }
          if (platform === "amazon") {
            if (
              val.id === "hard_coded_tag" &&
              item.column_value == "portfolio_name"
            ) {
              disabledHeader[i].disabled = false;
            }
            if (
              item.id === "hard_coded_tag" &&
              val.column_value == "portfolio_name"
            ) {
              disabledHeader[i].disabled = false;
            }
          }
        });
      }
    }

    function sortByType(a, b) {
      if (a.type === b.type) {
        return 0;
      } else if (a.type === "breakdown") {
        return -1;
      } else {
        return 1;
      }
    }
    data.sort(sortByType);
    let disabledEntities = disabledHeader
      .filter((data) => data.disabled)
      .map((data) => data.entity_name);
    let filteredHeader = data.filter((item) => {
      // console.log("dara>>>>>>>>>>>>", item);
      return (
        !disabledEntities?.includes(item.entity_name) ||
        accepetedParameter[item.value]?.includes(reportType) //this is for same column present in different column
      );
    });

    // console.log("filteredHeader>>>>>>>>>>>>>>.", filteredHeader);
    setHeader([...filteredHeader]);
    setDisabledData(disabledHeader);
  };
  const { generatedreportlist } = useSelector((state) => state.Customreport);
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log("debugerrr header", header);
  }, [header]);

  return (
    <div className="rightpanel__selected-box ">
      <div className="border_shadow">
        <div className="bg-[#F8F8F8] py-2 px-4 font-medium text-[18px]">
          Customize Template
        </div>
        <div className="relative border mt-2 bg-white py-1 px-2 ml-2 pr-2 mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="rightpanelsearchBar"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="custom__search rounded"
            value={searchTerm}
            onChange={(e) => {
              if (e.keyCode == 13) {
                e.preventDefault();
              } else {
                setSearchTerm(e.target.value);
              }
            }}
          />
        </div>
        <div className="pl-2">
          <div className="pt-2 pr-2 w-full">
            <ToggleButton
              label1={"Breakdown"}
              label2={"Parameters"}
              toggle={toggle}
              setToggle={setToggle}
              // platform={"customreport"}
              platform={platform}
            ></ToggleButton>
          </div>
          <div className=" flex bg-[#DEE2E6] py-2 px-4 font-medium text-[16px]">
            Column Name
          </div>
          <div className="text-[14px] py-2 px-4 ">
            {header.length} {header.length > 1 ? "Columns" : "Column"} selected
          </div>
        </div>
      </div>

      <div className="customrightpanelproductlist mb-2 bg-white">
        <div className="relative pl-2 pr-2 w-full h-[80%] ">
          <div className="customoption h-full">
            {filteredData && filteredData?.length ? (
              filteredData.map((val, index) => {
                return (
                  <div
                    className={`dropdownfields pt-2 
                          ${index !== 0 ? "mt-2" : ""} ${
                            list.length - 1 === index ? "pb-2" : ""
                          }
                        `}
                    key={index}
                  >
                    {val?.column_value === "create_custom_metrics" ? (
                      <WhenPermitted platform={platform} permission={PERMISSIONS.CUSTOM_REPORT_ACTION}>
                      <div
                        className="pl-5 pt-2 text-[14px] font-medium flex items-center cursor-pointer"
                        onClick={() => setCustomMetric("create")}
                      >
                        <img
                          className="w-4 h-4 rounded-full mr-2"
                          src={addIcon}
                          alt="Add custom"
                        />
                        Create Custom Metrics
                      </div>
                      </WhenPermitted>
                    ) : (
                      <div
                        className={`flex ${
                          val.is_custom && toggle === "parameters"
                            ? "justify-between"
                            : ""
                        }`}
                      >
                        <label
                          className="cursor-pointer text-[14px]"
                          htmlFor={`${val?.column_value}`}
                        >
                          <div className="row items-center pl-5">
                            <div
                            // className={`custom-checkbox ${platform}-custom-select`}
                            >
                              <input
                                type="checkbox"
                                id={`${val?.column_value}`}
                                checked={
                                  header && header?.length
                                    ? header?.find(
                                        (data) =>
                                          data?.value === val?.column_value
                                      )?.showColumn
                                      ? header?.find(
                                          (data) =>
                                            data?.value === val?.column_value
                                        )?.showColumn
                                      : false
                                    : false
                                }
                                // checked={val?.show_column}
                                disabled={
                                  disabledData?.find(
                                    (data) =>
                                      data.column_value == val?.column_value
                                  )?.disabled
                                }
                                onChange={(e) =>
                                  handleCheckClick(
                                    val.id,
                                    val,
                                    e.target.checked,
                                    toggle
                                  )
                                }
                                className="align-middle"
                                // style={{
                                //   background: val.show_column
                                //     ? color
                                //     : "transparent",
                                //   accentColor: val.show_column ? color : "",
                                // }}
                              />
                            </div>
                            <div className={`col px-2`}>
                              {val?.column_name}

                              <span className="text-[#bfbfbf]">
                                {val?.is_custom &&
                                  toggle === "parameters" &&
                                  " (Custom)"}
                              </span>
                            </div>
                          </div>
                        </label>
                        <div>
                          {val?.is_custom && toggle === "parameters" && (
                            <img
                              src={`/assets/images/editCustom.svg`}
                              alt="edit"
                              onClick={() => {
                                setCustomEditValue(val);
                                setCustomMetric("edit");
                              }}
                              className=" cursor-pointer w-4 h-4 mr-2"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex h-full items-center justify-center">
                No Data found
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="custom__report_generate bg-white px-2 py-2">
        <NavButton
          name="Generate"
          onClick={generateReport}
          width={"w-full"}
          disabled={
            header?.filter((data) => data?.type !== "parameters")?.length ==
              0 ||
            (loading &&
              loading.buttonFlag == ALL_BUTTON_FLAGS.CUSTOMREPORT &&
              loading.state) ||
            enableButton
          }
          color={color}
        />
        <NavButton
          name="Download"
          onClick={triggerDownload}
          width={"w-full"}
          disabled={generatedreportlist?.length == 0}
          color={color}
        />
      </div>
    </div>
  );
};
export default ListingCustomRight;
