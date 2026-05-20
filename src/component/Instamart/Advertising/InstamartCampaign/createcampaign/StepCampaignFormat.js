import React from "react";
import NewStepCaption from "./NewStepCaption";
import CardAdvertise from "./CardAdvertise";
import Performance from "./performance";
import Button from "../../../../common-components/button/Button";
import Btn from "./button/Btn";

const StepCampaignFormat = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  // const [advertiseObject, setAdvertiseObject] = useState("");
  // const [adasset, setAdasset] = useState("");
  const [error, setError] = React.useState({
    campaign_type: "",
    product_booster: "",
  });
  React.useEffect(() => {
    setError({
      ...error,
      campaign_type: "",
    });
  }, [campaignData.campaign_type]);
  React.useEffect(() => {
    setError({
      ...error,
      product_booster: "",
    });
  }, [campaignData.product_booster]);
  // React.useEffect(() => {
  //   console.log("campaignData errorerror", error);
  // }, [error]);
  return (
    <>
      {active === 1 ? (
        <>
          <NewStepCaption
            caption="  What's your advertising objective?"
            subcaption=" We'll help you select the right advertising format based on that"
          />
          <div className="row border-b">
            <CardAdvertise
              title="Reach"
              caption="Get visibility for your brand and build recall"
              // value={advertiseObject}
              // setValue={setAdvertiseObject}
              campaignData={campaignData}
              setCampaignData={setCampaignData}
              handleChange={handleChange}
              error={error}
            />
            <CardAdvertise
              title="Performance"
              caption="Drive sales performance and product visibility"
              // value={advertiseObject}
              // setValue={setAdvertiseObject}
              campaignData={campaignData}
              setCampaignData={setCampaignData}
              handleChange={handleChange}
              error={error}
            />
          </div>
          {campaignData?.campaign_type === "Performance" && (
            <Performance
              // adasset={adasset}
              // setAdasset={setAdasset}
              campaignData={campaignData}
              setCampaignData={setCampaignData}
              handleChange={handleChange}
              error={error}
            />
          )}

          <div className="row pt-4 border-t ">
            <Button
              title="Done"
              blinkit
              type="button"
              // disable={
              //   campaignData?.campaign_type === "" ||
              //   campaignData?.product_booster === ""
              // }
              click={() => {
                if (!campaignData.campaign_type) {
                  setError({
                    ...error,
                    campaign_type: "Please select an objective.",
                  });
                } else if (!campaignData.product_booster) {
                  setError({
                    ...error,
                    product_booster: "Please select an asset type.",
                  });
                } else {
                  setActive(active + 1);
                }
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="row pt-2 px-1">
            <div className="col_4 ">
              <p className="text-[11px] text-gray-600 font-semibold">
                Objective
              </p>
              <p className="font-semibold text-base">
                {campaignData?.campaign_type}
              </p>
            </div>
            <div className="col_4">
              <p className="text-[11px] text-gray-600 font-semibold">
                Ad asset
              </p>
              <p className="font-semibold text-base">
                {campaignData?.product_booster}
              </p>
            </div>
            <div className="col_4 text-end ">
              <Btn
                title="Edit"
                onClick={() => {
                  setActive(1);
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StepCampaignFormat;
