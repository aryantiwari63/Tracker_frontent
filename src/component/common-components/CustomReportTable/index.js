import React, { useEffect, useRef, useState } from "react";
import LoaderSpinner from "../loader-spinner";
import "./styles.css";
import { useSelector, useDispatch } from "react-redux";
import { ALL_BUTTON_FLAGS } from "../../../utils/constants";
import { setToastMessageHandler } from "../../../redux/action-creator/commonAction";

const CustomReportTable = ({
  headers,
  bodyContent,
  source,
  setDataLIMIT,
  dataLIMIT,
  platform,
}) => {
  const dispatch = useDispatch();
  const containsKeyDate = headers.some(
    (obj) => obj["id"] === "hard_coded_periodic"
  );

  const [tdWidth, setTdWidth] = useState(0);
  const [lastBreakdownIndex, setBreakdownIndex] = useState(0);
  const containerRef = useRef();
  const { loading } = useSelector((state) => state.CommonReducer);
  const { generatedreportlisttotaldata } = useSelector(
    (state) => state.Customreport
  );
  // const [height, setHeight] = useState(100);
  const nameChanger = {
    periodic_group_daily: "Date",
    periodic_group_weekly: "Date",
    periodic_group_monthly: "Date",
  };

  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;

    let breakdownItems = headers.filter((item) => item.type === "breakdown");
    let search_term_included =
      breakdownItems.length === 1 && breakdownItems[0].value === "search_term";
    if (bottom) {
      if (
        loading &&
        loading.buttonFlag == ALL_BUTTON_FLAGS.CUSTOMREPORT &&
        !loading.state
      ) {
        if ((platform === "amazon" || platform === "flipkart") && dataLIMIT) {
          let limit;
          if (search_term_included) {
            limit = 1;
          } else {
            limit = 3;
          }
          const totalPages = Math.ceil(generatedreportlisttotaldata / limit);
          const currentPage = Math.floor(dataLIMIT / limit) + 1;
          if (currentPage <= totalPages) {
            e.target.scrollTo({
              top: e.target.scrollTop - 50, // Adjust 20 pixels as needed
              behavior: "smooth", // Optional: for smooth scrolling
            });
          }
        }

        if (search_term_included) {
          setDataLIMIT(dataLIMIT + 1);
        } else {
          setDataLIMIT(dataLIMIT + 3);
        }
      }
    }
  };
  useEffect(() => {
    const tableContainer = document.getElementById("table-container");

    // Get the client width of the table container
    if (tableContainer) {
      setTdWidth(tableContainer.clientWidth);
    }
    let lastIndex = -1;

    for (let i = 0; i < headers.length; i++) {
      if (headers[i].type === "breakdown") {
        lastIndex = i;
      }
    }
    // console.log("lastIndxe>>>>>>>", lastIndex);
    setBreakdownIndex(lastIndex);
  });

  return (
    <>
      <div>
        <div
          id="table-container"
          // className="campaigncustomreport__table max-h-[620px] overflow-y-scroll"
          className="campaigncustomreport__table overflow-y-scroll"
          style={{
            // height: "calc(100vh - " + height + "px)",
            height:
              "calc(100vh - " +
              containerRef.current?.getBoundingClientRect().top +
              "px)",
            maxHeight:
              "calc(100vh - " +
              containerRef.current?.getBoundingClientRect().top +
              "px)",
            // overflowY: "auto",
          }}
          onScroll={handleScroll}
          ref={containerRef}
        >
          <table className="w-full custom-report_table">
            <thead className="campaignreport__tablehead table-fixed sticky top-0 left-0 z-[35] bg-[#F3F4F6]">
              <tr className="">
                {headers?.map((item, index) => {
                  if (item.showColumn) {
                    return (
                      <>
                        <th
                          className={`${
                            // bodyContent.length > 0
                            //   ?
                            containsKeyDate && item.type === "breakdown"
                              ? "date-breakdown-column"
                              : item.type === "breakdown"
                              ? "breakdown-column"
                              : "other-columns"
                            // : // : "no-data-found"
                            // ""
                          }`}
                          style={{
                            boxShadow:
                              lastBreakdownIndex === index
                                ? "inset -1px 0 #fff"
                                : "",
                            // width:
                            //   bodyContent.length === 0 && index <= 9
                            //     ? "100%"
                            //     : "",
                          }}
                          title={
                            item.description ? item.description : item.title
                          }
                        >
                          <div className="tableHead py-5 px-1.5 ">
                            <p>
                              {Object.keys(nameChanger).includes(
                                item.entity_name
                              )
                                ? "Date"
                                : item.title}
                            </p>
                            {/* {bodyContent &&
                              bodyContent.length > 0 &&
                              item.showSortButton && (
                                <div className="sortArrow cursor-pointer">
                                  <div>
                                    <div
                                      onClick={() => sortData(item?.value, 1)}
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
                                      onClick={() => sortData(item?.value, -1)}
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
                              )} */}
                          </div>
                        </th>
                        {/* <th> {bodyContent.length}</th> */}
                      </>
                    );
                  }
                })}
              </tr>
            </thead>
            <tbody>
              {bodyContent && bodyContent.length > 0 ? (
                bodyContent?.map((item) => {
                  if (source === "campaign") {
                    return (
                      <>
                        <tr className="h-[4rem]">
                          {headers.map(
                            (header, headerIndex) =>
                              header.showColumn && (
                                <td
                                  className={`${
                                    containsKeyDate &&
                                    header.type === "breakdown"
                                      ? "date-breakdown-column"
                                      : header.type === "breakdown"
                                      ? "breakdown-column"
                                      : "other-columns"
                                  }`}
                                  style={{
                                    paddingLeft: 15,
                                    cursor:
                                      header.type === "breakdown" &&
                                      header.id !== "hard_coded_periodic"
                                        ? "copy"
                                        : "default",
                                    boxShadow:
                                      lastBreakdownIndex === headerIndex
                                        ? "inset -1px 0 #fff"
                                        : "",
                                  }}
                                  key={headerIndex}
                                  title={item[header.value]}
                                  onClick={async () => {
                                    if (
                                      header.type === "breakdown" &&
                                      header.id !== "hard_coded_periodic"
                                    ) {
                                      try {
                                        await navigator.clipboard.writeText(
                                          item[header.value]
                                        );
                                        dispatch(
                                          setToastMessageHandler(
                                            "Text copied successfully",
                                            true
                                          )
                                        );
                                        // alert(
                                        //   "Copied to clipboard: " +
                                        //     item[header.value]
                                        // );
                                      } catch (err) {
                                        console.error("Failed to copy: ", err);
                                      }
                                    }
                                  }}
                                >
                                  {item[header.value]}
                                </td>
                              )
                          )}
                        </tr>
                      </>
                    );
                  }
                })
              ) : !loading.state ? (
                <td
                  className="p-2"
                  colSpan={5}
                  rowSpan={2}
                  style={{
                    alignItems: "center",
                    verticalAlign: "middle",
                  }}
                >
                  <div
                    className="loaderStyle  row sticky font-semibold"
                    style={{ width: tdWidth }}
                  >
                    {headers?.length === 0
                      ? "Please generate report"
                      : "No Data Found"}
                  </div>
                </td>
              ) : // <tr>
              //   <div className="p-2 row sticky "> No Data found</div>
              // </tr>
              null}

              {loading &&
                loading.buttonFlag == ALL_BUTTON_FLAGS.CUSTOMREPORT &&
                loading.state && (
                  // bodyContent.length <= 0 &&
                  <>
                    <td
                      className="p-2"
                      colSpan={16}
                      rowSpan={3}
                      style={{
                        alignItems: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        className="loaderStyle p-2 row sticky "
                        style={{ width: tdWidth }}
                      >
                        <LoaderSpinner />
                      </div>
                    </td>
                  </>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CustomReportTable;
