import React from "react";

import LoaderSpinner from "../../../common-components/loader-spinner";

const CampignReportTable = ({
  headers,
  bodyContent,
  loading,
  sortData,
  source,
  isCheckBoxRequired,
  setEditData,
  editData,
  customCss,
  setDataLIMIT,
  dataLIMIT,
  sortBy,
}) => {
  // const [rulesPopup, setRulesPopup] = useState(false);
  // const [ruleData, setRuleData] = useState(null);

  // const parser = new DOMParser();
  React.useEffect(() => {
    // console.log("bodyContent123", bodyContent);
  }, [bodyContent]);

  // const handleCheckBox = (check, data) => {
  //   if (check) {
  //     setEditData([...editData, data]);
  //   } else {
  //     setEditData(editData.filter((item) => item.id !== data.id));
  //   }
  // };

  // const handleCheckBoxSearchTerm = (check, data) => {
  //   if (check) {
  //     setEditData([...editData, data]);
  //   } else {
  //     setEditData(editData.filter((item) => item.id !== data.id));
  //   }
  // };

  // let currency = localStorage.getItem("currency");

  const handleAllCheckBox = (check, data) => {
    if (check) {
      setEditData([...data]);
    } else {
      setEditData([]);
    }
  };

  // const userName = localStorage.getItem("name");
  // let tableouterClass = [
  //   isCheckBoxRequired
  //     ? "campaignreportcheckbox__table "
  //     : customCss === true
  //     ? "rules_outer_table mb-20"
  //     : "campaignreport__table w-full",
  //   customCss ? "rule_headers" : "",
  // ];
  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;
    if (bottom) {
      setDataLIMIT(dataLIMIT + 50);
    }
  };
  // let currency_format = localStorage.getItem("currency_format");

  // const getAcc = (id) => {
  //   let selected = [];
  //   accountsData.map((item) => {
  //     if (id.includes(item.platform_id)) {
  //       selected?.push(item.label);
  //     }
  //   });
  //   selected = selected?.join(",");
  //   return selected;
  // };
  return (
    <>
    
      <div>
        <div
          className="campaignreport__table--campReport max-h-[640px] overflow-y-auto"
          onScroll={handleScroll}
        >
     
          <table className="w-full ">
            <thead
              className={
                isCheckBoxRequired
                  ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 left-0 z-[35] bg-[#F3F4F6] "
                  : source === "rule"
                  ? "campaignreport__tablehead  table-fixed sticky top-0 left-0 bg-[#F3F4F6] "
                  : "campaignreport__tablehead  table-fixed sticky top-0 left-0 z-[35] bg-[#F3F4F6]"
              }
            >
              <tr className="">
                {isCheckBoxRequired === true && (
                  <th className=" ">
                    <input
                      className=" h-16 "
                      type="checkbox"
                      // style={{ verticalAlign: "left" }}
                      checked={
                        editData?.length === bodyContent?.length &&
                        !loading &&
                        bodyContent?.length !== 0
                      }
                      onChange={(e) =>
                        handleAllCheckBox(e.target.checked, bodyContent)
                      }
                      disabled={bodyContent?.length > 0 ? false : true}
                    />
                  </th>
                )}

                {headers?.map((item) => {
                  if (item.showCol) {
                    return (
                      <>
                        {item.type === "single" ? (
                          <th className=" sticky top-0 left-0">
                            <div
                              className={
                                customCss === true
                                  ? "rule_table py-5 px-1.5 font-normal text-base"
                                  : "tableHead py-5 px-1.5 font-normal text-base"
                              }
                            >
                              <span className="">{item.title}</span>
                              {bodyContent &&
                                bodyContent.length > 0 &&
                                item.show && (
                                  <div
                                    className={
                                      customCss === true
                                        ? "rule_arrow"
                                        : "sortArrow cursor-pointer"
                                    }
                                  >
                                    <div>
                                      <div
                                        onClick={() =>
                                          sortData(
                                            item?.value,
                                            source === "blinkit" ? "ASC" : 1
                                          )
                                        }
                                        style={{
                                          color:
                                            sortBy.key === item.value &&
                                            (sortBy.order === 1 ||
                                              sortBy.order === "ASC")
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
                                        onClick={() =>
                                          sortData(
                                            item?.value,
                                            source === "blinkit" ? "DESC" : -1
                                          )
                                        }
                                        style={{
                                          color:
                                            sortBy.key === item.value &&
                                            (sortBy.order === -1 ||
                                              sortBy.order === "DESC")
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
                        ) : (
                          <th rowSpan={3} className="multiCol font-medium">
                            <div className="graycol">{item.title}</div>
                            {item.showCol &&
                              item.subTitles?.map((v, i) => {
                                return (
                                  <td className="graydirect" key={i}>
                                    {v}
                                  </td>
                                );
                              })}
                          </th>
                        )}
                      </>
                    );
                  }
                })}
              </tr>
            </thead>
            <tbody>
              {bodyContent && bodyContent.length > 0 ? (
                bodyContent?.map((item) => {
                  if (source === "blinkit") {
                    return (
                      <>
                        <tr className="tablecontent">
                          {isCheckBoxRequired === true && (
                            <td className="">
                              {/* <input
                                  className=""
                                  type="checkbox"
                                  checked={editData
                                    .map((data) => data._id)
                                    .includes(item._id)}
                                  onChange={(e) =>
                                    handleCheckBox(e.target.checked, item)
                                  }
                                /> */}
                            </td>
                          )}
                          {headers.map(
                            (header, headerIndex) =>
                              header.showCol && (
                                <td className="p-2" key={headerIndex}>
                                  {item[header.value]}
                                </td>
                              )
                          )}
                        </tr>
                      </>
                    );
                  }
                })
              ) : !loading ? (
                <td
                  className="p-2"
                  colSpan={10}
                  rowSpan={2}
                  style={{ alignItems: "center", verticalAlign: "middle" }}
                >
                  <div className="loaderStyle  row sticky font-semibold">
                    No Data Found
                  </div>
                </td>
              ) : // <tr>
              //   <div className="p-2 row sticky "> No Data found</div>
              // </tr>
              null}
              {loading && (
                <>
                  <td
                    className="p-2"
                    colSpan={16}
                    rowSpan={3}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle p-2 row sticky ">
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

export default CampignReportTable;
