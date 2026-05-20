import React, { useContext, useState } from "react";
import NegativeKeywordsBulkContext from "./negativeKeywordsContext";
import DialogBox from "../../../../../common-components/dialogBox.js";

const LeftNegativeKeywordPanel = ({
  campaignData,
  setCampaignData,
  // addedProducts,
  setAddedProducts,
  // setDuplicateNegativeKeyword,
  // duplicateNegativeKeyword,
  setNewKeyword,
  // newKeyword,
  setExistingKeyword,
  existingKeyword,

  formIndex,
}) => {
  const [searchTerm, setSearchTerm] = useState([]);

  // const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [duplicateKeyword, setDuplicateKeyword] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [showExistingPopup, setShowExistingPopup] = useState(false);

  const { addedKeywords, setAddedKeywords, matchType, setMatchType } =
    useContext(NegativeKeywordsBulkContext);
  // const selectKeywords = (value) => {
  //   selectedKeywords.some((item) => item.keyword === value.keyword)
  //     ? setSelectedKeywords(
  //         selectedKeywords.filter((item) => item.keyword !== value.keyword)
  //       )
  //     : setSelectedKeywords([
  //         ...selectedKeywords,
  //         { ...value, matchType: matchType },
  //       ]);
  // };
  const addSelectedKeywords = () => {
    let keywordData = [];
    // searchTerm &&
    //   searchTerm.length &&
    //   searchTerm?.split(",").map((keyword) => {
    //     keywordData.push({ keyword, matchType });
    //   });
    searchTerm &&
      searchTerm.length &&
      [...new Set(searchTerm?.split(","))]
        .join(",")
        ?.toString()
        ?.split(",")
        .map((keyword) => {
          keywordData.push({ keyword, matchType });
        });

    // console.log("campaignData keywordData", keywordData);

    const removedKeyData =
      campaignData &&
      campaignData[formIndex] &&
      campaignData[formIndex]?.keywords?.length &&
      campaignData[formIndex]?.keywords.map((data) => data.keyword);
    // console.log("campaignData removedKeyData", removedKeyData);
    const opertedData =
      keywordData &&
      keywordData?.length &&
      keywordData
        .map((data) => {
          if (
            removedKeyData &&
            removedKeyData?.length &&
            removedKeyData.includes(data.keyword)
          )
            return data.keyword;
        })
        .filter((data) => data != undefined);
    // console.log("campaignData opertedData", opertedData);
    setDuplicateKeyword(opertedData);

    //for existing negative keywords

    let existingData = [];
    keywordData &&
      keywordData?.length &&
      keywordData.map((data) => {
        if (
          campaignData &&
          campaignData[formIndex] &&
          campaignData[formIndex]?.negativeKeywords &&
          campaignData[formIndex]?.negativeKeywords?.length
        ) {
          campaignData[formIndex]?.negativeKeywords.map((key) => {
            if (key.keyword == data.keyword && key.matchType == data.matchType)
              existingData.push(key);
          });
        }
      });
    // console.log("campaignData existingData", existingData);

    setExistingKeyword(existingData);

    if (opertedData && opertedData.length) {
      setShowPopup(true);
    } else if (existingData && existingData?.length) {
      setShowExistingPopup(true);
    } else {
      setAddedKeywords([...addedKeywords, ...keywordData]);
      setNewKeyword(keywordData);
      setSearchTerm([]);
    }
  };
  const handleDialogApply = () => {
    let keywordData = [];
    searchTerm &&
      searchTerm.length &&
      searchTerm?.split(",").map((keyword) => {
        keywordData.push({ keyword, matchType });
      });
    setAddedKeywords([...addedKeywords, ...keywordData]);
    setSearchTerm([]);
    if (duplicateKeyword && duplicateKeyword?.length) {
      let newKeywordData =
        campaignData &&
        campaignData[formIndex] &&
        campaignData[formIndex]?.keywords?.length &&
        campaignData[formIndex]?.keywords
          .map((data) => {
            if (!duplicateKeyword.includes(data.keyword)) return data;
          })
          .filter((data) => data != undefined);

      let data = [...campaignData];
      if (data && data[formIndex]) {
        data[formIndex]["keywords"] = newKeywordData;
      }
      setCampaignData([...data]);

      setAddedProducts(newKeywordData);
    }
    setShowPopup(false);
  };
  const handleDialogApplyForExisting = () => {
    let keywordData = [];
    searchTerm &&
      searchTerm.length &&
      searchTerm?.split(",").map((keyword) => {
        keywordData.push({ keyword, matchType });
      });

    if (existingKeyword && existingKeyword?.length) {
      let removedIndex = [];
      for (let i = 0; i < keywordData.length; i++) {
        let key = keywordData[i];
        for (let j = 0; j < existingKeyword.length; j++) {
          if (
            key.keyword === existingKeyword[j].keyword &&
            key.matchType === existingKeyword[j].matchType
          ) {
            removedIndex.push(i);
          }
        }
      }
      let newKeywordData = keywordData.filter(
        (data, index) => !removedIndex.includes(index)
      );
      setAddedKeywords([...addedKeywords, ...newKeywordData]);
    } else {
      setAddedKeywords([...addedKeywords, ...keywordData]);
    }

    setSearchTerm([]);
    setShowPopup(false);
    setShowExistingPopup(false);
  };
  const handleDialogCancel = () => {
    if (duplicateKeyword && duplicateKeyword?.length) {
      let keywordData = [];
      searchTerm &&
        searchTerm.length &&
        searchTerm?.split(",").map((keyword) => {
          if (!duplicateKeyword.includes(keyword))
            keywordData.push({ keyword, matchType });
        });
      setAddedKeywords([...addedKeywords, ...keywordData]);
    }
    setSearchTerm([]);
    setShowPopup(false);
  };
  return (
    <>
      <div className="col_6 px-3 ">
        <div className="row justify-between px-3 py-3">
          <label className="font-bold">Match type</label>
          <label>
            <input
              type="radio"
              checked={matchType === "exact"}
              value="exact"
              name="neg"
              onClick={(e) => {
                setMatchType(e.target.value);
              }}
            />
            Negative exact
          </label>
          <label>
            <input
              type="radio"
              checked={matchType === "phrase"}
              value="phrase"
              name="neg"
              onClick={(e) => {
                setMatchType(e.target.value);
              }}
            />
            Negative phrase
          </label>
        </div>
        <div className="py-5">
          <textarea
            className="border row outline-none px-2"
            rows={"6"}
            placeholder="enter keyword separated by commas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="row pb-2">
          <div className="col_2 text-center">
            <button
              className="rounded-lg bg-gray-300 text-xm py-1 px-2"
              type="button"
              onClick={addSelectedKeywords}
              disabled={searchTerm?.length == 0}
            >
              Add Keywords
            </button>
          </div>
          {showPopup && (
            <DialogBox
              title="Confirmation"
              buttonName="Yes"
              cancelbuttonName="No"
              onAccept={handleDialogApply}
              onCancel={handleDialogCancel}
            >
              {duplicateKeyword && duplicateKeyword?.length
                ? `${duplicateKeyword?.join(",")} already exists in the Keyword
              Targeting list. Do you want to remove it from Targeting list and
              add it under Negative Keyword list?`
                : "Add negative keywords"}
            </DialogBox>
          )}
          {showExistingPopup && (
            <DialogBox
              title="Confirmation"
              buttonName="Yes"
              cancelbuttonName="No"
              onAccept={handleDialogApplyForExisting}
              // onCancel={handleDialogCancel}
            >
              {existingKeyword && existingKeyword?.length
                ? `${existingKeyword
                    .map((data) => data.keyword + "+" + data.matchType)
                    ?.join(
                      ","
                    )} has already been added to the list on the right.`
                : "Add keywords"}
            </DialogBox>
          )}
        </div>
      </div>
    </>
  );
};

export default LeftNegativeKeywordPanel;
