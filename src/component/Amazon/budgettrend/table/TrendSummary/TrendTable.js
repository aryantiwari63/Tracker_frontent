import React, { useEffect, useState } from "react";
import LoaderSpinner from "../../../../common-components/loader-spinner";

const TrendTable = ({
  bodyContent,
  start_date,
  end_date,
  accountName,
  loading,
}) => {
  const [sortedDates, setSortedDates] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const START_DATE = new Date(start_date);
  let END_DATE = new Date(end_date);

  if (END_DATE > new Date()) {
    END_DATE = new Date();
  }
  const TIME_DIFFERENCE = END_DATE.getTime() - START_DATE.getTime() + 1;

  const DIFF_BETWEEN_START_DATE_END_DATE = Math.ceil(
    TIME_DIFFERENCE / (1000 * 3600 * 24)
  );

  useEffect(() => {
    const copiedBodyContent = JSON.parse(JSON.stringify(bodyContent));
    const uniqueDates = new Set();
    copiedBodyContent.forEach((item) => {
      item?.spend_by_crawl?.forEach((spendEntry) => {
        uniqueDates.add(spendEntry.date);
      });
    });

    const sortedDatesArr = [...uniqueDates].sort(
      (a, b) => new Date(b) - new Date(a)
    );
    setSortedDates(sortedDatesArr);
  }, [bodyContent, start_date, end_date]);

  useEffect(() => {
    const filteredData = bodyContent.filter(
      (item) => item.account === accountName
    );
    setFilteredData(filteredData);
  }, [bodyContent, accountName, start_date, end_date]);
  let currency = localStorage.getItem("currency");
  let currency_format = localStorage.getItem("currency_format");

  return (
    <>
      <div className="bg-white w-full">
        <div
          className={"campaignreport__table max-h-[500px] overflow-y-scroll"}
        >
          <table className="budgettrend__table">
            <thead className="campaignreport__tablehead  table-fixed sticky top-0 z-10">
              <tr className="">
                <th
                  className="tableHead--sticky"
                  style={{ minWidth: "154px", position: "sticky", zIndex: 3 }}
                >
                  <div className="tableHead px-1 w-full">
                    <p>Campaign Name</p>
                  </div>
                </th>
                <th
                  className="tableHead--sticky"
                  style={{
                    left: "154px",
                    minWidth: "88px",
                    position: "sticky",
                    zIndex: 1,
                  }}
                >
                  <div className="tableHead px-1 w-full">
                    <p>Budget</p>
                  </div>
                </th>
                <th
                  className="tableHead--sticky"
                  style={{
                    left: "154px",
                    minWidth: "88px",
                    position: "sticky",
                    zIndex: 1,
                  }}
                >
                  <div className="tableHead px-1 w-full">
                    <p>Budget Type</p>
                  </div>
                </th>
                <th
                  className="tableHead--sticky"
                  style={{
                    left: "88px",
                    minWidth: "242px",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <div className="tableHead px-1 w-full">
                    <p>Total Amount Spent</p>
                  </div>
                </th>
                <th
                  className="tableHead--sticky"
                  style={{
                    left: "242px",
                    position: "sticky",

                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <div className="tableHead px-1 w-full">
                    <p>Current DRR</p>
                  </div>
                </th>
                {sortedDates.map((date) => (
                  <th key={date}>
                    <p className="tableHead-p w-60 ">{date}</p>
                    <div className="row">
                      <div className="col tableHead-c">1</div>
                      <div className="col tableHead-d">2</div>
                      <div className="col tableHead-e">3</div>
                      <div className="col tableHead-f">4</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            {loading === true ? (
              <tbody className="">
                <LoaderSpinner />
                {/* <tr>
                  <td className=""></td>
                </tr> */}
              </tbody>
            ) : (
              <tbody className="">
                {filteredData.length > 0 ? (
                  filteredData.map((item, i) => {
                    const spendEntries = Object.entries(item?.spend || {});
                    const totalSpendAmount = spendEntries.reduce(
                      (accumulator, [, spendData]) =>
                        accumulator + spendData.amount,
                      0
                    );

                    const groupedSpendEntries = {};
                    item.spend_by_crawl.forEach((spendEntry) => {
                      const { date, crawl, amount } = spendEntry;
                      if (!groupedSpendEntries[date]) {
                        groupedSpendEntries[date] = {};
                      }
                      groupedSpendEntries[date][`crawl_${crawl}`] = amount;
                    });

                    const dateData = sortedDates.map((date) => {
                      const crawl1Data = item.spend_by_crawl.find(
                        (entry) => entry.date === date && entry.crawl === 1
                      );
                      const crawl2Data = item.spend_by_crawl.find(
                        (entry) => entry.date === date && entry.crawl === 2
                      );
                      const crawl3Data = item.spend_by_crawl.find(
                        (entry) => entry.date === date && entry.crawl === 3
                      );
                      const crawl4Data = item.spend_by_crawl.find(
                        (entry) => entry.date === date && entry.crawl === 4
                      );

                      const crawlDataSum = Object.values(
                        groupedSpendEntries[date] || {}
                      ).reduce((sum, value) => sum + value, 0);

                      return (
                        <td key={date} className="date-amount">
                          <div className="row">
                            <div className="col_3 tableHead-valueA">
                              {groupedSpendEntries[date]?.crawl_1 !==
                              undefined ? (
                                <>
                                  <p>
                                    {currency}
                                    {groupedSpendEntries[
                                      date
                                    ]?.crawl_1?.toFixed(1)}
                                  </p>

                                  {isNaN(
                                    (groupedSpendEntries[date]?.crawl_1 * 100) /
                                      crawlDataSum
                                  ) ? (
                                    <p className="text-[11px]">-</p>
                                  ) : (
                                    <p className="text-[11px]">
                                      {(
                                        (groupedSpendEntries[date]?.crawl_1 *
                                          100) /
                                        crawlDataSum
                                      ).toFixed(1)}
                                      %
                                    </p>
                                  )}
                                  {crawl1Data?.campaign_status ===
                                    "Total Budget Met" && (
                                    <div className="tableHead-btn">
                                      Budget met
                                    </div>
                                  )}
                                </>
                              ) : (
                                "-"
                              )}
                            </div>

                            <div className="col_3 tableHead-valueB">
                              {groupedSpendEntries[date]?.crawl_2 !==
                              undefined ? (
                                <>
                                  <p>
                                    {currency}
                                    {groupedSpendEntries[
                                      date
                                    ]?.crawl_2?.toFixed(1)}
                                  </p>
                                  {isNaN(
                                    (groupedSpendEntries[date]?.crawl_2 * 100) /
                                      crawlDataSum
                                  ) ? (
                                    <p className="text-[11px]">-</p>
                                  ) : (
                                    <p className="text-[11px]">
                                      {(
                                        (groupedSpendEntries[date]?.crawl_2 *
                                          100) /
                                        crawlDataSum
                                      ).toFixed(1)}
                                      %
                                    </p>
                                  )}
                                  {crawl2Data?.campaign_status ===
                                    "Total Budget Met" && (
                                    <div className="tableHead-btn">
                                      Budget met
                                    </div>
                                  )}
                                </>
                              ) : (
                                "-"
                              )}
                              {/* {crawl2Data?.campaign_status ===
                            "Total Budget Met" && (
                            <div className="tableHead-btn">Budget met</div>
                          )} */}
                            </div>
                            <div className="col_3 tableHead-valueC">
                              {groupedSpendEntries[date]?.crawl_3 !==
                              undefined ? (
                                <>
                                  <p>
                                    {currency}
                                    {groupedSpendEntries[
                                      date
                                    ]?.crawl_3?.toFixed(1)}
                                  </p>
                                  {isNaN(
                                    (groupedSpendEntries[date]?.crawl_3 * 100) /
                                      crawlDataSum
                                  ) ? (
                                    <p className="text-[11px]">-</p>
                                  ) : (
                                    <p className="text-[11px]">
                                      {(
                                        (groupedSpendEntries[date]?.crawl_3 *
                                          100) /
                                        crawlDataSum
                                      ).toFixed(1)}
                                      %
                                    </p>
                                  )}
                                  {crawl3Data?.campaign_status ===
                                    "Total Budget Met" && (
                                    <div className="tableHead-btn">
                                      Budget met
                                    </div>
                                  )}
                                </>
                              ) : (
                                "-"
                              )}
                              {/* {crawl3Data?.campaign_status ===
                            "Total Budget Met" && (
                            <div className="tableHead-btn">Budget met</div>
                          )} */}
                            </div>
                            <div className="col_3 tableHead-valueD">
                              {groupedSpendEntries[date]?.crawl_4 !==
                              undefined ? (
                                <>
                                  <p>
                                    {currency}
                                    {groupedSpendEntries[
                                      date
                                    ]?.crawl_4?.toFixed(1)}
                                  </p>
                                  {isNaN(
                                    (groupedSpendEntries[date]?.crawl_4 * 100) /
                                      crawlDataSum
                                  ) ? (
                                    <p className="text-[11px]">-</p>
                                  ) : (
                                    <p className="text-[11px]">
                                      {(
                                        (groupedSpendEntries[date]?.crawl_4 *
                                          100) /
                                        crawlDataSum
                                      ).toFixed(1)}
                                      %
                                    </p>
                                  )}
                                  {crawl4Data?.campaign_status ===
                                    "Total Budget Met" && (
                                    <div className="tableHead-btn">
                                      Budget met
                                    </div>
                                  )}
                                </>
                              ) : (
                                "-"
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    });

                    return (
                      <tr key={i}>
                        <td
                          className="p-2 tableHead--sticky sticky m-4 "
                          style={{ left: "0.1px", zIndex: 1 }}
                        >
                          <div>{item.campaign_name}</div>
                        </td>
                        <td className="p-2  " style={{ position: "relative" }}>
                          <div>
                            {item?.spend[0]?.budget !== undefined
                              ? currency +
                                item?.spend[0]?.budget.toLocaleString(
                                  currency_format
                                )
                              : "-"}
                          </div>
                          {/* {item.budget_type === "DAILY_BUDGET" ? (
                            <div>
                              {item?.spend[0]?.budget === undefined ||
                              item?.spend[0]?.budget === NaN
                                ? "NA"
                                : currency +
                                  (
                                    item?.spend[0]?.budget * differenceInDays
                                  ).toLocaleString(currency_format)}
                            </div>
                          ) : (
                            <div>
                              {item?.spend[0]?.budget === undefined ||
                              item?.spend[0]?.budget === NaN
                                ? "NA"
                                : currency +
                                  item?.spend[0]?.budget.toLocaleString(
                                    currency_format
                                  )}
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

                        <td className="p-2 " style={{ position: "relative" }}>
                          <div>
                            {currency +
                              totalSpendAmount.toLocaleString(currency_format)}
                          </div>
                        </td>
                        <td className="p-2 " style={{}}>
                          <div>
                            {(
                              totalSpendAmount /
                              DIFF_BETWEEN_START_DATE_END_DATE
                            ).toFixed(2)}
                          </div>
                        </td>
                        {dateData}
                      </tr>
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

export default TrendTable;
