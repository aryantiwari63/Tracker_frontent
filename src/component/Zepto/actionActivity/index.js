import React, { useState, useEffect } from "react";
import _ from "lodash";
import { MultiSelect } from "react-multi-select-component";
import { _GET } from "../../../services/axios.method";
import {
  GET_ZEPTO_ACCOUNTS,
  ZEPTO_ACTION_RESULT,
} from "../../../utils/constants";
import ActionTable from "./actionTable";
import { _POST } from "../../../services/axios.method";
import Toast from "../../common-components/toast";
import {
  convertDate,
  defaultDateRange,
  getLocalStorageAccounts,
  saveLocalStorageAccounts
} from "../../../utils/helpers";
import DatePicker from "../../DatePicker";
// import { addDays } from "date-fns";
import "../../common-components/selectBox/selectBox.css"

const ActionActivity = () => {
  // eslint-disable-next-line no-unused-vars
  const [actionData, setActionData] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  const [platformId, setPlatformId] = useState([]);
  // const [accountIdObject,setAccountIdObject] = useState({})
  const [segment, setSegment] = useState([
    { label: "Performance", value: "Performance" },
    { label: "Awareness", value: "Awareness" },
  ]);
  const [ruleStatus, setRuleStatus] = useState([
    { label: "Failed", value: "false" },
    { label: "Success", value: "true" },
    { label: "Pending", value: "Pending" },
  ]);
  // const [segment, setSegment] = useState(["pla"]);
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
  const [sortBy,setSortBy] = useState({
    key: "createdat",
    order : "DESC"
  })

  const sortData = (item,order)=>{
    setSortBy({
      key : item,
      order : order
    })
  }
  // const media_type = localStorage.getItem('platform_type').replace(/"/g, '').substring(1);

  // api for fetch the data
  // console.error(platformId,"platformId")
  const getActionResultData = async () => {
    try {
      setLoading(true);
      let payloadPlatformId = [];
      let segmentName = [];
      // let segmentName = [];
      let actionStatus = [];
      // console.error(platformId,"platformId")
      platformId.map((item) => {
        payloadPlatformId.push(item.label);
      });
      segment.map((item) => {
        segmentName.push(item?.value);
      });
      // console.error(platformId,"platformId")
      // segment.map((item) => {
      //   segmentName.push(item.value);
      // });

      ruleStatus.map((item) => {
        actionStatus.push(item.value);
      });

      const data = {
        // platform: platformName,
        segment: segmentName,
        account: payloadPlatformId,
        status: actionStatus,
        start_date: convertDate(dateRange[0]?.startDate),
        end_date: convertDate(dateRange[0]?.endDate),
        sort: sortBy,
        media_type: "Zepto",
      };
      const result = await _POST(ZEPTO_ACTION_RESULT, data);
      setLoading(false);

      // let tempAccountIdObject = {};
      // accountsData.forEach((item) => {
      //   tempAccountIdObject[item.account_id] = item.label;
      // });
      
      // setAccountIdObject(tempAccountIdObject)


      // console.log(result?.data?.data?.result, "account id Result");

      setActionData(result?.data?.data?.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if ( 
      ruleStatus.length > 0 && 
      platformId.length > 0){
      getActionResultData();
    }else{
      setActionData([])
    }
      
  }, [platformId, ruleStatus, segment,sortBy]);

  useEffect(()=>{
    if(!calState.fullCalender && ruleStatus.length > 0 &&
      platformId.length > 0 )
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

      const result = await _GET(GET_ZEPTO_ACCOUNTS);
      const data = result.data.data;
      console.error(data,"accountttt")
      const accounts = data.map((item) => ({
        label: item.account_name,
        value: item.account_id,
        account_id: item.account_name,
        platform_id: item.account_id,
      }));
      let filterAccounts = _.cloneDeep(accounts);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
        let selectedAccounts = savedAccounts.map(value =>
          accounts.find(account => account.label === value)
        ).filter(Boolean);
          if (_.size(_.compact(selectedAccounts))) {
            filterAccounts = selectedAccounts;
          } else {
            saveLocalStorageAccounts(_.map(accounts, 'label'));
          }
      } else {
        saveLocalStorageAccounts(_.map(accounts, 'label'));
      }

      setLoading(false);
      setAccountsData(accounts);
      setPlatformId(filterAccounts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    accountNames();
    // setSegment(options.segment);
    // setRuleStatus(options.status);
    // setSegment(options.segment);
  }, []);

  const options = {
    brand: [],
    segment: [
      { label: "Performance", value: "Performance" },
      { label: "Awareness", value: "Awareness" },
    ],

    status: [
      { label: "Failed", value: "false" },
      { label: "Success", value: "true" },
      { label: "Pending", value: "Pending"}
    ],
    // segment: [
    //     { label: "Performance", value: "Performance" },
    //   { label: "Awareness", value: "Awareness" },
    // ],
  };

  const handleSelectedAccounts = (selected) => {
    console.error(selected,"selected_account")
    setPlatformId(selected);
    saveLocalStorageAccounts(_.map(selected, 'label'));
  };

  const handleSelectedPlatform = (selected) => {
    setSegment(selected);
  };
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
      <section className=" flex-nowrap mt-4 py-4 bg-white">
        <div className="flex pl-2">
          <div className="flipkart__selectfilter z-30">
            <MultiSelect
              className="rmsc--zepto"
              options={accountOptions}
              value={platformId}
              onChange={handleSelectedAccounts}
              labelledBy="Select Tags"
              valueRenderer={customValueRenderer}
              ClearSelectedIcon={null}
              disableSearch={true}
            />
          </div>
          <div className="flipkart__selectfilter ">
            <MultiSelect
              className="rmsc--zepto"
              options={options.segment}
              value={segment}
              onChange={handleSelectedPlatform}
              labelledBy="Select Tags"
              valueRenderer={customValueRenderer}
              ClearSelectedIcon={null}
              disableSearch={true}
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
          <div className="flipkart__calander ml-3 ">
            <DatePicker
              onChangeDate={onChangeDate}
              state={dateRange}
              setState={setDateRange}
              calState={calState}
              setCalState={setCalState}
              position={""}
              applyDate={applyDate}
              className="!top-[36px] border"
              platform={"zepto"}
            />
          </div>
        </div>
      </section>

      <div className="mt-4 w-full flex bg-white border rounded">
        <div className="px-4 py-4 w-full flex ">
          {/* {/* <div className="w-full bg-red-100 mr-8"> */}
          {/* <input
              className="rounded border py-1 px-2  w-full"
              placeholder="Search"
            />
          </div>  */}
          <div className="w-1/6 z-[11]">
            <MultiSelect
              // disabled={!showTags}
              className="rmsc--zepto"
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
        // accountIdObject = {accountIdObject}
        sortData = {sortData}
        sort={sortBy}
      />
    </>
  );
};

export default ActionActivity;
