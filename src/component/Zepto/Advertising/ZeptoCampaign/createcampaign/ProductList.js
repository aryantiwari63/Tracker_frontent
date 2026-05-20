import React from "react";
// import ListCard from "./ListCard";
// import Pagination from "../../../pagination";
import { LIMIT } from "../../../../../utils/constants";
import Pagination from "../../../../pagination";
import ListCard from "./ChooseProductPanel/ListCard";
// import { LIMIT } from "../../../../utils/constants";
// import { LIMIT } from "../../../../utils/constants";

const ProductList = ({
  productListtoShow = [],
  setSelectedProduct,
  selectedProduct,
  // campaignData,
  error,
  totalData,
  setOffset,
  offset,
  setPage,
  page,
}) => {
  // const [offset, setOffset] = React.useState(0);
  // const [page, setPage] = React.useState(1);
  // const [totalData, setTotalData] = React.useState();
  const paginate = (direction) => {
    if (direction == "prev") {
      setPage(page - 1);
      setOffset(offset - LIMIT);
    } else {
      setPage(page + 1);
      setOffset(offset + LIMIT);
    }
  };
  // const selectAlls = (checked) => {
  //   if (productListtoShow && productListtoShow.length > 0) {
  //     if (checked) {
  //       setSelectedProduct([...productListtoShow]);
  //     } else {
  //       setSelectedProduct([]);
  //     }
  //   }
  // };
  // React.useEffect(() => {
  //   if (campaignData.FSNs) {
  //     setSelectedProduct(
  //       productListtoShow.filter((item) => item.FSNs == campaignData.FSNs)
  //     );
  //   }
  // }, []);
  return (
    <>
      <div className="row ">
        <div className="listproduct">
          <div className="listproduct__head">
            {/* <div>
              <label className="row items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="select_alls"
                  name="select_alls"
                  // value=""
                  className="listproduct__checkbox"
                  onChange={(e) => selectAlls(e.target.checked)}
                  value={
                    campaignData.select_alls ? campaignData.select_alls : null
                  }
                />

                <div className="listproduct__heading pl-1">
                  Select all in this page
                  <div className="listproduct__error-mark">*</div>
                </div>
              </label>
            </div> */}
            <div className="listproduct__count inline ">
              {totalData > 0
                ? `1 - ${totalData} of ${totalData} products`
                : null}
            </div>
          </div>
          <div className="row ">
            {productListtoShow && productListtoShow?.length
              ? productListtoShow?.map((v, i) => {
                  return (
                    <div className="col_6" key={i}>
                      <ListCard
                        product={v}
                        setSelectedProduct={setSelectedProduct}
                        selectedProduct={selectedProduct}
                      />
                    </div>
                  );
                })
              : "No data found"}
          </div>
          {error.productId && <p className="errorText">{error.productId}</p>}

          {totalData > 10 ? (
            <Pagination paginate={paginate} page={page} totalData={totalData} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ProductList;
