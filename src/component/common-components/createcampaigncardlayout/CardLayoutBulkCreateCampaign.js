import React from "react";
import { useHistory } from "react-router-dom";

const CardLayoutBulkCreateCampaign = ({
  title,
  content,
  navigateLink,
  heading,
  picture,
}) => {
  const history = useHistory();
  const navigateToLink = () => {
    history.push(navigateLink);
  };
  return (
    <>
      <button className="row px-4 " type="button" onClick={navigateToLink}>
        <div className="row pb-3">
          <div className="row justify-center">
            {/* <img src={image} height="100%" alt="" /> */}
            <div className="text-base font-semibold">{heading}</div>
          </div>
          <div className="row justify-center">
            {/* <button className="" disabled>
              <IoIosArrowBack />
            </button> */}
            <img src={picture} alt="" height="80%" />
            {/* <button>
              <IoIosArrowForward />
            </button> */}
          </div>
          <div className="row justify-center pt-2 font-semibold text-base">
            {title}
          </div>
          <div className="row text-[#9A9EA5]">{content}</div>
        </div>
        <div className="row bg-[#EF880F] justify-center text-white rounded-md">
          Continue
        </div>
        <div className="row py-4">
          <select disabled className="w-full ">
            <option value="highlight" className="text-base">
              Highlights
            </option>
          </select>
        </div>
      </button>
    </>
  );
};

export default CardLayoutBulkCreateCampaign;
