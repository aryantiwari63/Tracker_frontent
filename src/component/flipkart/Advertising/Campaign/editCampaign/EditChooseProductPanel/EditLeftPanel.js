import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBrandsByAccount,
  getCategories,
  getProducts,
} from "../../../../../../redux/action-creator/campaignAction";
// import { brandDataListing } from "../../../../../../utils/constants";
import EditProductList from "../EditProductList";
import { GET_ACCOUNTS } from "../../../../../../utils/constants";
import { _GET } from "../../../../../../services/axios.method";
import { TreeSelect } from "primereact/treeselect";
import "./styles.css";

const EditLeftPanel = ({
  productListAccordingToCategories,
  setSelectedProduct,
  selectedProduct,
  setCampaignData,
  campaignData,
  handleChange,
  category,
  error,
  setSelectedBrand,
  totalData,
  setOffset,
  offset,
}) => {
  const dispatch = useDispatch();
  const [brandDataListing, setBrandDataListing] = React.useState([]);
  const { brandsbyaccount } = useSelector((state) => state.CampaignReducer);
  const [selectedNodeKey, setSelectedNodeKey] = React.useState(null);

  React.useEffect(() => {
    if (campaignData.category && selectedNodeKey) {
      dispatch(
        getProducts(
          // Object.keys(selectedNodeKey)?.join(""),
          selectedNodeKey,
          campaignData.brand,
          campaignData.search_product,
          campaignData.search_type ? campaignData.search_type : "Name",
          offset,
          campaignData.platform
        )
      );
    }
  }, [campaignData.search_product]);

  React.useEffect(() => {
    if (campaignData.category && selectedNodeKey) {
      dispatch(
        getProducts(
          selectedNodeKey,
          campaignData.brand,
          "",
          "",
          offset,
          campaignData.platform
        )
      );
    }
  }, [offset]);

  const handleBrandChange = (item) => {
    setSelectedBrand(item);
    for (let i = 0; i < brandDataListing.length; i++) {
      if (brandDataListing[i].value === item) {
        setCampaignData({
          ...campaignData,
          platform_id: brandDataListing[i].platform_id,
          account_id: brandDataListing[i].account_id,
          brand: brandDataListing[i].value,
        });
      }
    }
  };
  const client_name = localStorage.getItem("client_name");

  React.useEffect(() => {
    if (campaignData.brand) {
      dispatch(getCategories(campaignData.brand, campaignData.platform));

      dispatch(getBrandsByAccount(campaignData.brand));
      setOffset(0);
    }
  }, [campaignData.brand]);
  React.useEffect(() => {
    if (selectedNodeKey) {
      dispatch(
        getProducts(
          selectedNodeKey,
          campaignData.brand,
          "",
          "",
          offset,
          campaignData.platform
        )
      );
      setPage(1);
    }
  }, [selectedNodeKey]);
  const [page, setPage] = React.useState(1);
  const fetchAccounts = async () => {
    try {
      const result = await _GET(GET_ACCOUNTS);
      const data = result.data.data.result;
      const accounts = data.map((item) => ({
        label: item._id.account,
        value: item._id.account,
        account_id: item._id.account_id,
        platform_id: item._id.platform_id,
      }));
      setBrandDataListing(accounts);
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    fetchAccounts();
  }, []);
  const [nodes, setNodes] = React.useState([]);
  React.useEffect(() => {
    if (category && category?.length) {
      const formatData = (data) => {
        data.forEach((item, i) => {
          const pathArray = item.storepath.split("/");
          data[i]["hierarchy"] = pathArray;
          data[i]["key"] = item.storepath;
          data[i]["data"] = item.storeid;
          data[i]["label"] = item.storetitle;
          data[i]["style"] = { paddingLeft: "10px" };
          data[i]["parent_name"] = pathArray[pathArray.length - 2];
          data[i]["children"] = [];
        });

        for (let i = 0; i < data.length; i++) {
          const currentItem = data[i];
          const matchingParent = data.find(
            (item) => item.storeid === currentItem.parent_name
          );
          currentItem.parent_id = matchingParent ? matchingParent?.id : null;
        }

        return data;
      };

      const buildTree = (data) => {
        const nodeMap = {};

        data.forEach((obj) => {
          nodeMap[obj.id] = { ...obj, children: [] };
        });

        Object.values(nodeMap).forEach((obj) => {
          if (obj.parent_id !== undefined && nodeMap[obj.parent_id]) {
            nodeMap[obj.parent_id].children.push(obj);
          }
        });

        const rootNodes = Object.values(nodeMap).filter(
          (obj) => obj.parent_id === null
        );

        if (rootNodes.length === 1) {
          return rootNodes[0];
        } else {
          return rootNodes;
        }
      };

      const formattedData = formatData(category);

      const res = buildTree(formattedData, undefined);
      // eslint-disable-next-line no-console
      // console.log("campaignData res>>>>>", res);
      setNodes(res);
    }
  }, [category]);
  React.useEffect(() => {}, [nodes]);

  React.useEffect(() => {
    // if (selectedNodeKey) {
    //   dispatch(
    //     getProducts(
    //       Object.keys(selectedNodeKey)?.join(""),
    //       "",
    //       "",
    //       campaignData.brand,
    //       offset
    //     )
    //   );
    //   setCampaignData({
    //     ...campaignData,
    //     category: Object.keys(selectedNodeKey).join(""),
    //   });
    // }
    // setPage(1);
    // setOffset(0);
    // eslint-disable-next-line no-console
  }, [selectedNodeKey]);
  const [remountKey, setRemountKey] = React.useState(0);
  const handleSelect = (event) => {
    setSelectedNodeKey(event.value);
    setRemountKey((prevKey) => prevKey + 1); // Remount the component
  };
  React.useEffect(() => {
    if (campaignData?.category) {
      setSelectedNodeKey(campaignData?.category);
    }
  }, []);

  return (
    <>
      <div>
        <div className="leftpanel">
          <div className="leftpanel__wrap">
            <div className="leftpanel__image">
              <img
                src="/assets/images/info-orange.svg"
                alt=""
                height="100%"
                width="100%"
              />
            </div>
            <p className="leftpanel__imagecontent">
              You now need to select category (one at a time) to choose
              products. You can select products from multiple categories by
              changing the category one by one
            </p>
          </div>

          <div className="row pt-4">
            <div className="leftpanel-brand col_4">
              Brand
              <div>
                <select
                  className="leftpanel__selectdropdown"
                  onChange={(e) => handleBrandChange(e.target.value)}
                  value={campaignData.brand}
                  disabled
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
            {/* <div className=" pl-4 leftpanel-brand col_4">
              Category
              <span className="inline   createnewcamp-error">*</span>
              <div>
                <select
                  className="leftpanel__selectdropdown"
                  name="category"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  value={campaignData.category}
                  disabled
                >
                  {" "}
                  <option value="none" selected disabled>
                    Select
                  </option>
                  {category &&
                    category.length > 0 &&
                    category.map((v, i) => {
                      return (
                        <option key={i} value={v.category_id}>
                          {v.category_name}
                        </option>
                      );
                    })}
                </select>
              </div>
              {error.category && <p className="errorText">{error.category}</p>}
            </div> */}
            {client_name == "Bajaj" ? (
              <div className="leftpanel-brand col_4">
                Brand
                <div>
                  <select
                    className="leftpanel__selectdropdown"
                    name="subbrand"
                    // onChange={(e) => handleBrandChange(e.target.value)}
                    onChange={(e) => handleChange(e)}
                    value={campaignData.subbrand}
                    disabled
                  >
                    <option selected disabled>
                      Select
                    </option>
                    {brandsbyaccount?.map((item) => {
                      return (
                        <>
                          <option value={item.brand}>{item.brand}</option>
                        </>
                      );
                    })}
                  </select>
                </div>
              </div>
            ) : null}
            <div className="treeComponentContainer">
              <TreeSelect
                key={remountKey}
                value={{ [campaignData?.category]: true }}
                onChange={handleSelect}
                options={nodes}
                // options={[
                //   {
                //     key: "0",
                //     label: "Documents",
                //     data: "Documents Folder",
                //     children: [
                //       {
                //         key: "0-0",
                //         label: "Work",
                //         data: "Work Folder",
                //         style: { paddingLeft: "10px" },
                //         children: [
                //           {
                //             key: "0-0-0",
                //             label: "Expenses.doc",
                //             data: "Expenses Document",
                //             style: { paddingLeft: "10px" },
                //           },
                //           {
                //             key: "0-0-1",
                //             label: "Resume.doc",
                //             data: "Resume Document",
                //             style: { paddingLeft: "10px" },
                //           },
                //         ],
                //       },
                //       {
                //         key: "0-1",
                //         label: "Home",
                //         data: "Home Folder",
                //         style: { paddingLeft: "10px" },
                //         children: [
                //           {
                //             key: "0-1-0",
                //             label: "Invoices.txt",
                //             data: "Invoices for this month",
                //             style: { paddingLeft: "10px" },
                //           },
                //         ],
                //       },
                //     ],
                //   },
                //   {
                //     key: "1",
                //     label: "Events",
                //     data: "Events Folder",
                //     children: [
                //       {
                //         key: "1-0",
                //         label: "Meeting",
                //         data: "Meeting",
                //         style: { paddingLeft: "10px" },
                //       },
                //       {
                //         key: "1-1",
                //         label: "Product Launch",
                //         data: "Product Launch",
                //         style: { paddingLeft: "10px" },
                //       },
                //       {
                //         key: "1-2",
                //         label: "Report Review",
                //         data: "Report Review",
                //         style: { paddingLeft: "10px" },
                //       },
                //     ],
                //   },
                //   {
                //     key: "2",
                //     label: "Movies",
                //     data: "Movies Folder",
                //     children: [
                //       {
                //         key: "2-0",
                //         label: "Al Pacino",
                //         data: "Pacino Movies",
                //         style: { paddingLeft: "10px" },
                //         children: [
                //           {
                //             key: "2-0-0",
                //             label: "Scarface",
                //             data: "Scarface Movie",
                //             style: { paddingLeft: "10px" },
                //           },
                //           {
                //             key: "2-0-1",
                //             label: "Serpico",
                //             data: "Serpico Movie",
                //             style: { paddingLeft: "10px" },
                //           },
                //         ],
                //       },
                //       {
                //         key: "2-1",
                //         label: "Robert De Niro",
                //         data: "De Niro Movies",
                //         style: { paddingLeft: "10px" },
                //         children: [
                //           {
                //             key: "2-1-0",
                //             label: "Goodfellas",
                //             data: "Goodfellas Movie",
                //             style: { paddingLeft: "10px" },
                //           },
                //           {
                //             key: "2-1-1",
                //             label: "Untouchables",
                //             data: "Untouchables Movie",
                //             style: { paddingLeft: "10px" },
                //           },
                //         ],
                //       },
                //     ],
                //   },
                // ]}
                style={{
                  display: "inline-block",
                }}
                filter
                className="custom-tree-select"
                selectionMode="multiple"
                placeholder="Select Category"
                // disabled={true}
                panelStyle={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 100,
                  background: "#f5f5f5",
                }}
              />
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
                    value={campaignData.search_type}
                  >
                    <option value="Name">Name</option>
                    <option value="FSNs">FSNs</option>
                  </select>
                </div>

                <div className="col">
                  <input
                    type="text"
                    placeholder="Search by product name"
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
          <EditProductList
            productListtoShow={productListAccordingToCategories}
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
export default EditLeftPanel;
