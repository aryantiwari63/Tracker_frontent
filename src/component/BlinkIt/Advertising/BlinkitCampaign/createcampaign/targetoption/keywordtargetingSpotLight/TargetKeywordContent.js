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
  const [newKeywordData, setNewKeywordData] = useState([]);
  // const [updateKeywordData, setUpdateKeywordData] = useState([]);

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
    if (
      (Number(data) < Number(min) || Number(data) > Number(max)) &&
      min &&
      max
    ) {
      setInputKeywordError([...inputKeywordError, id]);
    } else {
      let updatedIds = inputKeywordError.filter((item) => item !== id);

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
    if (Number(data) < Number(min) || Number(data) > Number(max)) {
      setInputSmartKeywordError([...inputSmartKeywordError, id]);
    } else {
      let updatedIds = inputSmartKeywordError.filter((item) => item !== id);

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

  const handleActive = (check, id) => {
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

  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      active: active,
    });
  }, [active]);

  const [initialSet, setInitialSet] = React.useState(true);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.active &&
      campaignData?.active?.length &&
      initialSet
    ) {
      setTimeout(() => {
        setActive(campaignData?.active);
      }, [1000]);
      setInitialSet(false);
    }
  }, [campaignData]);

  return (
    <div className="flex-[0.5] p-2 flex flex-col border bg-[#F7FFF9] rounded-2xl">
      <h3 className="font-semibold text-sm">Selected Keywords</h3>
      <p className="text-xs">Your selected keywords will appear here</p>
      <div className="grid grid-cols-4 mt-2 text-gray-800 bg-gray-200 font-semibold py-2 text-center rounded-t-2xl">
        <div className="text-left pl-8">Keyword</div>
        <div className="col-span-2">Exact Match Bid</div>
        <div>
          Smart Match Bid{" "}
          <div className="flex justify-center tooltip-container">
            <span
              role="img"
              aria-label="question-circle"
              className="fas fa-question-circle"
            />
            <span className="tooltip-text !left-[-250px]">
              Smart match targets broad intent that cover your specific keyword
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
            <div className="flex flex-col justify-center items-center gap-1 col-span-2">
              {items.min_suggested_bid ? (
                <div className="w-fit text-[11px] px-2 rounded-lg  bg-blue-200 border mx-auto border-blue-700 text-blue-950">
                  Suggested top bid range{" "}
                  {`${items.min_suggested_bid}-${items.max_suggested_bid}`}
                </div>
              ) : null}

              <input
                type="number"
                placeholder="Enter CPM Bid Value"
                className="text-[10px] px-3 border w-[70%] rounded py-1.5 outline-none"
                value={
                  campaignData?.keywords?.filter(
                    (data) => data.id == items?.id
                  )[0]?.cpm
                    ? campaignData?.keywords?.filter(
                        (data) => data.id == items?.id
                      )[0]?.cpm
                    : ""
                }
                min={Number(items?.min_bid)}
                onChange={(e) =>
                  handleCPM(
                    e.target.value,
                    items?.id,
                    items.min_bid,
                    items.max_bid
                  )
                }
              />

              {inputKeywordError.includes(items?.id) && (
                <p className={`text-[11px] errorText`}>
                  {` please enter value between ${items.min_bid} and ${items?.max_bid}`}
                </p>
              )}
            </div>

            <div className=" flex flex-col justify-center items-center gap-1">
              {active.includes(items?.id) ? (
                items.smart_min_suggested_bid ? (
                  <div className="w-fit text-[11px] px-2 rounded-lg  bg-blue-200 border mx-auto border-blue-700 text-blue-950">
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
                  className={`errorText text-xs`}
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
