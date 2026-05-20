/* eslint-disable */
import React, { useEffect, useState } from "react";
import Popup from "../../../common-components/Popups/Popup";
// import CampaignTypeCard from "./CampaignTypeCard";

import CardLayoutCreateCampaign from "../../../common-components/createcampaigncardlayout/CardLayoutCreateCampaign";
import AmsCreateNewCampaign from "./createnewcamp";
import { _POST } from "../../../../services/axios.method";
import { AMAZON_CREATE_PORTFOLIO } from "../../../../utils/constants";
import { formatDate } from "../../../../utils/helpers";
import { setToastMessageHandler } from "../../../../redux/action-creator/commonAction";
import { useDispatch } from "react-redux";
// import CreateNewCampaign from "./CreateNewCampaign";
// import Budgeting from "./Budgeting";
// import ReviewNewCampaign from "./ReviewNewCampaign";

const AmsCreatePortfolioPopup = ({ setOpenState, OpenState }) => {
  //   const [showPopup, setShowPopup] = useState(false);
  const [portfolioName, setPortfolioName] = useState("");
  const [budget, setBudget] = useState("");
  const [ends, setEnds] = useState("");
  const [budgetStartDate, setBudgetStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [budgetEndDate, setBudgetEndDate] = useState("");
  const [budgetCap, setBudgetCap] = useState("noBudgetCap");
  const [error, setError] = useState(false);
  const [errMessage, setErrorMessage] = useState("");
  const budgetCapArray = [
    { label: "No Budget Cap", value: "noBudgetCap" },
    { label: "Date Range", value: "dateRange" },
    { label: "Recurring Monthly", value: "monthlyRecurring" },
  ];

  const dispatch = useDispatch();

  const formattedStartDate = formatDate(budgetStartDate);
  const formattedEndDate = formatDate(budgetEndDate);

  const budgetText =
    budget && budgetStartDate && budgetEndDate
      ? `Budget cap : ₹ ${budget} total spend, from ${formattedStartDate} to ${formattedEndDate}`
      : "Budget cap : -";

  const handleBudgetCapChange = () => {
    setBudget("");
    setEnds("");
    setBudgetStartDate("");
    setBudgetEndDate("");
    setError(false);
  };

  useEffect(() => {
    handleBudgetCapChange(); // Call the reset function on initial render
    // Optionally add a dependency array to trigger reset only on budgetCap change
  }, [budgetCap]);

  const validate = () => {
    if (!portfolioName) {
      setError(true);
      setErrorMessage("Please add portfolio name!");
      return false;
    }
    if (!budget && budgetCap !== "noBudgetCap") {
      setError(true);
      setErrorMessage("Please add budget!");
      return false;
    }
    if (budgetCap === "dateRange" && !budgetStartDate) {
      setError(true);
      setErrorMessage("Please select budget start date!");
      return false;
    }
    if (ends === "on" && (!budgetStartDate || !budgetEndDate)) {
      setError(true);
      setErrorMessage("Please select budget start/end date!");
      return false;
    }
    setError(false);
    return true;
  };

  const createPortfolio = async () => {
    try {
      if (!validate()) {
        return;
      }
      let post = {
        portfolio_name: portfolioName,
        budget_cap: budgetCap,
        profile_id: localStorage.getItem("amazon_profile"),
      };
      if (budgetStartDate) {
        post.startDate = budgetStartDate.replaceAll("-", "");
      }
      if (budgetEndDate) {
        post.endDate = budgetEndDate.replaceAll("-", "");
      }
      if (budget) {
        post.budget = budget;
      }
      const response = await _POST(AMAZON_CREATE_PORTFOLIO, post);
      if (
        response.data.data[0].code &&
        response.data.data[0].code == "SUCCESS"
      ) {
        dispatch(
          setToastMessageHandler("Portfolio created successfully", true)
        );
        setOpenState(false);
      } else {
        throw new Error(`Error : ${response.data.data[0].description}!`);
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      console.error(error);
    }

    // console.log(post,"portfolioooo")
  };

  return (
    <>
      <Popup
        title="Create Portfolio"
        setShowPopup={setOpenState}
        setTempView={() => {}}
        platform={"ams"}
        smallsize
        applyAction={createPortfolio}
        buttonText="Create"
      >
        <div className="px-5 py-1">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col col-span-2 gap-1">
              <label
                for="text-field"
                className="font-inter gap-2 flex font-semibold text-base leading-6"
              >
                Portfolio Name
                <img src="/assets/images/imp.svg" />
              </label>
              <input
                type="text"
                name="portfolio"
                className="border h-[32px] px-2"
                placeholder="Enter Portfolio Name"
                value={portfolioName}
                onChange={(e) => {
                  setPortfolioName(e.target.value);
                }}
              />
            </div>
            {/* select budget */}
            <div className="flex flex-col col-span-2 gap-1">
              <label
                for="text-field"
                className="font-inter flex gap-2 font-semibold text-base leading-6"
              >
                Budget Cap
                <img src="/assets/images/imp.svg" />
              </label>
              <select
                className="border w-[130px] h-[32px] bg-[#FAFAFA]"
                onChange={(e) => setBudgetCap(e.target.value)}
                value={budgetCap}
              >
                {budgetCapArray.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            {budgetCap === "dateRange" && (
              <>
                {/* monthly budget cap */}
                <div className="flex flex-col col-span-2 gap-1">
                  <label
                    for="text-field"
                    className="font-inter flex gap-2 font-semibold text-base leading-6"
                  >
                    Date Range budget cap
                    <img src="/assets/images/imp.svg" />
                  </label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="₹ Enter Amount"
                    className="border h-[32px] w-[130px] px-2"
                    value={budget}
                    onChange={(e) => {
                      setBudget(e.target.value);
                    }}
                  />
                </div>
              </>
            )}
            {budgetCap === "monthlyRecurring" && (
              <>
                {/* monthly budget cap */}
                <div className="flex flex-col col-span-2 gap-1">
                  <label
                    for="text-field"
                    className="font-inter flex gap-2 font-semibold text-base leading-6"
                  >
                    Monthly budget cap
                    <img src="/assets/images/imp.svg" />
                  </label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="₹ Enter Amount"
                    className="border h-[32px] w-[130px] px-2"
                    value={budget}
                    onChange={(e) => {
                      setBudget(e.target.value);
                    }}
                  />
                  <p className="text-gray-400">
                    Restarts on the 1st of each month.
                  </p>
                </div>
                {/* ends */}
                <div className="flex flex-col col-span-2 gap-1">
                  <label
                    for="ends"
                    className="font-inter font-semibold text-base leading-6"
                  >
                    Ends:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="ends_never"
                      name="ends"
                      value="never"
                      onChange={(e) => setEnds(e.target.value)}
                    />
                    <label
                      for="ends_never"
                      className="font-inter font-medium text-base leading-6"
                    >
                      Never
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="ends_on"
                      name="ends"
                      value="on"
                      onChange={(e) => setEnds(e.target.value)}
                    />
                    <label
                      for="ends_on"
                      className="font-inter font-medium text-base leading-6"
                    >
                      On
                    </label>
                  </div>
                </div>
              </>
            )}
            {(budgetCap == "dateRange" ||
              (budgetCap == "monthlyRecurring" && ends == "on")) && (
              <>
                {/* budget start  */}
                <div className="flex text-base gap-2">
                  <div className="flex flex-col w-1/2 col-span-2 gap-1">
                    <label
                      for="text-field"
                      className="font-inter font-semibold text-base leading-6"
                    >
                      Budget start
                    </label>
                    <input
                      type="date"
                      name="name"
                      min={new Date().toISOString().split("T")[0]}
                      value={budgetStartDate}
                      className="border h-[32px] px-2"
                      onChange={(e) => setBudgetStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-1/2 col-span-2 gap-1">
                    <label
                      for="text-field"
                      className="font-inter font-semibold text-base leading-6"
                    >
                      Budget end
                    </label>
                    <input
                      type="date"
                      name="name"
                      min={budgetStartDate}
                      value={budgetEndDate}
                      placeholder="value"
                      className="border h-[32px] px-2"
                      onChange={(e) => {
                        setBudgetEndDate(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            {budgetCap === "monthlyRecurring" ? (
              <div className="border p-1 bg-[#FAFAFA]">
                Budget cap: Each month
              </div>
            ) : budgetCap === "dateRange" ? (
              <div className="border p-1 bg-[#FAFAFA]">{budgetText}</div>
            ) : null}
            {error && <div className="text-[#EF880F]">{errMessage}</div>}
          </div>
        </div>
      </Popup>
    </>
  );
};
export default AmsCreatePortfolioPopup;
