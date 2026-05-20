import React from "react";
import { Link } from "react-router-dom";
import { APPLICATION_ROUTES } from "../../../utils/constants";

const OuterContainer = ({
  logo,
  title,
  children,
  footerless,
  customeOuterContainer,
  customOuterLink,
}) => {
  let LINK;
  switch (JSON.parse(localStorage.getItem("platform_type"))) {
    case "/blinkit":
      LINK = APPLICATION_ROUTES.BLINKITCAMPAING;
      break;
    case "/instamart":
      LINK = APPLICATION_ROUTES.INSTAMARTCAMPAIGNMANAGER;
      break;
    case "/flipkart":
      LINK = APPLICATION_ROUTES.FLIPKARTCAMPAING;
      break;
    case "/amazon":
      LINK = APPLICATION_ROUTES.AMAZONADVERTISE;
      break;
    case "/zepto":
      // eslint-disable-next-line no-unused-vars
      LINK = APPLICATION_ROUTES.ZEPTOCAMPAING;

      break;
  }
  return (
    <>
      <div
        className={[
          "outerContainer",
          customeOuterContainer,
          customOuterLink,
        ].join(" ")}
      >
        <div className="outerContainer__header ">
          <div>
            <div className="row ">
              <div className={["outerContainer__image"].join("")}>
                <img className="px-2 pt-1 " src={logo} alt="" />
              </div>
              <div className="outerContainer__title self-center font-semibold">{title}</div>
              <div className="pt-1.5 pl-1.5">
                {/* <div className=" tableHead-btn text-xs bg-[#E36A5F]">{customBtn}</div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="outerContainer__content">{children}</div>
        {!footerless && (
          <div className="outerContainer__footer">
            <div className="outerContainer__link">
              <Link
                to={
                  JSON.parse(localStorage.getItem("platform_type")) ===
                  "/blinkit"
                    ? APPLICATION_ROUTES.BLINKITCAMPAING
                    : JSON.parse(localStorage.getItem("platform_type")) ===
                      "/amazon"
                    ? APPLICATION_ROUTES.AMAZONADVERTISE + '?tab=campaign'
                    : JSON.parse(localStorage.getItem("platform_type")) ===
                      "/zepto"
                    ? APPLICATION_ROUTES.ZEPTOCAMPAING
                    : JSON.parse(localStorage.getItem("platform_type")) ===
                      "/instamart"
                    ? APPLICATION_ROUTES.INSTAMARTCAMPAIGNMANAGER
                    : APPLICATION_ROUTES.FLIPKARTCAMPAING
                }
              >
                All Campaigns
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OuterContainer;
