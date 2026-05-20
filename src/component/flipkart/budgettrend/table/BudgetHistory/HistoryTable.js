import { object } from "prop-types";
import { useState, useEffect } from "react";

const HistoryTable = ({ historyData }) => {
  const [tableData, setTableData] = useState([]);

  const convertDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    return formattedDate;
  };
  let decimalFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

  const currency = localStorage.getItem("currency");
  const currency_format = localStorage.getItem("currency_format");
  const handleTableData = () => {
    let history = [];

    let date;
    historyData?.length > 0 &&
      historyData?.map((item, i) => {
        if (item?.previous_data) {
          const previousData = item?.previous_data;

          for (const key in previousData) {
            let value_to = {};
            if (
              object.hasOwnProperty.call(previousData, key) &&
              Object.prototype.hasOwnProperty.call(item.budget, key)
            ) {
              value_to[key] = item.budget[key];
            }
            if (Object.hasOwnProperty.call(previousData, key)) {
              const value = previousData[key];
              let change_on;
              switch (key) {
                case "pla_budget":
                  change_on = "PLA";
                  break;
                case "pca_budget":
                  change_on = "PCA";
                  break;
                case "mk_budget":
                  change_on = "Flipkart";
                  break;
                case "sm_budget":
                  change_on = "Supermart";
                  break;
                case "sm_pla_budget":
                  change_on = "Supermart PLA";
                  break;
                case "sm_pca_budget":
                  change_on = "Supermart PCA";
                  break;
                case "mk_pca_budget":
                  change_on = "Flipkart PCA";
                  break;
                case "mk_pla_budget":
                  change_on = "Flipkart PLA";
                  break;
                default:
                  change_on = null;
              }

              date = convertDateTime(item?.createdAt);
              history.push({
                change_on: change_on,
                value_from: value !== null ? value : 0,
                username: item?.username,
                brand: item?.brand,
                date: date,
                month: item?.month,
                value_to: Object.values(value_to)[0],
                index: i,
              });
            }
          }
        } else {
          if (item?.budget) {
            let budgetData = item?.budget;
            for (const key in budgetData) {
              if (Object.hasOwnProperty.call(budgetData, key)) {
                const value = budgetData[key];
                let change_on;
                switch (key) {
                  case "pla_budget":
                    change_on = "PLA";
                    break;
                  case "pca_budget":
                    change_on = "PCA";
                    break;
                  case "mk_budget":
                    change_on = "Flipkart";
                    break;
                  case "sm_budget":
                    change_on = "Supermart";
                    break;
                  case "sm_pla_budget":
                    change_on = "Supermart PLA";
                    break;
                  case "sm_pca_budget":
                    change_on = "Supermart PCA";
                    break;
                  case "mk_pca_budget":
                    change_on = "Flipkart PCA";
                    break;
                  case "mk_pla_budget":
                    change_on = "Flipkart PLA";
                    break;
                  default:
                    change_on = null;
                }

                date = convertDateTime(item?.createdAt);
                history.push({
                  change_on: change_on,
                  value_from: 0,
                  username: item?.username,
                  brand: item?.brand,
                  date: date,
                  month: item?.month,
                  value_to: value,
                  index: i,
                });
              }
            }
          }
        }
        return null;
      });
    setTableData(history);
  };

  useEffect(() => {
    handleTableData();
  }, [historyData]);
  return (
    <>
      <div className="bg-white w-full">
        <div
          className={"campaignreport__table max-h-[530px] overflow-y-scroll"} style={{width:"100%"}}
        >
          <table style={{width:"100%"}}>
            <thead className="campaignreport__tableHeadBudget  table-fixed sticky top-0 left-0 z-[35] bg-[#F3F4F6]">
              <tr className="h-11">
                <th className="tableHeadBudgetBudget--sticky ">
                  <div className="tableHeadBudget px-2 w-full">
                    <p>Date / Time</p>
                  </div>
                </th>
                <th className="tableHeadBudgetBudget--sticky ">
                  <div
                    className="tableHeadBudget px-2 w-full"
                    style={{ minWidth: "200px" }}
                  >
                    <p>For Month</p>
                  </div>
                </th>
                <th className="tableHeadBudgetBudget--sticky">
                  <div
                    className="tableHeadBudget px-2 w-full bold"
                    style={{
                      // left: "5px",
                      minWidth: "200px",
                      position: "sticky",
                      top: 0,
                      zIndex: 3,

                      // height: "45px",
                    }}
                  >
                    <p>User</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudgetBudget--sticky min-w-16"
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
                    <p>Brand</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudgetBudget--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "140px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    // height: "45px",
                  }}
                >
                  <div
                    className="tableHeadBudget px-2 w-full"
                    style={{ minWidth: "250px" }}
                  >
                    <p>Change on</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudgetBudget--sticky"
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
                    <p>From</p>
                  </div>
                </th>
                <th
                  className="tableHeadBudgetBudget--sticky"
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
                    <p>To</p>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {tableData.length > 0 ? (
                tableData.map((item) => (
                  <>
                    {/* <tr className="h-11 budgetpacer--tablecontent m-4 ">
                     */}
                    <tr
                      className={`${
                        item.index % 2 == 0
                          ? "budgetpacer--tablecontent--even"
                          : "budgetpacer--tablecontent--odd"
                      } h-11 m-4`}
                    >
                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {item?.date}
                      </td>
                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {item?.month}
                      </td>
                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {item?.username}
                      </td>
                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {item?.brand}
                      </td>
                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {item?.change_on}
                      </td>
                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {currency}
                        {parseFloat(item?.value_from).toLocaleString(
                          currency_format,
                          decimalFormat
                        )}
                      </td>

                      <td className="p-2 tableHeadBudgetBudget--sticky">
                        {item?.value_to !== undefined ? (
                          <>
                            {currency}
                            {parseFloat(item?.value_to).toLocaleString(
                              currency_format,
                              decimalFormat
                            )}
                          </>
                        ) : (
                          <>{currency}0</>
                        )}
                      </td>
                    </tr>
                  </>
                ))
              ) : (
                <tr>
                  <td
                    className=""
                    colSpan={10}
                    rowSpan={2}
                    style={{ alignItems: "center", verticalAlign: "middle" }}
                  >
                    <div className="loaderStyle row sticky font-semibold">
                      No Data Found
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HistoryTable;
