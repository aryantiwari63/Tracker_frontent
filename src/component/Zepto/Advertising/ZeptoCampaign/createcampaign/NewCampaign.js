import React from "react";
import NewCampSteps from "./NewCampSteps";
import StepCampaignDetails from "./StepCampaignDetails";
import StepCampaignFormat from "./StepCampaignFormat";
import StepTargetingOptions from "./StepTargetingOptions";
import TargetBtn from "./targetoption/button/TargetBtn";
import { APPLICATION_ROUTES } from "../../../../../utils/constants";
import { useDispatch } from "react-redux";
import { createZeptoCampaign } from "../../../../../redux/action-creator/campaignAction";
import { useHistory } from "react-router";

const NewCampaign = ({ heading }) => {
  const [campaignData, setCampaignData] = React.useState({
    campaign_type: "",
  });
  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("campaignData", campaignData);
  // }, [campaignData]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCampaignData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const history = useHistory();
  const dispatch = useDispatch();
  const createCampaign = () => {
    if (!campaignData.campaign_type || campaignData.campaign_type == "") {
      setError({
        ...error,
        campaign_type: "Please select campaign type.",
      });
    } else if (!campaignData.campaign_name) {
      setError({
        ...error,
        campaign_name: "Please select campaign name.",
      });
    } else if (!campaignData.campaign_budget) {
      setError({
        ...error,
        campaign_budget: "Please select campaign budget.",
      });
    } else if (!campaignData.productId) {
      setError({
        ...error,
        productId: "Please select product.",
      });
    } else if (!campaignData.keywords || campaignData.keywords?.length == 0) {
      setError({
        ...error,
        keywords: "Please select keywords.",
      });
    } else {
      dispatch(createZeptoCampaign(campaignData));
      history.push(APPLICATION_ROUTES.ZEPTOCAMPAING);
    }
  };

  const [error, setError] = React.useState({
    campaign_type: "",
    campaign_name: "",
    campaign_budget: "",
    productId: "",
    keywords: "",
    // negativeKeywords: "",
  });
  React.useEffect(() => {
    setError({
      ...error,
      campaign_type: "",
    });
  }, [campaignData.campaign_type]);

  React.useEffect(() => {
    setError({
      ...error,
      campaign_name: "",
    });
  }, [campaignData.campaign_name]);
  React.useEffect(() => {
    setError({
      ...error,
      campaign_budget: "",
    });
  }, [campaignData.campaign_budget]);
  React.useEffect(() => {
    setError({
      ...error,
      productId: "",
    });
  }, [campaignData.productId]);
  React.useEffect(() => {
    setError({
      ...error,
      keywords: "",
    });
  }, [campaignData.keywords]);
  // React.useEffect(() => {
  //   setError({
  //     ...error,
  //     negativeKeywords: "",
  //   });
  // }, [campaignData.negativeKeywords]);

  return (
    <>
      <div className="">
        <div className="font-bold text-lg pb-4">{heading}</div>
        <NewCampSteps stepno={1} stepname="Campaign Details">
          <StepCampaignFormat
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            error={error}
          />
        </NewCampSteps>
        <NewCampSteps stepno={2} stepname="Products Targeting">
          <StepCampaignDetails
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            error={error}
          />
        </NewCampSteps>
        <NewCampSteps stepno={3} stepname="Targeting Options">
          <StepTargetingOptions
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            error={error}
          />
        </NewCampSteps>
      </div>
      <div className="row justify-center ">
        {/* <TargetBtn title="Save as draft" onClick={saveDraft} /> */}
        <TargetBtn
          title="Create Campaign"
          btn="create"
          // disabled={active != 5}
          onClick={createCampaign}
        />
      </div>
    </>
  );
};

export default NewCampaign;
