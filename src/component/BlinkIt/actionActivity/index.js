import React, { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import { _GET } from "../../../services/axios.method";
import { BLINKIT_ACTION_RESULT } from "../../../utils/constants";
import ActionTable from "./actionTable";
import { _POST } from "../../../services/axios.method";
import Toast from "../../common-components/toast";
import { convertDate, defaultDateRange } from "../../../utils/helpers";
import DatePicker from "../../DatePicker";
import { AMAZON_ACCOUNTS } from "../../../utils/amazonConstants";
import ActionActivityMultiSearch from "../../common-components/MultiSearch/ActionActivityMultiSearch";
import { useDispatch} from "react-redux";
import ActionType from "../../../redux/types";
// import { addDays } from "date-fns";
import "../../common-components/selectBox/selectBox.css";

const ActionActivity = () => {
  // eslint-disable-next-line no-unused-vars
  const [brandName, setBrandName] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  // const [platformId, setPlatformId] = useState([]);
  const [accountIdObject, setAccountIdObject] = useState({});
  const [platform, setPlatform] = useState([]);
  const [ruleStatus, setRuleStatus] = useState([]);
  // const [segment, setSegment] = useState(["pla"]);
  const dateFilters = defaultDateRange();
  const [loading, setLoading] = useState(false);
  const [sortBy,setSortBy] = useState({
    key: "createdat",
    order : "DESC"
  })
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(dateFilters["startDate"]),
      endDate: new Date(dateFilters["endDate"]),
      key: dateFilters["key"],
    },
  ]);
  const [calState, setCalState] = useState({
    showCalender: false,
    fullCalender: false,
    dateApplied: false,
  });

  const dispatch = useDispatch();
  const [filters, setFilters] = useState([]);

  const sortData = (item,order)=>{
    setSortBy({
      key : item,
      order : order
    })
  }

  // api for fetch the data
  const getActionResultData = async () => {
    try {
      setLoading(true);
      let actionStatus = [];


      ruleStatus.map((item) => {
        actionStatus.push(item.value);
      });

      const data = {
        status: actionStatus,
        filters: filters,
        start_date: convertDate(dateRange[0]?.startDate),
        end_date: convertDate(dateRange[0]?.endDate),
        sort: sortBy,
        media_type: "Blinkit",
      };
      const result = await _POST(BLINKIT_ACTION_RESULT, data);
      setLoading(false);

      let tempAccountIdObject = {};
      accountsData.forEach((item) => {
        tempAccountIdObject[item.value] = item.label;
      });

      setAccountIdObject(tempAccountIdObject);

      // console.log(result?.data?.data?.result, "account id Result");

      setActionData(result?.data?.data?.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (platform.length > 0 && ruleStatus.length > 0){
      getActionResultData();
    }else{
      setActionData([])
    }
    
  }, [
     platform,
    //  platformId,
     ruleStatus,
     filters,
     sortBy
    //  segment,
    //  dateRange
  ]);

  useEffect(()=>{
    if(!calState.fullCalender && platform.length > 0 && ruleStatus.length > 0)
      getActionResultData()
      },[dateRange])

  const onChangeDate = (item) => {
    defaultDateRange(item.selection);
    setDateRange([item.selection]);
    if (!calState.fullCalender) {
      setCalState({
        ...calState,
        showCalender: false,
        dateApplied: true,
      });
    }
  };
  const applyDate = () => {
    setCalState({
      showCalender: false,
      fullCalender: false,
      dateApplied: true,
    });
    onChangeDate({ selection: dateRange[0] });
    // getActionResultData();
  };

  // const accountOptions =
  //   accountsData && accountsData.length > 0
  //     ? accountsData.map((item) => ({
  //         label: item.label,
  //         value: item.platform_id,
  //       }))
  //     : [];

  const accountNames = async () => {
    try {
      setLoading(true);

      const result = await _GET(AMAZON_ACCOUNTS);
      const data = result.data.data;
      // console.log(data, "Amazon Data");
      const accounts = data
        .map((item) => {
          if (item.label !== "Enfagrow A+") {
            return {
              label: item.label,
              value: item.value,
              account_id: item.label,
              platform_id: item.value,
            };
          }
          return null; // Skip the item
        })
        .filter(Boolean);

      setLoading(false);
      setAccountsData(accounts);
      // setPlatformId(accounts);
      setBrandName(accounts);
      // console.log(accounts, "accountsData");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    accountNames();
    setPlatform(options.platform);
    setRuleStatus(options.status);
    // setSegment(options.segment);
  }, []);

  const options = {
    brand: [],
    platform: [
      { label: "Reach", value: "Reach" },
      { label: "Performance", value: "Performance" },
    ],

    status: [
      { label: "Failed", value: "false" },
      { label: "Success", value: "true" },
      { label: "Pending", value: "Pending"}
    ],
    segment: [
      { label: "Reach", value: "Reach" },
      { label: "Performance", value: "Performance" },
    ],
  };

  function applySearchFilter(sFilters, current) {
    // setIsDisabledSaveSearch(false);

    let apiFilter = {};
    // let tab = "campaign";
    apiFilter = sFilters;

    if (
      current === "blinkit_campaign_type"
    ) {
      if (current === "blinkit_campaign_type") {
        let blinkit_campaign_type = sFilters?.blinkit_campaign_type.map(
          (data) => data?.key
        );
        dispatch({
          type: ActionType.CAMPAIGN_TYPE,
          payload: blinkit_campaign_type,
        });
      }
      let otherFilters = {};
      if (
        [
          // "segment",
          "platform",
          "campaign_status",
          "campaign_budget_type",
        ].indexOf(current) > -1
      ) {
        otherFilters[current] = sFilters[current];
      }
      apiFilter = { ...apiFilter, ...otherFilters };
      // tab = "campaign";
      // setCheckboxData([]);
    }
    // filters[tab] = apiFilter;
    // getTabData(tab, true, filters);
    // console.log(filters, "filters12");
    // if (clearSearch === false) {
      setFilters(apiFilter);
    // } else {
    //   setFilters([]);
    // }
    // setShowHeader(showHeader);
    // console.log(JSON.stringify(sFilters), "filters-----", apiFilter, current);
    getActionResultData();
  }

  // const handleSelectedAccounts = (selected) => {
  //   setPlatformId(selected);
  //   setBrandName(selected);
  // };

  // const handleSelectedPlatform = (selected) => {
  //   setPlatform(selected);
  // };

  const handleSelectedStatus = (selected) => {
    setRuleStatus(selected);
  };

  const customValueRenderer = (selected) => {
    let selectedLabels = [];
    if (selected.length) {
      selected.map(({ label }) => selectedLabels.push(label));
    }
    return selectedLabels.join(",");
  };

  const handleTrigger = async () => {
    // try {
    //   const data = { action_id: id };
    //   const result = await _POST(AMAZON_RETRIGGER_ACTION, data);
    //   if (result?.status === 200) {
    //     dispatch(setToastMessageHandler(result?.data?.status?.message, true));
    //   } else {
    //     dispatch(setToastMessageHandler(result?.data?.error?.message, false));
    //   }
    // } catch (error) {}
  };

  return (
    <>
      <Toast></Toast>
      <div className="flex py-4 bg-white color-[#303030]">
        <b className="font-inter font-bold text-[16px] leading-6 pl-4">
          Action Activity
        </b>
      </div>
      <section className="mt-4 flex-nowrap bg-white">
        <div className=" flex py-4 pl-3">
          {/* <div className="flipkart__selectfilter z-30">
            <MultiSelect
              className="h-12"
              options={accountOptions}
              value={platformId}
              onChange={handleSelectedAccounts}
              labelledBy="Select Tags"
              valueRenderer={customValueRenderer}
              ClearSelectedIcon={null}
              disableSearch={true}
            />
          </div> */}
          {/* <div className="flipkart__selectfilter ">
            <MultiSelect
              className="h-12 rmsc--blinkit"
              options={options.platform}
              value={platform}
              onChange={handleSelectedPlatform}
              labelledBy="Select Tags"
              valueRenderer={customValueRenderer}
              ClearSelectedIcon={null}
              disableSearch={true}
            />
          </div> */}
              <ActionActivityMultiSearch
                applySearchFilter={applySearchFilter}
                mediaName="blinkit"
              />
          <div className="flipkart__calander mx-1">
            <DatePicker
              onChangeDate={onChangeDate}
              state={dateRange}
              setState={setDateRange}
              calState={calState}
              setCalState={setCalState}
              position={""}
              applyDate={applyDate}
              platform="blinkit"
              boxClassName="!h-[39px] !px-3"
              className="!top-[44px] border"
            />
          </div>
        </div>
      </section>

      <div className="mt-4 w-full flex bg-white border rounded">
        <div className="px-4 pt-4 w-full flex z-20">
          {/* {/* <div className="w-full bg-red-100 mr-8"> */}
          {/* <input
              className="rounded border py-1 px-2  w-full"
              placeholder="Search"
            />
          </div>  */}
          <div className="w-1/6">
            <MultiSelect
              // disabled={!showTags}
              className={`h-12 rmsc--blinkit`}
              options={options.status}
              value={ruleStatus}
              onChange={handleSelectedStatus}
              labelledBy="Select Tags"
              ClearSelectedIcon={null}
              valueRenderer={customValueRenderer}
              disableSearch={true}
            />
          </div>
        </div>
      </div>
      <ActionTable
        actionData={actionData}
        loading={loading}
        handleTrigger={handleTrigger}
        accountIdObject={accountIdObject}
        sortData = {sortData}
        sort={sortBy}
      />
    </>
  );
};

export default ActionActivity;
