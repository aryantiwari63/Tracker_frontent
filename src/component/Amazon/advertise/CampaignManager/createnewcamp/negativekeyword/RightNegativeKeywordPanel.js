import React, { useContext } from "react";
import NegativeKeywordsContext from "./negativeKeywordsContext";
import Tooltip from "../Tooltip";

const RightNegativeKeywordPanel = ({
  setCampaignData,
  campaignData,
  // handleChange,
  setDuplicateKeyword,
  duplicateKeyword,
  setNewKeyword,
  newKeyword,
  setExistingKeyword,
  existingKeyword,
}) => {
  const { addedKeywords, setAddedKeywords } = useContext(
    NegativeKeywordsContext
  );
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      negativeKeywords: addedKeywords,
    });
    setTimeout(() => {
      setDuplicateKeyword([]);
      setNewKeyword([]);
      setExistingKeyword([]);
    }, 3000);
  }, [addedKeywords]);

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
