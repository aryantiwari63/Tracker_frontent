import { useState, useEffect } from "react";
import _ from 'lodash';
import { getLocalStorageAccounts, saveLocalStorageAccounts } from "../../../../utils/helpers";
import SelectDropDrown from "../../../common-components/SelectDropDown";
import { _GET, _PATCH, _POST } from "../../../../services/axios.method";
import { ADD_BUDGET, BRAND_BUDGET, PERMISSIONS } from "../../../../utils/constants";
import { useDispatch } from "react-redux";
import {
  INSTAMART_BRANDS,
  INSTAMART_BUDGET_SUMMARY,
} from "../../../../utils/constants";
import Toast from "../../../common-components/toast";
import { setToastMessageHandler } from "../../../../redux/action-creator/commonAction";
import Button from "../../../common-components/button/Button";
import BudgetPacer from "../../../common-components/BudgetPacer";
import BudgetPacerTable from "../../../common-components/BudgetPacer/budgetPacerTable";
import { instamartWalletBal } from "../../../../redux/action-creator/instamart/instamartSideBarAction";
import WhenPermitted from "../../../common-components/WhenPermitted";
const BudgetSummaryInstamart = () => {
  const [brandOptionData, setBrandOptionData] = useState([]);
  const [selectedAccountVal, setSelectedAccountVal] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState();
  const [presentMonth, setPresentMonth] = useState(0);
  const [upcomingMonth, setUpcomingMonth] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [budgetMonth, setBudgetMonth] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loadBudget, setLoadBudget] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [budgetData, setBudgetData] = useState();

  const [currentMonth, setCurrentMonth] = useState(true);

  const [month, setMonth] = useState();
  const dispatch = useDispatch();

  const year = new Date().getFullYear();
  const title = `Budget for ${selectedAccountVal[0]}`;

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

  const accountNames = async () => {
    try {
      // setLoading(true);

      const result = await _GET(INSTAMART_BRANDS);
      const data = result.data.data;

      const accounts = data.map((item) => ({
        label: item.brand,
        value: item.brand,
      }));

      // setLoading(false);
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    accountNames();
  }, []);

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

  const getNoOfDaysInMNonth = (year, month) => {
    const noOfDays = new Date(year, month, 0).getDate();
    return noOfDays;
  };

  useEffect(() => {
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    setMonth(`${year}-${month}`);
  }, []);

  const verifyBudget = async () => {
    try {
      const data = {
        brand: selectedAccountVal[0],
        month: selectedMonth,
        year: year?.toString(),
        media_type: "Instamart",

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

  const handleBudgetData = (data) => {
    const budget = {};
    // if only platform and segment is selected
    budget.instamart = data?.platformData;

    data.budget = budget;
    data.media_type = "Instamart";
    data.brand = selectedAccountVal[0];

    data.year = year;
    addBudget(data);
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

  const budgetPacerSummary = async () => {
    try {
      setLoadBudget(true);
      const data = {
        brands: selectedAccountVal,
        start_date: startDate,
        end_date: endDate,
        month: budgetMonth,
        year: year?.toString(),
      };

      const result = await _POST(INSTAMART_BUDGET_SUMMARY, data);
      setLoading(false);

      setSummaryData(result?.data?.data?.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      month !== "" &&
      selectedAccountVal !== undefined &&
      selectedAccountVal.length > 0
    ) {
      budgetPacerSummary();
    } else {
      setSummaryData([]);
    }
  }, [selectedAccountVal, month]);

  useEffect(() => {
    dispatch(instamartWalletBal(selectedAccountVal));
  }, [selectedAccountVal]);

  useEffect(() => {
    const dateFormat = dateFormatting();
    const endDate = `${dateFormat.year}-${dateFormat.month}-${dateFormat.yesterDate}`;
    const startDate = `${dateFormat.year}-${dateFormat.month}-01`;
    const currentMonth = dateFormat.runningMonth;
    setEndDate(endDate);
    setStartDate(startDate);
    setBudgetMonth(currentMonth);
  }, []);

  return (
    <>
      {" "}
      <Toast></Toast>
      <div className="bg-white pb-3">
        <div className="flex items-center pt-4  pl-4">
          
          <div className="w-[260px] mr-2">
            <input
              className="border rounded h-8 px-4 w-full outline-[#851853]"
              type="month"
              id="month"
              value={month}
              onChange={handleMonthChange}
            />
          </div>

          <div className="w-[320px] mr-2">
            {brandOptionData.length > 0 && (
              <SelectDropDrown
                FilterHeading="Select Brand"
                selectAllDefault={true}
                setDefault={selectedAccountVal}
                setSelectedVal={setSelectedAccountVal}
                selectedVal={selectedAccountVal}
                options={brandOptionData}
                platform="instamart"
              />
            )}
          </div>
        <WhenPermitted permission={PERMISSIONS.ADD_BUDGET} platform="instamart">
          <div>
            <Button
              title="Add Budget"
              disable={selectedAccountVal?.length !== 1 && true}
              styles={
                selectedAccountVal?.length !== 1
                  ? { cursor: "no-drop", width: "150px" }
                  : { width: "150px" }
              }
              click={() => {
                setIsDrawerOpen(!isDrawerOpen);
                getMonth();
              }}
              hoverText={
                selectedAccountVal?.length !== 1 && "Select only 1 brand"
              }
              instamart={true}
            />
          </div>
          </WhenPermitted>
        </div>
        <BudgetPacerTable
          mediaType="Instamart"
          bodyContent={summaryData}
          loading={loading}
          currentMonth={currentMonth}
          month={month}
        />
      </div>
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
          mediaType="Instamart"
          setBudgetData={handleBudgetData}
          editBudgetData={budgetData}
          // loadBudget={loadBudget}
        />
      )}
    </>
  );
};
export default BudgetSummaryInstamart;
