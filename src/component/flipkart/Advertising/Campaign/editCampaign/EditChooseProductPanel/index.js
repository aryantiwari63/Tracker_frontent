import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBrandsByAccount,
  getCategories,
} from "../../../../../../redux/action-creator/campaignAction";
import EditLeftPanel from "./EditLeftPanel";
import EditRightPanel from "./EditRightPanel";

const EditChooseProductPanel = ({
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

  // React.useEffect(() => {
  //   dispatch(getCategories([]));
  // }, []);
  const client_name = localStorage.getItem("client_name");

  React.useEffect(() => {
    if (selectedBrand.length > 0) {
      dispatch(getCategories(selectedBrand, campaignData.platform));
      if (client_name == "Bajaj") {
        dispatch(getBrandsByAccount(campaignData.brand));
      }
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
          <EditLeftPanel
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
          <EditRightPanel
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

export default EditChooseProductPanel;
