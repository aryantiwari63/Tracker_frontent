import React from "react";
import ItemKeyword from "./ItemKeywords";
import { useDispatch, useSelector } from "react-redux";
import { getBlinkitKeywordList } from "../../../../../../../redux/action-creator/blinkit/createCampaignAction";

const SuggestedKeywords = ({
  setSelectedKeywords,
  campaignData,
  setKeywordData,
  keywordData,
}) => {
  // const keywords = [
  //   {
  //     keyword: "Sugar",
  //     searchvol: "837339",
  //   },
  //   {
  //     keyword: "Red Label",
  //     searchvol: "141234",
  //   },
  //   {
  //     keyword: "Tea Leaves",
  //     searchvol: "141234",
  //   },
  //   {
  //     keyword: "Broke Bond Taj Mahal",
  //     searchvol: "141234",
  //   },
  //   {
  //     keyword: "Red Label",
  //     searchvol: "141234",
  //   },
  //   {
  //     keyword: "Tea Leaves",
  //     searchvol: "141234",
  //   },
  //   {
  //     keyword: "Broke Bond Taj Mahal",
  //     searchvol: "141234",
  //   },
  //   {
  //     keyword: "Broke Bond Taj Mahal",
  //     searchvol: "141234",
  //   },
  //   {
  //     keyword: "Red Label",
  //     searchvol: "141234",
  //   },
  //   {
  //     keyword: "Tea Leaves",
  //     searchvol: "141234",
  //   },
  //   {
  //     keyword: "Broke Bond Taj Mahal",
  //     searchvol: "141234",
  //   },
  //   {
  //     keyword: "Red Label",
  //     searchvol: "141234",
  //   },
  //   {
  //     keyword: "Tea Leaves",
  //     searchvol: "141234",
  //   },
  // ];
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getBlinkitKeywordList({ brand: campaignData?.products }));
  }, []);
  const { keywordList } = useSelector(
    (state) => state?.BlinkitCreateCampaignReducer
  );
  // const [keywordData, setKeywordData] = React.useState([]);
  React.useEffect(() => {
    setKeywordData([...keywordList]);
  }, [keywordList]);

  const handleAddKeywords = ({
    keyword,
    searchvol,
    id,
    brand,
    max_suggested_bid,
    min_suggested_bid,
    smart_max_suggested_bid,
    smart_min_suggested_bid,
  }) => {
    setSelectedKeywords((prev) => {
      return [
        ...prev,
        {
          keyword: keyword,
          searchvol: searchvol,
          id: id,
          brand: brand,
          max_suggested_bid: max_suggested_bid,
          min_suggested_bid: min_suggested_bid,
          smart_max_suggested_bid: smart_max_suggested_bid,
          smart_min_suggested_bid: smart_min_suggested_bid,
        },
      ];
    });
    setKeywordData(keywordData.filter((item) => item.id != id));
  };
  return (
    <>
      <div className="row p-5  ">
        <h3 className="font-semibold text-xs">Suggested Keywords</h3>
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
                        brand: items.brand,
                        max_suggested_bid: items.max_suggested_bid,
                        min_suggested_bid: items.min_suggested_bid,
                        smart_max_suggested_bid: items.smart_max_suggested_bid,
                        smart_min_suggested_bid: items.smart_min_suggested_bid,
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
