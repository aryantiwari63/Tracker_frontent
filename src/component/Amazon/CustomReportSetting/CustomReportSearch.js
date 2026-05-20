/* eslint-disable */
import React, { useEffect, useMemo } from "react";
import { _GET, _POST } from "../../../services/axios.method";
import { FILTERACTION } from "../../common-components/MultiSearch/searchData";
import {
  AMAZON_ACCOUNTS,
  amazonPortfolioheader,
} from "../../../utils/amazonConstants";
import _, { flip } from "lodash";
import {
  saveLocalStorageAccounts,
  getLocalStorageAccounts,
} from "../../../utils/helpers";
import { MultiSelect } from "react-multi-select-component";
import CustomMultiSearch from "../../common-components/CustomMultiSearch/CustomMultiSearch";
import { GET_ACCOUNTS_FOR_CUSTOM_REPORT, GET_ALL_TAGS } from "../../../utils/constants";
import CustomSelect from "../../common-components/CustomSelect";
import MultiFilter from "../../common-components/MultiFilter/MultiFilter";
import {
  amazonReportFilterArr,
  blinkitReportFilterArr,
  flipkartReportFilterArr,
  instamartReportFilterArr,
  zeptoReportFilterArr,
} from "../../common-components/MultiFilter/FilterConstant";

const CustomReportSearch = ({
  setPlatformId,
  platformId,
  filters,
  setPrefilledfilters,
  prefilledfilters,
  setFilters,
  platform,
  header,
  color,
  filterAccount,
  edit,
  setAccountLoading,
  defaultFilterValue,
}) => {
  const platformListArr = useMemo(
    () => ({
      flipkart: flipkartReportFilterArr,
      amazon: amazonReportFilterArr,
      zepto: zeptoReportFilterArr,
      instamart: instamartReportFilterArr,
      blinkit: blinkitReportFilterArr,
    }),
    [platform]
  );

  const savedSearch = {};
  const [clearSearch, setClearSearch] = React.useState(false);
  const [tagList, setTagList] = React.useState([]);
  const [filterList, setFilterList] = React.useState(platformListArr[platform]);

  function applySearchFilter(sFilters, current) {
    // console.log("debugerrr current", current, sFilters);
    console.log("debugerrr>>>", sFilters, current);
    let apiFilter = {};
    let tab = "campaign";
    if (current === "tags") {
      apiFilter["tags"] = sFilters["tags"];;
      tab = "tag_name";
    } else if (
      current === "campaign_m" ||
      current === "campaign_name" ||
      current === "campaign_id"
    ) {
      apiFilter["campaign_m"] = sFilters["campaign_m"];
      let fValues = getFilterValue(["campaign_name", "status"], sFilters);
      let extraValues = {};
      if (current === "campaign_id") {
        extraValues = getFilterValue(["campaign_id"], sFilters);
      }
      apiFilter = { ...apiFilter, ...fValues, ...extraValues };
      tab = "campaign";
    } else if (current === "name" || current === "portfolio_m") {
      apiFilter["portfolio_m"] = sFilters["portfolio_m"];
      let fValues = getFilterValue(
        ["portfolio", "name", "status", "portfolio_m"],
        sFilters
      );
      apiFilter = { ...apiFilter, ...fValues };
      tab = "portfolio";
    } else if (current === "keyword_m" || current === "keyword") {
      apiFilter["keyword_m"] = sFilters["keyword_m"];
      let fValues = getFilterValue(["keyword"], sFilters);
      // console.log(fValues, "fValues");
      apiFilter = { ...apiFilter, ...fValues };
      tab = "keyword";
    } else if (current === "asin_m" || current === "asin") {
      apiFilter["asin_m"] = sFilters["asin_m"];
      let fValues = getFilterValue(["asin"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "asin";
    } else if (
      current === "ad_group_m" ||
      current === "ad_group_id" ||
      current === "ad_group_name"
    ) {
      apiFilter["ad_group_m"] = sFilters["ad_group_m"];
      let fValues = getFilterValue(["ad_group_name", "ad_group_id"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "adgroup";
    } else if (current === "search_term_m" || current === "search_term") {
      apiFilter["search_term_m"] = sFilters["search_term_m"];
      let fValues = getFilterValue(["search_term"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "search_term";
    } else if (current === "creative_m" || current === "creative") {
      apiFilter["creative_m"] = sFilters["creative_m"];
      let fValues = getFilterValue(["creative"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "creative";
    } else if (current === "placement_m" || current === "placement") {
      apiFilter["placement_m"] = sFilters["placement_m"];
      let fValues = getFilterValue(["placement"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "placement";
    } else if (current === "amazon_campaign_type") {
      apiFilter["amazon_campaign_type"] = sFilters["amazon_campaign_type"];
      let fValues = getFilterValue(["amazon_campaign_type"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "amazon_campaign_type";
    } //FLIPKART
    else if (
      current === "product_name" ||
      current === "fsn_id" ||
      current === "fsn_m"
    ) {
      apiFilter["fsn_m"] = sFilters["fsn_m"];
      let fValues = getFilterValue(["product_name", "fsn_id"], sFilters);
      // console.log("fValues>>>>>>>>>>>>>>", fValues);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "fsn";
    } else if (current === "segment") {
      apiFilter["flipkart_campaign_type"] = sFilters["segment"];
      let fValues = getFilterValue(["segment"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "flipkart_campaign_type";
    } else if (current === "platform") {
      apiFilter["flipkart_platform"] = sFilters["platform"];
      let fValues = getFilterValue(["platform"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "flipkart_platform";
    } else if (current === "campaign_status") {
      apiFilter["campaign_status"] = sFilters["campaign_status"];
      let fValues = getFilterValue(["campaign_status"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "campaign_status";
    } else if (current === "campaign_budget_type") {
      apiFilter["campaign_budget_type"] = sFilters["campaign_budget_type"];
      let fValues = getFilterValue(["campaign_budget_type"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "campaign_budget_type";
    }

    // BLINKIT
    else if (current === "category_name" || current === "category_m") {
      apiFilter["category_m"] = sFilters["category_m"];
      let fValues = getFilterValue(["category_name"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "category";
    } else if (current === "blinkit_campaign_type") {
      apiFilter["blinkit_campaign_type"] = sFilters["blinkit_campaign_type"];
      let fValues = getFilterValue(["blinkit_campaign_type"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "blinkit_campaign_type";
    }

    //ZEPTO
    else if (current === "product_name" || current === "product_m") {
      apiFilter["product_m"] = sFilters["product_m"];
      let fValues = getFilterValue(["product_name"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "product";
    } else if (current === "category" || current === "category_m") {
      apiFilter["category_m"] = sFilters["category_m"];
      let fValues = getFilterValue(["category"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "category";
    } else if (current === "zepto_campaign_type") {
      apiFilter["zepto_campaign_type"] = sFilters["zepto_campaign_type"];
      let fValues = getFilterValue(["zepto_campaign_type"], sFilters);
      apiFilter = { ...apiFilter, ...fValues };
      tab = "zepto_campaign_type";
    }
    filters[tab] = apiFilter;
    // console.log("debugerrr2>>>", filters, apiFilter);

    if (clearSearch === false) {
      setFilters({ ...filters });
      setPrefilledfilters(sFilters);
    } else {
      setFilters([]);
      setPrefilledfilters([]);
      // setClearSearch(false);
    }

    // console.log(JSON.stringify(sFilters), "filters-----", apiFilter, current);
  }
  function storeSearchFilter(filters) {
    setPrefilledfilters({ ...filters });
  }

  function getFilterValue(keys, filters) {
    let value = [];
    let keyName = "";
    filters.name_id.map((val) => {
      if (keys.indexOf(val.key) > -1) {
        value.push(val);
        keyName = val.key;
      }
    });
    // console.log("value>>>>>>>>>", value);
    return { [keyName]: value };
  }

  const [accountsData, setAccountsData] = React.useState([]);

  React.useEffect(() => {
    if (edit) {
      // let prefilledAccount = accountsData.filter((data) =>
      //   filterAccount?.includes(data.value)
      // );
      setPlatformId(filterAccount);
    }
  }, [accountsData]);

  // const handleSelectedAccounts = (selected) => {
  //   setPlatformId(selected);
  // };
  // const customValueRenderer = (selected) => {
  //   let selectedLabels = [];
  //   if (selected.length) {
  //     selected.map(({ label }) => selectedLabels.push(label));
  //   }
  //   return selectedLabels.join(",");
  // };

  const accountNames = async () => {
    try {
      const result = await _POST(GET_ACCOUNTS_FOR_CUSTOM_REPORT, {
        platform: platform,
      });
      const data = result.data.data;
      const accounts = data.map((item) => ({
        label: item.label,
        value: item.value,
      }));
      let accountsFilter = _.cloneDeep(accounts);
      let savedAccounts = getLocalStorageAccounts();
      if (_.size(savedAccounts)) {
        let firstAccount = savedAccounts[0];
        let filterAccount = accounts.find((acc) => acc.label === firstAccount);
        if (filterAccount) {
          accountsFilter = [filterAccount];
          saveLocalStorageAccounts([accountsFilter[0]?.label]);
        } else {
          saveLocalStorageAccounts([accountsFilter[0]?.label]);
        }
      } else {
        saveLocalStorageAccounts([accountsFilter[0]?.label]);
      }

      if (result?.data?.data && result.data.data?.length) {
        setPlatformId([accountsFilter[0]?.value]);
        setAccountsData(accounts);
      }
      setAccountLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (platform && (_.size(platformId) || platform === 'blinkit')) {
        try {
          const findBrand = _.find(accountsData, ele => _.get(ele, 'value') === _.first(platformId));
          let url = `${GET_ALL_TAGS}?platform=${platform}&entity=campaign`;
          if (platform !== 'blinkit') {
            url += `&account=${_.get(findBrand, 'label')}`;
          }
          const data = await _GET(url);
          const tags = _.get(data, 'data.data.result');
          const transformedTags = _.map(tags, ({ tag_name, tag_id }) => ({
            tag_name,
            tag_id
          }));
          setTagList(transformedTags)
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      }
    })();
  }, [platform, platformId]);

  useEffect(() => {
    if (_.size(tagList) && _.size(filterList)) {
      const tagFilter = filterList.find((ele) => ele.key === "tags");
      tagFilter.children = [];
      const updatedArray = filterList.map((ele) => {
        if (ele.key === "tags") {
          for (const e of tagList) {
            ele.children.push({
              label: e?.tag_name,
              key: e?.tag_id,
              action: FILTERACTION.TAG,
            });
          }
        }
        return ele;
      });
      setFilterList(updatedArray);
    }
  }, [JSON.stringify(tagList)]);
  React.useEffect(() => {
    if (platform !== "blinkit")
    accountNames();
    else {
      setAccountLoading(false);
    }
  }, []);

  function setPlatformFilter(e) {
    setPlatformId([e]);
  }

  return (
    <div className="row items-center">
      {platform !== "blinkit" && (
        <div
          className="customreport__selectfilter "
          style={{ width: "15%", paddingLeft: 0 }}
        >
          {/* <MultiSelect
            className="h-12"
            options={accountOptions}
            value={platformId}
            onChange={handleSelectedAccounts}
            labelledBy="Select Accounts"
            valueRenderer={customValueRenderer}
            ClearSelectedIcon={null}
            disableSearch={true}
          /> */}
          <CustomSelect
            label={"Select"}
            options={accountsData}
            value={platformId?.join()}
            onChange={setPlatformFilter}
            name="customreport"
            platform={platform}
            localStorageAccounts
            className="!leading-5"
          />
        </div>
      )}

      <div className="flex-1">
        <MultiFilter
          defaultValue={defaultFilterValue}
          savedSearch={savedSearch}
          arr={filterList}
          applySearchFilter={applySearchFilter}
          platform={platform}
        />
      </div>

      {/* <div
        style={{
          display: "flex",
          width: platform === "blinkit" ? "100%" : "85%",
        }}
      >
        <CustomMultiSearch
          saveSearch={savedSearch}
          applySearchFilter={applySearchFilter}
          storeSearchFilter={storeSearchFilter}
          clearSearch={clearSearch}
          setClearSearch={() => setClearSearch(false)}
          platform={platform}
          color={color}
          edit={edit}
          prefilledfilters={prefilledfilters}
        />

        <button
          type="submit"
          className={`clearbtn px-4 rounded-md py-2 border bg-white ${platform}-button flex items-center justify-center`}
          onClick={() => {
            setClearSearch(true);
          }}
        >
          Clear &nbsp;
        </button>
      </div> */}
    </div>
  );
};
export default CustomReportSearch;
