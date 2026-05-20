import React from "react";
import ItemKeyword from "./ItemKeywords";
import { useDispatch, useSelector } from "react-redux";
import { getBlinkitKeywordListForSpotLIght } from "../../../../../../../redux/action-creator/blinkit/createCampaignAction";

const SuggestedKeywords = ({
  setSelectedKeywords,
  campaignData,
  setKeywordData,
  keywordData,
}) => {
  const dispatch = useDispatch();
  const [brandedKeyword, setBrandedKeyword] = React.useState(true);
  const [genericKeyword, setGenericKeyword] = React.useState(true);
  React.useEffect(() => {
    dispatch(
      getBlinkitKeywordListForSpotLIght({
        data: campaignData?.collection[0]?.products?.map((data) => data?.id),
        type: "new",
      })
    );
  }, []);
  const { keywordListSpotlight } = useSelector(
    (state) => state?.BlinkitCreateCampaignReducer
  );
  React.useEffect(() => {
    setKeywordData([...keywordListSpotlight]);
  }, [keywordListSpotlight]);

  const handleAddKeywords = ({
    keyword,
    searchvol,
    id,
    // brand,
    min_bid,
    max_bid,
    min_suggested_bid,
    max_suggested_bid,
    smart_min_bid,
    smart_max_bid,
    smart_min_suggested_bid,
    smart_max_suggested_bid,
    exact_min_for_boost,
  }) => {
    setSelectedKeywords((prev) => {
      return [
        ...prev,
        {
          keyword: keyword,
          searchvol: searchvol,
          id: id,
          // brand: brand,
          min_bid: min_bid,
          max_bid: max_bid,
          min_suggested_bid: min_suggested_bid,
          max_suggested_bid: max_suggested_bid,
          smart_min_bid: smart_min_bid,
          smart_max_bid: smart_max_bid,
          smart_min_suggested_bid: smart_min_suggested_bid,
          smart_max_suggested_bid: smart_max_suggested_bid,
          exact_min_for_boost: exact_min_for_boost,
        },
      ];
    });
    setKeywordData(keywordData.filter((item) => item.id != id));
  };

  React.useEffect(() => {
    let data = [];

    if (brandedKeyword && !genericKeyword) {
      data = keywordListSpotlight.filter(
        (key) => key.is_brand_keyword === true
      );
    } else if (genericKeyword && !brandedKeyword) {
      data = keywordListSpotlight.filter(
        (key) => key.is_brand_keyword === false
      );
    } else if (brandedKeyword && genericKeyword) {
      data = [...keywordListSpotlight];
    }

    setKeywordData(data);
  }, [brandedKeyword, genericKeyword]);

  return (
    <>
      <div className="row p-5 bg-[#F7FFF9] rounded-2xl">
        <h3 className="font-semibold text-sm">Suggested Keywords</h3>
        <div className="row">
          <p className="text-xs">
            Pick relevant keywords from our suggestions to target in this
            campaign
          </p>
        </div>
        <div className="row items-center pt-4">
          <p className="text-xs text-gray-400 font-semibold">Filters</p>
          <div className="flex ml-4 gap-3">
            <div className="border border-gray-300 bg-white shadow-md rounded-full flex items-center py-1 px-2 text-sm text-green-600">
              Branded Keyword
              <input
                className="accent-green-600 full-checkbox mr-1 ml-2"
                type="checkbox"
                checked={brandedKeyword}
                onChange={() => {
                  setBrandedKeyword(!brandedKeyword);
                }}
              />
            </div>
            <div className="border border-gray-300 bg-white shadow-md rounded-full flex items-center py-1 px-2 text-sm text-green-600">
              Generic Keyword
              <input
                className="accent-green-600 full-checkbox mr-1 ml-2"
                type="checkbox"
                checked={genericKeyword}
                onChange={() => {
                  setGenericKeyword(!genericKeyword);
                }}
              />
            </div>
          </div>
        </div>
        <div className="row pt-4">
          {keywordData &&
            keywordData.length &&
            keywordData?.map((items) => {
              return (
                <>
                  <ItemKeyword
                    item={items.keyword}
                    searchvol={items.searchvol}
                    onClick={() =>
                      handleAddKeywords({
                        keyword: items.keyword,
                        searchvol: items.searchvol,
                        id: items.id,
                        // brand: items.brand,
                        min_bid: items.min_bid,
                        max_bid: items.max_bid,
                        min_suggested_bid: items.min_suggested_bid,
                        max_suggested_bid: items.max_suggested_bid,
                        smart_min_bid: items.smart_min_bid,
                        smart_max_bid: items.smart_max_bid,
                        smart_min_suggested_bid: items.smart_min_suggested_bid,
                        smart_max_suggested_bid: items.smart_max_suggested_bid,
                        exact_min_for_boost: items.exact_min_for_boost,
                      })
                    }
                  />
                </>
              );
            })}
        </div>
        <div className="text-gray-400 text-xs px-2">
          *Approximate no. of searches in last 30 days
        </div>
      </div>
    </>
  );
};
export default SuggestedKeywords;
