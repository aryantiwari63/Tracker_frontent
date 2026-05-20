import { useState, useEffect } from "react";
import { _GET, _POST } from "../../../../services/axios.method";
import BudgetPacerDaily from "../../../common-components/BudgetPacer/budgetPacerDaily";
import SelectDropDrown from "../../../common-components/SelectDropDown";
import {
  BLINKIT_CATEGORY_LIST,
  BLINKIT_BUDGET_DAILY,
} from "../../../../utils/constants";
import CustomSelectNew from "../../../common-components/CustomSelectNew";
const BlinkitDailyBudget = () => {
  const [segment, setSegment] = useState("SP");
  const [categoryName, setCategoryName] = useState("");
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

  const categoryNames = async () => {
    try {
      //  setLoading(true);

      const result = await _GET(BLINKIT_CATEGORY_LIST);
      const data = result.data.data?.result;

      // console.log(data, "Amazon Data");
      const account = data.map((item) => ({
        label: item.category_name,
        value: item.category_name,
      }));
      setBrandDataListing(account);
      setCategoryName(account[0]?.label);
    } catch (error) {
      console.error(error);
    }
  };
  const handleAccountSelection = (event) => {
    setCategoryName(event);
  };
  useEffect(() => {
    categoryNames();
  }, []);

  const dailyBudget = async () => {
    try {
      const data = {
        category: categoryName,
        segment: segment,
        start_date: startDate,
        end_date: endDate,
      };

      setLoading(true);

      const result = await _POST(BLINKIT_BUDGET_DAILY, data);
      setLoading(false);
      setDailyData(result?.data?.data?.result);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if ((categoryName !== "" && segment.length > 0, month !== ""))
      dailyBudget();
  }, [categoryName, segment, month]);

  const typeData = [
    {
      label: "Reach",
      value: "Reach",
    },
    {
      label: "Performance",
      value: "Performance",
    },
  ];

  return (
    <>
      <div className="flipkart__card pb-3  w-full ">
        <div className="flex ml-3 mt-4 space-x-5">
          <div>
            <input
              className="border  rounded h-8 px-2 py-[17px] blinkitRing"
              type="month"
              id="month"
              value={month}
              onChange={handleMonthChange}
            />
          </div>

          <div className="w-60">
            {/* <select
              className="h-8 w-60 border ml-5 focus:ring-1 focus:border-blinkitPrimary outline-blinkitPrimary focus:ring-blinkitPrimary"
              value={categoryName}
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
              value={categoryName}
              onChange={handleAccountSelection}
              platform={"blinkit"}
              className="py-[7px] border-gray-200"
            />
          </div>

          <div className="h-8  w-60 ">
            {" "}
            <SelectDropDrown
              platform={"blinkit"}
              FilterHeading="Select Segment"
              selectAllDefault={true}
              // options={["MP", "SM"]}
              setSelectedVal={setSegment}
              selectedVal={segment}
              options={typeData}
            />
          </div>
        </div>
        <BudgetPacerDaily
          loading={loading}
          bodyContent={dailyData}
          month={month}
          accountName={categoryName}
          mediaType="Blinkit"
        />
      </div>
    </>
  );
};
export default BlinkitDailyBudget;
