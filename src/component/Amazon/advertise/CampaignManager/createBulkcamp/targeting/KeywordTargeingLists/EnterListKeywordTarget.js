import React, { useState } from "react";
import Tooltip from "../../Tooltip";
import { BsChevronBarDown } from "react-icons/bs";
import DialogBox from "../../../../../../common-components/dialogBox.js";

const EnterListKeywordTarget = ({
  setCampaignData,
  campaignData,
  handleChange,
  addedProducts,
  setAddedProducts,
  setDuplicateKeyword,
  duplicateKeyword,
  setNewKeyword,
  // newKeyword,
  setExistingNegativeKeyword,
  existingNegativeKeyword,
  formIndex,
  setAddedKeywords,
  // addedKeywords,
}) => {
  const [bids, setBids] = useState("Custom bid");
  const [bidInput] = useState("");
  const [showBidsDropdown, setShowBidsDropdown] = useState(false);
  // const [sortoption, setSortOption] = useState("Order");
  // const [sortInput, setSortInput] = useState("");
  // const [showsortDropdown, setShowSortDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showExistingPopup, setShowExistingPopup] = useState(false);

  // const [addedProducts,setAddedProducts]=React.useState([])

  const bidsOptions = [
    // {
    //   label: "Suggested bid",
    //   value: "suggestedbid",
    // },
    {
      label: "Custom bid",
      value: "custombid",
    },
    // {
    //   label: "Default bid",
    //   value: "defaultbid",
    // },
  ];
  const [checkedItems, setCheckedItems] = useState({
    broad: true,
    phrase: true,
    exact: true,
  });

  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedItems({
      ...checkedItems,
      [name]: checked,
    });
  };
  React.useEffect(() => {
    if (Object.values(checkedItems).every((item) => item === false)) {
      setCheckedItems({
        ...checkedItems,
        broad: true,
      });
    }
  }, [checkedItems]);

  const checkboxOptions = [
    { name: "broad", label: "Broad" },
    { name: "phrase", label: "Phrase" },
    { name: "exact", label: "Exact" },
  ];
  // const sortOptionlist = [
  //   {
  //     label: "Orders",
  //     value: "orders",
  //   },
  //   {
  //     label: "Clicks",
  //     value: "clicks",
  //   },
  // ];

  const addSelectedKeywords = () => {
    let keywordData = [];
    let matchTypes = Object.keys(checkedItems)?.filter(
      (key) => checkedItems[key]
    );
    let bid = campaignData?.bid ? campaignData?.bid : "3";

    searchTerm &&
      searchTerm.length &&
      [...new Set(searchTerm?.split(","))]
        .join(",")
        ?.toString()
        ?.split(",")
        .map((keyword) => {
          matchTypes &&
            matchTypes.length &&
            matchTypes.map((match) => {
              keywordData.push({ keyword, match, bid });
            });
        });
    // setShowPopup(true);

    let duplicateData = [];
    keywordData &&
      keywordData?.length &&
      keywordData.map((data) => {
        if (
          campaignData &&
          campaignData[formIndex] &&
          campaignData[formIndex]?.keywords &&
          campaignData[formIndex]?.keywords?.length
        ) {
          campaignData[formIndex]?.keywords.map((key) => {
            if (key.keyword == data.keyword && key.match == data.match)
              duplicateData.push(key);
          });
        }
      });
    // console.log("campaignData duplicateData In key", duplicateData);

    setDuplicateKeyword(duplicateData);

    // for existing negative keywords
    const removedKeyData =
      campaignData &&
      campaignData[formIndex] &&
      campaignData[formIndex]?.negativeKeywords?.length &&
      campaignData[formIndex]?.negativeKeywords.map((data) => data.keyword);
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
    // console.log("campaignData removedKeyData NegKey", removedKeyData);
    // console.log("campaignData opertedData NegKey", new Set(opertedData));
    setExistingNegativeKeyword([...new Set(opertedData)]);
    if (duplicateData && duplicateData?.length) {
      // console.log("campaignData opertedData in cond 1");

      setShowPopup(true);
    } else if (opertedData && opertedData?.length) {
      // console.log("campaignData opertedData in cond 2");
      setShowExistingPopup(true);
    } else {
      // console.log("campaignData opertedData in cond 3");
      setAddedProducts([...addedProducts, ...keywordData]);
      setNewKeyword(keywordData);
      setSearchTerm([]);
    }
  };
  const handleDialogApply = () => {
    let keywordData = [];
    let matchTypes = Object.keys(checkedItems)?.filter(
      (key) => checkedItems[key]
    );
    let bid = campaignData?.bid ? campaignData?.bid : "3";

    searchTerm &&
      searchTerm.length &&
      searchTerm?.split(",").map((keyword) => {
        matchTypes &&
          matchTypes.length &&
          matchTypes.map((match) => {
            keywordData.push({ keyword, match, bid });
          });
      });
    // console.log("campaignData keywordData 1", keywordData);

    if (duplicateKeyword && duplicateKeyword?.length) {
      let removedIndex = [];
      for (let i = 0; i < keywordData.length; i++) {
        let key = keywordData[i];
        for (let j = 0; j < duplicateKeyword.length; j++) {
          if (
            key.keyword === duplicateKeyword[j].keyword &&
            key.match === duplicateKeyword[j].match
          ) {
            removedIndex.push(i);
          }
        }
      }
      let newKeywordData = keywordData.filter(
        (data, index) => !removedIndex.includes(index)
      );
      // console.log("campaignData keywordData", keywordData);

      setAddedProducts([...addedProducts, ...newKeywordData]);
    } else {
      setAddedProducts([...addedProducts, ...keywordData]);
    }

    setSearchTerm([]);
    setShowPopup(false);
  };
  React.useEffect(() => {
    // console.log("campaignData addedProducts",addedProducts)
  }, [addedProducts]);
  const handleDialogApplyforexistingNegativeKeyword = () => {
    let keywordData = [];
    let matchTypes = Object.keys(checkedItems)?.filter(
      (key) => checkedItems[key]
    );
    let bid = campaignData?.bid ? campaignData?.bid : "3";

    searchTerm &&
      searchTerm.length &&
      searchTerm?.split(",").map((keyword) => {
        matchTypes &&
          matchTypes.length &&
          matchTypes.map((match) => {
            keywordData.push({ keyword, match, bid });
          });
      });
    setAddedProducts([...addedProducts, ...keywordData]);

    setSearchTerm([]);
    if (existingNegativeKeyword && existingNegativeKeyword?.length) {
      let newKeywordData =
        campaignData &&
        campaignData[formIndex] &&
        campaignData[formIndex]?.negativeKeywords?.length &&
        campaignData[formIndex]?.negativeKeywords
          .map((data) => {
            if (!existingNegativeKeyword.includes(data.keyword)) return data;
          })
          .filter((data) => data != undefined);

      let data = [...campaignData];
      if (data && data[formIndex]) {
        data[formIndex]["negativeKeywords"] = newKeywordData;
      }
      setCampaignData([...data]);
      setAddedKeywords(newKeywordData);
    }
    setShowExistingPopup(false);
  };
  const handleDialogCancelforexistingNegativeKeyword = () => {
    if (existingNegativeKeyword && existingNegativeKeyword?.length) {
      let keywordData = [];
      let matchTypes = Object.keys(checkedItems)?.filter(
        (key) => checkedItems[key]
      );
      let bid = campaignData?.bid ? campaignData?.bid : "3";

      searchTerm &&
        searchTerm.length &&
        searchTerm?.split(",").map((keyword) => {
          matchTypes &&
            matchTypes.length &&
            matchTypes.map((match) => {
              if (!existingNegativeKeyword.includes(keyword)) {
                keywordData.push({ keyword, match, bid });
              }
            });
        });
      setAddedProducts([...addedProducts, ...keywordData]);
    }
    setSearchTerm([]);
    setShowExistingPopup(false);
  };
  return (
    <>
      <div className="row border  outline-none pt-4  px-5 ">
        <div className="col_5">
          <label className="font-semibold">
            Bid <Tooltip />
          </label>
        </div>
        <div className="col_4 pr-2">
          <div>
            <div className="rounded-3xl bg-gray-300  px-2 py-1 relative ">
              <div
                className="row justify-between items-center"
                onClick={() => setShowBidsDropdown(!showBidsDropdown)}
              >
                <div>{bids}</div>
                <BsChevronBarDown />
              </div>
              {showBidsDropdown && (
                <div className="absolute  w-full bg-white max-h-72 overflow-y-auto py-4 border z-10">
                  <div>
                    {bidsOptions?.map((item, i) => {
                      return (
                        item.label
                          .toLowerCase()
                          .startsWith(bidInput.toLowerCase()) && (
                          <div
                            key={i}
                            className={[
                              "portfolio__options",
                              bids === item.label &&
                                "portfolio__options--active",
                            ].join(" ")}
                            onClick={() => {
                              setBids(item.label);
                              setShowBidsDropdown(false);
                            }}
                          >
                            {item.label}
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col_2">
          <input
            type="number"
            className="border w-16 rounded"
            name="bid"
            id="bid"
            placeholder="Enter bid"
            // onChange={handleChange}
            onChange={(e) => handleChange(e, formIndex)}
            // value={campaignData.bid ? campaignData.bid : "3"}
            value={
              campaignData &&
              campaignData[formIndex] &&
              campaignData[formIndex].bid
                ? campaignData[formIndex].bid
                : ""
            }
          />
        </div>
      </div>
      <div className="row">
        <div className="row">
          <div className="col_5 pl-4">
            <label className="font-semibold">
              Match by <Tooltip />
            </label>
          </div>
          <div className="col pt-2">
            {checkboxOptions.map((option) => (
              <label key={option.name}>
                <input
                  type="checkbox"
                  name={option.name}
                  checked={checkedItems[option.name]}
                  onChange={handleCheckBoxChange}
                />
                <label className="pr-2">{option.label}</label>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <textarea
          rows="5"
          placeholder="Enter keywords separated by commas."
          className="px-4 w-full  outline-none border "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        ></textarea>
      </div>
      {showPopup && (
        <DialogBox
          title="Confirmation"
          buttonName="Okay"
          // cancelbuttonName="No"
          onAccept={handleDialogApply}
          // onCancel={handleDialogCancel}
        >
          {duplicateKeyword && duplicateKeyword?.length
            ? `${duplicateKeyword
                .map((data) => data.keyword + "+" + data.match)
                ?.join(",")} has already been added to the list on the right.`
            : "Add keywords"}
        </DialogBox>
      )}
      {showExistingPopup && (
        <DialogBox
          title="Confirmation"
          buttonName="Yes"
          cancelbuttonName="No"
          onAccept={handleDialogApplyforexistingNegativeKeyword}
          onCancel={handleDialogCancelforexistingNegativeKeyword}
        >
          {existingNegativeKeyword && existingNegativeKeyword?.length
            ? `${existingNegativeKeyword?.join(
                ","
              )} already exists in the Negative Keyword
              Targeting list. Do you want to remove it from Negative Targeting list and
              add it under Keyword list?`
            : "Add keywords"}
        </DialogBox>
      )}

      {/* <div className="row justify-end px-4 h-60 "> */}
      {/* <div className="text-red-300 text-sm ">!products weren't added.</div> */}
      {/* <button className="text-blue-400 pr-3">Download reports</button>*/}

      {/* </div> */}
      <div className="text-right  pr-3">
        {" "}
        <button
          className="rounded-lg bg-gray-300 px-2 py-2"
          onClick={addSelectedKeywords}
          disabled={searchTerm?.length == 0}
        >
          Add Keyword
        </button>
      </div>
    </>
  );
};
export default EnterListKeywordTarget;
