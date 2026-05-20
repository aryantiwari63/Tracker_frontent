import React, { useState, useEffect } from "react";
import _ from "lodash";
import { MultiSelect } from "react-multi-select-component";
import { _GET } from "../../../services/axios.method";
import { AMAZON_ACTION_RESULT } from "../../../utils/constants";
import ActionTable from "./actionTable";
import { _POST } from "../../../services/axios.method";
import Toast from "../../common-components/toast";
import {
  convertDate,
  defaultDateRange,
  getLocalStorageAccounts,
  saveLocalStorageAccounts,
} from "../../../utils/helpers";
import DatePicker from "../../DatePicker";
import { AMAZON_ACCOUNTS } from "../../../utils/amazonConstants";
import ActionActivityMultiSearch from "../../common-components/MultiSearch/ActionActivityMultiSearch";
import { useDispatch } from "react-redux";
import ActionType from "../../../redux/types";
// import { addDays } from "date-fns";
import "../../common-components/selectBox/selectBox.css";

const ActionActivity = () => {
  // eslint-disable-next-line no-unused-vars
  const [brandName, setBrandName] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  const [platformId, setPlatformId] = useState([]);
  const [accountIdObject, setAccountIdObject] = useState({});
  const [platform, setPlatform] = useState([]);
  const [ruleStatus, setRuleStatus] = useState([]);
  const [segment, setSegment] = useState(["pla"]);
  const dateFilters = defaultDateRange();
  const [loading, setLoading] = useState(false);
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
  // const media_type = localStorage.getItem('platform_type').replace(/"/g, '').substring(1);
  // api for fetch the data

  const [sortBy, setSortBy] = useState({
    key: "createdat",
    order: "DESC",
  });
  const getActionResultData = async () => {
    try {
      setLoading(true);
      let payloadPlatformId = [];
      let platformName = [];
      let segmentName = [];
      let actionStatus = [];

      platformId.map((item) => {
        payloadPlatformId.push(item.value);
      });
      platform.map((item) => {
        platformName.push(item?.value);
      });

      segment.map((item) => {
        segmentName.push(item.value);
      });

      ruleStatus.map((item) => {
        actionStatus.push(item.value);
      });

      const data = {
        platform: platformName,
        segment: segmentName,
        account: payloadPlatformId,
        status: actionStatus,
        filters: filters,
        start_date: convertDate(dateRange[0]?.startDate),
        end_date: convertDate(dateRange[0]?.endDate),
        media_type: "Amazon",
        sort: sortBy,
        client_id: localStorage.getItem("client_id"),
      };
      const result = await _POST(AMAZON_ACTION_RESULT, data);
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

  const sortData = (item, order) => {
    setSortBy({
      key: item,
      order: order,
    });
  };

  useEffect(() => {
    if (
      platform.length > 0 &&
      ruleStatus.length > 0 &&
      segment.length > 0 &&
      platformId.length > 0
    ) {
      getActionResultData();
    } else {
      setActionData([]);
    }
  }, [platform, platformId, ruleStatus, segment, filters, sortBy]);

  useEffect(() => {
    if (
      !calState.fullCalender &&
      platform.length > 0 &&
      ruleStatus.length > 0 &&
      segment.length > 0 &&
      platformId.length > 0
    )
      getActionResultData();
  }, [dateRange]);

  const onChangeDate = (item) => {
    defaultDateRange(item.selection);
    setDateRange([item.selection]);
    if (!calState.fullCalender) {
      setCalState({
        ...calState,
        showCalender: false,
        dateApplied: true,
      });
      // getActionResultData()
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

  const accountOptions =
    accountsData && accountsData.length > 0
      ? accountsData.map((item) => ({
          label: item.label,
          value: item.platform_id,
        }))
      : [];

  const accountNames = async () => {
    try {
      setLoading(true);

      const result = await _GET(AMAZON_ACCOUNTS);
      const data = result.data.data;
      // console.log(data, "Amazon Data");
      const accounts = data.map((item) => ({
        label: item.label,
        value: item.value,
        account_id: item.label,
        platform_id: item.value,
      }));
      let filterAccounts = _.cloneDeep(accounts);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
        let selectedAccounts = savedAccounts
          .map((value) => accounts.find((account) => account.label === value))
          .filter(Boolean);
        if (_.size(_.compact(selectedAccounts))) {
          filterAccounts = selectedAccounts;
        } else {
          saveLocalStorageAccounts(_.map(accounts, "label"));
        }
      } else {
        saveLocalStorageAccounts(_.map(accounts, "label"));
      }
      setLoading(false);
      setAccountsData(accounts);
      setPlatformId(filterAccounts);
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
    setSegment(options.segment);
  }, []);

  const options = {
    brand: [],
    platform: [
      { label: "Sponsored Product", value: "SP" },
      { label: "Sponsored Brand", value: "SB" },
      { label: "Sponsored Display", value: "SD" },
    ],

    status: [
      { label: "Failed", value: "false" },
      { label: "Success", value: "true" },
      { label: "Pending", value: "Pending" },
    ],
    segment: [
      { label: "Sponsored Product", value: "SP" },
      { label: "Sponsored Brand", value: "SB" },
      { label: "Sponsored Display", value: "SD" },
    ],
  };

  const applySearchFilter = React.useCallback(
    (sFilters, current) => {
      // setIsDisabledSaveSearch(false);

      let apiFilter = {};
      // let tab = "campaign";
      apiFilter = sFilters;

      if (current === "amazon_campaign_type") {
        if (current === "amazon_campaign_type") {
          let amazon_campaign_type = sFilters?.amazon_campaign_type.map(
            (data) => data?.key
          );
          dispatch({
            type: ActionType.CAMPAIGN_TYPE,
            payload: amazon_campaign_type,
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
    },
    [filters]
  );

  const handleSelectedAccounts = (selected) => {
    setPlatformId(selected);
    setBrandName(selected);
    saveLocalStorageAccounts(_.map(selected, "label"));
  };

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
      <section className="mt-4 flex-nowrap py-2  pl-1 bg-white">
        <div className=" flex items-center">
          <div className="flipkart__selectfilter z-20 ">
            <MultiSelect
              className="rmsc--ams customBox"
              options={accountOptions}
              value={platformId}
              onChange={handleSelectedAccounts}
              labelledBy="Select Tags"
              valueRenderer={customValueRenderer}
              ClearSelectedIcon={null}
              disableSearch={true}
            />
          </div>
          <div className="flex-1 ">
            <ActionActivityMultiSearch
              // saveSearch={savedSearch}
              applySearchFilter={applySearchFilter}
              // clearSearch={clearSearch}
              // setClearSearch={() => {
              //   setClearSearch(false);
              //   // setIsDisabledSaveSearch(true);
              // }}
              mediaName="amazon"
            />
          </div>
          {/* <div className="flipkart__selectfilter">
            <MultiSelect
              className="h-12"
              options={options.segment}
              value={segment}
              onChange={handleSelectedSegment}
              labelledBy="Select Tags"
              valueRenderer={customValueRenderer}
              ClearSelectedIcon={null}
              disableSearch={true}
            />
          </div> */}
          <div className="flipkart__calander ">
            <DatePicker
              onChangeDate={onChangeDate}
              state={dateRange}
              setState={setDateRange}
              calState={calState}
              setCalState={setCalState}
              position={""}
              applyDate={applyDate}
              boxClassName="!h-[38px]"
              className="!top-[44px] border"
              platform={"ams"}
            />
          </div>
        </div>
      </section>

      <div className="mt-4 w-full flex bg-white border rounded">
        <div className="px-4 py-4 w-full flex z-10">
          {/* {/* <div className="w-full bg-red-100 mr-8"> */}
          {/* <input
              className="rounded border py-1 px-2  w-full"
              placeholder="Search"
            />
          </div>  */}
          <div className="w-[24%]">
            <MultiSelect
              // disabled={!showTags}
              className={`rmsc--ams customBox`}
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
        {/* <div className="flex p-6 justify-end w-1/2 ">
          <div></div>
          <div>
            <button className="border flex py-1 px-2 rounded">
              <span>
                {" "}
                <img
                  className="w-3 inline-block align-baseline mr-1"
                  src="/assets/images/reload.png"
                  alt="reload"
                />
              </span>
              <span> Trigger again</span>
            </button>
          </div>
          <div className="h-8 flex py-1  ">
            {" "}
            <img
              className=" inline-block align-baseline cursor-pointer mx-3"
              onClick={() => setStarTop(!starTop)}
              src={
                starTop === true
                  ? "/assets/images/prime_star-fill.png"
                  : "/assets/images/star.png"
              }
              // src="/assets/images/star.png"
              alt="star"
            />
          </div>
          <div>
            <img
              className="inline-block align-baseline mt-2 cursor-pointer mx-2"
              src="/assets/images/columns.png"
              alt="reload"
            />
          </div>
          <div>
            <img
              className="inline-block align-baseline mt-2 cursor-pointer mx-2"
              src="/assets/images/download1.png"
              alt="reload"
            />
          </div>
        // </div> */}
      </div>
      <ActionTable
        actionData={actionData}
        loading={loading}
        handleTrigger={handleTrigger}
        accountIdObject={accountIdObject}
        sortData={sortData}
        sort={sortBy}
      />
    </>
  );
};

export default ActionActivity;
