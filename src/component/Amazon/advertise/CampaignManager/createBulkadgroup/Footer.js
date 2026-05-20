/* eslint-disable */
import React from "react";
import {
  createAmazonCampaign,
  createAmazonMultiAdgroup,
} from "../../../../../redux/action-creator/amazon/amazonCreateCampaign";
import { useDispatch } from "react-redux";
import { APPLICATION_ROUTES } from "../../../../../utils/constants";
import { useHistory } from "react-router-dom";

const Footer = ({ setCampaignData, campaignData }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const createCampaign = () => {
    dispatch(createAmazonMultiAdgroup(campaignData));
    history.push(APPLICATION_ROUTES.AMAZONADVERTISE);
  };
  return (
    <header className=" py-4 px-10 flex justify-end  ">
      <div className="flex items-center">
        <div className="space-x-4">
          {/* <button className="bg-gray-400 text-white px-4 py-2 rounded-2xl">
						Save as Draft
					</button> */}

          <button
            className="bg-orange-400 text-white px-4 py-2 rounded-2xl"
            onClick={createCampaign}
          >
            Launch Campaign
          </button>
        </div>
      </div>
    </header>
  );
};

export default Footer;
