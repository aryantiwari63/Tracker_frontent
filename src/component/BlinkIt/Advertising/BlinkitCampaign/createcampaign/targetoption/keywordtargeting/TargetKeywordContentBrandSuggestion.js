import React, { useState } from "react";

const TargetKeywordContentBrandSuggestion = ({
  selectedKeywords,
  setSelectedKeywords,
  setCampaignData,
  campaignData,
  inputKeywordError,
  setInputKeywordError,
  setKeywordData,
  keywordData,
}) => {
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
  const [initialKeywordSet, setInitialKeywordSet] = React.useState(true);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.keywords &&
      campaignData?.keywords?.length &&
      initialKeywordSet
    ) {
      setTimeout(() => {
        setSelectedKeywords(campaignData?.keywords);
      }, [1000]);
      setInitialKeywordSet(false);
    }
  }, [campaignData]);

  return (
    <div className="flex-[0.5] p-2 flex flex-col border bg-[#F7FFF9] rounded-2xl">
      <h3 className="font-semibold text-sm">Selected Keywords</h3>
      <p className="text-xs">Your selected keywords will appear here</p>
      <div className="grid grid-cols-4 mt-2 text-gray-800 bg-gray-200 font-semibold py-2 text-center rounded-t-2xl">
        <div className="text-left pl-8">Keyword</div>
        <div>Exact Match Bid</div>
      </div>

      <div className="max-h-[420px] overflow-y-auto rounded-2xl">
        {newKeywordData?.map((items, index) => (
          <div
            key={index}
            className="grid grid-cols-4 text-center py-2 bg-white h-[80px]"
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
            <div className="flex items-center justify-center flex-col">
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
          </div>
        ))}
      </div>
    </div>
  );
};
export default TargetKeywordContentBrandSuggestion;
