import React, { useEffect, useState } from "react";
import budgetTrend from "../../../data/flipkart/budget/budgetTrend.json";
import budgetTrendSecondMonth from "../../../data/flipkart/budget/budgetTrendSecondMonth.json";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { setMonth } from "date-fns";

const BudgetTrendLeftPanel = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [firstMonth, setFirstMonth] = useState(new Date().getMonth());
  const [showFirstMonthDatePicker, setShowFirstMonthDatePicker] =
    useState(false);
  const [secondMonth, setSecondMonth] = useState(new Date().getMonth());
  const [showSecondMonthDatePicker, setShowSecondMonthDatePicker] =
    useState(false);
  const [firstMonthData, setFirstMonthData] = useState({
    po: 0,
    AdCredits: 0,
    Expired: 0,
    Redeemed: 0,
    Blocked: 0,
    Spend: 0,
    total_budget: 0,
    available_balance: 0,
  });
  const [secondMonthData, setSecondMonthData] = useState({
    po: 0,
    AdCredits: 0,
    Expired: 0,
    Redeemed: 0,
    Blocked: 0,
    Spend: 0,
    total_budget: 0,
    available_balance: 0,
  });
  useEffect(() => {
    let budgetFirstMonthDataFromAPI = budgetTrend.response;
    let budgetSecondMonthDataFromAPI = budgetTrendSecondMonth.response;
    setFirstMonthData(() => {
      return {
        ...budgetFirstMonthDataFromAPI,
      };
    });
    setSecondMonthData(() => {
      return {
        ...budgetSecondMonthDataFromAPI,
      };
    });
  },[]);
  const {
    po,
    AdCredits,
    Expired,
    Redeemed,
    Blocked,
    Spend,
    total_budget,
    available_balance,
  } = firstMonthData;
  return (
    <>
      <div>
        <table className="budgettrendtable border-collapse">
          <thead className="budgettrendtable__head">
            <tr className="budgettrendtable__heading">
              <th className="budgettrendtable__headingtitle">Duration</th>
              <th className="budgettrendtable__headingtitle relative">
                <button
                  onClick={() => {
                    setShowFirstMonthDatePicker(!showFirstMonthDatePicker);
                  }}
                >
                  {firstMonth == "01"
                    ? "Jan"
                    : firstMonth == "02"
                    ? "Feb"
                    : firstMonth == "03"
                    ? "Mar"
                    : firstMonth == "04"
                    ? "Apr"
                    : firstMonth == "05"
                    ? "May"
                    : firstMonth == "06"
                    ? "Jun"
                    : firstMonth == "07"
                    ? "Jul"
                    : firstMonth == "08"
                    ? "Aug"
                    : firstMonth == "09"
                    ? "Sep"
                    : firstMonth == "10"
                    ? "Oct"
                    : firstMonth == "11"
                    ? "Nov"
                    : firstMonth == "12"
                    ? "Dec"
                    : ""}
                </button>
                {showFirstMonthDatePicker && (
                  <div className="absolute top-full pt-2">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        // console.log(
                        //   "date =====",
                        //   JSON.stringify(date),
                        //   "ijbikbi",
                        //   JSON.stringify(date).substring(6, 8)
                        // );
                        let month = JSON.stringify(date).substring(6, 8);
                        setFirstMonth(month);
                        setStartDate(date);
                        setShowFirstMonthDatePicker(false);
                      }}
                      dateFormat="MM/yyyy"
                      // customInput={<ExampleCustomInput />}
                      showMonthYearPicker
                      inline
                      className="border"
                    />
                  </div>
                )}
              </th>
              <th className="budgettrendtable__headingtitle relative">
                <button
                  onClick={() => {
                    setShowSecondMonthDatePicker(!showSecondMonthDatePicker);
                  }}
                >
                  {secondMonth == "01"
                    ? "Jan"
                    : secondMonth == "02"
                    ? "Feb"
                    : secondMonth == "03"
                    ? "Mar"
                    : secondMonth == "04"
                    ? "Apr"
                    : secondMonth == "05"
                    ? "May"
                    : secondMonth == "06"
                    ? "Jun"
                    : secondMonth == "07"
                    ? "Jul"
                    : secondMonth == "08"
                    ? "Aug"
                    : secondMonth == "09"
                    ? "Sep"
                    : secondMonth == "10"
                    ? "Oct"
                    : secondMonth == "11"
                    ? "Nov"
                    : secondMonth == "12"
                    ? "Dec"
                    : ""}
                </button>
                {showSecondMonthDatePicker && (
                  <div className="absolute top-full pt-2">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        // console.log(
                        //   "date =====",
                        //   JSON.stringify(date),
                        //   "ijbikbi",
                        //   JSON.stringify(date).substring(6, 8)
                        // );
                        let month = JSON.stringify(date).substring(6, 8);
                        setSecondMonth(month);
                        setStartDate(date);
                        setShowSecondMonthDatePicker(false);
                      }}
                      dateFormat="MM/yyyy"
                      // customInput={<ExampleCustomInput />}
                      showMonthYearPicker
                      inline
                      className="border"
                    />
                  </div>
                )}
              </th>
              <th className="budgettrend__heading-diffs  text-left">
                Difference
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="budgettrendtableul">
                <ul>
                  <li className="budgettrendtable__body font-bold text-left">
                    Money Available
                  </li>
                  <li className="budgettrendtable__body ">PO</li>
                  <li className="budgettrendtable__body">Ad Credits</li>
                  <li className="budgettrendtable__body">Expired</li>
                  <li className="budgettrendtable__body">Redeem</li>
                </ul>
              </td>
              <td className="budgettrendtableul">
                <ul>
                  <li className="budgettrendtable__body font-bold text-right">
                    31520
                  </li>
                  <li className="budgettrendtable__body text-right">{po}</li>
                  <li className="budgettrendtable__body text-right">
                    {AdCredits}
                  </li>
                  <li className="budgettrendtable__body text-right">
                    {Expired}
                  </li>
                  <li className="budgettrendtable__body text-right">
                    {Redeemed}
                  </li>
                </ul>
              </td>
              <td className="budgettrendtableul">
                <ul>
                  <li className="budgettrendtable__body font-bold text-right">
                    1501
                  </li>
                  <li className="budgettrendtable__body text-right">
                    {secondMonthData.po}
                  </li>
                  <li className="budgettrendtable__body text-right">
                    {secondMonthData.AdCredits}
                  </li>
                  <li className="budgettrendtable__body text-right">
                    {secondMonthData.Expired}
                  </li>
                  <li className="budgettrendtable__body text-right">
                    {secondMonthData.Redeemed}
                  </li>
                </ul>
              </td>
              <td className="budgettrend__heading-diffs">
                <ul>
                  <li className="budgettrendtable__headingtitle-diff font-extrabold  text-right">
                    0
                  </li>
                  <li className="budgettrendtable__headingtitle-diff text-right">
                    {po - secondMonthData.po}
                  </li>
                  <li className="budgettrendtable__headingtitle-diff text-right">
                    {AdCredits - secondMonthData.AdCredits}
                  </li>
                  <li className="budgettrendtable__headingtitle-diff text-right">
                    {Expired - secondMonthData.Expired}
                  </li>
                  <li className="budgettrendtable__headingtitle-diff text-right">
                    {Redeemed - secondMonthData.Redeemed}
                  </li>
                </ul>
              </td>
            </tr>
            <>
              <tr className="">
                <td className="borderbudgettabl-body">
                  <ul>
                    <li className="budgettrendtable__subbody pt-4 font-extrabold ">
                      Campaign Budget (Money Blocked)
                    </li>
                    <li className="budgettrendtable__subbody">Amount Spent</li>
                    <li className="budgettrendtable__subbody">
                      Blocked Amount
                    </li>
                  </ul>
                </td>
                <td className="borderbudgettabl-body">
                  <ul>
                    <li className="budgettrendtable__subbody font-bold pt-4 text-right">
                      {total_budget}
                    </li>
                    <li className="budgettrendtable__subbody text-right">
                      {Spend}
                    </li>
                    <li className="budgettrendtable__subbody text-right">
                      {Blocked}
                    </li>
                  </ul>
                </td>
                <td className="borderbudgettabl-body">
                  <ul>
                    <li className="budgettrendtable__subbody font-bold pt-4 text-right">
                      {secondMonthData.total_budget}
                    </li>
                    <li className="budgettrendtable__subbody text-right">
                      {secondMonthData.Spend}
                    </li>
                    <li className="budgettrendtable__subbody text-right">
                      {secondMonthData.Blocked}
                    </li>
                  </ul>
                </td>
                <td className="budgettrend__heading-diffs">
                  <ul>
                    <li className="budgettrendtable__headingtitle-diff text-black font-extrabold text-right">
                      {total_budget - secondMonthData.total_budget}
                    </li>
                    <li className="budgettrendtable__headingtitle-diff  text-right">
                      {Spend - secondMonthData.Spend}
                    </li>
                    <li className="budgettrendtable__headingtitle-diff  text-right">
                      {Blocked - secondMonthData.Blocked}
                    </li>
                  </ul>
                </td>
              </tr>
            </>
            <tr className="lastRow">
              <td>
                <ul className="budgettrendtable__bottombody ">
                  <li>Available Wallet Balance</li>
                </ul>
              </td>
              <td>
                <ul>
                  <li className="budgettrendtable__bottombody  text-right">
                    {available_balance}
                  </li>
                </ul>
              </td>
              <td>
                <ul>
                  <li className="budgettrendtable__bottombody font-bold text-right">
                    {secondMonthData.available_balance}
                  </li>
                </ul>
              </td>
              <td className="budgettrend__heading-diffs">
                <ul className="font-bold text-right">
                  <li>
                    {available_balance - secondMonthData.available_balance}
                  </li>
                </ul>
              </td>
            </tr>
            <tr className="lastRow">
              <td>
                <ul>
                  <li className="budgettrendtable__bottombody font-bold">
                    Potential Wallet
                  </li>
                </ul>
              </td>
              <td>
                <ul>
                  <li className="budgettrendtable__bottombody font-bold text-right">
                    45717
                  </li>
                </ul>
              </td>
              <td>
                <ul>
                  <li className="budgettrendtable__bottombody font-bold text-right">
                    2000
                  </li>
                </ul>
              </td>
              <td className="budgettrend__heading-diffs">
                <ul>
                  <li className="budgettrendtable__headingtitle-diff font-bold text-right">
                    0
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
export default BudgetTrendLeftPanel;
