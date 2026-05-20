import React, { useState } from "react";
import { useLocation } from "react-router";
import EditKeywordsLeftBlock from "./EditKeywordsLeftBlock";
import EditKeywordsRightBlock from "./EditKeywordsRightBlock";

const EditKeywordsTargetingBlock = ({
  setBroadKeys,
  broadKeys,
  setExactKeys,
  exactKeys,
  campaignData,
}) => {
  // const [broadKeys, setBroadKeys] = useState([]);
  // const [exactKeys, setExactKeys] = useState([]);
  const [broadKeyword, setBroadKeyword] = useState([]);
  const [exactKeyword, setExactKeyword] = useState([]);
  const location = useLocation();
  const campaignId = location?.state;
  React.useEffect(() => {
    if (campaignId) {
      if (campaignData.keywords_broad) {
        setBroadKeys([...campaignData.keywords_broad]);
      }
      if (campaignData.keywords_exact) {
        setExactKeys([...campaignData.keywords_exact]);
      }
    }
  }, []);
  const handleBroadKeysChange = (newBroadKeys) => {
    setBroadKeys(newBroadKeys);
  };

  const handleRemoveAll = () => {
    setBroadKeys([]);
  };

  const handleRemoveBroadKey = (index) => {
    const updatedBroadKeys = [...broadKeys];
    updatedBroadKeys.splice(index, 1);
    setBroadKeys(updatedBroadKeys);
   
  };

  const handleExactKeysChange = (newExactKeys) => {
    setExactKeys(newExactKeys);
  };

  const handleRemoveExactKey = (index) => {
    const updatedExactKeys = [...exactKeys];
    updatedExactKeys.splice(index, 1);
    setExactKeys(updatedExactKeys);
  };

  const handleRemoveAllExactKeys = () => {
    setExactKeys([]);
  };
  React.useEffect(() => {
    // console.log(
    //   "campaignData keyword",

    //   broadKeys,

    //   exactKeys
    // );
  }, [broadKeys, exactKeys]);
  return (
    <>
      <div className="row pt-3">
        <div className="col_6 ">
          <EditKeywordsLeftBlock
            onBroadKeysChange={handleBroadKeysChange}
            onExactKeysChange={handleExactKeysChange}
            setBroadKeyword={setBroadKeyword}
            broadKeyword={broadKeyword}
            setExactKeyword={setExactKeyword}
            exactKeyword={exactKeyword}
            campaignData={campaignData}
          />
        </div>
        <div className="col_6">
          <EditKeywordsRightBlock
            broadKeys={broadKeys}
            removeAllBroadKeys={handleRemoveAll}
            handleRemoveBroadKey={handleRemoveBroadKey}
            exactKeys={exactKeys}
            handleRemoveExactKey={handleRemoveExactKey}
            removeAllExactKeys={handleRemoveAllExactKeys}
            setBroadKeys={setBroadKeys}
            setExactKeys={setExactKeys}
          />
        </div>
      </div>
    </>
  );
};
export default EditKeywordsTargetingBlock;
