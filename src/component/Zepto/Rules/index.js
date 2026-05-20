import React, { useState, useEffect } from "react";
import _ from "lodash";
import FlipkartTable from "../../common-components/flipkarttable";
import CreateRulePopup from "./CreateRulePopup";
import { addDays } from "date-fns";
import { createRuleHeaders, PERMISSIONS } from "../../../utils/constants";
import { _GET, _POST } from "../../../services/axios.method";
import { GET_RULES, GET_ZEPTO_ACCOUNTS } from "../../../utils/constants";
import { getLocalStorageAccounts, saveLocalStorageAccounts } from "../../../utils/helpers";
import { setLoading } from "../../../redux/action-creator/commonAction";
import ActionType from "../../../redux/types";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../../common-components/toast";
import { MultiSelect } from "react-multi-select-component";
import WhenPermitted from "../../common-components/WhenPermitted";
// import { getWallletBalance } from "../../../redux/action-creator/sideBarAction";

const Rules = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [accountsData, setAccountsData] = useState([]);
  const [platformId, setPlatformId] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [status, setStatus] = useState([]);
  const [notInital, setnotInital] = useState(false);
  const [search, setSearch] = useState("");
  const { recallRules } = useSelector(
    (state) => state?.RecallGetRulesApiReducer
  );

  // eslint-disable-next-line no-unused-vars
  const [dateRange, setDateRange] = React.useState([
    {
      startDate: addDays(new Date(), -7),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  // const [loading, setLoading] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showHeader, setShowHeader] = React.useState([...createRuleHeaders]);
  const { ruleData } = useSelector((state) => state?.RuleReducer);
  const [dataLIMIT, setDataLIMIT] = React.useState(0);
  const [campaignType, setCampaignType] = useState( [
    { label: "Performance", value: "Performance" },
    { label: "Awareness", value: "Awareness" },
  ]);
  const dispatch = useDispatch();

  //   setSortBy({
  //     key: item,
  //     order: order,
  //   });
  //   setPage(1);
  //   setOffset(0);
  // };

  // eslint-disable-next-line no-unused-vars
  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: 1,
  });

  const handleSearch = async () => {
    await getRulesApi()
  }

  const getRulesApi = async () => {
    try {
      setLoading(true);
      let payloadPlatformId = [];
      let payloadStatus = [];
      let payloadCamp = [];
      campaignType.map((item) => {
        payloadCamp.push(item.value);
      })
      platformId.map((item) => {
        payloadPlatformId.push(item.value);
      });
      status.map((item) => {
        payloadStatus.push(item.value);
      });

      if (platformId.length > 0 || notInital) {
        let payload = {
          platformId: payloadPlatformId,
          status: payloadStatus,
          media_type: 'zepto',
          search: search,
          platform: payloadCamp
        };
        const result = await _POST(GET_RULES, payload);
        setnotInital(true);
        setLoading(false);
        // console.log(result?.data?.data?.fetchRule, "reult");
        // setRulesData(result?.data?.data?.fetchRule);
        dispatch({
          type: ActionType.RULE,
          payload: result?.data?.data?.fetchRule,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const accountNames = async () => {
    try {
      setLoading(true);
      const responseAccount = await _GET(GET_ZEPTO_ACCOUNTS);
      const accounts = responseAccount.data.data.map((item) => ({
        label: item.account_name,
        value: item.account_name,
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
    setPlatform(options.platform);
    setStatus(options.status);
  }, []);
  useEffect(() => {
    getRulesApi();
  }, [showPopup]);

  useEffect(() => {
    getRulesApi();
  }, [showPopup, platform, status, platformId, campaignType]);

  useEffect(() => {
    if (recallRules == true) {
      getRulesApi();
    }
    dispatch({
      type: ActionType.RECALLGETRULESAPI,
      payload: false,
    });
  }, [recallRules]);

  useEffect(()=>{
    if(!search)
    handleSearch()
  },[search])

  const handleSelectedAccounts = (selected) => {
    setPlatformId(selected);
    saveLocalStorageAccounts(_.map(selected, 'label'));
  };



  const handleSelectStatus = (selected) => {
    setStatus(selected);
  };

  const handleSelectCampaignType = (selected) => {
    setCampaignType(selected)
  }

  const accountOptions =
    accountsData && accountsData.length > 0
      ? accountsData.map((item) => ({
        label: item.label,
        value: item.label,
      }))
      : [];

  const options = {
    brand: [],
    status: [
      { label: "Enabled", value: true },
      { label: "Disabled", value: false },
    ],
    campaign_type: [
      { label: "Performance", value: "Performance" },
      { label: "Awareness", value: "Awareness" },
    ],
    tags: [],
  };
  const customValueRenderer = (selected) => {
    let selectedLabels = [];
    if (selected.length) {
      selected.map(({ label }) => selectedLabels.push(label));
    }
    return selectedLabels.join(",");
  };

  // React.useEffect(() => {
  //   const accounts = platformId.map((item) => item.label)
  //   dispatch(getWallletBalance(accounts));
  // }, [platformId]);

  return (
    <>
      <Toast></Toast>

      <div>
        {/* <TableSubHeader
          onChangeDate={onChangeDate}
          applyDate={applyDate}
          state={dateRange}
          setState={setDateRange}
          calState={calState}
          setCalState={setCalState}
          setSelectedAccountVal={setSelectedAccountVal}
          selectedAccountVal={selectedAccountVal}
          setSelectedPlatformVal={setSelectedPlatformVal}
          selectedPlatformVal={selectedPlatformVal}
          setSelectedTypeVal={setSelectedTypeVal}
          selectedTypeVal={selectedTypeVal}
        /> */}
      </div>
      <div className="flex py-4 bg-white color-[#303030]">
        <b className="font-inter font-bold text-[16px] leading-6 pl-4">
        Manage Rules
        </b>
      </div>
      <section className="mt-4 flex-nowrap pt-4 pl-2 bg-white">
        <div className="flex">
          <div className="flipkart__selectfilter z-30">
            <MultiSelect
              className="h-12 rmsc--zepto"
              options={accountOptions}
              value={platformId}
              onChange={handleSelectedAccounts}
              labelledBy="Select Tags"
              valueRenderer={customValueRenderer}
              ClearSelectedIcon={null}
              disableSearch={true}
            // isOpen={true}
            />
          </div>
          <div className="flipkart__selectfilter z-30">
            <MultiSelect
              className="h-12 rmsc--zepto"
              options={options.campaign_type}
              value={campaignType}
              onChange={handleSelectCampaignType}
              labelledBy="Select Tags"
              valueRenderer={customValueRenderer}
              ClearSelectedIcon={null}
              disableSearch={true}
            // isOpen={true}
            />
          </div>
          <div className="flipkart__selectfilter z-30">
            <MultiSelect
              className="h-12 rmsc--zepto"
              options={options.status}
              value={status}
              onChange={handleSelectStatus}
              labelledBy="Select Tags"
              valueRenderer={customValueRenderer}
              ClearSelectedIcon={null}
              disableSearch={true}
            />
          </div>
          <div className="relative text-gray-600 mr-2">
            <input type="search" value={search} onChange={(e) => { setSearch(e.target.value) }} name="serch" placeholder="Search by Name" className=" focus:border-[#5a0c82] focus:ring-[#5a0c82] rounded-md sm:text-sm focus:ring-1  w-96 border border-[#ccc] bg-white h-8 px-5 pr-10  text-sm focus:outline-none" />
            <button onClick={handleSearch} className="absolute right-0 top-0 mt-2 mr-4">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" xmlSpace="preserve" width="512px" height="512px">
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      <section>
        <div className="rules__card ">
          <WhenPermitted platform="zepto" permission={PERMISSIONS.CREATE_RULE}>
          <button
            className="card__btn row mb-4 zepto_btn"
            onClick={() => setShowPopup(!showPopup)}
          >
            <div className="h-2 w-4 pt-1 pr-0.5">
              <img src="/assets/images/plus1.svg" alt="" />
            </div>
            Create Rule
          </button>
          </WhenPermitted>
          {showPopup && <CreateRulePopup setOpenState={setShowPopup} getRulesApi={getRulesApi}/>}

          <FlipkartTable
            headers={showHeader}
            bodyContent={ruleData}
            sortBy={sortBy}
            // loading={loading}
            // sortData={sortData}
            // paginate={paginate}
            // totalData={totalData}
            // page={page}
            // offset={offset}
            setDataLIMIT={setDataLIMIT}
            dataLIMIT={dataLIMIT}
            source={"zepto_rule"}
            customCss={true}
            accountsData={accountsData}
            getRulesApi={getRulesApi}
          />
        </div>
      </section>
      {/* <PreviewBtn/> */}
    </>
  );
};
export default Rules;
