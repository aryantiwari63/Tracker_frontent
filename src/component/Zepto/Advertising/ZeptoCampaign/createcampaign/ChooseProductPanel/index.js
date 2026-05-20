import React, { useState } from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

const ChooseProductPanel = ({
  setCampaignData,
  campaignData,
  handleChange,
  setValues,
  values,
  setError,
  error,
}) => {
  const [selectedProduct, setSelectedProduct] = useState([]);

  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      productId: selectedProduct.map((product) => {
        return product.product_id;
      }),
    });
  }, [selectedProduct]);

  return (
    <>
      <div className="row ">
        <div className="col pr-10">
          <LeftPanel
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            error={error}
          />
        </div>
        <div className="  rightpanel">
          <RightPanel
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            setError={setError}
            error={error}
          />
        </div>
      </div>
    </>
  );
};

export default ChooseProductPanel;
