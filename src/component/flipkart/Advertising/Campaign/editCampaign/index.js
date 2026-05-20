import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import EditCampaignFields from "./EditCampaignFields";
import EditBudgeting from "./EditBudgeting";
import EditReviewNewCampaign from "./EditReviewNewCampaign";
import EditStepper from "./EditStepper";
import EditBottomNavBar from "./EditBottomNavBar";
import { scrollToTop } from "../../../../../utils/helpers";
import { getCampaignDetails } from "../../../../../redux/action-creator/campaignAction";

const EditCampaign = () => {
  const [step, setStep] = useState(1);
  const [campaignEditData, setCampaignEditData] = React.useState({
    campaign_name: "",
  });
  const [values, setValues] = React.useState([]);

  const [error, setError] = React.useState({
    campaignName: "",
    products: "",
    category: "",
    campaignBudget: "",
    startDate: "",
    endDate: "",
  });
  React.useEffect(() => {
    setError({
      ...error,
      category: "",
    });
  }, [campaignEditData.category]);
  React.useEffect(() => {
    setError({
      ...error,
      campaignName: "",
    });
  }, [campaignEditData.campaign_name]);
  React.useEffect(() => {
    setError({
      ...error,
      startDate: "",
    });
  }, [campaignEditData.start_duration]);
  React.useEffect(() => {
    setError({
      ...error,
      endDate: "",
    });
  }, [campaignEditData.end_duration]);
  React.useEffect(() => {
    setError({
      ...error,
      campaignBudget: "",
    });
  }, [campaignEditData.campaign_budget]);
  React.useEffect(() => {
    setError({
      ...error,
      products: "",
    });
  }, [campaignEditData.products]);

  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("campaignEditData", campaignEditData);
  // }, [campaignEditData]);
  React.useEffect(() => {
    // console.log("campaignData errorerror", error);
  }, [error]);
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
        setCampaignEditData({
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
    setCampaignEditData((prevState) => {
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
          <EditCampaignFields
            setCampaignData={setCampaignEditData}
            campaignData={campaignEditData}
            handleChange={handleChange}
            setError={setError}
            error={error}
            setValues={setValues}
            values={values}
          />
        );
      case 2:
        return (
          <EditBudgeting
            setCampaignData={setCampaignEditData}
            campaignData={campaignEditData}
            handleChange={handleChange}
            error={error}
          />
        );
      case 3:
        return <EditReviewNewCampaign campaignData={campaignEditData} />;
      default:
        break;
    }
  };
  let componentRenderer = React.useMemo(
    () => getFormHandler(step),
    [step, campaignEditData, error, values]
  );

  return (
    <>
      <div className="dashboard__card pb-16 ">
        <h4 className="createnewcamp__heading">New PLA Campaign</h4>
        <div>
          <EditStepper step={step} />
        </div>
        {componentRenderer}

        <EditBottomNavBar
          step={step}
          setStep={setStep}
          campaignData={campaignEditData}
          setCampaignData={setCampaignEditData}
          setError={setError}
          error={error}
          campaignDetails={campaignDetails}
        />
      </div>
    </>
  );
};

export default EditCampaign;
