import React from "react";
import LoaderSpinner from "../../../common-components/loader-spinner";

const SearchTermTable = ({
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
  React.useEffect(() => {
    // console.log("bodyContent123", bodyContent);
  }, [bodyContent]);


  const handleCheckBoxSearchTerm = (check, data) => {
    if (check) {
      setEditData([...editData, data]);
    } else {
      setEditData(editData.filter((item) => item.id !== data.id));
    }
  };
  const handleAllCheckBox = (check, data) => {
    if (check) {
      setEditData([...data]);
    } else {
      setEditData([]);
    }
  };

  const handleScroll = (e) => {
    const bottom =
      Math.abs(
        e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      ) < 1;
    if (bottom) {
      setDataLIMIT(dataLIMIT + 50);
    }
  };

  return (
    <>
      <div className="">
        <div
          className={
            isCheckBoxRequired
              ? "campaignreportcheckbox__table max-h-[640px] overflow-y-auto flipkartCampignDataTables"
              : "campaignreport__table max-h-[640px] overflow-y-auto"
          }
          onScroll={handleScroll}
        >
          <table className="h-full w-full ">
            <thead
              className={
                isCheckBoxRequired
                  ? "campaignreportcheckbox__tablehead table-fixed sticky top-0 left-0 z-[35] "
                  : "campaignreport__tablehead table-fixed sticky top-0 left-0 z-[35]"
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
                          <th className=" ">
                            <div className="tableHead px-1 font-normal text-base">
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
                          <th rowSpan={3} className="multiCol">
                            <div className="graycol">{item.title}</div>
                            {item.showCol &&
                              item.subTitles?.map((v, i) => {
                                return <td key={i} className="graydirect">{v}</td>;
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
                  if (source === "search_term") {
                    return (
                      <>
                        <tr
                          className={
                            isCheckBoxRequired
                              ? "tableContentCheckBox "
                              : "tablecontent"
                          }
                        >
                          {isCheckBoxRequired === true && (
                            <td className="pl-5  min-w-max  ">
                              <input
                                className="h-16"
                                type="checkbox"
                                checked={editData
                                  .map((data) => data.campaign_id)
                                  .includes(item.campaign_id)}
                                onChange={(e) =>
                                  handleCheckBoxSearchTerm(
                                    e.target.checked,
                                    item
                                  )
                                }
                              />
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

          {/* <button
          onClick={() => {
            callSearchPropertyAction();
          }}
        >
          Load More
        </button> */}
        </div>
        {/* {totalData > 10 ? (
          <Pagination paginate={paginate} page={page} totalData={totalData} />
        ) : null} */}
        {/* <NewPagination newpaginate={newpaginate} /> */}
      </div>
    </>
  );
};

export default SearchTermTable;
