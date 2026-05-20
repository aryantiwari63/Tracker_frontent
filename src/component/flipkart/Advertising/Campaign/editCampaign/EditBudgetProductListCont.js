import React, { useState } from "react";
import EditIncrementDecrementBtn from "./EditIncrementDecrementBtn";
import EditKeywordsTargeting from "./keywordtargeting";

const EditBudgetProductListCont = ({
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [showKeyword, setShowKeyword] = useState(false);
  const [addKeyword, setAddKeyword] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [showLimit, setShowLimit] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showPlacement, setShowPlacement] = useState(false);
  const [topSearch, setTopSearch] = useState(7.62);
  const [restSearch, setRestSearch] = useState(7.62);
  const [browseSearch, setBrowseSearch] = useState(7.62);
  const [restBrowse, setRestBrowse] = useState(7.62);
  const [topSearchCount, setTopSearchCount] = useState(0);
  const [restSearchCount, setRestSearchCount] = useState(0);
  const [topBrowseCount, setTopBrowseCount] = useState(0);
  const [restBrowseCount, setRestBrowseCount] = useState(0);
  const [broadKeys, setBroadKeys] = useState([]);
  const [exactKeys, setExactKeys] = useState([]);
  const [error, setError] = useState("");
  const [uploadedKeywords, setUploadedKeywords] = useState([]);

  let currency = localStorage.getItem("currency");

  const percentCalculate = (num, percentage) => {
    if (percentage > 0) {
      let percentageChange = num * (percentage / 100);
      let result = Number(num) + Number(percentageChange.toFixed(1));
      return result.toFixed(2);
    } else {
      return num;
    }
  };
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      topSearchCount: topSearchCount ? topSearchCount : null,
      restSearchCount: restSearchCount ? restSearchCount : null,
      topBrowseCount: topBrowseCount ? topBrowseCount : null,
      restBrowseCount: restBrowseCount ? restBrowseCount : null,
    });
  }, [topSearchCount, restSearchCount, topBrowseCount, restBrowseCount]);
  React.useEffect(() => {
    setError("");
    setTopSearch(campaignData?.cost_per_basket);
    setRestSearch(campaignData?.cost_per_basket);
    setBrowseSearch(campaignData?.cost_per_basket);
    setRestBrowse(campaignData?.cost_per_basket);
  }, [campaignData?.cost_per_basket]);
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      top_of_search_page: percentCalculate(topSearch, topSearchCount),
      rest_of_search_page: percentCalculate(restSearch, restSearchCount),
      top_of_browse_page: percentCalculate(browseSearch, topBrowseCount),
      rest_of_browse_page: percentCalculate(restBrowse, restBrowseCount),
    });
  }, [topSearchCount && topSearchCount]);
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      top_of_search_page: percentCalculate(topSearch, topSearchCount),
      rest_of_search_page: percentCalculate(restSearch, restSearchCount),
      top_of_browse_page: percentCalculate(browseSearch, topBrowseCount),
      rest_of_browse_page: percentCalculate(restBrowse, restBrowseCount),
    });
  }, [restSearchCount]);
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      top_of_search_page: percentCalculate(topSearch, topSearchCount),
      rest_of_search_page: percentCalculate(restSearch, restSearchCount),
      top_of_browse_page: percentCalculate(browseSearch, topBrowseCount),
      rest_of_browse_page: percentCalculate(restBrowse, restBrowseCount),
    });
  }, [topBrowseCount]);
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      top_of_search_page: percentCalculate(topSearch, topSearchCount),
      rest_of_search_page: percentCalculate(restSearch, restSearchCount),
      top_of_browse_page: percentCalculate(browseSearch, topBrowseCount),
      rest_of_browse_page: percentCalculate(restBrowse, restBrowseCount),
    });
  }, [restBrowseCount]);

  return (
    <>
      <div className="productlistcontainer">
        <div className="productlistcontainer__header ">
          <div className="col_3">Ad Groups</div>
          <div className="col_3">CPC (Cost Per Click)</div>
          <div className="col_3">Budget Limit (optional)</div>
          <div className="col_3">Advanced targeting (Optional)</div>
        </div>
        <div className="productlistcontainer__body row pt-4">
          <div className="col_3 productlistcontainer__cat">
            {/* Category {campaignData && campaignData?.category ? campaignData?.category : null} */}
            <div className="row items-center  pt-2">
              <div className="status">Draft</div>
              <div className="cursor-pointer text-blue-700 pl-2 text-xs">
                {campaignData && campaignData?.products
                  ? campaignData?.products.length
                  : null}{" "}
                Products
              </div>
            </div>
          </div>
          <div className="col_3 ">
            <div className="col_5">
              <input
                type="number"
                id="cost_per_basket"
                name="cost_per_basket"
                min="7.62"
                // max="5"
                className="border p-1 w-full border-gray-300 rounded-md outline-none"
                onChange={handleChange}
                value={campaignData?.cost_per_basket}
                disabled
              />
            </div>
            {error && <p className="errorText">{error}</p>}
            <div className="CPBbid">Min bid : 7.62</div>
          </div>
          <div className="col_3 ">
            <div
              className="cursor-pointer text-blue-700 py-1"
              // onClick={() => setShowLimit(!showLimit)}
            >
              +Set Limit
            </div>
            {showLimit ? (
              <div className="col_5">
                <input
                  type="number"
                  id="budget_limit"
                  name="budget_limit"
                  min="0"
                  // max="5"
                  className="border p-1.5 border-gray-300 rounded-md outline-none w-full"
                  onChange={handleChange}
                  value={campaignData.budget_limit}
                  disabled
                />
              </div>
            ) : null}
          </div>
          {addKeyword ? (
            <div className="col_3">
              <button
                className="cursor-pointer text-blue-700"
                onClick={() => setShowKeyword(!showKeyword)}
              >
                +Add Keywords
              </button>
              <p>Keyword targeting is applicable only on search pages</p>
              <div className="bg-green-200">
                {showKeyword && (
                  <EditKeywordsTargeting
                    setShowKeyword={setShowKeyword}
                    setBroadKeys={setBroadKeys}
                    broadKeys={broadKeys}
                    setExactKeys={setExactKeys}
                    exactKeys={exactKeys}
                    setUploadedKeywords={setUploadedKeywords}
                    uploadedKeywords={uploadedKeywords}
                    setAddKeyword={setAddKeyword}
                    setCampaignData={setCampaignData}
                    campaignData={campaignData}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="productlistcontainer__box">
              <div className="row  productlistcontainer__fields">
                keywords:{broadKeys.length + exactKeys.length}
              </div>
              <div className="row  productlistcontainer__fields">
                Broad Keywords:
                {broadKeys.length}
              </div>
              <div className="row  productlistcontainer__fields">
                Exact Keywords:
                {exactKeys.length}
              </div>
            </div>
          )}
          <div
            className="col_9 ml-auto mr-0 text-blue-700 cursor-pointer"
            // onClick={() =>
            //   campaignData.cost_per_basket
            //     ? setShowPlacement(!showPlacement)
            //     : setError("Please select Min bid")
            // }
          >
            Adjust bid by placement
            <img src="/assets/images/up.svg" alt="" className="inline pl-1.5" />
          </div>
        </div>
        <div className="productlistcontainer__percentageTable row">
          <div className="col_6 mx-auto">
            {showPlacement ? (
              <div className="productlistcontainer__box">
                <div className="row  productlistcontainer__fields">
                  <div className="col_6">Top of Search Page</div>
                  <div className="col_2">
                    {currency}
                    {percentCalculate(topSearch, topSearchCount)}
                  </div>
                  <div className="col_4">
                    <EditIncrementDecrementBtn
                      count={topSearchCount}
                      setCount={setTopSearchCount}
                    />
                  </div>
                </div>
                <div className="row  productlistcontainer__fields">
                  <div className="col_6">Rest of Search Page</div>
                  <div className="col_2">
                    {currency}
                    {percentCalculate(restSearch, restSearchCount)}
                  </div>
                  <div className="col_4">
                    <EditIncrementDecrementBtn
                      count={restSearchCount}
                      setCount={setRestSearchCount}
                    />
                  </div>
                </div>
                <div className="row productlistcontainer__fields">
                  <div className="col_6">Top of Browse Page</div>
                  <div className="col_2">
                    {currency}
                    {percentCalculate(browseSearch, topBrowseCount)}
                  </div>
                  <div className="col_4">
                    <EditIncrementDecrementBtn
                      count={topBrowseCount}
                      setCount={setTopBrowseCount}
                    />
                  </div>
                </div>
                <div className="row productlistcontainer__fields">
                  <div className="col_6">Rest of Browse Page</div>
                  <div className="col_2">
                    {currency}
                    {percentCalculate(restBrowse, restBrowseCount)}
                  </div>
                  <div className="col_4">
                    <EditIncrementDecrementBtn
                      count={restBrowseCount}
                      setCount={setRestBrowseCount}
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <div className="col_12 ">
              <label className="">
                <input
                  type="checkbox"
                  id="apply_same"
                  name="apply_same"
                  onChange={handleChange}
                  value={
                    campaignData && campaignData?.apply_same
                      ? campaignData?.apply_same
                      : "1"
                  }
                  disabled
                />
                <div className=" productlist__checkapply">
                  {" "}
                  Apply same percentages to all adgroups
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBudgetProductListCont;
