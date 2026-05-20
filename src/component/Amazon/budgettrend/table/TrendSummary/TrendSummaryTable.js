import React from "react";
import LoaderSpinner from "../../../../common-components/loader-spinner";
const TrendSummaryTable = ({ bodyContent, end_date, start_date, loading }) => {
  const START_DATE = new Date(start_date);
  let END_DATE = new Date(end_date);
  if (END_DATE > new Date()) {
    END_DATE = new Date();
  }
  const TIME_DIFFERENCE = END_DATE.getTime() - START_DATE.getTime() + 1;

  const DIFF_BETWEEN_START_DATE_END_DATE = Math.ceil(
    TIME_DIFFERENCE / (1000 * 3600 * 24)
  );

  let currency = localStorage.getItem("currency");
    let currency_format = localStorage.getItem("currency_format");


  return (
    <>
      <div className="bg-white w-full">
        <div
          className={"campaignreport__table max-h-[500px] overflow-y-scroll"}
        >
          <table className="">
            <thead
              className={"campaignreport__tablehead sticky top-0 left-0 z-10"}
            >
              <tr className="">
                <th
                  className="tableHead--sticky"
                  style={{
                    // left: "5px",
                    minWidth: "154px",
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    height: "45px",
                  }}
                >
                  <div className="tableHead px-2 w-full">
                    <p>Campaign Name</p>
                  </div>
                </th>
                <th
                  className="tableHead--sticky"
                  style={{
                    position: "relative",
                    left: "0px",
                    // minWidth: "88px",
                    // position: "sticky",
                    // top: 0,
                    zIndex: 1,
                  }}
                >
                  <div className="tableHead px-2 w-full">
                    <p>Campaign Type</p>
                  </div>
                </th>
                <th
                  className="tableHead--sticky"
                  style={{
                    // left: "602px",
                    minWidth: "170px",
                    // position: "sticky",
                    // top: 0,
                    // zIndex: 1,
                  }}
                >
                  <div className="tableHead px-2 w-full">
                    <p>Platform</p>
                  </div>
                </th>
                <th
                  className="tableHead--sticky"
                  style={{
                    // left: "770px",
                    minWidth: "128px",
                    // position: "sticky",
                    // top: 0,
                    // zIndex: 1,
                  }}
                >
                  <div className="tableHead px-2 w-full">
                    <p>Budget</p>
                  </div>
                </th>

                <th
                  className="tableHead--sticky"
                  style={{
                    // left: "770px",
                    minWidth: "128px",
                    // position: "sticky",
                    // top: 0,
                    // zIndex: 1,
                  }}
                >
                  <div className="tableHead px-2 w-full">
                    <p>Budget Type</p>
                  </div>
                </th>
                <th className="tableHead--sticky">
                  <div className="tableHead px-2 w-full">
                    <p>Amount Spent</p>
                  </div>
                </th>
                <th className="tableHead--sticky">
                  <div className="tableHead px-2 w-full">
                    <p>Days since campaign is active</p>
                  </div>
                </th>
                <th className="tableHead--sticky">
                  <div className="tableHead px-2 w-full">
                    <p>Current DRR</p>
                  </div>
                </th>
                <th className="tableHead--sticky">
                  <div className="tableHead px-2 w-full">
                    <p>Last 7 days DRR</p>
                  </div>
                </th>
                {/* <th
                  className="tableHead--sticky"
                  style={{
                    left: "593px",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <div className="tableHead px-2 w-full">
                    <p>Yesterdays DRR</p>
                  </div>
                </th> */}
                <th
                  className="tableHead--sticky"
                  style={
                    {
                      // left: "593px",
                      // position: "sticky",
                      // top: 0,
                      // zIndex: 1,
                    }
                  }
                >
                  <div className="tableHead px-2 w-[150px] bg-red-30">
                    <p>Zone 1</p>
                  </div>
                </th>
                <th
                  className="tableHead--sticky"
                  style={
                    {
                      // left: "593px",
                      // position: "sticky",
                      // top: 0,
                      // zIndex: 1,
                    }
                  }
                >
                  <div className="tableHead px-2 w-[150px]">
                    <p>Zone 2</p>
                  </div>
                </th>
                <th
                  className="tableHead--sticky"
                  // style={{ left: "593px", position: "sticky", top: 0 }}
                >
                  <div className="tableHead px-2 w-[150px]">
                    <p>Zone 3</p>
                  </div>
                </th>
                <th
                  className="tableHead--sticky"
                  style={
                    {
                      // left: "593px",
                      // position: "sticky",
                      // top: 0,
                      // zIndex: 1,
                    }
                  }
                >
                  <div className="tableHead px-2 w-[150px]">
                    <p>Zone 4</p>
                  </div>
                </th>
              </tr>
            </thead>

            {loading === true ? (
              <td
                className="p-2"
                colSpan={10}
                rowSpan={2}
                style={{ alignItems: "center", verticalAlign: "middle" }}
              >
                <div className="loaderStyle  row sticky ">
                  <LoaderSpinner />
                </div>
              </td>
            ) : (
              // <div className="bg-red-300 "> <LoaderSpinner /></div>

              <tbody className="">
                {bodyContent.length > 0 ? (
                  bodyContent.map((item) => {
                    // find the no of days since a campaign has been active
                    const campaignStartDate = new Date(item?.start_date);
                    const currentDate = new Date();
                    const timeDifference =
                      currentDate.getTime() - campaignStartDate.getTime();
                    const differenceInDays = Math.ceil(
                      timeDifference / (1000 * 3600 * 24)
                    );

                    const spendEntries = Object.entries(item?.spend || {});

                    const formattedEndDate = end_date;

                    // Find the spend amount for the end_date
                    let spendForEndDate = 0;
                    const endDateSpendEntry = spendEntries.find(
                      ([, spendData]) => spendData.date === formattedEndDate
                    );
                    if (endDateSpendEntry) {
                      // eslint-disable-next-line no-unused-vars
                      spendForEndDate = endDateSpendEntry[1].amount;
                    }

                    const totalSpendAmount = spendEntries.reduce(
                      (accumulator, [, spendData]) =>
                        accumulator + spendData.amount,
                      0
                    );

                    const sevenDaysAgo = new Date(END_DATE);
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Go seven days back from end_date

                    let totalSpendLastSevenDays = 0;
                    spendEntries.forEach(([, spendData]) => {
                      const spendDate = new Date(spendData.date);
                      const timeDifference =
                        spendDate.getTime() - sevenDaysAgo.getTime();

                      const differenceInDays = Math.ceil(
                        timeDifference / (1000 * 3600 * 24)
                      );
                      if (differenceInDays >= 0 && differenceInDays <= 7) {
                        totalSpendLastSevenDays += spendData.amount;
                      }
                    });

                    const crawlTotals = {};

                    // Calculate the total spend for each crawl ID
                    item.spend_by_crawl.forEach(({ crawl, amount }) => {
                      if (crawlTotals[crawl]) {
                        crawlTotals[crawl] += amount;
                      } else {
                        crawlTotals[crawl] = amount;
                      }
                    });

                    const crawlValues = Object.values(crawlTotals);
                    const SumOfCrawls = crawlValues.reduce(
                      (sum, value) =>
                        sum + value / DIFF_BETWEEN_START_DATE_END_DATE,
                      0
                    );

                    return (
                      <>
                        <tr className="tablecontent--budgetTrend m-4  ">
                          <td
                            className="p-2 tableHead--sticky  "
                            style={{ position: "sticky", left: 0, zIndex: 1 }}
                          >
                            <div>{item.campaign_name}</div>
                          </td>
                          <td
                            className="p-2   "
                            // style={{ left: "207px" }}
                          >
                            {item.segment ? <div>{item.segment}</div> : "NA"}
                          </td>
                          <td
                            className="p-2   "
                            // style={{ left: "295px" }}
                          >
                            {item.platform == "MP" ? (
                              <div>Flipkart</div>
                            ) : (
                              <div>Supermart</div>
                            )}
                          </td>

                          <td
                            className="p-2  "
                            style={{ position: "relative" }}
                          >
                            <div>
                              {item?.spend[0]?.budget !== undefined
                                ? currency +
                                  item?.spend[0]?.budget.toLocaleString(currency_format)
                                : "-"}
                            </div>
                            {/* {item.budget_type === "DAILY_BUDGET" ? (
                            <div>
                              {currency +
                                (
                                  item?.spend[0]?.budget * differenceInDays
                                ).toLocaleString(currency_format)}
                            </div>
                          ) : (
                            <div>
                              {currency +
                                item?.spend[0]?.budget.toLocaleString(currency_format)}
                            </div>
                          )} */}
                          </td>
                          <td>
                            {item.budget_type === "DAILY_BUDGET" ? (
                              <div>Daily Budget</div>
                            ) : (
                              <div>Total Budget</div>
                            )}
                          </td>

                          <td
                            className="p-2 tableHead--sticky  "
                            // style={{ left: "593px" }}
                          >
                            <div>
                              {currency +
                                totalSpendAmount.toLocaleString(currency_format)}
                            </div>
                          </td>

                          <td
                            className="p-2 tableHead--sticky"
                            // style={{ left: "593px" }}
                          >
                            {item?.start_date ? (
                              <div>{differenceInDays} Days</div>
                            ) : (
                              "NA"
                            )}
                          </td>
                          <td
                            className="p-2 tableHead--sticky "
                            // style={{ left: "593px" }}
                          >
                            <div>
                              {(
                                totalSpendAmount /
                                DIFF_BETWEEN_START_DATE_END_DATE
                              ).toFixed(2)}
                            </div>
                          </td>
                          <td
                            className="p-2 tableHead--sticky "
                            // style={{ left: "593px" }}
                          >
                            <div>
                              {DIFF_BETWEEN_START_DATE_END_DATE > 6
                                ? (totalSpendLastSevenDays / 7).toFixed(2)
                                : "NA"}
                            </div>
                          </td>

                          <td className="p-2 tableHead--sticky">
                            {crawlTotals[1] !== undefined ? (
                              <div>
                                {(
                                  crawlTotals[1] /
                                  DIFF_BETWEEN_START_DATE_END_DATE
                                ).toFixed(2)}
                                {isNaN(
                                  ((crawlTotals[1] /
                                    DIFF_BETWEEN_START_DATE_END_DATE) *
                                    100) /
                                    SumOfCrawls
                                ) ? (
                                  <p className="text-[10px]">-</p>
                                ) : (
                                  <p className="text-[10px]">
                                    {(
                                      ((crawlTotals[1] /
                                        DIFF_BETWEEN_START_DATE_END_DATE) *
                                        100) /
                                      SumOfCrawls
                                    ).toFixed(2)}
                                    % of total spend
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div>-</div>
                            )}
                          </td>

                          <td className="p-2 tableHead--sticky">
                            {crawlTotals[2] !== undefined ? (
                              <div>
                                {(
                                  crawlTotals[2] /
                                  DIFF_BETWEEN_START_DATE_END_DATE
                                ).toFixed(2)}
                                {isNaN(
                                  ((crawlTotals[2] /
                                    DIFF_BETWEEN_START_DATE_END_DATE) *
                                    100) /
                                    SumOfCrawls
                                ) ? (
                                  <p className="text-[10px]">-</p>
                                ) : (
                                  <p className="text-[10px]">
                                    {(
                                      ((crawlTotals[2] /
                                        DIFF_BETWEEN_START_DATE_END_DATE) *
                                        100) /
                                      SumOfCrawls
                                    ).toFixed(2)}
                                    % of total spend
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div>-</div>
                            )}
                          </td>

                          <td className="p-2 tableHead--sticky">
                            {crawlTotals[3] !== undefined ? (
                              <div>
                                {(
                                  crawlTotals[3] /
                                  DIFF_BETWEEN_START_DATE_END_DATE
                                ).toFixed(2)}
                                {isNaN(
                                  ((crawlTotals[3] /
                                    DIFF_BETWEEN_START_DATE_END_DATE) *
                                    100) /
                                    SumOfCrawls
                                ) ? (
                                  <p className="text-[10px]">-</p>
                                ) : (
                                  <p className="text-[10px]">
                                    {(
                                      ((crawlTotals[3] /
                                        DIFF_BETWEEN_START_DATE_END_DATE) *
                                        100) /
                                      SumOfCrawls
                                    ).toFixed(2)}
                                    % of total spend
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div>-</div>
                            )}
                          </td>

                          <td className="p-2 tableHead--sticky">
                            {crawlTotals[4] !== undefined ? (
                              <div>
                                {(
                                  crawlTotals[4] /
                                  DIFF_BETWEEN_START_DATE_END_DATE
                                ).toFixed(2)}
                                {isNaN(
                                  ((crawlTotals[4] /
                                    DIFF_BETWEEN_START_DATE_END_DATE) *
                                    100) /
                                    SumOfCrawls
                                ) ? (
                                  <p className="text-[10px]">-</p>
                                ) : (
                                  <p className="text-[10px]">
                                    {(
                                      ((crawlTotals[4] /
                                        DIFF_BETWEEN_START_DATE_END_DATE) *
                                        100) /
                                      SumOfCrawls
                                    ).toFixed(2)}
                                    % of total spend
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div>-</div>
                            )}
                          </td>
                        </tr>
                      </>
                    );
                  })
                ) : (
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
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default TrendSummaryTable;
