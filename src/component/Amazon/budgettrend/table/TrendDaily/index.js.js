import React, { useState, useEffect } from "react";
import OptionHeaders from "../../budgettrendheaderoptions/OptionHeaders";
import { GET_ACCOUNTS, BUDGET_SUMMARY } from "../../../../../utils/constants";
import TrendTable from "../TrendSummary/TrendTable";
import { _GET, _POST } from "../../../../../services/axios.method";

const BugetTrendDailyTable = () => {
  // holds budget pacer data
  const [summaryData, setSummaryData] = useState([]);
  // holds start date from the calendar
  const [startDateCal, setStartDateCal] = useState();
  // holds end date from the calendar
  const [endDateCal, setEndDateCal] = useState();
  // holds the list of the accounts
  const [brandDataListing, setBrandDataListing] = useState([]);
  // holds the account selected by the user
  const [accountName, setAccountName] = useState("Durex");
  const [loading, setLoading] = useState(false);

  // API to fetch list of accounts
  const accountNames = async () => {
    try {
      const result = await _GET(GET_ACCOUNTS);
      const data = result.data.data.result;
      const accounts = data.map((item) => ({
        value: item._id.account,
      }));

      setBrandDataListing(accounts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    accountNames();
  }, []);

  // API to fetch the budget pacer data
  const budgetSummaryApi = async () => {
    try {
      setLoading(true);
      let dateRange = {
        start_date: startDateCal,
        end_date: endDateCal,
        account: accountName,
      };

      const result = await _POST(BUDGET_SUMMARY, dateRange);
      setSummaryData(result?.data?.data?.mergedResult);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // sets the start date
  const startDate = (data) => {
    setStartDateCal(data);
  };

  // sets the end date
  const endDate = (data) => {
    setEndDateCal(data);
  };

  useEffect(() => {
    // if (accountName) {
    budgetSummaryApi();
    // }
  }, [startDateCal, endDateCal, accountName]);

  // sets the account selected
  const handleAccountSelection = (event) => {
    setAccountName(event);
  };
  // const dispatch = useDispatch();
  // React.useEffect(() => {
  //   dispatch(getWallletBalance(accountName));
  // }, [accountName]);

  return (
    <>
      <div className="flipkart__card pb-3 ">
        <div className="flex">
          <OptionHeaders start_date={startDate} end_date={endDate} />
          <div>
            <select
              className="h-8 mt-6 w-60 ml-0 border"
              value={accountName}
              onChange={(e) => handleAccountSelection(e.target.value)}
            >
              {brandDataListing?.map((item, key) => (
                <option key={key} value={item.value}>{item.value}</option>
              ))}
            </select>
          </div>
        </div>

        <TrendTable
          bodyContent={summaryData}
          end_date={endDateCal}
          start_date={startDateCal}
          accountName={accountName}
          loading={loading}
        />
      </div>
    </>
  );
};

export default BugetTrendDailyTable;
