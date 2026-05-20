import React from "react";
import ItemKeyword from "./ItemKeywords";
import { useDispatch, useSelector } from "react-redux";
import { getInstamartKeywordList } from "../../../../../../../redux/action-creator/instamart/createCampaignAction";
import { v4 as uuidv4 } from "uuid";

const SuggestedKeywords = ({
  setSelectedKeywords,
  campaignData,
  setKeywordData,
  keywordData,
}) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.products &&
      campaignData?.products?.length
    ) {
      dispatch(getInstamartKeywordList({ brand: campaignData?.products }));
    }
  }, [campaignData?.products]);
  const { instamartkeywordList } = useSelector(
    (state) => state?.InstamartCreateCampaignReducer
  );
  React.useEffect(() => {
    setKeywordData([...instamartkeywordList]);
  }, [instamartkeywordList]);

  const handleAddKeywords = ({
    keywordtext,
    exact_minimumbid,
    exact_suggestedlowerbid,
    exact_suggestedupperbid,
    exact_highestactivebid,
    broad_minimumbid,
    broad_suggestedlowerbid,
    broad_suggestedupperbid,
    broad_highestactivebid,
    exact_searchcount,
    broad_searchcount,
    product_id,
    account_id,
  }) => {
    setSelectedKeywords((prev) => {
      return [
        ...prev,
        {
          keywordtext: keywordtext,
          exact_minimumbid: exact_minimumbid,
          exact_suggestedlowerbid: exact_suggestedlowerbid,
          exact_suggestedupperbid: exact_suggestedupperbid,
          exact_highestactivebid: exact_highestactivebid,
          broad_minimumbid: broad_minimumbid,
          broad_suggestedlowerbid: broad_suggestedlowerbid,
          broad_suggestedupperbid: broad_suggestedupperbid,
          broad_highestactivebid: broad_highestactivebid,
          exact_searchcount: exact_searchcount,
          broad_searchcount: broad_searchcount,
          product_id: product_id,
          account_id: account_id,
          match: "broad",
          id: uuidv4(),
        },
      ];
    });
    setKeywordData(
      keywordData.filter((item) => item.keywordtext != keywordtext)
    );
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
                    item={items.keywordtext}
                    searchvol={items.broad_searchcount}
                    onClick={() =>
                      handleAddKeywords({
                        keywordtext: items.keywordtext,
                        exact_minimumbid: items.exact_minimumbid,
                        exact_suggestedlowerbid: items.exact_suggestedlowerbid,
                        exact_suggestedupperbid: items.exact_suggestedupperbid,
                        exact_highestactivebid: items.exact_highestactivebid,
                        broad_minimumbid: items.broad_minimumbid,
                        broad_suggestedlowerbid: items.broad_suggestedlowerbid,
                        broad_suggestedupperbid: items.broad_suggestedupperbid,
                        broad_highestactivebid: items.broad_highestactivebid,
                        exact_searchcount: items.exact_searchcount,
                        broad_searchcount: items.broad_searchcount,
                        product_id: items.product_id,
                        account_id: items.account_id,
                      })
                    }
                  />
                </>
              );
            })}
        </div>
        {/* <div className="text-gray-400 text-xs px-2">
          *Approximate no. of searches in last 30 days
        </div> */}
      </div>
    </>
  );
};
export default SuggestedKeywords;
