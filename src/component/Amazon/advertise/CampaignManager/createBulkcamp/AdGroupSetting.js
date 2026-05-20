/* eslint-disable */
import React, { useState } from "react";
import { BiMessageSquareError } from "react-icons/bi";
import {
  AiFillQuestionCircle,
  AiOutlineExclamation,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import "./styles.css";
import CreateAdGroupSteps from "./Products/CreateAdGroupSteps";
import BlockHeading from "./BlockHeading";
import Tooltip from "./Tooltip";

const AdGroupSetting = ({
  setCampaignData,
  campaignData,
  handleChange,
  formIndex,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <>
      <section>
        <div className="row pb-4">
          <div className="row font-semibold text-2xl py-4 ">
            {formIndex ? Number(formIndex) + 1 : 1} &nbsp; Ad Groups
          </div>
          <p className=" text-base">
            Ad group of ads within a campaign that share the same set of
            targetings tactics or creative types.They can help you organize your
            campaign more efficiently.Consder grouping products that fall within
            the same category and price range. You can certainly additional ad
            groups in campaign manager after launch your campaign.
            <span className="text-blue-400 underline pl-1">Learn more</span>
          </p>
        </div>
        <div className="border ">
          <BlockHeading
            heading={"Ad group settings"}
            subheading={" How to create ad group"}
          />
        </div>

        <div className="row  px-4 mb-4 border py-4 bg-white">
          <label className="font-bold text-base pr-2">Ad group name</label>
          <Tooltip />

          <div className="row">
            <input
              type="text"
              className="border px-2 rounded-md w-60 py-2 outline-none"
              id="adgroup_name"
              name="adgroup_name"
              placeholder="Enter adgroup name"
              onChange={(e) => handleChange(e, formIndex)}
              value={
                campaignData &&
                campaignData?.find(({ index }) => index === formIndex)
                  ?.adgroup_name
              }
            />
          </div>
          <div className="py-2 row hidden">
            <AiOutlineExclamation className="text-red-600 text-sm pt-0.5" />
            <label className="text-red-600 text-sm ">
              Enter a adgroup name
            </label>
          </div>
          {/* <div className="row text-blue-400 text-sm">Quick Fix</div> */}
        </div>
        <div className=""></div>
      </section>
    </>
  );
};

export default AdGroupSetting;
