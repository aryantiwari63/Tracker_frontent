import React, { useState, useEffect } from "react";
import _ from "lodash";
// import OptionHeaders from "../../budgettrendheaderoptions/OptionHeaders";
import {
  BUDGET_PACER_DAILY,
  GET_ACCOUNTS,
} from "../../../../../utils/constants";
// import TrendTable from "../TrendSummary/TrendTable";
import { _GET, _POST } from "../../../../../services/axios.method";
import { useDispatch } from "react-redux";
import { getWallletBalance } from "../../../../../redux/action-creator/sideBarAction";
import BudgetDaily from "./BudgetDaily";
import SelectDropDrown from "../../../../common-components/SelectDropDown";
import { saveLocalStorageAccounts, getLocalStorageAccounts } from "../../../../../utils/helpers";

const BugetTrendDailyTable = () => {
  // holds budget pacer data
  // const [summaryData, setSummaryData] = useState([]);
  // // holds start date from the calendar
  // const [startDateCal, setStartDateCal] = useState();
  // // holds end date from the calendar
  // const [endDateCal, setEndDateCal] = useState();
  // holds the list of the accounts
  const [brandDataListing, setBrandDataListing] = useState([]);
  // holds the account selected by the user
  const [accountName, setAccountName] = useState("");
  const [platform, setPlatform] = useState([]);
  const [segment, setSegment] = useState("PLA");
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [month, setMonth] = useState("");

  const date = new Date();

  const year = date.getFullYear();
  // API to fetch list of accounts
  const accountNames = async () => {
    try {
      const result = await _GET(GET_ACCOUNTS);
      const data = result.data.data.result;
      const accounts = data.map((item) => ({
        value: item._id.account,
      }));
      let accountsFilter = _.cloneDeep(accounts);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
         let firstAccount = savedAccounts[0];
         let filterAccount = accounts.find(acc => acc.value === firstAccount);
         if (filterAccount) {
            accountsFilter = [filterAccount]
            saveLocalStorageAccounts([accountsFilter[0]?.value])
         } else {
           saveLocalStorageAccounts([accountsFilter[0]?.value])
         }
      } else {
        saveLocalStorageAccounts([accountsFilter[0]?.value])
      }     
      setBrandDataListing(accounts);
      setAccountName(accountsFilter[0]?.value);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    accountNames();
  }, []);

  // sets the account selected
  const handleAccountSelection = (event) => {
    setAccountName(event);
    saveLocalStorageAccounts([event])
  };
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getWallletBalance(accountName));
  }, [accountName]);

  const dailyBudget = async () => {
    try {
      const data = {
        brand: accountName,
        platform: platform,
        segment: segment,
        start_date: startDate,
        end_date: endDate,
      };
      setLoading(true);

      const result = await _POST(BUDGET_PACER_DAILY, data);
      setLoading(false);
      setDailyData(result?.data?.data?.result);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dailyBudget();
  }, [accountName, platform, segment, month]);

  const dateFormatting = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
    const yesterDate = yesterday.getDate().toString().padStart(2, "0");

    const monthIndex = date.getMonth();
    const runningMonth = monthNames[monthIndex];

    return { year, month, yesterDate, runningMonth };
  };

  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const dateFormat = dateFormatting();
    const endDate = `${dateFormat.year}-${dateFormat.month}-${dateFormat.yesterDate}`;
    const startDate = `${dateFormat.year}-${dateFormat.month}-01`;
    // const currentMonth = dateFormat.runningMonth;
    setEndDate(endDate);
    setStartDate(startDate);
    // setBudgetMonth(currentMonth);
  }, []);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
    const yesterDate = yesterday.getDate().toString().padStart(2, "0");
    const start_date = `${event.target.value}-01`;

    let end_date;
    const compareMonth = `${year}-${month}` === event.target.value;
    if (compareMonth === true) {
      //  setCurrentMonth(true);
      end_date = `${event.target.value}-${yesterDate}`;
    } else {
      //  setCurrentMonth(false);

      end_date = `${event.target.value}-31`;
    }

    setStartDate(start_date);
    setEndDate(end_date);
  };

  useEffect(() => {
    const date = new Date();

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    setMonth(`${year}-${month}`);
  }, []);

  const platformsData = [
    {
      label: "Flipkart",
      value: "MP",
    },
    {
      label: "Supermart",
      value: "SM",
    },
  ];

  const typeData = [
    {
      label: "PLA",
      value: "PLA",
    },
    {
      label: "PCA",
      value: "PCA",
    },
  ];

  return (
    <>
      <div className="flipkart__card pb-3 w-full">
        <div className="flex items-center mt-4">
          <div className="w-[260px] mr-2">
            <input
              className="border rounded h-8 px-4 w-full outline-[#0081F7]"
              type="month"
              id="month"
              value={month}
              onChange={handleMonthChange}
            />
          </div>

          <div>
            <select
              className="h-8 rounded-md w-60 border focus:outline-[#0081F7] active:outline-[#0081F7]"
              value={accountName}
              onChange={(e) => handleAccountSelection(e.target.value)}
            >
              {brandDataListing?.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>

          <div className="w-60 ml-2">
            {" "}
            <SelectDropDrown
              FilterHeading="Select Platform"
              selectAllDefault={true}
              // options={["MP", "SM"]}
              setSelectedVal={setPlatform}
              selectedVal={platform}
              options={platformsData}
            />
          </div>

          <div className="h-8 ml-2 w-60">
            {" "}
            <SelectDropDrown
              FilterHeading="Select Segment"
              selectAllDefault={true}
              // options={["MP", "SM"]}
              setSelectedVal={setSegment}
              selectedVal={segment}
              options={typeData}
            />
          </div>
        </div>
        <BudgetDaily
          loading={loading}
          bodyContent={dailyData}
          month={month}
          accountName={accountName}
        />
        {/* <TrendTable
          bodyContent={summaryData}
          end_date={endDateCal}
          start_date={startDateCal}
          accountName={accountName}
          loading={loading}
        /> */}
      </div>
    </>
  );
};

export default BugetTrendDailyTable;
