import React from "react";
import AdGroupSetting from "./AdGroupSetting";
import Products from "./Products";
import TargetingOptionsAms from "./targeting";
import CampaignBidding from "./campaign";
import Settings from "./settings";
import Header from "./Header";
import Footer from "./Footer";

const AmsCreateNewCampaign = () => {
  // let { amazonProfile } = useSelector((state) => state?.AmazonProfileReducer);
  const amazonProfile = localStorage.getItem("amazon_profile");

  const [value, setValue] = React.useState("1");
  let data = new Array(Number(value)).fill(Number(value));

  const [campaignData, setCampaignData] = React.useState([
    {
      start_date: new Date().toLocaleDateString("en-CA"),
      profile_id: amazonProfile,
      bid: "3",
      asins: [],
      index: 0,
      campaign_name: "testCam" + "copy",
      adgroup_name: "testAd",
      budget: null,
      end_date: null,
      portfolio: null,
      target: "manual",
      ManualTargeting: "keyword",
      dynamicBid: "LEGACY_FOR_SALES",
      PLACEMENT_TOP: null,
      PLACEMENT_PRODUCT_PAGE: null,
      PLACEMENT_REST_OF_SEARCH: null,
      negativeKeywords: [],
      keywords: [],
    },
  ]);

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    let data = [...campaignData];
    data[index][name] = value;
    setCampaignData([...data]);
  };
  let initialState = {};
  React.useEffect(() => {
    if (value != "1") {
      initialState = data.map((item, i) => {
        return {
          index: i,
          campaign_name:
            (campaignData[0].campaign_name
              ? campaignData[0].campaign_name
              : "testCam" + "copy") + i,
          adgroup_name:
            (campaignData[0].adgroup_name
              ? campaignData[0].adgroup_name
              : "testAd") + i,
          start_date: new Date().toLocaleDateString("en-CA"),
          profile_id: amazonProfile,
          bid: campaignData[0].bid ? campaignData[0].bid : "3",
          asins: campaignData[0].asins ? campaignData[0].asins : [],
          budget: campaignData[0].budget ? campaignData[0].budget : null,
          end_date: campaignData[0].end_date ? campaignData[0].end_date : null,
          portfolio: campaignData[0].portfolio
            ? campaignData[0].portfolio
            : null,
          target: campaignData[0].target ? campaignData[0].target : "manual",
          dynamicBid: campaignData[0].dynamicBid
            ? campaignData[0].dynamicBid
            : "LEGACY_FOR_SALES",
          ManualTargeting: campaignData[0].ManualTargeting
            ? campaignData[0].ManualTargeting
            : "keyword",
          PLACEMENT_TOP: campaignData[0].PLACEMENT_TOP
            ? campaignData[0].PLACEMENT_TOP
            : null,
          PLACEMENT_PRODUCT_PAGE: campaignData[0].PLACEMENT_PRODUCT_PAGE
            ? campaignData[0].PLACEMENT_PRODUCT_PAGE
            : null,
          PLACEMENT_REST_OF_SEARCH: campaignData[0].PLACEMENT_REST_OF_SEARCH
            ? campaignData[0].PLACEMENT_REST_OF_SEARCH
            : null,
          keywords: campaignData[0].keywords ? campaignData[0].keywords : [],
          negativeKeywords: campaignData[0].negativeKeywords
            ? campaignData[0].negativeKeywords
            : [],
        };
      });

      setCampaignData(initialState);
    }
  }, [value]);

  return (
    <>
      <div className="px-5">
        <Header setValue={setValue} value={value} />
      </div>

      {data.map((item, i) => {
        return (
          <div className="px-10" key={i}>
            <AdGroupSetting
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              formIndex={i}
            />
            <Products
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              formIndex={i}
            />
            <div className="py-4">
              {" "}
              <TargetingOptionsAms
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
                formIndex={i}
              />
            </div>
            <label className="font-semibold my-6 text-lg px-4">Campaign</label>
            <CampaignBidding
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              formIndex={i}
            />
            <Settings
              setCampaignData={setCampaignData}
              campaignData={campaignData}
              handleChange={handleChange}
              formIndex={i}
            />
            <hr
              style={{
                color: "black",
                backgroundColor: "black",
                height: 5,
              }}
            />
          </div>
        );
      })}
      <Footer setCampaignData={setCampaignData} campaignData={campaignData} />
    </>
  );
};

export default AmsCreateNewCampaign;
