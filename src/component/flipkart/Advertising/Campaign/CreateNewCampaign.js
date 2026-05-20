import React, { useState } from "react";
import Stepper from "./Stepper";
import BottomNavBar from "./newcampaign/BottomNavBar";
import Budgeting from "./Budgeting";
import ReviewNewCampaign from "./ReviewNewCampaign";
import CreateCampaignFields from "./CreateCampaignFields";
import { scrollToTop } from "../../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { getCampaignDetails } from "../../../../redux/action-creator/campaignAction";
import { useHistory, useLocation } from "react-router";

const CreateNewCampaign = () => {
  const [step, setStep] = useState(1);
  const history = useHistory();

  const [campaignData, setCampaignData] = React.useState({
    campaign_name: "",
    subbrand: "",
    cost_model: "CPC",
  });
  const [values, setValues] = React.useState([]);

  const [error, setError] = React.useState({
    campaignName: "",
    products: "",
    category: "",
    campaignBudget: "",
    startDate: "",
    endDate: "",
    subbrand: "",
  });
  React.useEffect(() => {
    setError({
      ...error,
      category: "",
    });
  }, [campaignData.category]);
  React.useEffect(() => {
    setError({
      ...error,
      subbrand: "",
    });
  }, [campaignData.subbrand]);
  React.useEffect(() => {
    setError({
      ...error,
      campaignName: "",
    });
  }, [campaignData.campaign_name]);
  React.useEffect(() => {
    setError({
      ...error,
      startDate: "",
    });
  }, [campaignData.start_duration]);
  React.useEffect(() => {
    setError({
      ...error,
      endDate: "",
    });
  }, [campaignData.end_duration]);
  React.useEffect(() => {
    setError({
      ...error,
      campaignBudget: "",
    });
  }, [campaignData.campaign_budget]);
  React.useEffect(() => {
    setError({
      ...error,
      products: "",
    });
  }, [campaignData.products]);

  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("campaignData", campaignData);
  //   // eslint-disable-next-line no-console
  //   console.log("campaignData error", error);
  // }, [campaignData]);

  React.useEffect(() => {
    if (localStorage.getItem("refreshCount") == 0) {
      history.go(0);
    }
    localStorage.setItem("refreshCount", 1);
  }, []);

  const dispatch = useDispatch();
  const location = useLocation();
  React.useEffect(() => {
    // console.log("3hurfbrhfb3vk", location?.state);
  }, [location?.state]);

  const campaignId = location?.state;
  React.useEffect(() => {
    if (campaignId) {
      dispatch(getCampaignDetails(campaignId));
    }
  }, []);
  const { campaignDetails } = useSelector((state) => state?.CampaignReducer);
  React.useEffect(() => {
    if (campaignDetails) {
      if (campaignId) {
        setCampaignData({
          ...campaignDetails,
        });
        setStep(3);

        // setCampaignData((prevValue) => ({
        //   ...prevValue,
        //   test: campaignDetails?.test,
        // }));
      }
    }
  }, [campaignDetails]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCampaignData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const getFormHandler = (formNumber) => {
    scrollToTop();
    switch (formNumber) {
      case 1:
        return (
          <CreateCampaignFields
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            setError={setError}
            error={error}
            setValues={setValues}
            values={values}
          />
        );
      case 2:
        return (
          <Budgeting
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            error={error}
          />
        );
      case 3:
        return <ReviewNewCampaign campaignData={campaignData} />;
      default:
        break;
    }
  };
  let componentRenderer = React.useMemo(
    () => getFormHandler(step),
    [step, campaignData, error, values]
  );

  return (
    <>
      <div className="dashboard__card pb-16 ">
        <h4 className="createnewcamp__heading">New PLA Campaign</h4>
        <div>
          <Stepper step={step} />
        </div>
        {componentRenderer}

        <BottomNavBar
          step={step}
          setStep={setStep}
          campaignData={campaignData}
          setCampaignData={setCampaignData}
          setError={setError}
          error={error}
        />
      </div>
    </>
  );
};

export default CreateNewCampaign;
