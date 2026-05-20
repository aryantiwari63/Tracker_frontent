import React from "react";
import LoaderSpinner from "../../../../common-components/loader-spinner";
import "./styles.css";
import { CSVLink } from "react-csv";

const BudgetDaily = ({ loading, bodyContent, month, accountName }) => {
  const currency = localStorage.getItem("currency");
  const currency_format = localStorage.getItem("currency_format");
  let decimalFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

  const exportData = bodyContent.map((i) => {
    const totalUnitsSold =
      parseFloat(i?.units_sold_direct) + parseFloat(i?.units_sold_indirect);
    return {
      brand: i.account,
      platform: i.platform === "MP" ? "Flipkart" : "Supermart",
      segment: i?.segment,
      date: i.created_on,
      clicks: i.clicks,
      spend: i.spend,
      direct_units_sold: i.units_sold_direct,
      units_sold_indirect: i.units_sold_indirect,
      direct_sales: i.direct_sales,
      indirect_sales: i.indirect_sales,
      total_units_sold: totalUnitsSold,
      sales: i?.sales,
      cpc: i.cpc,
      cvr: i.cvr,
      aov: i?.sales / totalUnitsSold,
      roas: i.roas,
    };
  });

  return (
    <>
      <div className="w-full">
        <div className="mb-2 mr-2 flex items-center justify-end">
          {/* <h2 className="text-[20px]">Daily Budget</h2> */}
          <CSVLink
            data={exportData}
            filename={`budget_daily_data_${accountName}_${month}.csv`}
            className="border rounded text-gray-500 px-4 py-2 roshadow-md cursor-pointer hover:text-blue-600 transition duration-300"
          >
            {" "}
            <img className="header-buttons w-4" src="/assets/images/hard-disk.png" alt="" />
          </CSVLink>
        </div>
        <div
          className="campaignreport__table max-h-[550px] overflow-y-auto"
          // className={"campaignreport__table max-h-[550px] overflow-y-scroll"}
        >
          <table className="">
            <thead
              // className={"campaignreport__tablehead sticky top-0 left-0 z-10"}
              className="campaignreport__tablehead  table-fixed sticky top-0 left-0 z-[35] bg-[#F3F4F6]"
            >
              <tr className="h-11">
                <th className="tableHeadBudget--sticky ">
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Brand</p>
                  </div>
                </th>
                <th className="tableHeadBudget--sticky ">
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Platform</p>
                  </div>
                </th>
                <th className="tableHeadBudget--sticky ">
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Segment</p>
                  </div>
                </th>
                <th className="tableHeadBudget--sticky ">
                  <div
                    className="tableHeadBudget px-2 w-full"
                    style={{ minWidth: "140px" }}
                  >
                    <p>Date</p>
                  </div>
                </th>
                <th className="tableHeadBudget--sticky">
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Clicks</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudget--sticky min-w-16"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full ">
                    <p>Spend</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Direct Units Sold</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Indirect Units Sold</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Direct Sales</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Indirect Sales</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Total Units Sold</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Total Sales</p>
                  </div>
                </th>{" "}
                <th
                  className="tableHeadBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>CPC</p>
                  </div>
                </th>{" "}
                <th
                  className="tableHeadBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>CVR</p>
                  </div>
                </th>{" "}
                <th
                  className="tableHeadBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>AOV</p>
                  </div>
                </th>{" "}
                <th
                  className="tableHeadBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div className="tableHeadBudget px-2 w-full">
                    <p>ROAS</p>
                  </div>
                </th>{" "}
              </tr>
            </thead>

            {loading === true ? (
              <tbody>
                <tr>
                  <td
                    className=""
                    colSpan={10}
                    rowSpan={2}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle row sticky">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {bodyContent.length > 0 ? (
                  bodyContent?.map((item, index) => {
                    const totalUnitSold =
                      parseFloat(item?.units_sold_direct) +
                      parseFloat(item?.units_sold_indirect);

                    const aov = item?.sales / totalUnitSold;
                    return (
                      <>
                        <tr key={index} className="h-11 tablecontent m-4 ">
                          <td className="p-2 tableHeadBudget--sticky  ">
                            <div>{item?.account}</div>
                          </td>
                          <td className="p-2 tableHeadBudget--sticky  ">
                            {item?.platform === "MP" ? (
                              <div>Flipkart</div>
                            ) : (
                              <div>Supermart</div>
                            )}
                          </td>
                          <td className="p-2 tableHeadBudget--sticky  ">
                            <div>{item?.segment}</div>
                          </td>
                          <td className="p-2 tableHeadBudget--sticky  ">
                            <div>{item?.created_on}</div>
                          </td>
                          <td className="p-2  ">
                            <div>
                              {" "}
                              {parseFloat(item?.clicks).toLocaleString(
                                currency_format,
                            
                              )}
                            </div>
                          </td>
                          <td className="p-2  ">
                            {currency}
                            {parseFloat(item?.spend).toLocaleString(
                              currency_format,
                              decimalFormat
                            )}
                          </td>
                          <td className="p-2  ">
                            <div>
                              {parseFloat(
                                item?.units_sold_direct
                              ).toLocaleString(currency_format)}
                            </div>
                          </td>{" "}
                          <td className="p-2  ">
                            <div>
                              {parseFloat(
                                item?.units_sold_indirect
                              ).toLocaleString(currency_format)}
                            </div>
                          </td>{" "}
                          <td className="p-2  ">
                            <div>
                              {currency}
                              {parseFloat(item?.direct_sales).toLocaleString(
                                currency_format,
                                decimalFormat
                              )}
                            </div>
                          </td>{" "}
                          <td className="p-2  ">
                            <div>
                              {" "}
                              {currency}
                              {parseFloat(item?.indirect_sales).toLocaleString(
                                currency_format,
                                decimalFormat
                              )}
                            </div>
                          </td>{" "}
                          <td className="p-2  ">
                            <div>
                              {parseFloat(totalUnitSold)?.toLocaleString(
                                currency_format,
                               
                              )}
                            </div>
                          </td>{" "}
                          <td className="p-2  ">
                            <div>
                              {currency}
                              {parseFloat(item?.sales).toLocaleString(
                                currency_format,
                                decimalFormat
                              )}
                            </div>
                          </td>
                          <td className="pl-2">
                            <div>{parseFloat(item?.cpc).toFixed(2)}</div>
                          </td>
                          <td className="pl-2">
                            <div>{parseFloat(item?.cvr).toFixed(2)}%</div>
                          </td>
                          <td className="pl-2">
                            {!isNaN(aov) ? (
                              <div>{parseFloat(aov)?.toFixed(2)}</div>
                            ) : (
                              <div>-</div>
                            )}
                          </td>
                          <td className="pl-2">
                            <div>{parseFloat(item?.roas).toFixed(2)}</div>
                          </td>
                        </tr>
                      </>
                    );
                  })
                ) : (
                  <td
                    className=""
                    colSpan={10}
                    rowSpan={2}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle  row sticky font-semibold">
                      No Data Found
                    </div>
                  </td>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default BudgetDaily;
