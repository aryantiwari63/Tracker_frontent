import "./style.css";
import { CSVLink } from "react-csv";
import LoaderSpinner from "../loader-spinner";

const BudgetPacerDaily = ({
  loading,
  bodyContent,
  month,
  accountName,
  mediaType,
}) => {
  const currency = localStorage.getItem("currency");
  const currency_format = localStorage.getItem("currency_format");
  let decimalFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  let roasName;
  let unitSoldName;
  const exportData = bodyContent.map((i) => {
    let segment;

    if (
      mediaType === "Amazon" ||
      mediaType === "Zepto" ||
      mediaType === "Blinkit"
    ) {
      segment = i.campaign_type;
      roasName = "ROAS";
      unitSoldName = "Orders";
    }
    if (mediaType === "Instamart") {
      roasName = "ROI";
      unitSoldName = "Cart Addition";
    }
    return {
      brand: accountName,
      date: i.created_on,
      spend: i.spend,
      [unitSoldName]: i.orders,
      sales: i?.sales,
      ...(mediaType !== "Instamart" && {
        cpc: i.cpc,
        cvr: i.cvr,
        aov: i.aov,
        clicks: i.clicks,
        segment: segment,
      }),

      [roasName]: i.roas,
    };
  });
  return (
    <>
      <div className="w-full bg-white">
        {" "}
        <div className="mb-2 mx-4 flex items-center justify-end">
          {/* <h2 className="text-[20px] font-semibold">Daily Budget</h2> */}
          <CSVLink
            data={exportData}
            filename={`budget_daily_data_${accountName}_${month}.csv`}
            className="border rounded text-gray-500 px-2 py-2 roshadow-md cursor-pointer hover:text-blue-600 transition duration-300"
          >
            {" "}
            <img className="header-buttons w-4" src="/assets/images/hard-disk.png" alt="" />
          </CSVLink>
        </div>
        <div
          className="campaignreport__table max-h-[550px] overflow-y-auto mx-4"
          // className={"campaignreport__table max-h-[550px] overflow-y-scroll"}
        >
          <table className="w-full">
            {" "}
            <thead
              // className={"campaignreport__tablehead sticky top-0 left-0 z-10"}
              className="campaignreport__tablehead  table-fixed sticky top-0 left-0 z-[35] bg-[#F3F4F6]"
            >
              <tr className="h-[54px]">
                <th className="tableHeadBudget--sticky ">
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Brand</p>
                  </div>
                </th>
                {mediaType !== "Instamart" && (
                  <th className="tableHeadBudget--sticky ">
                    <div className="tableHeadBudget px-2 w-full">
                      <p>Segment</p>
                    </div>
                  </th>
                )}
                <th className="tableHeadBudget--sticky ">
                  <div
                    className="tableHeadBudget px-2 w-full"
                    style={{ minWidth: "140px" }}
                  >
                    <p>Date</p>
                  </div>
                </th>
                {mediaType !== "Instamart" && (
                  <th className="tableHeadBudget--sticky">
                    <div className="tableHeadBudget px-2 w-full">
                      <p>Clicks</p>
                    </div>
                  </th>
                )}
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
                    <p>{unitSoldName}</p>
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
                    <p>Sales</p>
                  </div>
                </th>
                {mediaType !== "Instamart" && (
                  <>
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
                  </>
                )}

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
                    <p>{roasName}</p>
                  </div>
                </th>
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
                {bodyContent?.length > 0 ? (
                  bodyContent?.map((item, index) => {
                    let segmentName;
                    if (
                      mediaType === "Amazon" ||
                      mediaType === "Zepto" ||
                      mediaType === "Blinkit"
                    ) {
                      segmentName = item.campaign_type;
                    }

                    return (
                      <>
                        <tr key={index} className="h-11 tablecontent m-4 ">
                          <td className="p-2 tableHeadBudget--sticky  ">
                            <div>{accountName}</div>
                          </td>
                          {mediaType !== "Instamart" && (
                            <td className="p-2 tableHeadBudget--sticky  ">
                              <div>{segmentName}</div>
                            </td>
                          )}
                          <td className="p-2 tableHeadBudget--sticky  ">
                            <div>{item?.created_on}</div>
                          </td>
                          {mediaType !== "Instamart" && (
                            <td className="p-2  ">
                              <div>
                                {" "}
                                {parseFloat(item?.clicks).toLocaleString(
                                  currency_format
                                )}
                              </div>
                            </td>
                          )}
                          <td className="p-2  ">
                            {currency}
                            {parseFloat(item?.spend).toLocaleString(
                              currency_format,
                              decimalFormat
                            )}
                          </td>
                          <td className="p-2  ">
                            <div>
                              {parseFloat(item?.orders).toLocaleString(
                                currency_format
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
                          </td>{" "}
                          {mediaType !== "Instamart" && (
                            <>
                              <td className="p-2  ">
                                <div>
                                  {" "}
                                  {currency}
                                  {parseFloat(item?.cpc).toLocaleString(
                                    currency_format,
                                    decimalFormat
                                  )}
                                </div>
                              </td>{" "}
                              <td className="p-2  ">
                                <div>
                                  {currency}
                                  {parseFloat(item?.cvr).toLocaleString(
                                    currency_format,
                                    decimalFormat
                                  )}
                                </div>
                              </td>
                              <td className="pl-2">
                                <div>{parseFloat(item?.aov).toFixed(2)}</div>
                              </td>
                            </>
                          )}
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
export default BudgetPacerDaily;
