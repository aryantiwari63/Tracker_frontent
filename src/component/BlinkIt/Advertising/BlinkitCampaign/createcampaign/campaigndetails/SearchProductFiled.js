import React, { useState } from "react";
// import Button from "../../../../../common-components/button/Button";
// import Btn from "../button/Btn";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getProductList } from "../../../../../../redux/action-creator/blinkit/createCampaignAction";
import CustomMultiSelectBlinkit from "../../../../../common-components/MultiSelectBlinkit";

const SearchProductFiled = ({
  // active,
  // setActive,
  // setCampaignData,
  // campaignData,
  selectedData,
  setSelectedData,
}) => {
  let { productList } = useSelector(
    (state) => state?.BlinkitCreateCampaignReducer
  );

  const [listData, setListData] = useState([]);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getProductList());
  }, []);
  React.useEffect(() => {
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
        from: "product",
      }));
      setListData(data);
    }
  }, [productList]);

  return (
    <>
      <div className="pb-2">
        <div className="relative w-full">
          <div className="blinkit_leftpanel__selected-title">
            <div>
              <b>Enter products manually</b>
              <div>Find and select your products manually</div>
            </div>
          </div>
          <div className="mt-5">
            <CustomMultiSelectBlinkit
              options={listData}
              className="rmsc--blinkit"
              value={selectedData}
              onChange={setSelectedData}
              labelledBy="Select products"
              overrideStrings={{
                selectSomeItems: "Select products",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchProductFiled;
