import React from "react";
import StarCheckbox from "../../../../../common-components/StarCheckbox";

const ProductRightPanel = ({
  selectedProduct,
  setSelectedProduct,

  setCampaignData,
  campaignData,
}) => {
  const [selectedCheckboxes, setSelectedCheckboxes] = React.useState({});
  const [selectedCheckedProducts, setSelectedCheckedProducts] = React.useState(
    []
  );

  // const [searchTerm, setSearchTerm] = React.useState("");
  const [starredProducts, setStarredProducts] = React.useState([]);
  // const [filteredProducts, setFilteredProducts] = React.useState([]);
  // React.useEffect(() => {
  //   setCampaignData({
  //     ...campaignData,
  //     searchterm: searchTerm,
  //   });
  // }, [searchTerm]);
  // React.useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("debugerrr selectedCheckboxes inside", selectedCheckboxes);
  //   setCampaignData({
  //     ...campaignData,
  //     selectedCheckboxes: selectedCheckboxes,
  //   });
  // }, [selectedCheckboxes]);
  React.useEffect(() => {
    let products = selectedCheckedProducts.map((checkedProduct) => {
      let isStarProduct = false;
      let order = null;

      // Check if the product or its parent exists in starredProducts
      starredProducts.forEach((starredProduct) => {
        starredProduct.children.forEach((child) => {
          if (child.id === checkedProduct.id) {
            isStarProduct = starredProduct.order ? true : false;
            order = starredProduct.order;
          }
        });
      });

      return {
        id: parseInt(checkedProduct.id), // Convert id to integer if needed
        is_star_product: isStarProduct,
        ...(isStarProduct && { order: order }),
      };
    });
    setCampaignData({
      ...campaignData,
      starredproducts: starredProducts,
      selectedcheckedproducts: selectedCheckedProducts,
      selectedCheckboxes: selectedCheckboxes,
      products: products,
    });
  }, [starredProducts, selectedCheckedProducts, selectedCheckboxes]);
  // React.useEffect(() => {
  //   setCampaignData({
  //     ...campaignData,
  //     filteredproducts: filteredProducts,
  //   });
  // }, [filteredProducts]);

  const handleChildCheckboxChange = (parentId, childId, isChecked, product) => {
    setSelectedCheckboxes((prev) => {
      const newState = { ...prev };

      if (!newState[parentId]) {
        newState[parentId] = new Set();
      }

      if (isChecked) {
        newState[parentId].add(childId);
        setSelectedCheckedProducts((prevProducts) => [
          ...prevProducts,
          product,
        ]);
      } else {
        newState[parentId].delete(childId);
        setSelectedCheckedProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== childId)
        );
      }

      const allChildrenUnchecked =
        !newState[parentId] || newState[parentId].size === 0;

      if (allChildrenUnchecked) {
        // Remove stars and reset orders for the unchecked product
        setStarredProducts((prevStarred) => {
          const updatedStarred = prevStarred
            .filter((p) => p.value !== parentId)
            .map((p, index) => ({
              ...p,
              order: index + 1,
            }));

          return updatedStarred;
        });
      }

      return newState;
    });
  };

  const handleMainCheckboxChange = (parentId, isChecked, parentProduct) => {
    setSelectedCheckboxes((prev) => {
      const newState = { ...prev };

      if (isChecked) {
        newState[parentId] = new Set(
          parentProduct.children.map((child) => child.id)
        );
        setSelectedCheckedProducts((prevProducts) => [
          ...prevProducts,
          ...parentProduct.children,
        ]);
        setStarredProducts((prevStarred) => {
          const updatedStarred = prevStarred.map((p) => ({
            ...p,
          }));

          return updatedStarred;
        });
      } else {
        delete newState[parentId];
        setSelectedCheckedProducts((prevProducts) =>
          prevProducts.filter(
            (p) => !parentProduct.children.some((child) => child.id === p.id)
          )
        );

        // Remove stars and reset orders for the unchecked products
        setStarredProducts((prevStarred) => {
          const updatedStarred = prevStarred
            .filter((p) => p.value !== parentId)
            .map((p, index) => ({
              ...p,
              order: index + 1,
            }));

          return updatedStarred;
        });
      }

      return newState;
    });
  };

  const handleParentCheckboxChange = (isChecked) => {
    const newSelectedCheckboxes = {};

    if (isChecked) {
      selectedProduct.forEach((product) => {
        newSelectedCheckboxes[product.value] = new Set(
          product.children.map((child) => child.id)
        );
      });
      setSelectedCheckedProducts(
        selectedProduct.flatMap((product) => product.children)
      );
    } else {
      setSelectedCheckedProducts([]);
      // Remove stars and reset orders for all products
      setStarredProducts([]);
    }

    setSelectedCheckboxes(newSelectedCheckboxes);
  };

  const allChildrenCount = selectedProduct.reduce(
    (count, product) => count + product?.children?.length,
    0
  );
  const selectedChildrenCount = selectedCheckedProducts?.length;

  const isParentPartiallyChecked =
    selectedChildrenCount > 0 && selectedChildrenCount < allChildrenCount;
  const isParentFullyChecked =
    selectedProduct?.length > 0
      ? selectedChildrenCount === allChildrenCount
      : false;

  const handleStarToggle = (product, isStarred) => {
    setStarredProducts((prevStarred) => {
      let updatedStarred = [...prevStarred];

      if (isStarred) {
        const maxOrder =
          updatedStarred.length > 0
            ? Math.max(...updatedStarred.map((p) => p.order))
            : 0;
        product.order = maxOrder + 1;
        updatedStarred.push(product);
      } else {
        // Remove the product and update the orders of remaining products
        updatedStarred = updatedStarred
          .filter((p) => p.value !== product.value)
          .map((p, index) => ({
            ...p,
            order: index + 1, // Reassign order based on the new index
          }));
      }

      // Update the order for the original product list
      selectedProduct.forEach((p) => {
        const starredProduct = updatedStarred.find(
          (sp) => sp.value === p.value
        );
        p.order = starredProduct ? starredProduct.order : null;
      });

      return updatedStarred;
    });
  };

  // React.useEffect(() => {
  //   const data = selectedProduct.filter((product) =>
  //     product.label.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredProducts(data);
  // }, [searchTerm]);

  // let arraytosort =
  //   filteredProducts?.length > 0 && searchTerm !== ""
  //     ? filteredProducts
  //     : selectedProduct;
  function getUniqueByLabel(data) {
    let uniqueLabels = new Set();
    let uniqueItems = [];

    data.forEach((item) => {
      if (!uniqueLabels.has(item.label)) {
        uniqueLabels.add(item.label);
        uniqueItems.push(item);
      }
    });

    return uniqueItems;
  }

  const arraytosort = getUniqueByLabel(selectedProduct);
  // let arraytosort = selectedProduct;
  const sortedProducts = arraytosort.sort((a, b) => {
    if (a.order && b.order) return a.order - b.order;
    if (a.order) return -1;
    if (b.order) return 1;
    return 0;
  });

  React.useEffect(() => {
    const updatedSelectedProduct = selectedProduct.map((p) => {
      const starredProduct = starredProducts.find((sp) => sp.value === p.value);
      return {
        ...p,
        order: starredProduct ? starredProduct.order : null,
      };
    });

    setSelectedProduct(updatedSelectedProduct);
  }, [starredProducts]);

  const [initialCheckedProductsSet, setInitialCheckedProductsSet] =
    React.useState(true);
  const [initialStarredProductsSet, setInitialStarredProductsSet] =
    React.useState(true);
  const [initialSelectedDataSet, setInitialSelectedDataSet] =
    React.useState(true);
  const [initialSelectedcheckboxesSet, setInitialSelectedcheckboxesSet] =
    React.useState(true);
  React.useEffect(() => {
    if (
      campaignData &&
      campaignData?.selectedcheckedproducts &&
      campaignData?.selectedcheckedproducts?.length &&
      initialCheckedProductsSet
    ) {
      setTimeout(() => {
        setSelectedCheckedProducts(campaignData?.selectedcheckedproducts);
      }, [1000]);
      setInitialCheckedProductsSet(false);
    }
    if (
      campaignData &&
      campaignData?.starredproducts &&
      campaignData?.starredproducts?.length &&
      initialStarredProductsSet
    ) {
      setTimeout(() => {
        setStarredProducts(campaignData?.starredproducts);
      }, [1000]);
      setInitialStarredProductsSet(false);
    }
    if (
      campaignData &&
      campaignData?.selectedData &&
      campaignData?.selectedData?.length &&
      initialSelectedDataSet
    ) {
      setTimeout(() => {
        setSelectedProduct(campaignData?.selectedData);
      }, [1000]);
      setInitialSelectedDataSet(false);
    }

    if (
      campaignData &&
      campaignData?.selectedCheckboxes &&
      Object.keys(campaignData?.selectedCheckboxes).length &&
      initialSelectedcheckboxesSet
    ) {
      setSelectedCheckboxes(campaignData?.selectedCheckboxes);
      setInitialSelectedcheckboxesSet(false);
    }
  }, [campaignData]);

  return (
    <div className="blinkit_rightpanel__selected-box flex flex-col px-4 pb-4">
      <div className="blinkit_rightpanel__selected-title h-[60px]">
        <div>
          <b>Selected Products</b>
          <div>Your target products will appear here</div>
        </div>
      </div>
      <div
        className="blinkit_rightpanel__productlist-card flex flex-col flex-1 pb0"
        id="selected-product-show"
      >
        <div className="flex items-center py-2 px-2 bg-[#F8F8F8] rounded-t-[10px]">
          <div className="flex-[0.05] flex pl-3">
            <input
              type="checkbox"
              className={`w-4 h-4 blinkit_product_custom-checkbox ${
                isParentPartiallyChecked
                  ? "partial-checkbox"
                  : isParentFullyChecked
                  ? "full-checkbox"
                  : ""
              }`}
              checked={isParentFullyChecked || isParentPartiallyChecked}
              onChange={(e) => handleParentCheckboxChange(e.target.checked)}
            />
          </div>

          <div className="flex-[0.05] flex justify-center tooltip-container">
            <span
              role="img"
              aria-label="question-circle"
              className="fas fa-question-circle"
            />
            <span className="tooltip-text">
              Star Products: Select up to 3 top products to feature at the top
              of your campaigns. These products will be shown first to users
              wherever your campaign appears
            </span>
          </div>

          <div className="flex-[0.5] text-center font-semibold">
            Product Name
          </div>
          <div className="flex-[0.4] font-semibold">Variants</div>
        </div>

        {/* <div className="px-2">
          <div className="relative w-full border mt-1 rounded-xl">
            <i className="fas fa-search absolute top-1/2 transform -translate-y-1/2 left-2 text-gray-500"></i>
            <input
              type="text"
              placeholder="Search amongst the added products"
              className="pl-8 p-2 border border-gray-50 rounded-xl w-full focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div> */}

        {sortedProducts && sortedProducts?.length ? (
          <div className="flex flex-col divide-y max-h-[425px] overflow-y-auto">
            {sortedProducts.map((v) => {
              const totalChildren = v?.children?.length;
              const selectedChildrenCount =
                selectedCheckboxes[v.value]?.size || 0;

              const isPartiallyChecked =
                selectedChildrenCount > 0 &&
                selectedChildrenCount < totalChildren;
              const isFullyChecked = selectedChildrenCount === totalChildren;

              // Check if the main checkbox or any child is selected to enable the StarCheckbox
              const isStarEnabled = isFullyChecked || isPartiallyChecked;

              return (
                <div
                  key={v.value}
                  className="flex justify-between items-center px-2 py-3"
                >
                  <div className="flex-[0.05] flex pl-3">
                    <input
                      type="checkbox"
                      className={`w-4 h-4 blinkit_product_custom-checkbox ${
                        isPartiallyChecked
                          ? "partial-checkbox"
                          : isFullyChecked
                          ? "full-checkbox"
                          : ""
                      }`}
                      checked={isFullyChecked || isPartiallyChecked}
                      onChange={(e) =>
                        handleMainCheckboxChange(v.value, e.target.checked, v)
                      }
                    />
                  </div>
                  <div className="flex-[0.05] flex justify-center">
                    <StarCheckbox
                      key={`star-checkbox-${v.value}-${v.order}`} // unique key with order
                      isChecked={starredProducts.some(
                        (p) => p.value === v.value
                      )}
                      product={v}
                      onToggle={(isStarred) => {
                        handleStarToggle(v, isStarred);
                      }}
                      order={v.order || ""}
                      disabled={!isStarEnabled} // Disable the StarCheckbox if it's not enabled
                    />
                  </div>

                  <div className="blinkit_listproduct__image flex-[0.5] flex items-center justify-evenly">
                    <img
                      src={
                        v.image_url !== ""
                          ? `${v?.image_url}`
                          : "/assets/images/product-img.jpg"
                      }
                      alt=""
                      width={50}
                      height={50}
                    />

                    <div className="blinkit_listcard__producttitle">
                      <b>{v?.label}</b>
                    </div>
                  </div>

                  <div className="flex-[0.4] flex flex-wrap gap-2">
                    {v?.children &&
                      v?.children?.length &&
                      v?.children.map((data) => {
                        const isChecked = selectedCheckboxes[v.value]?.has(
                          data.id
                        );
                        return (
                          <div
                            key={data.id}
                            className="border rounded-md gap-2 p-1 flex items-center"
                          >
                            <input
                              type="checkbox"
                              className="blinkit_product_custom-checkbox full-checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                handleChildCheckboxChange(
                                  v.value,
                                  data.id,
                                  e.target.checked,
                                  data
                                )
                              }
                            />
                            {data?.unit}
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5 text-gray-500">
            No products selected.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRightPanel;
