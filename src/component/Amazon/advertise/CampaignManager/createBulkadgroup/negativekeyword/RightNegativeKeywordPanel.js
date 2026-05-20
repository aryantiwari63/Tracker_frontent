import React, { useContext } from "react";
// import EventHandlerContext from "../../../../../../context/eventHAndlerContext";
import NegativeKeywordsBulkContext from "./negativeKeywordsContext";
import Tooltip from "../Tooltip";

const RightNegativeKeywordPanel = ({
  setCampaignData,
  campaignData,
  // handleChange,
  formIndex,
  setDuplicateKeyword,
  duplicateKeyword,
  setNewKeyword,
  newKeyword,
  setExistingKeyword,
  existingKeyword,
}) => {
  const { addedKeywords, setAddedKeywords } = useContext(
    NegativeKeywordsBulkContext
  );
  React.useEffect(() => {
    // if (
    //   campaignData &&
    //   campaignData[formIndex] &&
    //   campaignData[formIndex]?.negativeKeywords?.length
    // ) {
    //   let negativeData = campaignData[formIndex]?.negativeKeywords;
    //   console.log("campaignData negativeData", negativeData);
    //   setAddedKeywords([...addedKeywords, negativeData]);
    // }
    // console.log(
    //   "campaignData negativeData",
    //   campaignData[formIndex]?.negativeKeywords,
    //   campaignData[formIndex]
    // );
  }, []);
  React.useEffect(() => {
    let data = [...campaignData];
    if (data && data[formIndex]) {
      data[formIndex]["negativeKeywords"] = addedKeywords;
    }
    setCampaignData([...data]);
    setTimeout(() => {
      setDuplicateKeyword([]);
      setNewKeyword([]);
      setExistingKeyword([]);
    }, 3000);
  }, [addedKeywords]);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData[0] &&
      formIndex > 0 &&
      campaignData[0]?.negativeKeywords
    ) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      setAddedKeywords([...campaignData[0]?.negativeKeywords]);
    }
  }, [formIndex]);
  return (
    <>
      <div className=" border col_6 bg-gray-50">
        <div className="row border-b py-2 px-2 justify-between">
          <div className="font-semibold pl-2">
            {addedKeywords?.length} added
          </div>
          <div>
            <button
              onClick={() => setAddedKeywords([])}
              className="text-blue-400"
            >
              Remove all
            </button>
          </div>
        </div>
        <div className="row  border-t border-b border-gray-300 py-2 px-3 justify-between text-sm">
          <div>Keyword</div>
          <div className="pr-16">
            Match Type
            <Tooltip />
          </div>
        </div>
        <table className="w-full addedNegativeKeywordsTable ">
          {addedKeywords?.map((item, i) => {
            return (
              <tr key={i} className="text-xs">
                <td
                  width={"75%"}
                  // className="pl-2"
                  className={
                    (duplicateKeyword &&
                      duplicateKeyword?.length &&
                      duplicateKeyword.find(
                        (data) =>
                          data.keyword === item.keyword &&
                          data.match === item.match
                      )) ||
                    (existingKeyword &&
                      existingKeyword?.length &&
                      existingKeyword.find(
                        (data) =>
                          data.keyword === item.keyword &&
                          data.matchType === item.matchType
                      ))
                      ? "duplicateKeyword"
                      : newKeyword &&
                        newKeyword?.length &&
                        newKeyword.find(
                          (data) =>
                            data.keyword === item.keyword &&
                            data.match === item.match
                        )
                      ? "newKeyword"
                      : ""
                  }
                >
                  {item.keyword}
                </td>
                <td>{item.matchType}</td>
                <td>
                  <button
                    className="font-semibold"
                    onClick={() => {
                      setAddedKeywords(
                        addedKeywords.filter(
                          // (value) => value.keyword !== item.keyword
                          (ele) => {
                            if (
                              ele.matchType === item.matchType &&
                              ele.keyword === item.keyword
                            ) {
                              return false;
                            } else {
                              return true;
                            }
                          }
                        )
                      );
                    }}
                  >
                    X
                  </button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
};
export default RightNegativeKeywordPanel;
