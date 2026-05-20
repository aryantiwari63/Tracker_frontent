import { useState, useEffect } from "react";
import { _GET, _POST } from "../../../../services/axios.method";
import _ from 'lodash';
import {
  AMAZON_ACCOUNTS,
  AMAZON_DAILY_BUDGET_PACER,
} from "../../../../utils/amazonConstants";
import { saveLocalStorageAccounts, getLocalStorageAccounts } from "../../../../utils/helpers";
import BudgetPacerDaily from "../../../common-components/BudgetPacer/budgetPacerDaily";
import SelectDropDrown from "../../../common-components/SelectDropDown";
import CustomSelectNew from "../../../common-components/CustomSelectNew";
const DailyBudget = () => {
  const [segment, setSegment] = useState("SP");
  const [accountName, setAccountName] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [brandDataListing, setBrandDataListing] = useState([]);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [dailyData, setDailyData] = useState([]);

  const date = new Date();

  const year = date.getFullYear();
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
    const dateFormat = dateFormatting();
    const endDate = `${dateFormat.year}-${dateFormat.month}-${dateFormat.yesterDate}`;
    const startDate = `${dateFormat.year}-${dateFormat.month}-01`;
    // const currentMonth = dateFormat.runningMonth;
    setEndDate(endDate);
    setStartDate(startDate);
    // setBudgetMonth(currentMonth);
  }, []);

  useEffect(() => {
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    setMonth(`${year}-${month}`);
  }, []);

  const accountNames = async () => {
    try {
      //  setLoading(true);

      const result = await _GET(AMAZON_ACCOUNTS);
      const data = result.data.data;
      // console.log(data, "Amazon Data");
      const accounts = data.map((item) => ({
        label: item.label,
        value: item.value,
        account_id: item.label,
        platform_id: item.value,
      }));

      const account = accounts.map((item) => ({
        label: item.label,
        value: item.label,
      }));
      let accountsFilter = _.cloneDeep(account);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
         let firstAccount = savedAccounts[0];
         let filterAccount = account.find(acc => acc.value === firstAccount);
         if (filterAccount) {
            accountsFilter = [filterAccount]
            saveLocalStorageAccounts([accountsFilter[0]?.value])
         } else {
           saveLocalStorageAccounts([accountsFilter[0]?.value])
         }
      } else {
        saveLocalStorageAccounts([accountsFilter[0]?.value])
      }

      setBrandDataListing(account);
      setAccountName(accountsFilter[0]?.label);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAccountSelection = (event) => {
    setAccountName(event);
    saveLocalStorageAccounts(event);
  };

  useEffect(() => {
    accountNames();
  }, []);

  const dailyBudget = async () => {
    try {
      const data = {
        brand: accountName,

        segment: segment,
        start_date: startDate,
        end_date: endDate,
      };

      setLoading(true);

      const result = await _POST(AMAZON_DAILY_BUDGET_PACER, data);
      setLoading(false);
      setDailyData(result?.data?.data?.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dailyBudget();
  }, [accountName, segment, month]);

  const typeData = [
    {
      label: "SP",
      value: "SP",
    },
    {
      label: "SB",
      value: "SB",
    },
    {
      label: "SD",
      value: "SD",
    },
  ];
  return (
    <>
      <div className="flipkart__card pb-3    pl-4 mb-0">
        <div className="flex -mb-3 mt-4">
          <div>
            <input
              className="border mr-4 rounded h-8 amsRing px-2"
              type="month"
              id="month"
              value={month}
              onChange={handleMonthChange}
            />
          </div>

          <div>
            {/* <select
              className="h-8 w-60  my-8 mr-4 border amsRing "
              value={accountName}
              onChange={(e) => handleAccountSelection(e.target.value)}
            >
              {brandDataListing?.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select> */}
            <CustomSelectNew
                label={"Select"}
                options={brandDataListing}
                value={accountName}
                onChange={handleAccountSelection}
                platform={"ams"}
                className="py-[6px] w-60"
              />
          </div>

          <div className="h-8 ml-4 w-60 ">
            {" "}
            <SelectDropDrown
              FilterHeading="Select Segment"
              selectAllDefault={true}
              // options={["MP", "SM"]}
              setSelectedVal={setSegment}
              selectedVal={segment}
              options={typeData}
              platform={"ams"}
            />
          </div>
        </div>
      </div>
        <BudgetPacerDaily
          loading={loading}
          bodyContent={dailyData}
          month={month}
          accountName={accountName}
          mediaType="Amazon"
        />
    </>
  );
};

export default DailyBudget;
