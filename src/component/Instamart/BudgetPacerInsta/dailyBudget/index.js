import { useState, useEffect } from "react";
import { _GET, _POST } from "../../../../services/axios.method";
import _ from "lodash";
import BudgetPacerDaily from "../../../common-components/BudgetPacer/budgetPacerDaily";
import {
  INSTAMART_BRANDS,
  INSTAMART_DAILY_BUDGET,
} from "../../../../utils/constants";
import { getLocalStorageAccounts, saveLocalStorageAccounts } from "../../../../utils/helpers";
import { instamartWalletBal } from "../../../../redux/action-creator/instamart/instamartSideBarAction";
import { useDispatch } from "react-redux";
import CustomSelectNew from "../../../common-components/CustomSelectNew";

const DailyBudgetInstamart = () => {
  const [accountName, setAccountName] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [brandDataListing, setBrandDataListing] = useState([]);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [dailyData, setDailyData] = useState([]);

  const date = new Date();
  const dispatch = useDispatch();

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

      const result = await _GET(INSTAMART_BRANDS);
      const data = result.data.data;
      // console.log(data, "Amazon Data");
      const account = data.map((item) => ({
        label: item.brand,
        value: item.brand,
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
    saveLocalStorageAccounts([event]);
  };

  useEffect(() => {
    accountNames();
  }, []);

  const dailyBudget = async () => {
    try {
      const data = {
        brand: accountName,

        start_date: startDate,
        end_date: endDate,
      };

      setLoading(true);

      const result = await _POST(INSTAMART_DAILY_BUDGET, data);
      setLoading(false);
      setDailyData(result?.data?.data?.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (accountName !== "" && month !== "") dailyBudget();
  }, [accountName, month]);

  useEffect(() => {
    if (accountName !== "") dispatch(instamartWalletBal(accountName));
  }, [accountName]);

  return (
    <>
      <div className="bg-white pb-3  w-full ">
      <div className="flex items-center pt-4 px-4">  
          <div className="w-[260px] mr-2">
            <input
              className="border rounded h-8 px-4 w-full outline-[#851853]"
              type="month"
              id="month"
              value={month}
              onChange={handleMonthChange}
            />
          </div>

          <div className="w-60">
            {/* <select
              className="h-8 w-[325px] border"
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
              platform={"instamart"}
              className="py-[7px] border-gray-200"
            />
          </div>
        </div>

        <BudgetPacerDaily
          loading={loading}
          bodyContent={dailyData}
          month={month}
          accountName={accountName}
          mediaType="Instamart"
        />
      </div>
    </>
  );
};
export default DailyBudgetInstamart;
