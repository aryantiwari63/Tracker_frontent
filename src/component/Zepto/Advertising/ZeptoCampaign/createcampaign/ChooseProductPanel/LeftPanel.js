import React from "react";
import ProductList from "../ProductList";
// import { useSelector } from "react-redux";
// import {
//   getBrandsByAccount,
//   getCategories,
//   getProducts,
// } from "../../../../../redux/action-creator/campaignAction";
// import { GET_ACCOUNTS } from "../../../../../utils/constants";
// import { _GET } from "../../../../../services/axios.method";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { getProductsForZeptoCampaign } from "../../../../../../redux/action-creator/campaignAction";
import { _GET } from "../../../../../../services/axios.method";
import { GET_ZEPTO_ACCOUNTS } from "../../../../../../utils/constants";
// import ActionType from "../../../../../redux/types";

const LeftPanel = ({
  setSelectedProduct,
  selectedProduct,
  setCampaignData,
  campaignData,
  handleChange,
  error,
}) => {
  const [brandDataListing, setBrandDataListing] = React.useState([]);
  const [selectedAccount, setSelectedAccount] = React.useState(null);
  const productsData = useSelector(
    (state) => state.CampaignReducer?.zeptoproducts?.product
  );
  const totalData = useSelector(
    (state) => state.CampaignReducer?.zeptoproducts?.totalData
  );
  const dispatch = useDispatch();
  React.useEffect(() => {
    setSelectedAccount(null);
  }, []);
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    if (selectedAccount) {
      dispatch(
        getProductsForZeptoCampaign(
          campaignData?.account,
          campaignData.search_product,
          campaignData.search_type ? campaignData.search_type : "Name",
          0
        )
      );
    }
  }, [campaignData.search_product]);
  React.useEffect(() => {
    if (selectedAccount) {
      dispatch(
        getProductsForZeptoCampaign(
          campaignData?.account,
          campaignData.search_product,
          campaignData.search_type ? campaignData.search_type : "Name",
          offset
        )
      );
    }
  }, [offset]);

  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setCampaignData({
      ...campaignData,
      search_product: "",
    });
  }, [campaignData?.search_type]);
  const fetchAccounts = async () => {
    try {
      const result = await _GET(GET_ZEPTO_ACCOUNTS);
      const data = result.data.data;
      const accounts = data.map((item) => ({
        label: item.account_name,
        value: item.account_name,
      }));
      setBrandDataListing(accounts);
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    fetchAccounts();
  }, []);
  const handleBrandChange = (item) => {
    setSelectedAccount(item);
    setCampaignData({
      ...campaignData,
      account: item,
    });
    if (item) {
      dispatch(getProductsForZeptoCampaign(item, "", "", offset));
    }
  };

  return (
    <>
      <div>
        <div className="leftpanel">
          <div className="leftpanel-brand col_4">
            Account
            <span className="inline   createnewcamp-error">*</span>
            <div>
              <select
                className="leftpanel__selectdropdown"
                onChange={(e) => handleBrandChange(e.target.value)}
                value={campaignData.account}
              >
                <option selected disabled>
                  Select
                </option>
                {brandDataListing?.map((item) => {
                  return (
                    <>
                      <option value={item.value}>{item.label}</option>
                    </>
                  );
                })}
              </select>
            </div>
          </div>
          <div className=" pt-4 pb-4 ">
            <div>
              <div className="border rounded-sm row">
                <div className="">
                  <select
                    className=" leftpanel__search-box"
                    id="search_type"
                    name="search_type"
                    onChange={handleChange}
                    // onChange={(e) => {
                    //   handleChange(e);

                    // }}
                    value={campaignData.search_type}
                  >
                    <option value="Name">Name</option>
                    <option value="ProductId">ProductId</option>
                    <option value="Category">Category</option>
                  </select>
                </div>

                <div className="col">
                  <input
                    type="text"
                    placeholder="Search"
                    id="search_product"
                    name="search_product"
                    className="leftpanel_searchproduct"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    value={campaignData.search_product}
                  />
                </div>
              </div>
            </div>
          </div>
          <ProductList
            productListtoShow={productsData}
            setSelectedProduct={setSelectedProduct}
            selectedProduct={selectedProduct}
            setCampaignData={setCampaignData}
            campaignData={campaignData}
            handleChange={handleChange}
            error={error}
            totalData={totalData}
            setOffset={setOffset}
            offset={offset}
            setPage={setPage}
            page={page}
          />
        </div>
      </div>
    </>
  );
};
export default LeftPanel;
