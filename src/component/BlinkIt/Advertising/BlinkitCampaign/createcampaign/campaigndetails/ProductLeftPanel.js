import React from "react";
import SearchProductFiled from "./SearchProductFiled";
import { _GET, _POST } from "../../../../../../services/axios.method";
import {
  GET_BLINKIT_CREATE_CAMPAIGN_ACCOUNTS,
  GET_BLINKIT_CREATE_CAMPAIGN_CATEGORY,
  GET_BLINKIT_CREATE_CAMPAIGN_PRODUCTS_FROM_CATEGORY,
} from "../../../../../../utils/constants";

import CustomMultiSelectBlinkit from "../../../../../common-components/MultiSelectBlinkit";

const ProductLeftPanel = ({
  setCampaignData,
  campaignData,
  selectedData,
  setSelectedData,
}) => {
  const [brandDataListing, setBrandDataListing] = React.useState([]);
  const [categoryDataListing, setCategoryDataListing] = React.useState([]);
  const [selectedBrand, setSelectedBrand] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState([]);
  const [sectionPassed, setSectionPassed] = React.useState(false);

  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      brand: selectedBrand,
    });
    if (selectedBrand && selectedBrand?.length) {
      if (!sectionPassed) {
        setSelectedCategory([]);
      }
      fetchCategories(selectedBrand);
      if (selectedData && selectedData?.length) {
        const data = selectedData?.filter((data) => data?.from !== "category");

        setSelectedData(data);
        setSectionPassed(false);
      }
    }
  }, [selectedBrand]);
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      selectedcategory: selectedCategory,
    });
    if (selectedCategory && selectedCategory?.length) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);
  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      selectedData: selectedData,
    });
  }, [selectedData]);

  const fetchAccounts = async () => {
    try {
      const result = await _GET(GET_BLINKIT_CREATE_CAMPAIGN_ACCOUNTS);
      const data = result.data.data.result;
      const accounts = data.map((item) => ({
        label: item.brand_name,
        value: item.brand_name,
        brand_id: item.brand_id,
      }));
      setBrandDataListing(accounts);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchCategories = async (brands) => {
    try {
      const result = await _POST(GET_BLINKIT_CREATE_CAMPAIGN_CATEGORY, {
        brand: brands,
      });
      const data = result.data.data.result;
      const category = data.map((item) => ({
        label: item.category_name,
        value: item.category_name,
        category_id: item.category_id,
        product_id: item.product_id,
      }));
      setCategoryDataListing(category);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchProducts = async (category) => {
    try {
      const result = await _POST(
        GET_BLINKIT_CREATE_CAMPAIGN_PRODUCTS_FROM_CATEGORY,
        {
          productids: category?.map((data) => data.product_id),
        }
      );
      const productList = result.data?.data?.data;
      if (productList && productList?.length) {
        const data = productList?.map((item) => ({
          label: item.name,
          value: item.id,
          brand: item.brand,
          group_ids: item.group_ids,
          children: item.children,
          unit: item.unit,
          image_url: item.image_url,
          category_id: item.category_id,
          id: item?.children?.map((data) => data.id),
          from: "category",
        }));

        setSelectedData([...selectedData, ...data]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  const [initialSet, setInitialSet] = React.useState(true);
  const [initialSectionPassedSet, setInitialSectionPassedSet] =
    React.useState(true);
  const [initialCategorySet, setInitialCategorySet] = React.useState(true);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.brand &&
      campaignData?.brand?.length &&
      initialSet
    ) {
      setSelectedBrand(campaignData?.brand);

      setInitialSet(false);
    }
    if (
      campaignData &&
      campaignData?.selectedcategory &&
      campaignData?.selectedcategory?.length &&
      initialCategorySet
    ) {
      setSelectedCategory(campaignData?.selectedcategory);

      setInitialCategorySet(false);
    }
    if (
      campaignData &&
      campaignData?.productSectionPassed &&
      initialSectionPassedSet
    ) {
      setSectionPassed(true);

      setInitialSectionPassedSet(false);
    }
  }, [campaignData]);

  return (
    <>
      <>
        <div className="leftpanel_container">
          <div>
            <div className="blinkit_leftpanel">
              <div className="blinkit_leftpanel__selected-title">
                <div>
                  <b>Choose products</b>
                  <div>Select products from the brand and category filters</div>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <div className="blinkit_leftpanel-brand  mr-2 w-[49%] mb-4 space-y-2">
                  <b>Select brands</b>

                  <div className="mt-5 z-[200]">
                    <CustomMultiSelectBlinkit
                      options={brandDataListing}
                      className="rmsc--blinkit"
                      value={selectedBrand}
                      onChange={setSelectedBrand}
                      labelledBy="Select from brands"
                      overrideStrings={{
                        selectSomeItems: "Select from brands",
                      }}
                      disableSearch={true}
                      disabled={
                        brandDataListing && brandDataListing?.length == 0
                      }
                    />
                  </div>
                </div>
                <div className="blinkit_leftpanel-brand w-[49%] mb-4 space-y-2">
                  <b>Select categories</b>

                  <div className="mt-5">
                    <CustomMultiSelectBlinkit
                      options={categoryDataListing}
                      className="rmsc--blinkit "
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      labelledBy="Select from categories"
                      overrideStrings={{
                        selectSomeItems: "Select from categories",
                      }}
                      disableSearch={true}
                      disabled={selectedBrand && selectedBrand?.length == 0}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="blinkit_leftpanel">
              <SearchProductFiled
                selectedData={selectedData}
                setSelectedData={setSelectedData}
              />
            </div>
          </div>
        </div>
      </>
    </>
  );
};
export default ProductLeftPanel;
