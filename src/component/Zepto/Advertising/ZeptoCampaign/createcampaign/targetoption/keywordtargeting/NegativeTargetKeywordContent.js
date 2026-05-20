import React, { useState } from "react";

const NegativeTargetKeywordContent = ({
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

  const handleDelete = (data) => {
    setSelectedKeywords((prev) => {
      return prev.filter((item) => item.id !== data.id);
    });
    if (data && data.searchvol) {
      setKeywordData([...keywordData, data]);
    }
  };
  React.useEffect(() => {
    // console.log("campaignData selectedKeywords", selectedKeywords);
    if (selectedKeywords.length) {
      setCampaignData({
        ...campaignData,
        keywords: selectedKeywords,
      });
    }
  }, [selectedKeywords]);
  React.useEffect(() => {
    // console.log("campaignData data123 inputKeywordError", inputKeywordError);
  }, [inputKeywordError]);

  const handleCPM = (data, id, min, max) => {
    // console.log("campaignData data123", data, i);
    if (Number(data) < Number(min) || Number(data) > Number(max)) {
      setInputKeywordError([...inputKeywordError, id]);
    } else {
      let updatedIds = inputKeywordError.filter((item) => item !== id);
      // console.log("campaignData updatedIds 12", updatedIds);

      setInputKeywordError(updatedIds);
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
    }
  };
  const handleSmartCPM = (data, id, min, max) => {
    // console.log("campaignData data123", data, i);
    if (Number(data) < Number(min) || Number(data) > Number(max)) {
      setInputSmartKeywordError([...inputSmartKeywordError, id]);
    } else {
      let updatedIds = inputSmartKeywordError.filter((item) => item !== id);
      // console.log("campaignData updatedIds 12", updatedIds);

      setInputSmartKeywordError(updatedIds);
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
    }

    // selectedKeywords[i].smartcpm = data;

    // setCampaignData({
    //   ...campaignData,
    //   keywords: selectedKeywords,
    // });
  };
  const handleActive = (check, id) => {
    // console.log("campaignData check", check, id);
    if (check) {
      setActive([...active, id]);
    } else {
      setActive((prev) => {
        return prev.filter((item) => item !== id);
      });
    }
  };
  React.useEffect(() => {
    // console.log("campaignData active", active);

    setCampaignData({
      ...campaignData,
      active: active,
    });
  }, [active]);
  // React.useEffect(() => {
  //   console.log(
  //     "campaignData key123",
  //     campaignData?.keywords?.filter((data) => data.id == "10")[0]?.cpm
  //   );
  // }, [campaignData?.keywords]);
  return (
    <>
      <div>
        <div className="">
          <table className="w-full targetKeyword__table">
            <thead className="h-[30px] bg-gray-200 text-center text-gray-400 pl-4">
              <tr className="">
                <th></th>
                <th className="text-left">Keyword</th>
                <th>Exact Match CPM Bid</th>
                <th>Smart Match</th>
                <th>Smart Match CPM Bid</th>
              </tr>
            </thead>
            <tbody className="keywordcontent_table">
              {selectedKeywords.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    Add new keywords or choose from the suggested keywords
                  </td>
                </tr>
              )}
              {selectedKeywords?.map((items) => {
                return (
                  <>
                    <tr className="text-center border-b h-[50px]">
                      <td className="w-5 ">
                        <buton
                          className="  cursor-pointer block"
                          onClick={() => handleDelete(items)}
                        >
                          x
                        </buton>
                      </td>

                      <td className="text-left py-5">
                        <div>
                          <p className="font-bold text-black">
                            {items.keyword}
                          </p>
                          {items.searchvol > 0 && (
                            <p> {items.searchvol} searches</p>
                          )}
                        </div>
                      </td>

                      <td>
                        <div>
                          <input
                            type="number"
                            placeholder="Enter CPM Bid Value"
                            className="text-[10px] px-2 rounded py-1 outline-none"
                            // value={campaignData?.keywords?.[i]?.cpm}
                            value={
                              campaignData?.keywords?.filter(
                                (data) => data.id == items?.id
                              )[0]?.cpm
                                ? campaignData?.keywords?.filter(
                                    (data) => data.id == items?.id
                                  )[0]?.cpm
                                : ""
                            }
                            min={Number(items?.min_suggested_bid)}
                            onChange={(e) =>
                              handleCPM(
                                e.target.value,
                                items?.id,
                                items.min_suggested_bid,
                                items.max_suggested_bid
                              )
                            }
                          />
                          {inputKeywordError?.includes(items?.id) && (
                            <p className="errorText">{` please enter value between ${items?.min_suggested_bid} and ${items?.max_suggested_bid}`}</p>
                          )}
                          {items.min_suggested_bid ? (
                            <div className="w-fit px-2 mt-1 rounded-lg  bg-blue-200 border mx-auto border-blue-700 text-blue-950">
                              Suggested top bid range{" "}
                              {`${items.min_suggested_bid}-${items.max_suggested_bid}`}
                            </div>
                          ) : null}
                        </div>
                      </td>

                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              handleActive(e.target.checked, items?.id)
                            }
                          />
                          <span className="slider round slider--blinkit px-2 py-2"></span>
                        </label>
                      </td>
                      <td>
                        <div>
                          <input
                            type="number"
                            disabled={!active?.includes(items?.id)}
                            placeholder="Enter CPM Bid Value"
                            className="text-[10px] px-2 rounded py-1 bg-gray-100 outline-none"
                            min={Number(items?.smart_min_suggested_bid)}
                            max={Number(items?.smart_max_suggested_bid)}
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
                                items.smart_min_suggested_bid,
                                items.smart_max_suggested_bid
                              )
                            }
                          />
                          {inputSmartKeywordError?.includes(items?.id) && (
                            <p className="errorText">{` please enter value between ${items?.smart_min_suggested_bid} and ${items?.smart_max_suggested_bid}`}</p>
                          )}

                          {active?.includes(items?.id) ? (
                            items.smart_min_suggested_bid ? (
                              <div className="w-fit px-2 mt-1 rounded-lg  bg-blue-200 border mx-auto border-blue-700 text-blue-950">
                                Suggested top bid range{" "}
                                {`${items.smart_min_suggested_bid}-${items.smart_max_suggested_bid}`}
                              </div>
                            ) : null
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default NegativeTargetKeywordContent;
