import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getKeywordList } from "../../../../../../redux/action-creator/campaignAction";
import EditSidePopup from "./EditSidePopup";
import EditExcludeKeywords from "./EditexcludeKeywords";
import EditKeywordsTargetingBlock from "./Editkeywords";

const EditKeywordsTargeting = ({
  setShowKeyword,

  setBroadKeys,
  broadKeys,
  setExactKeys,
  exactKeys,
  uploadedKeywords,
  setUploadedKeywords,
  setAddKeyword,
  setCampaignData,
  campaignData,
}) => {
  const [showKeywordTarget, setShowKeywordTarget] = useState("keywords");
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getKeywordList(campaignData.brand, ""));
  }, []);

  const handleTabClick = (tabName) => {
    setShowKeywordTarget(tabName);
  };
  const applyKeyword = () => {
    setShowKeyword(false);
    setAddKeyword(false);
    setCampaignData({
      ...campaignData,
      keywords_broad: broadKeys,
      keywords_exact: exactKeys,
      exclude_keywords: uploadedKeywords,
    });
  };

  return (
    <div className="">
      <EditSidePopup
        setShowPopup={setShowKeyword}
        setBroadKeys={setBroadKeys}
        setExactKeys={setExactKeys}
        setUploadedKeywords={setUploadedKeywords}
        title="Keyword Targeting"
        className="sidepopup_title"
        footerless={true}
      >
        <div className="row text-base px-5 py-2 tabs gap-4  ">
          <button
            className={showKeywordTarget === "keywords" ? "active" : ""}
            onClick={() => handleTabClick("keywords")}
          >
            Keywords{" "}
            {broadKeys.length || exactKeys.length
              ? broadKeys.length + exactKeys.length
              : 0}
          </button>

          <button
            className={showKeywordTarget === "excludeKeywords" ? "active" : ""}
            onClick={() => handleTabClick("excludeKeywords")}
          >
            Exclude Keywords (
            {uploadedKeywords.length ? uploadedKeywords.length : 0})
          </button>
        </div>

        <div>
          {showKeywordTarget === "keywords" ? (
            <EditKeywordsTargetingBlock
              setBroadKeys={setBroadKeys}
              broadKeys={broadKeys}
              setExactKeys={setExactKeys}
              exactKeys={exactKeys}
              campaignData={campaignData}
            />
          ) : (
            <EditExcludeKeywords
              setUploadedKeywords={setUploadedKeywords}
              uploadedKeywords={uploadedKeywords}
            />
          )}
        </div>
        <div className="flex justify-end mr-2 border-t-2 pt-2">
          <button
            id="cancel_button"
            className="keyword_buttons bg-gray-100 border-2 border-solid  border-gray-200 px-3 py-2 text-base rounded mr-5 w-20 "
            onClick={() => {
              setShowKeyword(false);
              setBroadKeys([]);
              setExactKeys([]);
              setUploadedKeywords([]);
            }}
          >
            Cancel
          </button>
          <button
            className="keyword_buttons bg-blue-500 border-gray-400 px-3 py-2 text-base rounded text-white w-20"
            onClick={applyKeyword}
          >
            Apply
          </button>
        </div>
      </EditSidePopup>
    </div>
  );
};
export default EditKeywordsTargeting;
