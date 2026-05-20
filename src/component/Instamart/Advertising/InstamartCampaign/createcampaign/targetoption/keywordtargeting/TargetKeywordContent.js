import React from "react";

const TargetKeywordContent = ({
  selectedKeywords,
  setSelectedKeywords,
  setCampaignData,
  campaignData,
  inputKeywordError,
  setInputKeywordError,
  setKeywordData,
  keywordData,
}) => {
  const [newKeywordData, setNewKeywordData] = React.useState([]);

  const handleDelete = (data) => {
    let tempData = campaignData?.keywords;
    let newData = tempData?.filter((item) => item.id !== data.id);
    setSelectedKeywords([...newData]);
    if (data && data.broad_searchcount) {
      setKeywordData([...keywordData, data]);
    }
  };
  React.useEffect(() => {
    // if (selectedKeywords.length) {
    //   setCampaignData({
    //     ...campaignData,
    //     keywords: selectedKeywords,
    //   });
    // }
    //////////
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

  const handleCPM = (data, id, min) => {
    if (Number(data) < Number(min) && min) {
      setInputKeywordError([...inputKeywordError, id]);
    } else {
      let updatedIds = inputKeywordError?.filter((item) => item !== id);

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

  const setMatchType = (match, id) => {
    let tempData = campaignData?.keywords;

    tempData?.forEach((keyword) => {
      if (keyword.id === id) {
        keyword.match = match;
      }
    });

    setCampaignData({
      ...campaignData,
      keywords: tempData,
    });
    setSelectedKeywords([...tempData]);
  };
  return (
    <>
      <div>
        <div className="">
          <table className="w-full targetKeyword__table">
            <thead className="h-[30px] bg-gray-200 text-center text-gray-400 pl-4">
              <tr className="">
                <th></th>
                <th className="text-left">Keyword</th>
                <th>Search Volume</th>
                <th>Minimum Bid</th>
                <th>Match Type</th>
                <th>Your Bid</th>
              </tr>
            </thead>
            <tbody className="keywordcontent_table">
              {newKeywordData.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    Add new keywords or choose from the suggested keywords
                  </td>
                </tr>
              )}
              {newKeywordData?.map((items) => {
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
                            {items.keywordtext}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div>
                          {items && items[`${items.match}_searchcount`] ? (
                            <p>
                              {" "}
                              {items[`${items.match}_searchcount`]} searches
                            </p>
                          ) : (
                            <p> 0 searches</p>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          {items && items[`${items.match}_minimumbid`] ? (
                            <p> {items[`${items.match}_minimumbid`]} </p>
                          ) : (
                            0
                          )}
                        </div>
                      </td>

                      <td>
                        <select
                          onChange={(e) =>
                            setMatchType(e.target.value, items?.id)
                          }
                        >
                          <option value="broad">Broad Match</option>
                          <option value="exact">Exact Match</option>
                        </select>
                      </td>
                      <td>
                        <div>
                          <input
                            type="number"
                            placeholder="Enter Bid Value"
                            className="text-[10px] px-2 rounded py-1 outline-none"
                            value={
                              campaignData?.keywords?.filter(
                                (data) => data.id == items?.id
                              )[0]?.cpm
                                ? campaignData?.keywords?.filter(
                                    (data) => data.id == items?.id
                                  )[0]?.cpm
                                : ""
                            }
                            // min={Number(items[`${items.match}_minimumbid`])}
                            onChange={(e) =>
                              handleCPM(
                                e.target.value,
                                items?.id,
                                items[`${items.match}_minimumbid`]
                              )
                            }
                          />
                          {inputKeywordError &&
                            inputKeywordError?.includes(items?.id) && (
                              <p className="errorText">{` please enter value greater than ${
                                items[`${items.match}_minimumbid`]
                              }`}</p>
                            )}

                          {items[`${items.match}_suggestedlowerbid`] ? (
                            <div className="w-fit px-2 mt-1 rounded-lg  bg-blue-200 border mx-auto border-blue-700 text-blue-950">
                              Suggested top bid range{" "}
                              {`${items[`${items.match}_suggestedlowerbid`]}-${
                                items[`${items.match}_suggestedupperbid`]
                              }`}
                            </div>
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
export default TargetKeywordContent;
