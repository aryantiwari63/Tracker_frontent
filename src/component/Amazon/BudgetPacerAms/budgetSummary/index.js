import { useState, useEffect } from "react";
import SelectDropDrown from "../../../common-components/SelectDropDown";
import { _GET, _POST, _PATCH } from "../../../../services/axios.method";
import {
  AMAZON_ACCOUNTS,
  AMAZON_BUDGET_SUMMARY,
} from "../../../../utils/amazonConstants";
import _ from 'lodash';
import { saveLocalStorageAccounts, getLocalStorageAccounts } from "../../../../utils/helpers.js";
import { ADD_BUDGET, BRAND_BUDGET, PERMISSIONS } from "../../../../utils/constants";
import Button from "../../../common-components/button/Button";
import BudgetPacer from "../../../common-components/BudgetPacer";
import { useDispatch } from "react-redux";
import { setToastMessageHandler } from "../../../../redux/action-creator/commonAction";
import Toast from "../../../common-components/toast";
import BudgetPacerTable from "../../../common-components/BudgetPacer/budgetPacerTable.js";
import WhenPermitted from "../../../common-components/WhenPermitted.js";
const BudgetSummary = () => {
  const [brandOptionData, setBrandOptionData] = useState([]);
  const [selectedAccountVal, setSelectedAccountVal] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState();
  const [presentMonth, setPresentMonth] = useState(0);
  const [upcomingMonth, setUpcomingMonth] = useState();
  const [platformSelected, setPlatformSelected] = useState(true);
  const [segmentSelected, setSegmentSelected] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [budgetMonth, setBudgetMonth] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loadBudget, setLoadBudget] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [budgetData, setBudgetData] = useState();

  const [currentMonth, setCurrentMonth] = useState(true);
  const year = new Date().getFullYear();

  const [month, setMonth] = useState();
  const dispatch = useDispatch();

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
  const getMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;

    setPresentMonth(monthNames[currentMonth]);
    setUpcomingMonth(monthNames[nextMonth]);
  };

  useEffect(() => {
    const date = new Date();

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    setMonth(`${year}-${month}`);
  }, []);

  const getNoOfDaysInMNonth = (year, month) => {
    const noOfDays = new Date(year, month, 0).getDate();
    return noOfDays;
  };

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
    const dateFormat = dateFormatting();
    setMonth(event?.target.value);
    let numberOfDaysInMonth;
    const start_date = `${event.target.value}-01`;
    let chosenMonth;
    let end_date;
    const compareMonth = `${dateFormat.year}-${month}` === event.target?.value;

    if (compareMonth === true) {
      setCurrentMonth(true);
      end_date = `${event.target.value}-${dateFormat?.yesterDate}`;
      chosenMonth =
        monthNames[parseInt(event?.target?.value?.split("-")[1] - 1)];
    } else {
      numberOfDaysInMonth = getNoOfDaysInMNonth(
        dateFormat.year,
        event.target.value?.split("-")[1]
      );
      chosenMonth =
        monthNames[parseInt(event?.target?.value?.split("-")[1] - 1)];

      end_date = `${event.target.value}-31`;
      setCurrentMonth(numberOfDaysInMonth);
    }
    setBudgetMonth(chosenMonth);
    setStartDate(start_date);
    setEndDate(end_date);
  };

  useEffect(() => {
    const dateFormat = dateFormatting();
    const endDate = `${dateFormat.year}-${dateFormat.month}-${dateFormat.yesterDate}`;
    const startDate = `${dateFormat.year}-${dateFormat.month}-01`;
    const currentMonth = dateFormat.runningMonth;
    setEndDate(endDate);
    setStartDate(startDate);
    setBudgetMonth(currentMonth);
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

      const brandOptionDatas = accounts.map((item) => ({
        label: item.label,
        value: item.label,
      }));
      let filterAccounts = _.cloneDeep(brandOptionDatas);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
        let selectedAccounts = savedAccounts.map(value =>
          brandOptionDatas.find(account => account.value === value)
        ).filter(Boolean);
          if (_.size(_.compact(selectedAccounts))) {
            filterAccounts = selectedAccounts;
          } else {
            saveLocalStorageAccounts(_.map(brandOptionDatas, 'value'));
          }
      } else {
        saveLocalStorageAccounts(_.map(brandOptionDatas, 'value'));
      }
      setBrandOptionData(brandOptionDatas);
      setSelectedAccountVal(_.map(filterAccounts, 'value'));

      //  setLoading(false);
      //   setAccountsData(accounts);
      //   setPlatformId(accounts);
      //   setBrandName(accounts);
      // console.log(accounts, "accountsData");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    accountNames();
  }, []);

  const budgetPacerSummary = async () => {
    try {
      setLoadBudget(true);
      const data = {
        brands: selectedAccountVal,
        start_date: startDate,
        end_date: endDate,
        month: budgetMonth,
        year: year?.toString(),
        platform: platformSelected,
        segment: segmentSelected,
      };
      const result = await _POST(AMAZON_BUDGET_SUMMARY, data);
      setLoading(false);
      setSummaryData(result?.data?.data?.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const date = new Date();

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    setMonth(`${year}-${month}`);
  }, []);

  useEffect(() => {
    if (platformSelected || segmentSelected) {
      budgetPacerSummary();
    } else {
      setSummaryData([]);
    }
  }, [selectedAccountVal, month, platformSelected, segmentSelected]);

  const handleBudgetData = (data) => {
    const budget = {};

    // if only platform and segment is selected
    if (data?.platform && data?.segment) {
      (budget.sp_budget = data?.platformData),
        (budget.sb_budget = data?.segment2),
        (budget.sd_budget = data?.segment3);
    }
    // if only platform was selected
    else if (data?.platform) {
      budget.amazon = data?.platformData;
    } else if (data?.segment) {
      (budget.sp_budget = data?.platformData),
        (budget.sb_budget = data?.segment2),
        (budget.sd_budget = data?.segment3);
    }
    data.budget = budget;
    data.media_type = "Amazon";
    data.brand = selectedAccountVal[0];

    data.year = year;
    addBudget(data);
  };

  const updatedData = (previousData, newData) => {
    const updatedData = {};

    for (let key in previousData) {
      if (Object.prototype.hasOwnProperty.call(previousData, key)) {
        if (!Object.prototype.hasOwnProperty.call(newData, key)) {
          updatedData[key] = previousData[key];
        }
      }
    }
    for (let key in newData) {
      if (Object.prototype.hasOwnProperty.call(newData, key)) {
        if (
          !Object.prototype.hasOwnProperty.call(previousData, key) ||
          newData[key] !== previousData[key]
        ) {
          updatedData[key] = previousData[key] || null;
        }
      }
    }

    return updatedData;
  };

  const addBudget = async (data) => {
    try {
      let result;
      if (budgetData !== null && budgetData !== undefined) {
        const updatedData1 = updatedData(budgetData?.budget, data?.budget);
        data.previous_data = updatedData1;
        result = await _PATCH(`${ADD_BUDGET}/${budgetData?.id}`, data);
      } else {
        data.previous_data = null;
        result = await _POST(ADD_BUDGET, data);
      }
      if (result?.status === 200) {
        dispatch(setToastMessageHandler("Action performed successfully", true));
      } else {
        dispatch(setToastMessageHandler("Failed to perform action", false));
      }
      budgetPacerSummary();
    } catch (error) {
      console.error(error);
    }
  };

  const title = `Budget for ${selectedAccountVal[0]}`;

  const verifyBudget = async () => {
    try {
      const data = {
        brand: selectedAccountVal[0],
        month: selectedMonth,
        year: year?.toString(),
        media_type: "Amazon",

        // start_date: startDate,
        // end_date: endDate,
      };
      setLoadBudget(true);
      const result = await _POST(BRAND_BUDGET, data);
      setLoadBudget(false);
      setBudgetData(result?.data?.data?.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedMonth) verifyBudget();
  }, [selectedMonth]);

  return (
    <>
      <Toast></Toast>
      <div className="flipkart__card pb-3 pl-4 mb-0">
        <div className="flex items-center mb-4 mt-4">
          <input
            className="border mr-4 rounded h-8 amsRing px-2"
            type="month"
            id="month"
            value={month}
            onChange={handleMonthChange}
          />
        </div>

        <div className="w-[350px] ">
          {brandOptionData.length > 0 && (
            <SelectDropDrown
              FilterHeading="Select Brand"
              selectAllDefault={true}
              setDefault={selectedAccountVal}
              setSelectedVal={setSelectedAccountVal}
              selectedVal={selectedAccountVal}
              options={brandOptionData}
              platform="ams"
            />
          )}
        </div>

        <div className="flex items-center ml-6">
          <label className="mr-2 text-base">Platform</label>
          <input
            className="cursor-pointer accent-orange-600"
            type="checkbox"
            value={platformSelected}
            checked={platformSelected === true ? true : false}
            onChange={(e) => setPlatformSelected(e.target.checked)}
          />
        </div>
        <div className="flex items-center ml-8">
          <label className="mr-2 text-base">SP/SB/SD</label>
          <input
            className="cursor-pointer accent-orange-600"
            type="checkbox"
            value={segmentSelected}
            onChange={(e) => setSegmentSelected(e.target.checked)}
          />
        </div>
        <div className="flex-row items-center ml-8 cursor-not-allowed">
          <label className="mr-2 text-base">Category</label>
          <input
            type="checkbox"
            checked={false}
            disabled
            className="accent-orange-600"
            // value={segmentSelected}
            // onChange={(e) => setSegmentSelected(e.target.checked)}
          />
        </div>
        <WhenPermitted permission={PERMISSIONS.ADD_BUDGET} platform="amazon">
        <div className=" ml-8  ">
          <Button
            title="Add Budget"
            disable={selectedAccountVal?.length !== 1 && true}
            styles={
              selectedAccountVal?.length !== 1
                ? {
                    cursor: "no-drop",
                    width: "150px",
                    backgroundColor: "#EF880F",
                  }
                : { width: "150px", backgroundColor: "#EF880F" }
            }
            click={() => {
              setIsDrawerOpen(!isDrawerOpen);
              getMonth();
            }}
            hoverText={
              selectedAccountVal?.length !== 1 && "Select only 1 brand"
            }
          />
        </div>
        </WhenPermitted>
      </div>
        <BudgetPacerTable
          mediaType="Amazon"
          bodyContent={summaryData}
          loading={loading}
          currentMonth={currentMonth}
          platformSelected={platformSelected}
          segmentSelected={segmentSelected}
          month={month}
        />

      {isDrawerOpen === true && (
        <BudgetPacer
          title={title}
          // platformSelected="flipkart"
          smallsize={true}
          // applyAction={handleApplyAction}
          setTempView={() => {}}
          disableButton={selectedMonth ? false : true}
          brandName={selectedAccountVal[0]}
          open={isDrawerOpen}
          isOpen={setIsDrawerOpen}
          presentMonth={presentMonth}
          upcomingMonth={upcomingMonth}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          mediaType="Amazon"
          setBudgetData={handleBudgetData}
          editBudgetData={budgetData}
          //   loadBudget={loadBudget}
        />
      )}
    </>
  );
};

export default BudgetSummary;
