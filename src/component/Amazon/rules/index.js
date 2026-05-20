import React, { useState, useEffect } from "react";
import _ from "lodash";
import AMAZONTABLE from "../../common-components/amazontable";
import CreateRulePopup from "./CreateRulePopup";
import BuyBoxPopup from "./BuyBoxPopup";
import { GET_ALL_TAGS, PERMISSIONS, createRuleHeaders } from "../../../utils/constants";
// import PreviewBtn from "./button/Previewbtn";
import { _GET, _POST } from "../../../services/axios.method";
import { GET_RULES } from "../../../utils/constants";
import { getLocalStorageAccounts, saveLocalStorageAccounts } from "../../../utils/helpers";
import { setLoading } from "../../../redux/action-creator/commonAction";
import ActionType from "../../../redux/types";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../../common-components/toast";
import { AMAZON_ACCOUNTS } from "../../../utils/amazonConstants";
import { MultiSelect } from "react-multi-select-component";
import "../../common-components/selectBox/selectBox.css"
import WhenPermitted from "../../common-components/WhenPermitted";

const Rules = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupBuyBox, setShowPopupBuyBox] = useState(false);
  const [accountsData, setAccountsData] = useState([]);
  const [platformId, setPlatformId] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [status, setStatus] = useState([]);
  const [notInital, setnotInital] = useState(false);
  const [search, setSearch] = useState("")
  const { recallRules } = useSelector(
    (state) => state?.RecallGetRulesApiReducer
  ); 
  // const [loading, setLoading] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showHeader, setShowHeader] = React.useState([...createRuleHeaders]);
  const [tags, setTags] = React.useState();
  const { ruleData } = useSelector((state) => state?.RuleReducer);
  const [dataLIMIT, setDataLIMIT] = React.useState(0);

  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const [sortBy, setSortBy] = React.useState({
    key: "created_on",
    order: 1,
  });

  const getRulesApi = async () => {
    try {
      setLoading(true);
      let payloadPlatform = [];
      let payloadPlatformId = [];
      let payloadStatus = [];
      platform.map((item) => {
        payloadPlatform.push(item.value);
      });
      platformId.map((item) => {
        payloadPlatformId.push(item.value);
      });
      status.map((item) => {
        payloadStatus.push(item.value);
      });
      if (platformId.length > 0 || notInital) {
        let payload = {
          platform: payloadPlatform,
          platformId: payloadPlatformId,
          status: payloadStatus,
          media_type: 'amazon',
          search: search
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
      const result = await _GET(AMAZON_ACCOUNTS);
      const data = result.data.data;
      const accounts = data.map((item) => ({
        label: item.label,
        value: item.value,
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

  const getTags = async() => {
      const response = await _GET(
        `${GET_ALL_TAGS}?platform=amazon&data_level=campaign`
      );
      setLoading(false);
      setTags(response.data.data.result);
  }

  useEffect(() => {
    accountNames();
    setPlatform(options.platform);
    setStatus(options.status);
    getTags()
  }, []);
  useEffect(() => {
    getRulesApi();
  }, [showPopup]);

  useEffect(() => {
    getRulesApi();
  }, [showPopup, platform, status, platformId]);

  useEffect(() => {
    if (recallRules == true) {
      getRulesApi();
    }
    dispatch({
      type: ActionType.RECALLGETRULESAPI,
      payload: false,
    });
  }, [recallRules]);

  const handleSelectedAccounts = (selected) => {
    setPlatformId(selected);
    saveLocalStorageAccounts(_.map(selected, 'label'));
  };

  const handleSelectedPlatform = (selected) => {
    setPlatform(selected);
  };

  const handleSelectStatus = (selected) => {
    setStatus(selected);
  };

  const accountOptions =
    accountsData && accountsData.length > 0
      ? accountsData.map((item) => ({
          label: item.label,
          value: item.value,
        }))
      : [];

  const options = {
    brand: [],
    platform: [
      { label: "Sponsored Product", value: "SP" },
      { label: "Sponsored Brand", value: "SB" },
      { label: "Sponsored Display", value: "SD" },
    ],
    status: [
      { label: "Enabled", value: true },
      { label: "Disabled", value: false },
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
  const handleSearch = async () => {
    await getRulesApi()
  }
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
      <section className="mt-4 flex-nowrap pt-4 pl-2 pr-4 bg-white">
        <div className=" flex columns-4">
          <div className="flipkart__selectfilter z-[20] flex-1">
            <MultiSelect
              className="h-12 rmsc--ams"
              options={accountOptions}
              value={platformId}
              onChange={handleSelectedAccounts}
              labelledBy="Select Tags"
              valueRenderer={customValueRenderer}
              ClearSelectedIcon={null}
              disableSearch={true}
              
            />
          </div>
          <div className="flipkart__selectfilter z-[20] flex-1">
            <MultiSelect
              className="h-12 rmsc--ams"
              options={options.platform}
              value={platform}
              onChange={handleSelectedPlatform}
              labelledBy="Select Tags"
              valueRenderer={customValueRenderer}
              ClearSelectedIcon={null}
              disableSearch={true}
            />
          </div>
          <div className="flipkart__selectfilter z-[20] flex-1 ">
            <MultiSelect
              className="h-12 rmsc--ams"
              options={options.status}
              value={status}
              onChange={handleSelectStatus}
              labelledBy="Select Tags"
              valueRenderer={customValueRenderer}
              ClearSelectedIcon={null}
              disableSearch={true}
            />
          </div>
          <div className="relative text-gray-600 flex-1">
            <input type="search" value={search} onChange={(e) => { setSearch(e.target.value) }} name="serch" placeholder="Search by Name" className="w-full rounded-md border border-gray-300 bg-white h-8 px-5 pr-10  text-sm focus:outline-none focus:border-orange-400  focus:ring-orange-400 sm:text-sm focus:ring-1" />
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
          <WhenPermitted platform="amazon" permission={PERMISSIONS.CREATE_RULE}>
          <div className="flex justify-between">
          <button
            className="card__btn orange_btn row mb-4"
            onClick={() => setShowPopup(!showPopup)}
          >
            <div className="h-2 w-4 pt-1 pr-0.5">
              <img src="/assets/images/plus1.svg" alt="" />
            </div>
            Create Rule
          </button>

          <button
            className="card__btn orange_btn row mb-4"
            onClick={() => setShowPopupBuyBox(!showPopupBuyBox)}
          >
            <div className="h-2 w-4 pt-1 pr-0.5">
              <img src="/assets/images/plus1.svg" alt="" />
            </div>
            Buy Box
          </button>
          </div>
          </WhenPermitted>
          {showPopup && <CreateRulePopup setOpenState={setShowPopup} getRulesApi={getRulesApi} />}
          {showPopupBuyBox && <BuyBoxPopup setOpenState={setShowPopupBuyBox}/>}

          <AMAZONTABLE
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
            source={"rule"}
            customCss={true}
            accountsData={accountsData}
            tags={tags}
            getRulesApi={getRulesApi}
          />
        </div>
      </section>
      {/* <PreviewBtn/> */}
    </>
  );
};
export default Rules;
