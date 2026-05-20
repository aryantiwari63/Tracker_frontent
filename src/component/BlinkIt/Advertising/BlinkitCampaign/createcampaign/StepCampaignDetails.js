import React from "react";
import NewStepCaption from "./NewStepCaption";
import ProductRightPanel from "./campaigndetails/ProductRightPanel";
import ProductLeftPanel from "./campaigndetails/ProductLeftPanel";
import Btn from "./button/Btn";
import Button from "../../../../common-components/button/Button";

const StepCampaignDetails = ({
  active,
  setActive,
  setCampaignData,
  campaignData,
  handleChange,
}) => {
  const [selectedData, setSelectedData] = React.useState([]);
  const [error, setError] = React.useState({
    products: "",
  });
  React.useEffect(() => {
    if (campaignData?.products?.length > 0) {
      setError({
        ...error,
        products: "",
      });
    }
  }, [campaignData?.products]);

  return (
    <>
      {active === 3 ? (
        <>
          <NewStepCaption
            caption="Select campaign products"
            subcaption={
              selectedData && selectedData?.length
                ? ""
                : "Choose your campaign products using filters, search, or bulk upload"
            }
          />

          <div className="flex" style={{ height: "600px" }}>
            <div className="w-1/2 pr-2 h-full">
              <ProductLeftPanel
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                active={active}
                setActive={setActive}
              />
            </div>
            <div className="w-1/2 pl-2 h-full">
              <ProductRightPanel
                selectedProduct={selectedData}
                setSelectedProduct={setSelectedData}
                setCampaignData={setCampaignData}
                campaignData={campaignData}
                handleChange={handleChange}
              />
            </div>
          </div>
          <div className="row pt-4 border-t justify-end">
            {error.products && <p className="errorText">{error.products}</p>}
            <div className="ml-6 text-end">
              <Button
                title="Done"
                platform={"blinkit"}
                blinkit
                type="button"
                click={() => {
                  if (
                    !campaignData?.products ||
                    campaignData?.products?.length == 0
                  ) {
                    setError({
                      ...error,
                      products:
                        "At least 1 product should be selected to promote.",
                    });
                  } else {
                    setCampaignData({
                      ...campaignData,
                      active: [],
                      activeSmartCpm: [],
                      productSectionPassed: true,
                    });
                    setActive(active + 1);
                  }
                }}
              />
            </div>
            <div className="col-auto text-end px-2">
              {active > 3 && (
                <Btn
                  title="Edit"
                  onClick={() => {
                    setActive(3);
                  }}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="row pt-2 px-1">
            <div className="col">
              <p className="text-[11px] text-gray-600 font-semibold">
                Campaign Products
              </p>

              <div className="row gap-1">
                {campaignData?.selectedcheckedproducts?.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className=" searchproductfield__selectedoptions"
                    >
                      {item.name}-{item?.unit}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-end ">
              <Btn
                title="Edit"
                onClick={() => {
                  setActive(3);
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StepCampaignDetails;
