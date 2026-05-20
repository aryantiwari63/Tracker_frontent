import React, { useEffect, useState } from "react";
import _ from "lodash";
// import TrendSummaryTable from "./TrendSummaryTable";
// import OptionHeaders from "../../budgettrendheaderoptions/OptionHeaders";
import { _GET, _PATCH, _POST } from "../../../../../services/axios.method.js";
import {
  // BUDGET_SUMMARY,
  GET_ACCOUNTS,
  ADD_BUDGET,
  BUDGET_PACER_SUMMARY,
  BRAND_BUDGET,
  PERMISSIONS,
} from "../../../../../utils/constants.js";
import { getWallletBalance } from "../../../../../redux/action-creator/sideBarAction.js";
import { useDispatch } from "react-redux";
import Button from "../../../../common-components/button/Button.js";

import { setToastMessageHandler } from "../../../../../redux/action-creator/commonAction.js";
import Toast from "../../../../common-components/toast/index.js";
import { getLocalStorageAccounts, saveLocalStorageAccounts } from "../../../../../utils/helpers.js";
import SelectDropDrown from "../../../../common-components/SelectDropDown.js";
import BudgetSummary from "./BudgetSummary.js";
import AddBudgetDialog from "./AddBudgetDialog.js";
import WhenPermitted from "../../../../common-components/WhenPermitted.js";

const BudgetTrendSummary = () => {
  // holds budget pacer data
  const [summaryData, setSummaryData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadBudget, setLoadBudget] = useState(false);
  const [presentMonth, setPresentMonth] = useState(0);
  const [upcomingMonth, setUpcomingMonth] = useState();

  const [brandId, setBrandId] = useState("");
  const [brandOptionData, setBrandOptionData] = useState([]);
  const [selectedAccountVal, setSelectedAccountVal] = useState([]);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [currentMonth, setCurrentMonth] = useState(true);
  const year = new Date().getFullYear();

  const [month, setMonth] = useState();

  const [budgetMonth, setBudgetMonth] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [budgetData, setBudgetData] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [platformSelected, setPlatformSelected] = useState(true);
  const [segmentSelected, setSegmentSelected] = useState(false);
  // API to fetch list of accounts
  // eslint-disable-next-line no-console

  const accountNames = async () => {
    try {
      const result = await _GET(GET_ACCOUNTS);
      const data = result.data.data.result;
      const accounts = data.map((item) => ({
        value: item._id.account,
        brand_id: item._id.platform_id,
      }));
      const brandOptionDatas = accounts.map((item) => ({
        label: item.value,
        value: item.value,
      }));
      let filterAccounts = _.cloneDeep(brandOptionDatas);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
        let selectedAccounts = savedAccounts.map(value =>
          filterAccounts.find(account => account.value === value)
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

      // setAccountName(accounts[0]?.value);
      setBrandId(accounts[0]?.brand_id);
      // setBrandDataListing(accounts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    accountNames();
  }, []);

  const dispatch = useDispatch();
  React.useEffect(() => {
    // if (selectedAccountVal.length > 0)
    dispatch(getWallletBalance(selectedAccountVal));
  }, [selectedAccountVal]);
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
      const result = await _POST(BUDGET_PACER_SUMMARY, data);
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
    budgetPacerSummary();
  }, [selectedAccountVal, month, platformSelected, segmentSelected]);

  const verifyBudget = async () => {
    try {
      const data = {
        brand: selectedAccountVal[0],
        month: selectedMonth,
        year: year?.toString(),
        media_type: "Flipkart",
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

  const handleBudgetData = (data) => {
    const category_data = {};
    const budget = {};
    let totalBudget;

    totalBudget =
      (parseFloat(data?.budgetValueMk1) || 0) +
      (parseFloat(data?.budgetValueMk2) || 0) +
      (parseFloat(data?.budgetValueSm1) || 0) +
      (parseFloat(data?.budgetValueSm2) || 0);

    // platform, segment and category are selected
    if (data?.platform && data?.category && data?.segment) {
      category_data.mk_pla_category = data?.category1;
      category_data.mk_pca_category = data?.category2;
      category_data.sm_pla_category = data?.category3;
      category_data.sm_pca_category = data?.category4;
    }
    // category and segment are selected
    else if (data?.category && data?.segment) {
      category_data.pla_category = data?.category1;
      category_data.pca_category = data?.category2;
    }
    // platform and category are selected
    else if (data?.platform && data?.category) {
      category_data.mk_category = data?.category1;
      category_data.sm_category = data?.category3;
    }
    // only category is selected
    else if (data?.category && !data?.platform && !data?.segment) {
      category_data.category = data?.category1;
    }
    // platform and segment are selected
    if (data?.platform && data?.segment) {
      budget.mk_pla_budget = data?.budgetValueMk1;
      budget.mk_pca_budget = data?.budgetValueMk2;
      budget.sm_pla_budget = data?.budgetValueSm1;
      budget.sm_pca_budget = data?.budgetValueSm2;
    }
    // only platform is selected
    else if (data?.platform) {
      budget.mk_budget = data?.budgetValueMk1;
      budget.sm_budget = data?.budgetValueSm1;
    }
    // only segment is selected
    else if (data?.segment) {
      budget.pla_budget = data?.budgetValueMk1;
      budget.pca_budget = data?.budgetValueMk2;
    }

    data.brand = selectedAccountVal[0];
    (data.brand_id = brandId), (data.media_type = "Flipkart");
    // let totalBudget = parseFloat(data?.budget1) + parseFloat(data?.budget2);

    // const sums = [0, 0, 0, 0];

    // for (let i = 1; i <= 4; i++) {
    //   const category_num = data[`category${i}`];
    //   if (category_num) {
    //     for (let key in category_num) {
    //       if (Object.prototype.hasOwnProperty.call(category_num, key)) {
    //         sums[i - 1] += parseFloat(category_num[key]);
    //       }
    //     }
    //   }
    //   totalBudget += sums[i - 1];
    // }
    data.month = selectedMonth;
    data.total_budget = totalBudget;
    data.year = year;
    data.category_data = category_data;
    data.budget = budget;

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

  return (
    <>
      <Toast></Toast>
      <div className="flipkart__card pb-3 ">
        <div className="flex items-center mt-4 pl-2">
          <div className="w-[260px] mr-2">
          <input
            className="border rounded h-8 px-4 w-full outline-[#0081F7]"
            type="month"
            id="month"
            value={month}
            onChange={handleMonthChange}
          />
          </div>

          <div className="w-[320px] ">
            {brandOptionData.length > 0 && (
              <SelectDropDrown
                FilterHeading="Select Brand"
                selectAllDefault={true}
                setDefault={selectedAccountVal}
                setSelectedVal={setSelectedAccountVal}
                selectedVal={selectedAccountVal}
                options={brandOptionData}
                platform ="flipkart"
              />
            )}
          </div>

          <div className=" ml-8 flex items-center">
            <label className="mr-2 text-base">Platform</label>
            <input
              className="cursor-pointer"
              type="checkbox"
              value={platformSelected}
              checked={platformSelected === true ? true : false}
              onChange={(e) => setPlatformSelected(e.target.checked)}
            />
          </div>
          <div className=" ml-8 flex items-center" >
            <label className="mr-2 text-base">PLA/PCA</label>
            <input
              className="cursor-pointer"
              type="checkbox"
              value={segmentSelected}
              onChange={(e) => setSegmentSelected(e.target.checked)}
            />
          </div>
          <div className="ml-8 cursor-not-allowed flex items-center">
            <label className="mr-2 text-base cursor-not-allowed flex items-center">Category</label>
            <input
              type="checkbox"
              checked={false}
              className="cursor-not-allowed"
              // value={segmentSelected}
              // onChange={(e) => setSegmentSelected(e.target.checked)}
            />
          </div>
         <WhenPermitted platform="flipkart" permission={PERMISSIONS.ADD_BUDGET}>
          <div className=" ml-8  ">
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
            />
          </div>
          </WhenPermitted>
        </div>

        <BudgetSummary
          bodyContent={summaryData}
          loading={loading}
          currentMonth={currentMonth}
          platformSelected={platformSelected}
          segmentSelected={segmentSelected}
          month={month}
        />
      </div>
      {isDrawerOpen === true && (
        <AddBudgetDialog
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
          setBudgetData={handleBudgetData}
          editBudgetData={budgetData}
          loadBudget={loadBudget}
        />
      )}
    </>
  );
};
export default BudgetTrendSummary;
