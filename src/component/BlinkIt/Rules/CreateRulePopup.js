/* eslint-disable no-useless-escape */
/* eslint-disable no-dupe-else-if */
import React, { useEffect, useState } from "react";
import Popup from "../../common-components/Popups/Popup";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { GoPlus } from "react-icons/go";
import {
  campaignAction,
  campaignActionWithBudget,
  adGroupActionWithBudget,
  Keywords,
  adGroupAction,Category
} from "./data/actionData";

import AddCondition from "./AddCondition";
import TimeRange from "../../common-components/timerange/TimeRange";
import CreateRuleSchedule from "./CreateRuleSchedule";
import "./styles.css";
import { GET_ALL_TAGS, RULES } from "../../../utils/constants";
import { _GET, _POST } from "../../../services/axios.method";
import {
  setLoading,
  setToastMessageHandler,
} from "../../../redux/action-creator/commonAction";
import ActionType from "../../../redux/types";
import { MultiSelect } from "react-multi-select-component";
import { AiOutlineMinusCircle } from "react-icons/ai";
import CustomSelectNew from "../../common-components/CustomSelectNew";

const ruleToArr=[
  {
    label:"Campaign",
    value:"Campaign"
  },
  {
    label:"Keyword",
    value:"Keyword"
  },
  {
    label:"Category",
    value:"Category"
  }
]

const accountArr=[
  {
    label:"Performance",
    value:"Performance"
  },
  {
    label:"Reach",
    value:"Reach"
  },
  {
    label:"Performance+Reach",
    value:"Performance,Reach"
  }
]

const CreateRulePopup = ({ setOpenState, getRulesApi = _.noop }) => {
  const [actionData, setActionData] = useState([
    {
      label: "",
      value: "",
    },
  ]);

  const [ruleName, setRuleName] = useState("");
  const [campaignType, setCampaignType] = useState(["Performance"]);
  const [entity, setEntity] = useState("Campaign");
  const [scheduleData, setscheduleData] = useState("");
  const [dateType, setDateType] = useState("");
  const [timeRange, setTimeRange] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [time, setTime] = useState([{ index: 0, time: "" }]);
  // eslint-disable-next-line no-unused-vars
  const [date, setDate] = useState("");
  const [weeklyTiming, setWeeklyTiming] = useState([]);
  const [firstCondtion, setFirstCondition] = useState([]);
  const [condition, setCondition] = useState([]);
  const [ruleNameError, setRuleNameError] = useState(false);
  const [actionRuleError, setActionRuleError] = useState(false);
  const { ruleData } = useSelector((state) => state?.RuleReducer);
  const [noConditions, setNoConditions] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetPercentage, setBudgetPercentage] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [dateTimings, setDateTimings] = useState([]);
  const [budgetType, setBudgetType] = useState("amount");
  const [selectedAction, setSelectedAction] = useState("");
  const [showTags, setShowTags] = useState(true);
  const [timeError, setTimeError] = useState(false);
  const [timeSameError, setTimeSameError] = useState(false);
  const [emailCounter, setEmailCounter] = useState(1);
  const [emailArray, setEmailArray] = useState([]);
  const [validEmail, setValidEmail] = useState([]);
  const [emailError, setEmailError] = useState(false);
  useEffect(() => {
    setSelectedAction(actionData[0].value);
  }, [actionData]);

  const dispatch = useDispatch();

  const createRuleAPI = async (data) => {
    try {
      setLoading(true);
      let updatedRules = [];
      await _POST(RULES, data);

      setLoading(false);

      updatedRules = [...ruleData, data];

      dispatch({
        type: ActionType.RULE,
        payload: updatedRules,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const validateEmail = (e, index) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if ( re.test(e.target.value) ) {
      let newValid = validEmail
      validEmail[index] = true; 
      setValidEmail([...newValid])
    }
    else {
      let newValid = validEmail
      validEmail[index] = false; 
      setValidEmail([...newValid])
     
    }
  }

  useEffect(() => {
    switch (entity) {
      case "Campaign":
        if (campaignType.includes("Performance") && campaignType.includes("Reach")) {
          setActionData(campaignAction);
        } else setActionData(campaignActionWithBudget);

        break;
      case "AdGroup":
        if (campaignType == ["PLA,PCA"]) setActionData(adGroupAction);
        else setActionData(adGroupActionWithBudget);
        break;
      case "Keyword":
        setActionData(Keywords);
        break;
      case "Category":
        setActionData(Category);
        break;
      default:
        break;
    }
  }, [entity, campaignType, selectedAction]);


  const handleEmailChange = (e, c) => {
    let newEmailArray = emailArray;
    newEmailArray[c] = e.target.value
   setEmailArray([...newEmailArray])
  }

  const handleCreateRule = async() => {
    let name = ruleName.trim();
    let emails =  emailArray.filter(function (el) {
      return el != null || el != "" ||  el != undefined;
    });
    let   tempEmail = validEmail.slice(0, emailCounter);
    let emailChecker = tempEmail.every(v => v === true);
    try {
      if (!name) {
        setRuleNameError(true);

        setOpenState(true);
        return;
      } else if (entity == "") {
        setActionRuleError(true);
        setOpenState(true);
        return;
      } else if (!name) {
        setRuleNameError(true);

        setOpenState(true);
        return;
      }  else if(emailArray.length < 1 || !emailChecker) {
        setEmailError(true);

        setOpenState(true);
      } 
       else if (
        (dateType === "Weekly" &&
          scheduleData === "Custom" &&
          (weeklyTiming[0]?.day === undefined ||
            !weeklyTiming[0]?.timer[0]?.time)) ||
        (dateType === "Datewise" &&
          scheduleData === "Custom" &&
          (dateTimings[0]?.day === undefined ||
            !dateTimings[0]?.timer[0]?.time))
      ) {
        setTimeError(true);
        setOpenState(true);
        return;
      } else {
        if (dateType === "Weekly" && weeklyTiming[0]?.timer[0]?.time) {
          for (let i = 0; i < weeklyTiming[0].timer.length - 1; i++) {
            if (
              weeklyTiming[0].timer[i].time ==
              weeklyTiming[0].timer[i + 1].time ||
              weeklyTiming[0].timer[i].time ==
              weeklyTiming[0].timer[i + 2]?.time ||
              weeklyTiming[0].timer[i].time ==
              weeklyTiming[0].timer[i + 3]?.time
            ) {
              setTimeSameError(true);
              setOpenState(true);
              return;
            }
          }
        }
        if (dateType === "Datewise" && dateTimings[0]?.timer[0]?.time) {
          for (let i = 0; i < dateTimings[0].timer.length - 1; i++) {
            if (
              dateTimings[0].timer[i].time ==
              dateTimings[0].timer[i + 1].time ||
              dateTimings[0].timer[i].time ==
              dateTimings[0].timer[i + 2]?.time ||
              dateTimings[0].timer[i].time == dateTimings[0].timer[i + 3]?.time
            ) {
              setTimeSameError(true);
              setOpenState(true);
              return;
            }
          }
        }
      
 
        let data = {
          rule_name: name,
          entity: entity,
          campaign_type: campaignType,
          action: selectedAction,
          schedule: scheduleData,
          time_range: timeRange,
          emails: emails,
          is_condition_present:
            firstCondtion.length === 0 ? false : !noConditions,
          // custom_schedule: {
          //   custom_type: dateType,
          //   schedule_time: (dateType === "Weekly"
          //     ? weeklyTiming
          //     : dateTimings
          //   ).map((item) => ({
          //     [dateType === "Weekly" ? "custom_day" : "custom_date"]: item.day,
          //     start_time1: item.timer.length > 0 ? item.timer[0].time : "00:00",
          //     start_time2: item.timer.length > 1 ? item.timer[1].time : "00:00",
          //     start_time3: item.timer.length > 2 ? item.timer[2].time : "00:00",
          //     start_time4: item.timer.length > 3 ? item.timer[3].time : "00:00",
          //   })),
          // },
          ...(dateType && {
            custom_schedule: {
              custom_type: dateType,
              schedule_time: (dateType === "Weekly"
                ? weeklyTiming
                : dateTimings
              ).map((item) => ({
                [dateType === "Weekly" ? "custom_day" : "custom_date"]:
                  item.day,
                start_time1:
                  item.timer.length > 0 ? item.timer[0].time : "00:00",
                start_time2:
                  item.timer.length > 1 ? item.timer[1].time : "00:00",
                start_time3:
                  item.timer.length > 2 ? item.timer[2].time : "00:00",
                start_time4:
                  item.timer.length > 3 ? item.timer[3].time : "00:00",
              })),
            },
          }),
          ...(firstCondtion.length > 0 && !noConditions && {
            rule_condition: [firstCondtion, ...condition],
          }),
          budget_amount: budgetAmount,
          budget_percent: budgetPercentage,
          tags: selectedTags,
          media_type: "blinkit",
        };
        await createRuleAPI(data);
        if(_.isFunction(getRulesApi))
        {
          getRulesApi();
        }
        // setShowDialog(true);
        setOpenState(false);
        dispatch(
          setToastMessageHandler(`Rule ${ruleName} created successfully!`, true)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSchedule = (data) => {
    setscheduleData(data);
  };
  const handleDateType = (data) => {
    setDateType(data);
  };
  const handleTimeRange = (data) => {

    setTimeRange(data);
  };
  const handleSelectedDate = (data) => {
    setDate(data);
  };
  const handleSelectedTime = (data) => {
    setTime(data);
  };
  const handleWeeklyTiming = (data) => {
    setTimeError(false)
    setTimeSameError(false);
    setWeeklyTiming(data);
  };

  const handleConditionsApplied = (data) => {
    setCondition(data);
  };

  const handleFirstConditionApplied = (data) => {
    setFirstCondition(data);
  };

  const dateFilter = (data) => {
    setTimeError(false)
    setTimeSameError(false);
    setDateTimings(data);
  };

  const handleAmountChange = (e) => {
    if (budgetType === "amount") {
      setBudgetAmount(e.target.value);
      setBudgetPercentage("");
    } else {
      setBudgetPercentage(e.target.value);
      setBudgetAmount("");
    }
  };

  // TAG APIs
  const fetchAllTagsApi = async () => {
    try {
      setLoading(true);
      const response = await _GET(
        `${GET_ALL_TAGS}?platform=${"blinkit"}&data_level=campaign`
      );
      setLoading(false);
      setTags(response.data.data.result);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAllTagsApi();
  }, []);

  const handleSelectedTags = (selected) => {
    setSelectedTags(selected);
  };


  const options =
    tags && tags.length > 0
      ? tags.map((item) => ({
        label: item.tag_name,
        value: item._id,
      }))
      : [];

  return (
    <div>
      <Popup
        title="Create Rule : Custom Rule"
        setShowPopup={setOpenState}
        // applyAction={handleCreateRule}
        applyAction={() => handleCreateRule()}
        platform="blinkit"
      >
        <div className="pl-4 pr-3 pb-4">
          <div className=" mb-2">
            Automatically update campaigns, ad sets ads in bulk creating
            automated rules.
          </div>
          <div className=" flex  justify-between pt-2">
            <div className="text-[13px] first-row">
              <label htmlFor="" className="">
                Rule name
              </label>
              <label className="text-red-500">*</label>
              <br />
              <input
                type="text"
                className="w-full border h-[32px] pl-2 rounded border-gray-300 blinkitRing "
                name="rule_name"
                id="rule_name"
                placeholder="Rule name"
                value={ruleName}
                onChange={(e) => {
                  setRuleName(e.target.value);
                  setRuleNameError(false);
                }}
              />
              {ruleNameError == true && (
                <p className="text-red-500 text-[11px]">
                  Rule name is a required field
                </p>
              )}
            </div>
            {/* <div>
              
            </div> */}

            <div className="first-row text-[13px]">
              <label className="" htmlFor="">
                Apply Rule to
              </label>
              <label className="text-red-500">*</label>
              {/* <br /> */}

              <CustomSelectNew
              label={"Select one"}
              options={ruleToArr}
              value={entity}
              onChange={(eventValue) => {
                setActionRuleError(false);
                  if (eventValue === "Campaign") setShowTags(true);
                  else {
                    setShowTags(false);
                    setSelectedTags([]);
                  }
                  setEntity(eventValue);
              }}
              platform={"blinkit"}
              className="border-gray-300"
            />

              {/* <select
                name="campaign_type"
                id="campaign_type"
                className="w-full border h-[32px] pl-2 rounded border-gray-300  focus:border-blue-500 focus:outline-none"
                value={entity}
                onChange={(e) => {
                  setActionRuleError(false);
                  if (e.target.value === "Campaign") setShowTags(true);
                  else {
                    setShowTags(false);
                    setSelectedTags([]);
                  }
                  setEntity(e.target.value);
                }}
              >
                <option className="text-[13px]" selected disabled value="">
                  Select one
                </option>
                <option className="text-[13px]" value="Campaign">
                  Campaign
                </option>
                <option className="text-[13px]" value="Keyword">
                  Keyword
                </option>
                <option className="text-[13px]" value="Category">
                  Category
                </option>
              </select> */}
              {actionRuleError == true && (
                <p className="text-red-500 text-[11px]">
                  Apply rule to is a required field
                </p>
              )}
            </div>
          </div>
          <div className="row gap-2 p-1">
            <div className="flex flex-col flex-[0.5] ">
              <div className="w-full ">
                <label className="text-[13px]" htmlFor="">
                  Campaign Type
                </label>
              </div>
              <CustomSelectNew
              label={"Select one"}
              options={accountArr}
              value={campaignType?.join(",")}
              onChange={(eventValue) => {
                let selectedValues=eventValue.split(",")
                setCampaignType(selectedValues)
              }}
              platform={"blinkit"}
              className="border-gray-300"
            />
              {/* <select
                name="campaign_type"
                id="campaign_type"
                value={campaignType}
                onChange={(e) => {
                  const selectedValues = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );

                  if (selectedValues.includes("Performance,Reach")) {
                    setCampaignType(["Performance", "Reach"]);
                  } else {
                    setCampaignType(selectedValues);
                  }
                }}
                className="border w-full h-[32px] rounded pr-4 border-gray-300 focus:border-blue-500 focus:outline-none "
              >
                <option value="Performance">Performance</option>
                <option value="Reach">Reach</option>
                <option value="Performance,Reach">Performance+Reach</option>
              </select> */}
            </div>

            <div className="flex-[0.5] z-10">
              <label className="text-[13px] " htmlFor="">
                Tags{" "}
              </label>
              <MultiSelect
                disabled={!showTags}
                className={`${!showTags ? "disableMulti" : ""}  h-[31px] rmsc--blinkit`}
                options={options}
                value={selectedTags}
                onChange={handleSelectedTags}
                labelledBy="Select Tags"
                ClearSelectedIcon={null}
              />
            </div>

          </div>
          <div className=" flex gap-2">
            <div className=" w-1/2 pl-1">
              <label className="text-[13px]" htmlFor="">
                Action{" "}
              </label>
              {/* <select
                name="rule_action"
                id="rule_action"
                className="w-full text-black pl-2 rounded border h-[32px] border-gray-300 focus:border-blue-500 focus:outline-none"
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                defaultValue={actionData[0].value}
              >
                {actionData.map((v, i) => (
                  <option value={v.value} key={i} disabled={v.disabled} title={v.disabled ? "Feature Locked in PoC" : ""}>
                    {v.label}
                  </option>
                ))}
              </select> */}
              <CustomSelectNew
              label={"Select"}
              options={actionData}
              value={selectedAction}
              onChange={setSelectedAction}
              platform={"blinkit"}
              className="border-gray-300"
            />
            </div>

            <div className="w-1/2">
              <label
                className={
                  actionData[0].value == "IncreaseBudget"
                    ? "text-[13px] text-black"
                    : "text-[13px] text-gray-300"
                }
                htmlFor=""
              >
                Increase budget by{" "}
              </label>
              <div className="flex w-full ">
                {" "}
                <div className=" w-full pr-1">
                  <input
                    min={0}
                    className={
                      selectedAction !== "IncreaseBudget" &&
                        selectedAction != "IncreaseBid"
                        ? "w-full border h-[32px] pl-2 rounded border-gray-300  focus:border-blue-500 focus:outline-none"
                        : "w-full border h-[32px] pl-2 rounded border-gray-300 cursor-not-allowed"
                    }
                    type="number"
                    value={
                      budgetType === "amount" ? budgetAmount : budgetPercentage
                    }
                    onChange={(e) => handleAmountChange(e)}
                    disabled={
                      selectedAction !== "IncreaseBudget" &&
                      selectedAction != "IncreaseBid" &&
                      true
                    }
                    onKeyPress={(e) => {
                      if (e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                <select
                  name="budget_type"
                  id="budget_type"
                  value={budgetType}
                  onChange={(e) => setBudgetType(e.target.value)}
                  disabled={
                    selectedAction !== "IncreaseBudget" &&
                    selectedAction != "IncreaseBid" &&
                    true
                  }
                  className={
                    selectedAction !== "IncreaseBudget" &&
                      selectedAction != "IncreaseBid"
                      ? "border w-1/2 h-[32px] rounded pr-4 border-gray-300 focus:border-blue-500 focus:outline-none  mr-1"
                      : "border w-1/2 h-[32px] rounded pr-4 border-gray-300 cursor-not-allowed mr-1"
                  }
                >
                  <option value="amount">Amount</option>
                  <option value="percent">Percent</option>
                </select>
              </div>
            </div>
          </div>
          <div className=" flex">
            <div className=" w-1/2 pl-1">
              <label className="text-[13px]" htmlFor="">
                Email{" "}
              </label>
              {Array.from(Array(emailCounter)).map((c, index) => {
                return (<div className="flex mt-1" key ={index}>
                  <div className="w-96">
              <input type="email" id="email" onBlur={(e) => validateEmail(e, index)} onChange={(e) => handleEmailChange(e,index)} className=" h-[36px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" required />
              {validEmail[index] == false && (
                <p className="text-red-500 text-[11px]">
                  Please enter a valid email address
                </p>
              )}    
              </div>    
                       {index == emailCounter-1 && emailCounter < 5 && <button
              className={`blinkit_btn condition__plus-btn ${validEmail[index] == false ?"cursor-not-allowed" : "" } bg-slate-500 h-[36px] ml-3`
              
              }

              onClick={() => {setEmailCounter(emailCounter + 1)}}
              disabled={validEmail[index] == false ? true : false}
            >
              <h1 className="text-white text-base" ><GoPlus /></h1>
            </button> }
             {index == emailCounter-1 && emailCounter > 1 &&  <button
             style={{color: "red !important"}}
              className={"condition__minus-btn bg-slate-500 h-[36px] ml-3"
            
              }
              onClick={() => {setEmailCounter(emailCounter - 1)}}
              // // onClick={handleAddCondition}
              // disabled={emptyConditionFlag === true ? true : false}
            >
              <h1 className="text-white text-base" ><AiOutlineMinusCircle /></h1>
            </button> 
                 
            }</div>)

              })}

            </div>
          </div>
          {emailError == true && (
                <p className="text-red-500 text-[11px]">
                  Please enter atleast one valid email
                </p>
              )}
          <div className="flex mt-4 mb-2">
            <label className="text-[13px] ml-1" htmlFor="">
              Conditions{" "}
            </label>
            <div className="ml-12 flex align-middle ">
              {" "}
              <input
                className="cursor-pointer accent-green-600"
                type="checkbox"
                htmlFor="no_conditions"
                name="no_condtions"
                onChange={(e) => setNoConditions(e.target.checked)}
              />
              <label className="text-[13px] ml-1" htmlFor="no_conditions">
                No conditions
              </label>
            </div>
          </div>

          <div
            className={noConditions === false ? "pl-0 pr-2 w-full " : "hidden"}
          >
            <AddCondition
              conditionsApplied={handleConditionsApplied}
              firstConditionsApplied={handleFirstConditionApplied}
              entity={entity}
            />
          </div>
        </div>
        {/* <div className="pt-2 pl-4 pr-3">
          <AddBtn />
        </div> */}
        <div
          className={noConditions === false ? "pt-2 pl-4 pr-16 row" : "hidden"}
        >
          <TimeRange timeRange={handleTimeRange} platform="blinkit" />
        </div>

        <CreateRuleSchedule
          schedule={handleSchedule}
          dateType={handleDateType}
          selectedDate={handleSelectedDate}
          selectedTime={handleSelectedTime}
          weekTiming1={handleWeeklyTiming}
          dateFilter={dateFilter}
        />
        {timeError === true && (
          <p className="text-red-500 ml-4">Select time frame</p>
        )}
        {timeSameError === true && (
          <p className="text-red-500 ml-4">
            Please select different time frames
          </p>
        )}
      </Popup>
    </div>
  );
};
export default CreateRulePopup;
