import React, { useState } from "react";

const TargetKeywordContent = ({
  selectedKeywords,
  setSelectedKeywords,
  setCampaignData,
  campaignData,
  inputKeywordError,
  setInputKeywordError,
  inputSmartKeywordError,
  setInputSmartKeywordError,
  setKeywordData,
  keywordData,
}) => {
  const [active, setActive] = useState([]);
  const [activeBoost, setActiveBoost] = useState([]);
  const [newKeywordData, setNewKeywordData] = useState([]);

  const handleDelete = (data) => {
    setSelectedKeywords((prev) => {
      return prev.filter((item) => item.id !== data.id);
    });
    // setSelectedKeywords((prev) => {
    //   return prev.filter((item) => item.id !== data.id);
    // });
    // eslint-disable-next-line no-console
    // console.log("campaignData data", data);

    if (data && data.searchvol) {
      setKeywordData([...keywordData, data]);
    }
  };
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log(
    //   "campaignData selectedKeywords 00",
    //   selectedKeywords,
    //   selectedKeywords.length
    // );
    if (selectedKeywords && selectedKeywords?.length >= 0) {
      // eslint-disable-next-line no-console
      // console.log("campaignData newKeywordData inside 0", selectedKeywords);
      if (campaignData?.keywords && campaignData?.keywords?.length) {
        let campaignIds = new Set(campaignData?.keywords?.map((obj) => obj.id));
        let newAddedKeyword = selectedKeywords.filter(
          (obj) => !campaignIds.has(obj.id)
        );

        let selectedKeyIds = new Set(selectedKeywords?.map((obj) => obj.id));

        let campaignDatakeywords = campaignData.keywords.filter((obj) =>
          selectedKeyIds.has(obj.id)
        );
        // eslint-disable-next-line no-console
        // console.log("campaignData newKeywordData inside 1", newAddedKeyword);
        setNewKeywordData([...campaignDatakeywords, ...newAddedKeyword]);
      } else {
        setNewKeywordData([...selectedKeywords]);
        //eslint-disable-next-line no-console
        // console.log("campaignData newKeywordData inside 2", [
        //   ...selectedKeywords,
        // ]);
      }
    }
  }, [selectedKeywords]);
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log("campaignData newKeywordData", newKeywordData);

    setCampaignData({
      ...campaignData,
      keywords: newKeywordData,
    });
  }, [newKeywordData]);

  React.useEffect(() => {
    // console.log("campaignData data123 inputKeywordError", inputKeywordError);
  }, [inputKeywordError]);

  const handleCPM = (data, id, min, max) => {
    // console.log("campaignData data123", data, i);
    if (
      (Number(data) < Number(min) || Number(data) > Number(max)) &&
      min &&
      max
    ) {
      setInputKeywordError([...inputKeywordError, id]);
    } else {
      let updatedIds = inputKeywordError.filter((item) => item !== id);
      // console.log("campaignData updatedIds 12", updatedIds);

      setInputKeywordError(updatedIds);
    }
    let tempData = campaignData?.keywords;
    let result = tempData.map(function (item) {
      var o = Object.assign({}, item);
      if (item.id == id) {
        o.cpm = data;
      }
      return o;
    });

    setCampaignData({
      ...campaignData,
      keywords: result,
      keywordsCpmChange:
        (Number(campaignData?.keywordsCpmChange)
          ? Number(campaignData?.keywordsCpmChange)
          : 1) + 1,
    });
  };

  const handleSmartCPM = (data, id, min, max) => {
    // console.log("campaignData data123", data, i);
    if (Number(data) < Number(min) || Number(data) > Number(max)) {
      setInputSmartKeywordError([...inputSmartKeywordError, id]);
    } else {
      let updatedIds = inputSmartKeywordError.filter((item) => item !== id);
      // console.log("campaignData updatedIds 12", updatedIds);

      setInputSmartKeywordError(updatedIds);
    }
    let tempData = campaignData?.keywords;
    let result = tempData.map(function (item) {
      var o = Object.assign({}, item);
      if (item.id == id) {
        o.smartcpm = data;
      }
      return o;
    });

    setCampaignData({
      ...campaignData,
      keywords: result,
    });
  };
  const handleBoostValue = (data, id) => {
    // console.log("campaignData data123", data, i);
    if (Number(data) <= 50) {
      let tempData = campaignData?.keywords;
      let result = tempData.map(function (item) {
        var o = Object.assign({}, item);
        if (item.id == id) {
          o.boostvalue = data;
        }
        return o;
      });

      setCampaignData({
        ...campaignData,
        keywords: result,
      });
    }
  };
  const handleActive = (check, id) => {
    // console.log("campaignData check", check, id);
    if (check) {
      setActive([...active, id]);
    } else {
      setActive((prev) => {
        return prev.filter((item) => item !== id);
      });
      let tempData = campaignData?.keywords;
      let result = tempData.map(function (item) {
        var o = Object.assign({}, item);
        if (item.id == id) {
          o.smartcpm = undefined;
        }
        return o;
      });

      setCampaignData({
        ...campaignData,
        keywords: result,
      });
    }
  };
  const handleBoost = (check, id) => {
    // console.log("campaignData check", check, id);
    if (check) {
      setActiveBoost([...activeBoost, id]);
    } else {
      setActiveBoost((prev) => {
        return prev.filter((item) => item !== id);
      });
    }
    let tempData = campaignData?.keywords;
    let result = tempData.map(function (item) {
      var o = Object.assign({}, item);
      if (item.id == id) {
        o.cpm = "";
      }
      return o;
    });

    setCampaignData({
      ...campaignData,
      keywords: result,
    });
    let updatedIds = inputKeywordError.filter((item) => item !== id);

    setInputKeywordError(updatedIds);
  };
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      active: active,
      activeSmartCpm: active,
    });
  }, [active]);
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      activeBoostData: activeBoost,
    });
  }, [activeBoost]);

  const [initialSet, setInitialSet] = React.useState(true);
  const [initialBoostSet, setInitialBoostSet] = React.useState(true);
  // const [initialKeywordSet, setInitialKeywordSet] = React.useState(true);
  React.useEffect(() => {
    // if (
    //   campaignData &&
    //   campaignData?.keywords &&
    //   campaignData?.keywords?.length &&
    //   initialKeywordSet
    // ) {
    //   setTimeout(() => {
    //     setSelectedKeywords(campaignData?.keywords);
    //   }, [1000]);
    //   setInitialKeywordSet(false);
    // }
    if (
      campaignData &&
      campaignData?.activeSmartCpm &&
      campaignData?.activeSmartCpm?.length &&
      initialSet
    ) {
      setTimeout(() => {
        setActive(campaignData?.activeSmartCpm);
      }, [1000]);
      setInitialSet(false);
    }
    if (
      campaignData &&
      campaignData?.activeBoostData &&
      campaignData?.activeBoostData?.length &&
      initialBoostSet
    ) {
      setTimeout(() => {
        setActiveBoost(campaignData?.activeBoostData);
      }, [1000]);
      setInitialBoostSet(false);
    }
  }, [campaignData]);

  return (
    <div className="flex-[0.55] p-2 flex flex-col border bg-[#F7FFF9] rounded-2xl">
      <h3 className="font-semibold text-sm">Selected Keywords</h3>
      <p className="text-xs">Your selected keywords will appear here</p>
      <div className="grid grid-cols-4 mt-2 text-gray-800 bg-gray-100 font-semibold py-2 text-center rounded-t-2xl">
        <div className="text-left pl-8">Keyword</div>
        <div>Exact Match Bid</div>
        <div className="flex justify-center items-center">
          <div className="bg-[#256FEF] rounded-md text-white w-[80%]">
            Bid Booster
          </div>
        </div>
        <div>
          Smart Match Bid{" "}
          <div className="flex justify-center tooltip-container">
            <span
              role="img"
              aria-label="question-circle"
              className="fas fa-question-circle"
            />
            <span className="tooltip-text !left-[-250px]">
              Smart match targets broad in tent that cover your specific keyword{" "}
              {"'"}s intent. For example, bidding on {'"'}mustard oil{'"'} with
              smart match turned on will show your product on searches such as
              {'"'}oil{'"'} and {'"'}mustard{'"'}.
            </span>
          </div>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto rounded-2xl">
        {newKeywordData?.map((items, index) => (
          <div
            key={index}
            className="grid grid-cols-4 text-center py-2 bg-white h-[100px]"
          >
            <div className="flex items-center">
              <buton
                className=" ml-2 mr-3 cursor-pointer block text-red-500"
                onClick={() => handleDelete(items)}
              >
                x
              </buton>

              <div className="text-left">
                <p className="font-semibold text-black">{items.keyword}</p>
                {items.searchvol > 0 && (
                  <div className="text-xs text-gray-400">
                    {" "}
                    {items.searchvol} searches
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-2">
              {items.min_suggested_bid ? (
                <div className="w-fit text-[11px] leading-3 px-2 rounded-lg  bg-blue-200 border mx-auto border-blue-700 text-blue-950">
                  Suggested top bid range{" "}
                  {`${items.min_suggested_bid}-${items.max_suggested_bid}`}
                </div>
              ) : null}
              <input
                type="number"
                placeholder="Enter CPM Bid Value"
                className="text-[10px] px-3 border w-[70%] rounded py-1 outline-none"
                value={
                  campaignData?.keywords?.filter(
                    (data) => data.id == items?.id
                  )[0]?.cpm
                    ? campaignData?.keywords?.filter(
                        (data) => data.id == items?.id
                      )[0]?.cpm
                    : ""
                }
                min={
                  activeBoost.includes(items?.id)
                    ? Number(
                        items?.exact_min_for_boost
                          ? items?.exact_min_for_boost
                          : 251
                      )
                    : Number(items?.min_bid)
                }
                onChange={(e) =>
                  handleCPM(
                    e.target.value,
                    items?.id,
                    activeBoost.includes(items?.id)
                      ? items?.exact_min_for_boost
                        ? items?.exact_min_for_boost
                        : 251
                      : items.min_bid,
                    items.max_bid
                  )
                }
              />

              {inputKeywordError.includes(items?.id) && (
                <p className={`text-[11px] leading-3 errorText`}>
                  {` please enter value between ${
                    activeBoost.includes(items?.id)
                      ? items?.exact_min_for_boost
                        ? items?.exact_min_for_boost
                        : 251
                      : items.min_bid
                  } and ${items?.max_bid}`}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-center items-center">
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  onChange={(e) => handleBoost(e.target.checked, items?.id)}
                  // checked={active.includes(items?.id)}
                  className="blinkit_product_custom-checkbox full-checkbox mr-1"
                  checked={activeBoost.includes(items?.id)}
                />
                <div className="flex text-sm justify-center items-center">
                  Boost my bid
                </div>
              </div>
              {activeBoost.includes(items?.id) ? (
                <input
                  type="number"
                  disabled={!activeBoost.includes(items?.id)}
                  placeholder="Upto"
                  className="text-[10px] px-2 w-[50%] rounded py-1 bg-gray-100 outline-none"
                  min={0}
                  max={50}
                  value={
                    campaignData?.keywords?.filter(
                      (data) => data.id == items?.id
                    )[0]?.boostvalue
                      ? campaignData?.keywords?.filter(
                          (data) => data.id == items?.id
                        )[0]?.boostvalue
                      : ""
                  }
                  onChange={(e) => handleBoostValue(e.target.value, items?.id)}
                />
              ) : (
                ""
              )}
              {
                <div
                  className={`${
                    activeBoost.includes(items?.id) &&
                    !campaignData?.keywords?.filter(
                      (data) => data.id == items?.id
                    )[0]?.boostvalue
                      ? "errorText"
                      : "text-transparent"
                  } text-xs`}
                >
                  please enter boost value
                </div>
              }
            </div>

            <div className=" flex flex-col justify-center gap-2 items-center">
              {active.includes(items?.id) ? (
                items.smart_min_suggested_bid ? (
                  <div className="w-fit text-[11px] leading-3 px-2 mt-1 rounded-lg  bg-blue-200 border mx-auto border-blue-700 text-blue-950">
                    Suggested top bid range{" "}
                    {`${items.smart_min_suggested_bid}-${items.smart_max_suggested_bid}`}
                  </div>
                ) : null
              ) : null}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="blinkit_product_custom-checkbox full-checkbox mr-1 ml-2"
                  onChange={(e) => handleActive(e.target.checked, items?.id)}
                  checked={active.includes(items?.id)}
                />
                <input
                  type="number"
                  disabled={!active.includes(items?.id)}
                  placeholder="Enter CPM Bid Value"
                  className="text-[10px] px-2 rounded py-1 bg-gray-100 outline-none"
                  min={Number(items?.smart_min_bid)}
                  max={Number(items?.smart_max_bid)}
                  // value={campaignData?.keywords?.[i]?.smartcpm}
                  value={
                    campaignData?.keywords?.filter(
                      (data) => data.id == items?.id
                    )[0]?.smartcpm
                      ? campaignData?.keywords?.filter(
                          (data) => data.id == items?.id
                        )[0]?.smartcpm
                      : ""
                  }
                  onChange={(e) =>
                    handleSmartCPM(
                      e.target.value,
                      items?.id,
                      items.smart_min_bid,
                      items.smart_max_bid
                    )
                  }
                />
              </div>

              {inputSmartKeywordError.includes(items?.id) && (
                <p
                  className={`errorText text-[11px] leading-3`}
                >{` please enter value between ${items?.smart_min_bid} and ${items?.smart_max_bid}`}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TargetKeywordContent;
