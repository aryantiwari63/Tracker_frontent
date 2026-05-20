import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlinkitBrandSuggestionList } from "../../../../../../../redux/action-creator/blinkit/createCampaignAction";
import LoaderSpinnerBlinkit from "../../../../../../common-components/loader-spinner-blinkit";

const CategoryKeywordContentBrandSuggestion = ({
  setCampaignData,
  campaignData,
}) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch brand suggestion list on mount
  useEffect(() => {
    dispatch(getBlinkitBrandSuggestionList());
  }, [dispatch]);

  // Get brand suggestion list from the redux store
  const { brandSuggestionList } = useSelector(
    (state) => state?.BlinkitCreateCampaignReducer
  );

  // Handle checkbox selection and update selected brands
  const handleCheckBox = (check, data) => {
    let updatedIds;
    if (check) {
      updatedIds = [...selectedCheckBox, data];
      setSelectedCheckBox(updatedIds);
    } else {
      updatedIds = selectedCheckBox.filter(
        (item) => item.brand_id !== data.brand_id
      );
      setSelectedCheckBox(updatedIds);
    }
  };

  // Handle select/deselect all checkbox
  const handleSelectAll = (check) => {
    if (check) {
      const allBrands = brandSuggestionList.map((brand) => ({
        brand_id: brand.brand_id,
        brand_name: brand.brand_name,
        brand_logo: brand.brand_logo,
        number_of_products: brand.number_of_products,
      }));
      setSelectedCheckBox(allBrands);
    } else {
      setSelectedCheckBox([]);
    }
    setSelectAll(check);
  };

  // Update campaign data with selected brands
  useEffect(() => {
    setCampaignData({
      ...campaignData,
      brandDetailsData: selectedCheckBox,
    });
  }, [selectedCheckBox]);

  // Handle search filtering based on brand name
  const filteredBrandList = brandSuggestionList?.filter((brand) =>
    brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [initialSet, setInitialSet] = React.useState(true);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.brandDetailsData &&
      campaignData?.brandDetailsData?.length &&
      initialSet
    ) {
      setTimeout(() => {
        setSelectedCheckBox(campaignData?.brandDetailsData);
      }, [1000]);
      setInitialSet(false);
    }
  }, [campaignData]);

  return (
    <div className="w-1/2 p-4 border rounded-lg border-gray-300 shadow-md bg-white">
      {/* Table Header */}
      <div className="flex items-center mb-1">
        {/* Select All Checkbox */}
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            className={`w-4 h-4 blinkit_product_custom-checkbox full-checkbox`}
            checked={selectAll}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />

          <h2 className="text-lg font-semibold">
            Brands ({selectedCheckBox.length} selected)
          </h2>
        </div>
        <h2 className="text-lg font-semibold text-right w-1/2">
          Number of Products
        </h2>
      </div>

      <div className="mr-2">
        <div className="relative w-full border mt-1 rounded-xl">
          <i className="fas fa-search absolute top-1/2 transform -translate-y-1/2 left-2 text-gray-500"></i>
          <input
            type="text"
            placeholder="Search brand by name"
            className="pl-8 p-2 border border-gray-50 rounded-xl w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {brandSuggestionList && brandSuggestionList.length ? (
          filteredBrandList.map((data) => (
            <div
              key={data.brand_id}
              className="flex items-center justify-between border-b py-2"
            >
              {/* Checkbox */}
              <div className="flex items-center space-x-4 w-1/2">
                <input
                  type="checkbox"
                  className={`w-4 h-4 blinkit_product_custom-checkbox full-checkbox`}
                  checked={selectedCheckBox
                    .map((item) => item.brand_id)
                    .includes(data.brand_id)}
                  onChange={(e) => handleCheckBox(e.target.checked, data)}
                />
                {/* Brand Logo and Name */}
                <div className="flex items-center space-x-2">
                  <img
                    src={data.brand_logo}
                    alt={data.brand_name}
                    className="w-10 h-10 object-contain"
                  />
                  <span className="font-medium">{data.brand_name}</span>
                </div>
              </div>

              {/* Number of Products */}
              <div className="flex items-center space-x-4 w-1/2">
                {data.number_of_products}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center space-x-4 w-1/2">
            <LoaderSpinnerBlinkit />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryKeywordContentBrandSuggestion;
