import React, { useState } from "react";
import KeywordTargeting from "./targetoption/keywordtargeting/KeywordTargeting";
// import Button from "../../../../common-components/button/Button";
// import TargetResult from "./targetoption/targetoptionresult";
// import Btn from "./button/Btn";

const StepTargetingOptions = ({
  // active,
  // setActive,
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [inputKeywordError, setInputKeywordError] = React.useState([]);
  const [cpmError, setCpmError] = React.useState("");

  const [error, setError] = React.useState({
    inputKeywordError: "",
  });

  React.useEffect(() => {
    setCpmError("");
    // eslint-disable-next-line no-console
    // console.log(" campaignData indide debug", campaignData.keywordsCpmChange);
  }, [campaignData.keywordsCpmChange]);

  React.useEffect(() => {
    setError({
      ...error,
      inputKeywordError: "",
    });
    setCampaignData({
      ...campaignData,
      inputkeyworderror: inputKeywordError,
    });
  }, [inputKeywordError.length]);

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log("campaignData errorerror", error);
  }, [error]);
  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("campaignData error", error, inputKeywordError);
  // }, [inputKeywordError]);

  return (
    <>
      {/* {active > 4 ? (
        <TargetResult campaignData={campaignData} />
      ) : ( */}
      <>
        <div className="text-xs py-2">
          {" "}
          You can select multiple targeting options to boost your product across
          the platform.
        </div>
        <KeywordTargeting
          selectedKeywords={selectedKeywords}
          setSelectedKeywords={setSelectedKeywords}
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
          error={error}
          inputKeywordError={inputKeywordError}
          setInputKeywordError={setInputKeywordError}
          cpmError={cpmError}
          // inputKeywordCPMError={inputKeywordCPMError}
        />
      </>
      {/* )} */}
      {/* <div className="col text-end px-2">
        {active > 4 ? (
          <Btn
            title="Edit"
            onClick={() => {
              setActive(4);
            }}
          />
        ) : (
          <div className="pt-4">
            <Button
              title="Done"
              // disable={selectedKeywords.length ? false : true}
              instamart
              click={() => {
                if (
                  // eslint-disable-next-line no-prototype-builtins
                  !campaignData?.keywords.every((obj) =>
                    // eslint-disable-next-line no-prototype-builtins
                    obj.hasOwnProperty("cpm")
                  )
                ) {
                  // setError({
                  //   ...error,
                  //   cpmError: "Please enter a cpm values of selected keywords",
                  // });
                  setCpmError("Please enter a cpm values of selected keywords");
                } else if (inputKeywordError.length) {
                  setError({
                    ...error,
                    inputKeywordError:
                      "Please fill correct keyword's bid values",
                  });
                } else {
                  setActive(active + 1);
                }
              }}
            />
          </div>
        )}
      </div> */}
    </>
  );
};

export default StepTargetingOptions;
