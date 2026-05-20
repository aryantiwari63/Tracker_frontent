import React, { useState } from "react";
import BlockHeading from "../BlockHeading";
import Tooltip from "../Tooltip";
import { BsChevronDown } from "react-icons/bs";
// import { AiFillExclamationCircle } from "react-icons/ai";
import {
  // AMAZON_CREATE_CAMPAIGN_PORTFOLIO_LIST,
  AMAZON_GET_EXISTING_CAMPAIGN,
  AMAZON_GET_EXISTING_CAMPAIGN_DETAILS,
} from "../../../../../../utils/constants";
import { _POST } from "../../../../../../services/axios.method";
import { useSelector } from "react-redux";

const CampaignSelection = ({
  setCampaignData,
  campaignData,
  formIndex,
  setShowSetting,
}) => {
  const [campaign, setCampaign] = useState("");
  const [campaignInput, setCampaignInput] = useState("");
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = React.useState([]);
  const [campaignOptions, setCampaignOptions] = React.useState([]);
  // const [campaignDetails, setCampaignDetails] = React.useState();
  const amazonProfile = localStorage.getItem("amazon_profile");
  let { selectedCheckBox } = useSelector((state) => state?.CampaignReducer);
  React.useEffect(() => {
    if (
      selectedCheckBox &&
      selectedCheckBox["campaign"] &&
      selectedCheckBox["campaign"].length == 1 &&
      selectedCheckBox["campaign"][0]?.state != "ARCHIVED"
    ) {
      // console.log("campaignData existing", selectedCheckBox["campaign"][0]);
      setSelectedCampaign([selectedCheckBox["campaign"][0]]);
    }
  }, []);
  React.useEffect(() => {
    if (selectedCampaign?.length) {
      setCampaign(selectedCheckBox["campaign"][0]["campaign_name"]);

      let data = campaignData;
      if (data && data[formIndex]) {
        data[formIndex]["campaign_name"] =
          selectedCheckBox["campaign"][0]["campaign_name"];
        data[formIndex]["campaign_id"] =
          selectedCheckBox["campaign"][0]["campaign_id"];
        data[formIndex]["existing_campaign"] = true;
        data[formIndex]["start_date"] =
          selectedCheckBox["campaign"][0]["start_date"];
        data[formIndex]["end_date"] =
          selectedCheckBox["campaign"][0]["end_date"];
        data[formIndex]["budget"] = Number(
          selectedCheckBox["campaign"][0]["budget"]
        );
      }

      setCampaignData([...data]);
      setShowSetting(false);
      getCampaignListDetails(selectedCheckBox["campaign"][0]["campaign_id"]);
    }
  }, [selectedCampaign]);
  const getExistingCampaignList = async () => {
    let res;
    if (amazonProfile) {
      res = await _POST(AMAZON_GET_EXISTING_CAMPAIGN, {
        profile_id: amazonProfile,
        search: campaignInput,
      });
    }

    if (res) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      setCampaignOptions([...res?.data?.data?.data]);
    }
  };
  const getCampaignListDetails = async (campid) => {
    let res;
    if (campid) {
      res = await _POST(AMAZON_GET_EXISTING_CAMPAIGN_DETAILS, {
        campaign_id: campid,
      });
    }
    // console.log("campaignData ressss", res?.data?.data?.data[0]);

    if (res?.data) {
      // setCampaignDetails(res?.data?.data?.data[0]);

      let data = campaignData;
      if (data && data[formIndex]) {
        data[formIndex]["campaign_name"] =
          res?.data?.data?.data[0]["campaign_name"];
        data[formIndex]["campaign_id"] =
          res?.data?.data?.data[0]["campaign_id"];
        data[formIndex]["existing_campaign"] = true;
        data[formIndex]["start_date"] = res?.data?.data?.data[0]["start_date"];
        data[formIndex]["end_date"] = res?.data?.data?.data[0]["end_date"];
        data[formIndex]["budget"] = Number(res?.data?.data?.data[0]["budget"]);
        data[formIndex]["portfolio"] = res?.data?.data?.data[0]["portfolio"];
      }

      setCampaignData([...data]);
    }
  };
  React.useEffect(() => {
    getExistingCampaignList();
  }, []);
  React.useEffect(() => {
    getExistingCampaignList();
  }, [campaignInput]);

  return (
    <>
      <div className="py-2 rounded-lg">
        <div className="border">
          <BlockHeading
            heading={"Choose campaign"}
            subheading={"How to setup your campaign"}
          />
        </div>
        <div className="border border-t-0 px-3 py-4  bg-white">
          <form>
            <div>
              <label className="font-semibold">
                Campaign name <Tooltip />
              </label>
              <div>
                <div className="rounded-3xl bg-gray-300 col_3 px-2 py-1 relative">
                  <div
                    className="row justify-between items-center"
                    onClick={() =>
                      setShowCampaignDropdown(!showCampaignDropdown)
                    }
                  >
                    <div>{campaign}</div>
                    <BsChevronDown />
                  </div>
                  {showCampaignDropdown && (
                    <div className="absolute top-0 left-0 w-full bg-white max-h-72 overflow-y-auto py-4 border z-10">
                      <div className="px-2">
                        <input
                          type="text"
                          className="border rounded-md px-2 py-1 w-full"
                          value={campaignInput}
                          onChange={(e) => {
                            setCampaignInput(e.target.value);
                          }}
                          name="campaign_name"
                          id="campaign_name"
                          placeholder="Enter campaign name"
                        />
                      </div>
                      <div>
                        {campaignOptions && campaignOptions?.length ? (
                          campaignOptions?.map((item, i) => {
                            return (
                              // item.label
                              //   .toLowerCase()
                              //   .startsWith(campaignInput.toLowerCase()) && (
                              <div
                                key={i}
                                className={[
                                  "portfolio__options",
                                  campaign === item.label &&
                                    "portfolio__options--active",
                                ].join(" ")}
                                onClick={() => {
                                  setCampaign(item.label);
                                  setShowCampaignDropdown(false);
                                  // setCampaignData({
                                  //   ...campaignData,
                                  //   portfolio: [item.label, item.value],
                                  // });
                                  let data = campaignData;
                                  if (data && data[formIndex]) {
                                    data[formIndex]["campaign_name"] =
                                      item.label;
                                    data[formIndex]["campaign_id"] = item.value;
                                    data[formIndex]["existing_campaign"] = true;
                                  }

                                  setCampaignData([...data]);
                                  setShowSetting(false);
                                  getCampaignListDetails(item.value);
                                }}
                              >
                                {item.label}
                              </div>
                              // )
                            );
                          })
                        ) : (
                          <button
                            onClick={() => {
                              setCampaign(campaignInput);
                              let data = campaignData;
                              if (data && data[formIndex]) {
                                data[formIndex]["campaign_name"] =
                                  campaignInput;
                                data[formIndex]["existing_campaign"] = false;

                                data[formIndex]["campaign_id"] = null;
                                data[formIndex]["start_date"] =
                                  new Date().toLocaleDateString("en-CA");
                                data[formIndex]["end_date"] = null;
                                data[formIndex]["budget"] = null;
                                data[formIndex]["portfolio"] = null;
                              }

                              setCampaignData([...data]);
                              setShowCampaignDropdown(false);
                              setShowSetting(true);
                            }}
                          >
                            Create new
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CampaignSelection;
