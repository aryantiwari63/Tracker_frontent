import { useEffect, useState } from "react";
import Popup from "../../../common-components/Popups/Popup";
const SearchTermPopup = ({
  selectedAdGroup,
  setSearchTermTypeData,
  searchTermTypeData,
  campaignTermTypeData,
  searchTermAction,
  setSearchTermAction,
  editSearch,
  setOpenState,
  editSearchTermNegative,
}) => {
  const [showProductWarning, setShowProductWarning] = useState(false);
  const [showKeywordWarning, setShowKeywordWarning] = useState(false);
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);
  // Close Popup and reset warnings
  const handleClosePopup = () => {
    setOpenState(false);
    setShowProductWarning(false);
    setShowKeywordWarning(false);
  };
  // Disable Apply Button if warnings are shown
  // const isApplyDisabled = (searchTermAction=='keyword' ?
  //     ((searchTermTypeData=='NEGATIVE_EXACT'|| searchTermTypeData== 'NEGATIVE_PHRASE') ?
  //       false : true)
  //     :(searchTermAction=='all'?
  //     ((searchTermTypeData=='NEGATIVE_EXACT'|| searchTermTypeData== 'NEGATIVE_PHRASE')
  //     ? false : true)
  //     :false)) || (showProductWarning || showKeywordWarning);
  // console.log("testttttt", (searchTermAction=='keyword') )
  useEffect(() => {}, [
    selectedAdGroup,
    searchTermTypeData,
    campaignTermTypeData,
  ]);
  // Reset warnings when searchTermAction changes
  useEffect(() => {
    setShowProductWarning(false);
    setShowKeywordWarning(false);
  }, [searchTermAction]);
  useEffect(() => {
    setIsApplyDisabled(
      (searchTermAction == "keyword"
        ? searchTermTypeData == "NEGATIVE_EXACT" ||
          searchTermTypeData == "NEGATIVE_PHRASE"
          ? false
          : true
        : searchTermAction == "all"
        ? searchTermTypeData == "NEGATIVE_EXACT" ||
          searchTermTypeData == "NEGATIVE_PHRASE"
          ? false
          : true
        : searchTermAction == "product"
        ? false
        : true) ||
        showProductWarning ||
        showKeywordWarning
    );
  }, [
    searchTermAction,
    searchTermTypeData,
    showKeywordWarning,
    showProductWarning,
  ]);
  useEffect(() => {
    if (searchTermAction === "keyword") {
      setShowProductWarning(false);
      const hasUnspecifiedMatchType = editSearch.some(
        (term) =>
          term.match_type != "EXACT" &&
          term.match_type != "PHRASE" &&
          term.match_type != "BROAD" &&
          term.match_type != "TARGETING_EXPRESSION_PREDEFINED"
      );
      setShowKeywordWarning(hasUnspecifiedMatchType);
    } else if (searchTermAction === "product") {
      // console.log("product", searchTermAction);
      setShowKeywordWarning(false);
      const hasUnspecifiedMatchType = editSearch.some(
        (term) =>
          term.match_type === "EXACT" ||
          term.match_type === "PHRASE" ||
          term.match_type === "BROAD" ||
          term.match_type === "TARGETING_EXPRESSION_PREDEFINED"
      );
      setShowProductWarning(hasUnspecifiedMatchType);
      // console.log("testttttttttttttt", showProductWarning, hasUnspecifiedMatchType);
    } else {
      setShowProductWarning(false);
      setShowKeywordWarning(false);
    }
  }, [editSearch, searchTermAction, searchTermTypeData]);
  const handleTypeChange = (e) => {
    setSearchTermTypeData(e);
  };

  const handleActionChange = (e) => {
    setSearchTermAction(e);
  };
  return (
    <>
      <Popup
        setTempView={() => {}}
        title="Add negative keyword/product"
        setShowPopup={setOpenState}
        applyAction={editSearchTermNegative}
        cutomButton={[
          {
            handleClick: handleClosePopup,
            label: "Cancel",
            style: "bg-white text-black border",
          },
          {
            handleClick: editSearchTermNegative,
            label: "Apply",
            style: `border ${
              isApplyDisabled
                ? "bg-blue-500 text-white opacity-50 cursor-not-allowed"
                : "text-white"
            }`,
            disabled: isApplyDisabled,
          },
        ]}
      >
        <div className="px-4">
          <h4>Action</h4>
          <div className="py-1 pb-3">
            <select
              name="Action"
              id="Action"
              className="w-full py-2 text-gray-600 outline-none px-2 border-2 rounded text-sm"
              onChange={(e) => handleActionChange(e.target.value)}
            >
              <option selected disabled>
                Select
              </option>
              <option value="keyword">Negate All Keyword</option>
              <option value="product">Negate All Product</option>
              <option value="all">Negate All Keyword & Product</option>
            </select>
          </div>
          {searchTermAction != "product" && (
            <>
              {" "}
              <h4>Keyword Match Type</h4>
              <div className="py-1 pb-3">
                <select
                  name="Type"
                  id="Type"
                  className="w-full py-2 text-gray-600 outline-none px-2 border-2 rounded text-sm"
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  <option selected disabled>
                    Select
                  </option>
                  <option value="NEGATIVE_EXACT">EXACT</option>
                  <option value="NEGATIVE_PHRASE">PHRASE</option>
                </select>
              </div>
            </>
          )}
        </div>
        {searchTermAction == "keyword" && showKeywordWarning && (
          <div className="text-red-500 mt-2 px-4">
            You have selected Negative Product Targeting
          </div>
        )}
        {searchTermAction == "product" && showProductWarning && (
          <div className="text-red-500 mt-2 px-4">
            You have selected Negative Keyword
          </div>
        )}
      </Popup>
    </>
  );
};

export default SearchTermPopup;
