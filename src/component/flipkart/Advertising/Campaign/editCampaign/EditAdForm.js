import React from "react";

const EditAdForm = ({  campaignData, handleChange }) => {
  return (
    <>
      <div>
        <h2 className="adform__heading ">
          Where do you want to show your ad?{" "}
        </h2>
        <div className="row">
          <label htmlFor="flipkart" className="adform__radio ">
            <input
              type="radio"
              id="flipkart"
              name="platform"
              checked={
                campaignData?.Flipkartplatform ||
                campaignData?.platform == "Flipkart"
              }
              // value="Flipkart"
              onChange={handleChange}
              value={
                campaignData?.Flipkartplatform
                  ? campaignData?.Flipkartplatform
                  : "Flipkart"
              }
              disabled
            />
            <div className="adform__image">
              <img
                src="/assets/images/flipkart-logo.png"
                height="100%"
                width="100%"
                alt=""
              />
            </div>
          </label>
          <label htmlFor="supermart" className="adform__radio ">
            <input
              type="radio"
              id="supermart"
              name="platform"
              checked={
                campaignData?.Supermartplatform ||
                campaignData?.platform == "Supermart"
              }
              // value="Supermart"
              onChange={handleChange}
              value={
                campaignData?.Supermartplatform
                  ? campaignData?.Supermartplatform
                  : "Supermart"
              }
              disabled
            />
            <div className="adform__supermartimage">
              <img
                src="/assets/images/supermart-logo.png"
                height="100%"
                width="100%"
              />
            </div>
          </label>
        </div>
      </div>
    </>
  );
};
export default EditAdForm;
