import { useState, useEffect } from "react";
import SelectDropDrown from "../../../common-components/SelectDropDown.js";
import { _GET, _POST, _PATCH } from "../../../../services/axios.method.js";
import {
  ADD_BUDGET,
  BRAND_BUDGET,
  BLINKIT_CATEGORY_LIST,
  BLINKIT_BUDGET_PACER_SUMMARY,
  PERMISSIONS,
} from "../../../../utils/constants.js";
import Button from "../../../common-components/button/Button.js";
import BudgetPacer from "../../../common-components/BudgetPacer/index.js";
import { useDispatch } from "react-redux";
import { setToastMessageHandler } from "../../../../redux/action-creator/commonAction.js";
import Toast from "../../../common-components/toast/index.js";
import BudgetPacerTable from "../../../common-components/BudgetPacer/budgetPacerTable.js";
import WhenPermitted from "../../../common-components/WhenPermitted.js";

const BlinkitBudgetSummary = () => {
  const [brandOptionData, setBrandOptionData] = useState([]);
  const [selectedAccountVal, setSelectedAccountVal] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState();
  const [presentMonth, setPresentMonth] = useState(0);
  const [upcomingMonth, setUpcomingMonth] = useState();
  // eslint-disable-next-line no-unused-vars
  const [platformSelected, setPlatformSelected] = useState(true);
  const [categorySelected, setCategorySelected] = useState(false);
  const [segmentSelected, setSegmentSelected] = useState(true);
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

  //   useEffect(() => {
  //     const date = new Date();

  //     const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //     setMonth(`${year}-${month}`);
  //   }, []);

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
    categoryNames();
    const dateFormat = dateFormatting();
    const endDate = `${dateFormat.year}-${dateFormat.month}-${dateFormat.yesterDate}`;
    const startDate = `${dateFormat.year}-${dateFormat.month}-01`;
    const currentMonth = dateFormat.runningMonth;
    setEndDate(endDate);
    setStartDate(startDate);
    setBudgetMonth(currentMonth);

    const date = new Date();

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    setMonth(`${year}-${month}`);
  }, []);

  const categoryNames = async () => {
    try {
      // setLoading(true);

      const result = await _GET(BLINKIT_CATEGORY_LIST);
      const data = result.data.data?.result;
      const category = data.map((item) => ({
        label: item.category_name,
        value: item.category_name,
      }));

      // setLoading(false);

      setBrandOptionData(category);
      setSelectedAccountVal(category.map((item) => item.label));
    } catch (error) {
      console.error(error);
    }
  };

  //   useEffect(() => {
  //     categoryNames();
  //   }, []);

  const handleBudgetData = (data) => {
    const budget = {};
    //    if segment and category is selected
    if (data?.segment && data?.category) {
      budget.reach_category_budget = data.reachCategory;
      budget.performance_category_budget = data.performanceCategory;
    }
    // if only segment is selected
    else if (data?.segment) {
      budget.reach_budget = data?.platformData;
      budget.performance_budget = data?.segment2;
    }
    // if only category is selected
    else if (data?.category) {
      budget.category = data?.reachCategory;
    }
    data.budget = budget;
    data.media_type = "Blinkit";
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

  const verifyBudget = async () => {
    try {
      const data = {
        month: selectedMonth,
        year: year?.toString(),
        media_type: "Blinkit",

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

  const budgetPacerSummary = async () => {
    try {
      setLoadBudget(true);
      const data = {
        category_name: selectedAccountVal,
        start_date: startDate,
        end_date: endDate,
        month: budgetMonth,
        year: year?.toString(),
        platform: platformSelected,
        segment: segmentSelected,
        category: categorySelected,
      };
      const result = await _POST(BLINKIT_BUDGET_PACER_SUMMARY, data);
      setLoading(false);
      setSummaryData(result?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (
      selectedAccountVal.length > 0 &&
      selectedAccountVal !== undefined &&
      month !== "" &&
      endDate !== "" &&
      startDate != "" &&
      (categorySelected || segmentSelected)
    ) {
     
      budgetPacerSummary();
    } else {
      setSummaryData([]);
    }
  }, [
    selectedAccountVal,
    month,
    segmentSelected,
    categorySelected,
    endDate,
    startDate,
  ]);

  return (
    <>
      <Toast></Toast>
      <div className="flipkart__card pb-3 ">
        {" "}
        <div className="flex items-center mb-4 mt-4 ml-3">
          <input
            className="border rounded h-8 px-2 blinkitRing"
            type="month"
            id="month"
            value={month}
            onChange={handleMonthChange}
          />
        </div>
        <div className="w-[350px] ml-4">
          {brandOptionData.length > 0 && (
            <SelectDropDrown
              FilterHeading="Select Brand"
              selectAllDefault={true}
              setDefault={selectedAccountVal}
              setSelectedVal={setSelectedAccountVal}
              selectedVal={selectedAccountVal}
              options={brandOptionData}
              platform="blinkit"
            />
          )}
        </div>
        <div className=" ml-5 cursor-not-allowed">
          <label className="mr-2 text-base cursor-not-allowed">Platform</label>
          <input
            className=" cursor-not-allowed"
            type="checkbox"
            checked={false}
          />
        </div>
        <div className=" ml-5">
          <label className="mr-2 text-base">Reach/Performance</label>
          <input
            className="cursor-pointer accent-green-600"
            type="checkbox"
            value={segmentSelected}
            checked={segmentSelected === true ? true : false}
            onChange={(e) => setSegmentSelected(e.target.checked)}
          />
        </div>
        <div className="ml-5">
          <label className="mr-2 text-base">Category</label>
          <input
            type="checkbox"
            className="accent-green-600"
            checked={categorySelected}
            value={categorySelected}
            onChange={(e) => setCategorySelected(e.target.checked)}
          />
        </div>
        <WhenPermitted platform="blinkit" permission={PERMISSIONS.ADD_BUDGET}>
        <div className=" ml-5  ">
          <Button
            blinkit={true}
            title="Add Budget"
            styles={{ width: "150px" }}
            click={() => {
              setIsDrawerOpen(!isDrawerOpen);
              getMonth();
            }}
          />
        </div>
        </WhenPermitted>
        <BudgetPacerTable
          mediaType="Blinkit"
          bodyContent={summaryData}
          loading={loading}
          currentMonth={currentMonth}
          platformSelected={platformSelected}
          segmentSelected={segmentSelected}
          categorySelected={categorySelected}
          month={month}
        />
      </div>
      {isDrawerOpen === true && (
        <BudgetPacer
          title="Add budget for categories"
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
          mediaType="Blinkit"
          categoryName={brandOptionData}
          setBudgetData={handleBudgetData}
          editBudgetData={budgetData}
          // loadBudget={loadBudget}
        />
      )}
    </>
  );
};
export default BlinkitBudgetSummary;
