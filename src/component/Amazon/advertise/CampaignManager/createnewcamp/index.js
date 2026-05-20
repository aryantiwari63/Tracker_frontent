import React from "react";
import AdGroupSetting from "./AdGroupSetting";
import Products from "./Products";
import TargetingOptionsAms from "./targeting";
import CampaignBidding from "./campaign";
import Settings from "./settings";
import Header from "./Header";
import Footer from "./Footer";
import { useSelector } from "react-redux";

const AmsCreateNewCampaign = () => {
  let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);

  const [campaignData, setCampaignData] = React.useState({
    start_date: new Date().toLocaleDateString("en-CA"),
    profile_id: amazonProfile,
    bid: "3",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCampaignData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("campaignData", campaignData);
  // }, [campaignData]);
  return (
    <>
      <div className="px-5">
        <Header />
      </div>

      <div className="px-10">
        <AdGroupSetting
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
        />
        <Products
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
        />
        <div className="py-4">
          {" "}
          <TargetingOptionsAms
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
          />
        </div>
        <label className="font-semibold my-6 text-lg px-4">Campaign</label>
        <CampaignBidding
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
        />
        <Settings
          setCampaignData={setCampaignData}
          campaignData={campaignData}
          handleChange={handleChange}
        />
      </div>
      <Footer setCampaignData={setCampaignData} campaignData={campaignData} />
    </>
  );
};

export default AmsCreateNewCampaign;
