import React, { useState } from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { useDispatch, useSelector } from "react-redux";
import {
  getBrandsByAccount,
  getCategories,
  // getProducts,
} from "../../../../../redux/action-creator/campaignAction";

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
  const [selectedBrand, setSelectedBrand] = useState("");
  const dispatch = useDispatch();
  const productsData = useSelector(
    (state) => state.CampaignReducer?.products?.product
  );
  const totalData = useSelector(
    (state) => state.CampaignReducer?.products?.totalData
  );
  const { categories } = useSelector((state) => state.CampaignReducer);
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    if (selectedBrand.length > 0) {
      dispatch(getCategories(selectedBrand, campaignData.platform));

      dispatch(getBrandsByAccount(campaignData.brand));
    }
  }, [selectedBrand]);

  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      products: selectedProduct.map((product) => {
        return product.productid;
      }),
      FSNs: selectedProduct.map((product) => {
        return product.productid;
      }),
    });
  }, [selectedProduct]);

  return (
    <>
      <div className="row ">
        <div className="col pr-10">
          <LeftPanel
            productListAccordingToCategories={productsData}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            category={categories}
            error={error}
            totalData={totalData}
            setOffset={setOffset}
            offset={offset}
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
