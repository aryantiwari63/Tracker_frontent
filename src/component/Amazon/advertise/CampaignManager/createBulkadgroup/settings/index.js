import React, { useState } from "react";
// import BlockHeading from "../BlockHeading";
import Tooltip from "../Tooltip";
import { BsChevronDown } from "react-icons/bs";

import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

import {
  AMAZON_CREATE_CAMPAIGN_PORTFOLIO_LIST,
  // AMAZON_GET_EXISTING_CAMPAIGN,
} from "../../../../../../utils/constants";
import { _POST } from "../../../../../../services/axios.method";
// import { useSelector } from "react-redux";

const Settings = ({
  setCampaignData,
  campaignData,
  handleChange,
  formIndex,
  setShowSetting,
  showSetting,
}) => {
  const [portfolio, setPortfolio] = useState("No Portfolio");
  const [portfolioInput, setPortfolioInput] = useState("");
  const [showPortfolioDropdown, setShowPortfolioDropdown] = useState(false);
  const [portfolioOptions, setPortfolioOptions] = React.useState([]);
  // const [existingCampaignOptions, setExistingCampaignOptions] = React.useState(
  //   []
  // );
  const amazonProfile = localStorage.getItem("amazon_profile");

  React.useEffect(() => {
    const getPortfolio = async () => {
      let res;
      if (amazonProfile) {
        res = await _POST(AMAZON_CREATE_CAMPAIGN_PORTFOLIO_LIST, {
          profile_id: amazonProfile,
        });
      }

      if (res) {
        setPortfolioOptions([...res.data.data.data]);
      }
    };

    getPortfolio();
  }, []);
  // React.useEffect(() => {
  //   const getExistingCampaignList = async () => {
  //     let res;
  //     if (amazonProfile) {
  //       res = await _POST(AMAZON_GET_EXISTING_CAMPAIGN, {
  //         profile_id: amazonProfile,
  //       });
  //     }

  //     if (res) {
  //       setExistingCampaignOptions([...res.data.data.data]);
  //     }
  //   };

  //   getExistingCampaignList();
  // }, []);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData[0] &&
      formIndex > 0 &&
      campaignData[0]?.portfolio
    ) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      setPortfolio([...campaignData[0]?.portfolio][0]);
    }
  }, [formIndex]);

  const Minimize = () => {
    setShowSetting(false);
  };
  const Maximize = () => {
    setShowSetting(true);
  };
  const [error, setError] = React.useState("");
  const handleBudget = (event, index) => {
    const { name, value } = event.target;
    if (Number(value) > 21000000) {
      setError("Budget should not be more than ₹2,10,00,000.00");
    } else {
      let data = [...campaignData];
      data[index][name] = value;
      setCampaignData([...data]);
      setError("");
    }
  };
  return (
    <>
      <div className="py-2 rounded-lg">
        {/* <button
          className="pr-3 pt-2"
          onClick={() => {
            Minimize();
          }}
        >
          <AiOutlineUp />
        </button>

        <button
          className="pr-3 pt-2"
          onClick={() => {
            Maximize();
          }}
        >
          <AiOutlineDown />
        </button>
        <div className="border">
          <BlockHeading
            heading={"Settings"}
            subheading={"How to setup you campaign"}
          />
        </div> */}
        <div className="row font-semibold text-2xl py-4 ">
          Settings
          {showSetting ? (
            <button
              className="pr-3 pt-2"
              onClick={() => {
                Minimize();
              }}
            >
              <AiOutlineUp />
            </button>
          ) : (
            <button
              className="pr-3 pt-2"
              onClick={() => {
                Maximize();
              }}
            >
              <AiOutlineDown />
            </button>
          )}
        </div>
        {showSetting ? (
          <div className="border border-t-0 px-3 py-4  bg-white">
            <form>
              {/* <div>
              <label className="font-semibold">
                Campaign name <Tooltip />
              </label>
              <div>
                <div>
                  <input
                    className="border col_3 px-2 py-1"
                    type="text"
                    name="campaign_name"
                    id="campaign_name"
                    placeholder="Enter campaign name"
                    onChange={(e) => handleChange(e, formIndex)}
                    value={
                      campaignData &&
                      campaignData?.find(({ index }) => index === formIndex)
                        ?.campaign_name
                    }
                  />
                
                </div>
              </div>
            </div> */}
              {/* portfolio */}
              {campaignData &&
              campaignData?.find(({ index }) => index === formIndex)
                ?.existing_campaign ? (
                <p className="duplicateKeyword">
                  These values can cannot be set post creation of the Campaign.
                </p>
              ) : null}

              <div>
                <label className="font-semibold">
                  Portfolio <Tooltip />
                </label>
                <div>
                  <div className="rounded-3xl bg-gray-300 col_3 px-2 py-1 relative">
                    <div
                      className="row justify-between items-center"
                      onClick={() =>
                        campaignData &&
                        campaignData?.find(({ index }) => index === formIndex)
                          ?.existing_campaign
                          ? setShowPortfolioDropdown(false)
                          : setShowPortfolioDropdown(!showPortfolioDropdown)
                      }
                    >
                      <div>
                        {campaignData &&
                        campaignData?.find(({ index }) => index === formIndex)
                          ?.portfolio?.length
                          ? campaignData?.find(
                              ({ index }) => index === formIndex
                            )?.portfolio[0]
                          : portfolio}
                      </div>
                      <BsChevronDown />
                    </div>
                    {showPortfolioDropdown && (
                      <div className="absolute top-0 left-0 w-full bg-white max-h-72 overflow-y-auto py-4 border z-10">
                        <div className="px-2">
                          <input
                            type="text"
                            className="border rounded-md px-2 py-1 w-full"
                            value={portfolioInput}
                            onChange={(e) => {
                              setPortfolioInput(e.target.value);
                            }}
                          />
                        </div>
                        <div>
                          {portfolioOptions?.map((item, i) => {
                            return (
                              item.label
                                .toLowerCase()
                                .startsWith(portfolioInput.toLowerCase()) && (
                                <div
                                  key={i}
                                  className={[
                                    "portfolio__options",
                                    portfolio === item.label &&
                                      "portfolio__options--active",
                                  ].join(" ")}
                                  onClick={() => {
                                    setPortfolio(item.label);
                                    setShowPortfolioDropdown(false);
                                    // setCampaignData({
                                    //   ...campaignData,
                                    //   portfolio: [item.label, item.value],
                                    // });
                                    let data = campaignData;
                                    if (data && data[formIndex]) {
                                      data[formIndex]["portfolio"] = [
                                        item.label,
                                        item.value,
                                      ];
                                    }

                                    setCampaignData([...data]);
                                  }}
                                >
                                  {item.label}
                                </div>
                              )
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* date select */}
              <div className="col_5">
                <div className="row py-4">
                  <div className="col">
                    <label className="font-semibold">
                      Start <Tooltip />
                    </label>
                    <div>
                      <input
                        type="date"
                        className="border py-1 px-2  rounded-lg"
                        // value={new Date().toLocaleDateString("en-CA")}
                        name="start_date"
                        id="start_date"
                        placeholder="Enter start date"
                        onChange={(e) => handleChange(e, formIndex)}
                        disabled={
                          campaignData &&
                          campaignData?.find(({ index }) => index === formIndex)
                            ?.existing_campaign
                            ? campaignData?.find(
                                ({ index }) => index === formIndex
                              )?.existing_campaign
                            : false
                        }
                        value={
                          campaignData &&
                          campaignData?.find(({ index }) => index === formIndex)
                            ?.start_date
                        }
                        min={new Date().toLocaleDateString("en-CA")}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <label className="font-semibold">
                      End <Tooltip />
                    </label>
                    <div>
                      <input
                        type="date"
                        className="border py-1 px-2  rounded-lg"
                        name="end_date"
                        id="end_date"
                        placeholder="Enter end date"
                        onChange={(e) => handleChange(e, formIndex)}
                        value={
                          campaignData &&
                          campaignData?.find(({ index }) => index === formIndex)
                            ?.end_date
                        }
                        disabled={
                          campaignData &&
                          campaignData?.find(({ index }) => index === formIndex)
                            ?.existing_campaign
                            ? campaignData?.find(
                                ({ index }) => index === formIndex
                              )?.existing_campaign
                            : false
                        }
                        min={
                          campaignData &&
                          campaignData?.find(({ index }) => index === formIndex)
                            ?.start_date
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* country */}
              <div>
                <label className="font-semibold">Country</label>
                <div>India</div>
              </div>
              {/* daily budget */}
              <div>
                <label className="font-semibold">
                  Daily budget <Tooltip />
                </label>
                <div>
                  <div className="rounded-3xl bg-white px-2 py-1 border">
                    ₹
                    <input
                      type="number"
                      className="border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      name="budget"
                      id="budget"
                      placeholder="Enter budget"
                      // onChange={(e) => handleChange(e, formIndex)}
                      onChange={(e) => {
                        handleBudget(e, formIndex);
                      }}
                      value={
                        campaignData &&
                        campaignData?.find(({ index }) => index === formIndex)
                          ?.budget
                          ? campaignData?.find(
                              ({ index }) => index === formIndex
                            )?.budget
                          : null
                      }
                      disabled={
                        campaignData &&
                        campaignData?.find(({ index }) => index === formIndex)
                          ?.existing_campaign
                          ? campaignData?.find(
                              ({ index }) => index === formIndex
                            )?.existing_campaign
                          : false
                      }
                      // max={10}
                    />
                    {error ? <p className="errorText">{error}</p> : null}
                  </div>
                </div>
                {/* <div>
                Suggested daily budget ₹ <span className="text-blue-400">{"66,425.00"}</span> <Tooltip />{" "}
                <span className="bg-green-500 px-1 py-0.5 text-white font-bold rounded-md">
                  New
                </span>
              </div>
              <div className="row">
                <AiFillExclamationCircle className="text-blue-400"/>
               <label>Suggested budget increase the chance that your campaign will run
                throughout the day.</label> 
              </div> */}
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Settings;
